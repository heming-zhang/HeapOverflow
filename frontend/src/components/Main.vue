<template>
  <sui-container>
    <h1 is="sui-header" dividing>
        <span>Questions</span>
        <sui-button v-if="$session.get('login')"
                    @click="postQuestion" 
                    class="newq_btn" color="green">
                Post Question
        </sui-button>
    </h1>
    <QuestionList :qlist="qlist"/>
  </sui-container>
</template>

<script>
import QuestionList from '@/components/QuestionList'
import axios from 'axios'

export default {
  name: 'Main',
  components:{
    QuestionList
  },
  data: function() {
    return {
      qlist: []
    }
  },
  async created() {
    const resp = await axios.get('http://3.14.88.210:31313/qlist');
    if(resp.data.err) {
      alert(resp.data.err);
      return;
    }
    this.qlist = resp.data;
  },
  methods: {
    postQuestion: function() {
      this.$router.push({
        path: '/post'
      })
    }
  }
}

</script>

<style scoped>
  .newq_btn {
      margin-left: 20px;
  }
</style>
