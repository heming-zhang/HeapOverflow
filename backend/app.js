const app = require('express')();
const logger = require('morgan');
const bodyParser = require('body-parser');
const models = require('./models');
const sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const session = require('express-session')({
    secret: 'muhaha',
    resave: true,
    saveUninitialized: true
});
const cors = require('cors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session);

app.use(cors({
    origin:['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}));

app.post('/register', async (req, res) => {
    const c = await models.User.count({
        where: {
            name: req.body.username
        }
    });
    if(c) {
        res.send({
            err: 'user already exists'
        });
        return;
    }
    models.User.create({
        name: req.body.username,
        passwd: req.body.password
    })
    .then(user => {
        res.send(user);
    })
    .catch(err => {
        res.send({err: err.errors[0].message});
    })
});

app.post('/login', (req, res) => {
    if(req.session.uid) {
        res.send({
            err: 'already login'
        });
        return;
    }
    models.User.findOne({
        where: {
            name: req.body.username,
            passwd: req.body.password
        }
    })
    .then(user => {
        if(user == null) {
            res.send({
                err: 'incorrect username or password'
            });
            return;
        }
        req.session.uid = user.id;
        req.session.uname = user.name;
        req.session.save();
        res.send({user: user});
    })
    .catch(err => res.send({err: err}));
});

app.post('/logout', (req, res) => {
    if(req.session.uid) {
        delete req.session.uid;
        delete req.session.uname;
    }
    res.send('ok');
});

app.get('/session', (req, res) => {
    if(!req.session.uid) {
        res.send(null);
        return;
    }
    res.send({
        uid: req.session.uid,
        uname: req.session.uname
    });
})

app.post('/new_question', (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    models.Question.create({
        title: req.body.title,
        description: req.body.description,
        UserId: req.session.uid
    })
    .then(question => {
        res.send(question)
    })
    .catch(err => res.send({err: err.errors[0].message}));
});

app.post('/del_question', (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    models.Question.findByPk(req.body.qid)
    .then(q => {
        if(q.UserId != req.session.uid) {
            res.send({err: 'permission denied'});
            return;
        }
        q.destroy();
        res.send('ok');
    })
    .catch(err => res.send(err));
});

app.post('/upd_question', (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    models.Question.findByPk(req.body.qid)
    .then(q => {
        if(q.UserId != req.session.uid) {
            res.send({err: 'permission denied'});
            return;
        }
        q.update({
            title: req.body.title,
            description: req.body.description
        })
        .then(() => res.send('ok'));
    })
    .catch(err => res.send(err));
});

async function qFormat(qlist) {
    var ret = [];
    for(var i = 0; i < qlist.length; i++) {
        var q = qlist[i];
        var item = {
            id: q.id,
            title: q.title,
            ans_cnt: await models.Comment.count({
                where: {
                    QuestionId: q.id
                }
            }),
            last_edit: dateFormat(q.updatedAt),
            aid: q.UserId,
            author: (await models.User.findByPk(q.UserId)).name
        }
        const vote = await models.Vote.sum('value', { 
            where: {
                QuestionId: q.id
            }
        });
        item.vote = vote ? vote : 0;
        ret.push(item);
    }
    return ret;
}

async function cFormat(clist) {
    var ret = [];
    for(var i = 0; i < clist.length; i++) {
        var c = clist[i];
        var item = {
            id: c.id,
            content: c.content,
            last_edit: dateFormat(c.updatedAt),
            aid: c.UserId,
            author: (await models.User.findByPk(c.UserId)).name,
            qid: c.QuestionId,
            qtitle: (await models.Question.findByPk(c.QuestionId)).title
        }
        const vote = await models.Vote.sum('value', { 
            where: {
                CommentId: c.id
            }
        });
        item.vote = vote ? vote : 0;
        ret.push(item);
    }
    return ret;
}

app.get('/qlist', async (req, res) => {
    try {
        const qlist = await models.Question.findAll();
        res.send(await qFormat(qlist));
    }
    catch(err) {res.send({err: err})}
})

app.get('/question', async (req, res) => {
    var q = await models.Question.findByPk(req.query.qid);
    if(q == null) {
        res.send({err: 'question does not exist'});
        return;
    }
    var u = await models.User.findByPk(q.UserId);
    const vote = await models.Vote.sum('value', { 
        where: {
            QuestionId: q.id
        }
    });
    var ret = {
        qid: q.id,
        title: q.title,
        description: q.description,
        last_edit: dateFormat(q.updatedAt),
        author: u.name,
        aid: u.id,
        vote: vote ? vote : 0
    };
    if(req.session.uid) {
        const myVote = await models.Vote.findOne({
            attributes: ['value'],
            where: {
                QuestionId: q.id,
                UserId: req.session.uid
            }
        });
        ret.myVote = myVote ? myVote.value : 0;
    }
    res.send(ret);
});

app.get('/user', async (req, res) => {
    try {
        const u = await models.User.findByPk(req.query.uid);
        if(u == null) {
            res.send({err: 'no such user'});
            return;
        }
        const qlist = await u.getQuestions();
        const clist = await u.getComments();
        res.send({
            uname: u.name,
            createdAt: dateFormat(u.createdAt).slice(0, 10),
            qlist: await qFormat(qlist),
            alist: await cFormat(clist)
        })
    }
    catch(err) {req.send({err: err})}
})

app.post('/new_answer', async (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    try {
        if(req.body.editId) {
            const c = await models.Comment.findByPk(req.body.editId);
            await c.update({content: req.body.content});
            res.send('ok');
            return;
        }
        const c = await models.Comment.create({
            content: req.body.content,
            UserId: req.session.uid,
            QuestionId: req.body.qid,
            ParentId: ('replyId' in req.body) ? req.body.replyId : null
        })
        res.send(c);
    } 
    catch(err) {res.send({err: err.errors[0].message})}
});

app.post('/del_answer', async (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    try {
        const c = await models.Comment.findByPk(req.body.cid);
        await c.destroy();
        res.send('ok');
    }
    catch(err) {res.send({err: err})}
});

function dateFormat(dt) {
    var date_iso = new Date(dt).toISOString();
    return date_iso.slice(0, 10) + ' ' + date_iso.slice(11, 19);
}

async function queryComment(uid, cid) {
    const c = await models.Comment.findByPk(cid);
    const childs = await models.sequelize.query(
        "SELECT * FROM `Comments` WHERE ParentId = ?", { 
            replacements: [cid],
            type: sequelize.QueryTypes.SELECT
        });
    const vote = await models.Vote.sum('value', { 
        where: {
            CommentId: cid
        }
    });
    var ret = {
        id: cid,
        aid: c.UserId,
        author: (await models.User.findByPk(c.UserId)).name,
        content: c.content,
        last_edit: dateFormat(c.updatedAt),
        vote: vote ? vote : 0
    };
    if(uid) {
        const myVote = await models.Vote.findOne({
            attributes: ['value'],
            where: {
                CommentId: cid,
                UserId: uid
            }
        });
        ret.myVote = myVote ? myVote.value : 0;
    }
    if(childs.length == 0) return ret;
    ret.comments = [];
    for(var i = 0; i < childs.length; i++) {
        ret.comments.push(await queryComment(uid, childs[i].id));
    }
    return ret;
}

app.get('/answers', (req, res) => {
    models.Question.findByPk(req.query.qid)
    .then(q => {
        if(q == null) {
            res.send({err: 'question does not exist'});
            return;
        }
        q.getComments().then(async (com) => {
            var ret = [];
            for(var i = 0; i < com.length; i++) {
                var comment = com[i];
                if(!comment.ParentId) ret.push(await queryComment(req.session.uid, comment.id));
            }
            res.send({
               answers: ret
            })
        })
    })
    .catch(err => res.send({err: err}));
});

app.post('/vote', async (req, res) => {
    if(!req.session.uid) {
        res.send({err: 'login required'});
        return;
    }
    const v = await models.Vote.findOne({
        where: {
            UserId: req.session.uid,
            QuestionId: req.body.qid ? req.body.qid : null,
            CommentId: req.body.cid ? req.body.cid : null
        }
    });
    if(v == null) {
        models.Vote.create({
            value: req.body.value,
            UserId: req.session.uid,
            QuestionId: req.body.qid ? req.body.qid : null,
            CommentId: req.body.cid ? req.body.cid : null
        })
        .then(v => res.send('ok'))
        .catch(err => res.send({err: err}));
    }
    else if(v.value != req.body.value) {
        v.update({value: req.body.value})
        .then(() => res.send('ok'))
        .catch(err => res.send({err: err}));
    }
    else {
        v.destroy()
        .then(() => res.send('ok'))
        .catch(err => res.send({err: err}));
    }
})

app.get('/search', async (req, res) => {
    try {
        var key = req.query.key;
        res.send({
            qlist: await qFormat(await models.Question.findAll({
                where: {
                    title: {
                        [sequelize.Op.like]: '%' + key + '%'
                    }
                }
            })),
            alist: await cFormat(await models.Comment.findAll({
                where: {
                    content: {
                        [sequelize.Op.like]: '%' + key + '%'
                    }
                }
            })),
            ulist: await models.User.findAll({
                where: {
                    name: {
                        [sequelize.Op.like]: '%' + key + '%'
                    }
                }
            })
        });
    }
    catch(err) {res.send({err: err})}
})

app.listen(31313);

