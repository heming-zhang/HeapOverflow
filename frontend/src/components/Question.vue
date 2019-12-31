<template>
    <sui-container>
        <h1 is="sui-header" dividing>Question</h1>
        <sui-segment>
            <sui-grid>
                <sui-grid-row>
                    <sui-grid-column :width="1" class="votearea">
                        <div class="upvote" :class="q.myVote == 1 ? 'voted' : ''" 
                            @click="vote($route.params.id, 1)">
                            <sui-icon name="angle up"></sui-icon>
                        </div>
                        <div class="thumb">{{q.vote}}</div>
                        <div class="downvote" :class="q.myVote == -1 ? 'voted' : ''" 
                            @click="vote($route.params.id, -1)">
                            <sui-icon name="angle down"></sui-icon>
                        </div>                          
                    </sui-grid-column>
                    <sui-grid-column :width="15">
                        <sui-comment-group>
                            <sui-comment>
                                <sui-comment-content>
                                    <a :href="'/user/' + q.aid" is="sui-comment-author">{{q.author}}</a>
                                    <sui-comment-metadata>
                                        <div>Last Edit: {{q.last_edit}}</div>
                                    </sui-comment-metadata>
                                    <sui-divider hidden />
                                    <sui-comment-text>
                                        <sui-header size="medium">{{q.title}}</sui-header>
                                        <p v-html="q.description"></p>
                                    </sui-comment-text>
                                    <sui-divider hidden />
                                    <sui-comment-actions v-if="$session.get('login') && q.aid == $session.get('uid')">
                                        <sui-comment-action @click="edit">Edit</sui-comment-action>
                                        <sui-comment-action @click="del($route.params.id)">Delete</sui-comment-action>
                                    </sui-comment-actions>
                                </sui-comment-content>
                            </sui-comment>
                        </sui-comment-group>
                    </sui-grid-column>
                </sui-grid-row>
            </sui-grid>
        </sui-segment>
        <h1 is="sui-header" dividing>
            <span>Answers</span>
            <sui-button v-if="$session.get('login')"
                        @click="postAnswer" 
                        class="newc_btn" color="green">
                    Post Answer
            </sui-button>
        </h1>
        <AnswerList :answers="answers" 
                    @reply="replyAnswer"
                    @edit="editAnswer"/>
        <sui-modal v-model="m.open">
            <sui-modal-header>{{m.header}}</sui-modal-header>
            <sui-modal-content>
                <sui-form>
                    <sui-form-field>
                        <label>Content</label>
                        <textarea v-model="m.content"></textarea>
                    </sui-form-field>
                </sui-form>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button negative @click="toggle">Close</sui-button>
                <sui-button positive @click="modalSubmit">Submit</sui-button>
            </sui-modal-actions>
        </sui-modal>
    </sui-container>
</template>

<script>
import axios from 'axios'
import AnswerList from '@/components/AnswerList'

export default {
    name: 'Question',
    components: {
        AnswerList
    },
    data: () => {
        return {
            q: {
                title: '',
                description: '',
                author: '',
                aid: null,
                last_edit: '',
                vote: 0,
                myVote: 0
            },
            m: {
                open: false,
                header: '',
                editId: null,
                replyId: null,
                content: ''
            },
            answers: []
        }
    },
    methods: {
        toggle: function() {
            this.m.open = !this.m.open;
        },
        init: async function() {
            var resp = await axios.get('http://3.14.88.210:31313/question', {
                params: {
                    qid: this.$route.params.id
                }
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            this.q = resp.data;
            resp = await axios.get('http://3.14.88.210:31313/answers', {
                params: {
                    qid: this.$route.params.id
                }
            });
            this.answers = resp.data.answers;
        },
        vote: async function(qid, value) {
            const resp = await axios.post('http://3.14.88.210:31313/vote', {
                qid: qid,
                value: value
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            const after = (this.q.myVote == value) ? 0 : value;
            this.q.vote += (after - this.q.myVote);
            this.q.myVote = after;
        },
        del: async function(qid) {
            const resp = await axios.post('http://3.14.88.210:31313/del_question', {
                qid: qid,
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            this.$router.push({path: '/'});
        },
        edit: function() { 
            this.$router.push({
                path: '/post',
                query: {
                    qid: this.$route.params.id
                }
            })
        },
        postAnswer: function() {
            this.m.header = 'New Answer';
            this.m.editId = null;
            this.m.replyId = null;
            this.toggle();
        },
        replyAnswer: function(replyId) {
            this.m.header = 'Reply';
            this.m.replyId = replyId;
            this.m.editId = null;
            this.toggle();
        },
        editAnswer: function(editId, oldContent) {
            this.m.header = 'Edit Answer';
            this.m.replyId = null;
            this.m.editId = editId;
            this.m.content = oldContent;
            this.toggle();
        },
        modalSubmit: async function() {
            const resp = await axios.post('http://3.14.88.210:31313/new_answer', {
                qid: this.$route.params.id,
                content: this.m.content,
                replyId: this.m.replyId ? this.m.replyId : null,
                editId: this.m.editId ? this.m.editId : null
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            this.$router.go();
        }
    },
    created() {
        this.init();
    },
    watch: {
        '$route.query': function() {
            this.init();
        }
    }
}
</script>

<style scoped>
    .upvote {
        margin-top: 10px;
    }
    .upvote:hover, .downvote:hover {
        color: aqua;
        cursor: pointer;
    }
    .voted {
        color: aqua;
    }
    .upvote, .downvote, .thumb {
        text-align: center;
        height: 30px;
        width: 100%;
        font-size: 30px;
        font-weight: bold;
    }
    .thumb, .downvote {
        margin-top: 15px;
    }
    .votearea {
        padding: 0 !important;
    }
    .newc_btn {
        margin-left: 20px;
    }
</style>