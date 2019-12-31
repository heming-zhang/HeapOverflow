<template>
  <sui-container>
    <h1>{{u.uname}}</h1>
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
    <sui-container v-if="active=='Overview'">
      <sui-statistic horizontal color="olive">
        <sui-statistic-label>Joined Since&nbsp;&nbsp;&nbsp;&nbsp;</sui-statistic-label>
        <sui-statistic-value>{{u.createdAt}}</sui-statistic-value>
      </sui-statistic>
      <sui-statistics-group horizontal>
        <sui-statistic in-group color="olive">
          <sui-statistic-value>{{u.qlist.length}}</sui-statistic-value>
          <sui-statistic-label>Questions</sui-statistic-label>
        </sui-statistic>
        <sui-statistic in-group color="olive">
          <sui-statistic-value>{{u.alist.length}}</sui-statistic-value>
          <sui-statistic-label>Answers</sui-statistic-label>
        </sui-statistic>
      </sui-statistics-group>
    </sui-container>

    <sui-container v-if="active=='Questions'">
      <QuestionList :qlist='u.qlist' />
    </sui-container>

    <sui-container v-if="active=='Answers'">
      <UsersAnswers :alist='u.alist' />
    </sui-container>
  </sui-container>
</template>

<script>
import QuestionList from '@/components/QuestionList'
import UsersAnswers from '@/components/UsersAnswers'
import axios from 'axios'

export default {
  name: 'UsersProfile',
  components:{
    QuestionList,
    UsersAnswers
  },
  data: function(){
    return {
      u: {
        uname: '',
        createdAt: '',
        qlist: [],
        alist: []
      },
      items: ['Overview', 'Questions','Answers'],
      active: 'Overview',
    }
  },
  methods: {
    init: async function(){
      const resp = await axios.get('http://3.14.88.210:31313/user', {
        params: {
          uid: this.$route.params.id
        }
      });
      if(resp.data.err) {
        alert(resp.data.err);
        return;
      }
      this.u = resp.data;
    },
    isActive(itemname) {
      return this.active === itemname;
    },
    select(itemname) {
      this.active = itemname;
    }
  },
  created: function() {
      this.init();
  },
  watch: {
    '$route.params': function() {
      this.init();
    }
  }
}
</script>

