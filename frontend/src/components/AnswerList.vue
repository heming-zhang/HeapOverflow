<template>
    <sui-comment-group>
        <sui-comment v-for="(c, index) in answers" :key="index" 
                    :class="$route.query.cid == c.id ? 'focused' : ''">
            <sui-grid>
                <sui-grid-row>
                    <sui-grid-column :width="1" class="votearea">
                        <div class="upvote" :class="c.myVote == 1 ? 'voted' : ''" 
                            @click="vote(c, 1)">
                            <sui-icon name="angle up"></sui-icon>
                        </div>
                        <div class="thumb">{{c.vote}}</div>
                        <div class="downvote" :class="c.myVote == -1 ? 'voted' : ''" 
                            @click="vote(c, -1)">
                            <sui-icon name="angle down"></sui-icon>
                        </div>              
                    </sui-grid-column>
                    <sui-grid-column :width="15">
                        <sui-comment-content>
                            <a :href="'/user/' + c.aid" is="sui-comment-author">{{c.author}}</a>
                            <sui-comment-metadata>
                                <div>Last Edit: {{c.last_edit}}</div>
                            </sui-comment-metadata>
                            <sui-comment-text>
                                <p>{{c.content}}</p>
                            </sui-comment-text>
                            <sui-comment-actions>
                                <sui-comment-action 
                                    v-if="$session.get('login')"
                                    @click="reply(c.id)">
                                    Reply
                                </sui-comment-action>
                                <sui-comment-action 
                                    v-if="$session.get('login') && c.aid == $session.get('uid')"
                                    @click="edit(c.id, c.content)">
                                    Edit
                                </sui-comment-action>
                                <sui-comment-action 
                                    v-if="$session.get('login') && c.aid == $session.get('uid')"
                                    @click="del(c.id)">
                                    Delete
                                </sui-comment-action>
                            </sui-comment-actions>
                        </sui-comment-content>
                        <AnswerList v-if="c.comments" 
                                    :answers="c.comments" 
                                    @reply="reply"
                                    @edit="edit"/>
                    </sui-grid-column>
                </sui-grid-row>
            </sui-grid>
        </sui-comment>
    </sui-comment-group>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AnswerList',
    props: {
        answers: {
            type: Array,
            required: true
        }
    },
    data: () => {
        return {
            
        }
    },
    mounted() {
        if($('.focused').length) {
            $('html, body').animate({
                scrollTop: $('.focused').offset().top
            }, '400');
        }
    },
    methods: {
        vote: async function(c, value) {
            const resp = await axios.post('http://3.14.88.210:31313/vote', {
                cid: c.id,
                value: value
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            const after = (c.myVote == value) ? 0 : value;
            c.vote += (after - c.myVote);
            c.myVote = after;
        },
        reply: function(replyId) {
            this.$emit('reply', replyId);
        },
        edit: function(editId, oldContent) {
            this.$emit('edit', editId, oldContent);
        },
        del: async function(cid) {
            const resp = await axios.post('http://3.14.88.210:31313/del_answer', {
                cid: cid
            });
            if(resp.data.err) {
                alert(resp.data.err);
                return;
            }
            this.$router.go();
        }
    }
}
</script>

<style scoped>
    .upvote, .downvote, .thumb {
        text-align: center;
    }
    .votearea {
        padding: 0 !important;
    }
    .upvote:hover, .downvote:hover {
        color: aqua;
        cursor: pointer;
    }
    .voted {
        color: aqua;
    }
</style>