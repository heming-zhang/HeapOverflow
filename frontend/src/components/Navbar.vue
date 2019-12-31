<template>
  <div>
    <sui-menu inverted>
        <sui-menu-item @click.native="toMain">
          <a @click.native="toMain">HeapOverflow</a>
        </sui-menu-item>
        <sui-menu-item>
          <div class="ui left icon action input">
            <i class="search icon"></i>
            <input type="text" v-model="content" @keyup.enter="searchContent" placeholder="Search...">
            <div class="ui blue inverted submit button" @click="searchContent">Search</div>
          </div>
        </sui-menu-item>
        <sui-menu-menu v-if="$session.get('login')" position="right">
          <sui-menu-item>
            <a @click="toUsersProfile">{{username}}</a>
          </sui-menu-item>
          <sui-menu-item>
            <sui-button @click.native="signOut" inverted color="blue">Sign Out</sui-button>
          </sui-menu-item>
        </sui-menu-menu>
        <sui-menu-menu v-else position="right">
          <sui-menu-item>
            <sui-button @click.native="signInPrime" inverted color="blue">Sign In</sui-button>
          </sui-menu-item>
          <sui-menu-item>
            <sui-button @click.native="signUpPrime" inverted color="blue">Sign Up</sui-button>
          </sui-menu-item>
        </sui-menu-menu>
    </sui-menu>

    <!-- modal for signin -->
    <sui-modal v-model="openSignIn">
      <sui-modal-header>Sign In</sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <label>Username</label>
            <input type="text" v-model="username" placeholder="Username" >
          </sui-form-field>
          <sui-form-field>
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Password" >
          </sui-form-field>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click.native="signInPrime">
          Close
        </sui-button>
        <sui-button positive @click.native="signIn">
          Sign In
        </sui-button>
      </sui-modal-actions>
    </sui-modal>

    <!-- modal for signup  -->
    <sui-modal v-model="openSignUp">
      <sui-modal-header>Sign Up</sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <label>Username</label>
            <input type="text" v-model="username" placeholder="Username" >
          </sui-form-field>
          <sui-form-field>
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Password" >
          </sui-form-field>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click.native="signUpPrime">
          Close
        </sui-button>
        <sui-button positive @click.native="signUp">
          Sign Up
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Navbar',
  data: function(){
    return {
      content: '',
      openSignIn: false,
      openSignUp: false,
      username: '',
      password: ''
    }
  },
  async created() {
    const resp = await axios.get('http://3.14.88.210:31313/session');
    if(resp.data) {
      this.$session.start();
      this.$session.set('uid', resp.data.uid);
      this.$session.set('uname', resp.data.uname);
      this.$session.set('login', true);
      this.username = resp.data.uname;
    }
  },
  methods:{
    searchContent: function(){
      this.$router.push({
        path: '/search',
        query:{
          key: this.content
        }
      })
    },
    signInPrime: function(){
      this.openSignIn = !this.openSignIn
    },
    signUpPrime: function(){
      this.openSignUp = !this.openSignUp
    },
    signIn: async function(){
      this.openSignIn = !this.openSignIn
      // interactions with backend
      const resp = await axios.post('http://3.14.88.210:31313/login', {
          username: this.username,
          password: this.password
      });
      if(resp.data.err){
        alert(resp.data.err)
      }else{
        this.$session.start();
        this.$session.set('uid', resp.data.user.id);
        this.$session.set('uname', resp.data.user.name);
        this.$session.set('login', true);
        this.$router.go();
      }
    },
    signUp: async function(){
      this.openSignUp = !this.openSignUp
      // interactions with backend
      const resp = await axios.post('http://3.14.88.210:31313/register', {
          username: this.username,
          password: this.password
      });
      if(resp.data.err){
        alert(resp.data.err);
      }
    },
    toUsersProfile: function(){
      this.$router.push({
        path: '/user/' + this.$session.get('uid')
      })
    },
    signOut: async function() {
      const resp = await axios.post('http://3.14.88.210:31313/logout');
      if(resp.data.err){
        alert(resp.data.err)
      }else{
        this.$session.destroy();
        this.$router.go();
      }
    },
    toMain: function(){
      this.$router.push({
        path: '/'
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