<template>
    <sui-container>
      <sui-item-group divided>
        <sui-item v-for="(a, aindex) in alist" :key="aindex">
          <sui-item-content>
            <sui-item-header>
              <a @click="toUser(a.aid)" >{{a.author}}</a> commented on
              <a @click="toQuestion(a.qid)" >{{a.qtitle}}</a>
            </sui-item-header>
            <sui-item-description>
              <p>
                <a @click="toQuestion(a.qid, a.id)">{{a.content}}</a>
              </p>
            </sui-item-description>
            <sui-item-meta>
              <span>{{a.vote}} Upvotes</span>
              <span>{{a.last_edit}}</span>
            </sui-item-meta>
          </sui-item-content>
        </sui-item>
      </sui-item-group>
    </sui-container>
</template>

<script>
export default {
  name: 'UsersAnswers',
  props:{
    alist:{
      type: Array,
      require: true
    }
  },
  data: function(){
    return {
    }
  },
  methods:{
    toQuestion: function(qid, cid){
      this.$router.push({
        path: '/question/' + qid,
        query: {
          cid: cid
        }
      })
    },
    toUser: function(uid){
      this.$router.push({
        path: '/user/' + uid,
      })
    }
  }
}
</script>