<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <Navbar />
    <router-view/>
  </div>
</template>

<script>

import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components:{
    Navbar
  }
}
</script>

<style>
</style>