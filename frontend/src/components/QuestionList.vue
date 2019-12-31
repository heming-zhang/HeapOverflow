<template>
    <sui-container>
      <sui-item-group divided>
        <sui-item v-for="(q, qindex) in qlist" :key="qindex">
          <sui-item-content>
            <a is="sui-item-header" @click.native="toQuestion(q.id)">{{q.title}}</a>
            <sui-item-meta>
              <span ><b>{{q.vote}} </b> Upvotes</span>
              <span ><b>{{q.ans_cnt}} </b> Comments</span>
              Posted By: <a :href="'/user/' + q.aid"><b>{{q.author}} </b></a>
              <span >Last Edit: <b> {{q.last_edit}}</b></span>
            </sui-item-meta>
          </sui-item-content>
        </sui-item>
      </sui-item-group>
    </sui-container>
</template>

<script>
export default {
  name: 'QuestionList',
  props:{
    qlist:{
      type: Array,
      require: true
    }
  },
  data: function(){
    return {
    }
  },
  methods:{
    toQuestion: function(qid) {
      this.$router.push({
        path: '/question/' + qid
      })
    }
  }
}
</script>

<style scoped>
  a:hover {
    cursor: pointer;
  }
</style>
