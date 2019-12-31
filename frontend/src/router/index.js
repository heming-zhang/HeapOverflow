import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import SearchResults from '@/components/SearchResults'
import UsersProfile from '@/components/UsersProfile'
import Question from '@/components/Question'
import Post from '@/components/Post'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Main
    },
    {
      path: '/search',
      component: SearchResults
    },
    {
      path: '/user/:id',
      component: UsersProfile
    },
    {
      path: '/question/:id',
      component: Question
    },
    {
      path: '/post',
      component: Post
    }
  ]
})
