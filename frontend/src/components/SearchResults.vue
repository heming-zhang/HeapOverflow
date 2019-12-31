<template>
  <sui-container>
    <h1 is="sui-header">Search Result</h1>
    <sui-menu tabular>
      <a
        is="sui-menu-item"
        v-for="item in items"
        :key="item"
        :active="isActive(item)"
        :content="item"
        @click="select(item)"
      />
    </sui-menu>
    <div v-if="active=='Questions'">
      <QuestionList :qlist='sRes.qlist' />
    </div>
    <div v-if="active=='Answers'">
      <UsersAnswers :alist='sRes.alist' />
    </div>
    <div v-if="active=='Users'">
      <UsersList :ulist='sRes.ulist' />
    </div>
  </sui-container>
</template>

<script>
import QuestionList from '@/components/QuestionList'
import UsersAnswers from '@/components/UsersAnswers'
import UsersList from '@/components/UsersList'
import axios from 'axios'

export default {
  name: 'SearchResults',
  components:{
    QuestionList,
    UsersAnswers,
    UsersList
  },
  data: function(){
    return{
      items: ['Questions','Answers', 'Users'],
      active: 'Questions',
      sRes: {
        qlist: [],
        alist: [],
        ulist: []
      }
    }
  },
  methods: {
    search: async function() {
      if(this.$route.query.key.length == 0) {
        alert('keyword cannot be empty');
        return;
      }
      const res = await axios.get('http://3.14.88.210:31313/search', {params: {key: this.$route.query.key}});
      if(res.data.err) {
        alert(res.data.err);
        return;
      }
      this.sRes = res.data;
    },
    isActive(itemname) {
      return this.active === itemname;
    },
    select(itemname) {
      this.active = itemname;
    }
  },
  created: function() {
      this.search()
  },
  watch: {
    '$route.query': function () {
      this.search();
    }
  }
}

</script>