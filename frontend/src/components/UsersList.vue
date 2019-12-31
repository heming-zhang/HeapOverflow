<template>
    <sui-container>
      <sui-item-group divided>
        <sui-item v-for="(u, uindex) in ulist" :key="uindex">
          <sui-item-content>
            <sui-icon name="user circle" disabled />
            <a is="sui-item-header" @click.native="toUser(u.id)">{{u.name}}</a>
          </sui-item-content>
        </sui-item>
      </sui-item-group>
    </sui-container>
</template>

<script>
export default {
  name: 'UsersList',
  props:{
    ulist:{
      type: Array,
      require: true
    }
  },
  data: function(){
    return {
    }
  },
  methods:{
    toUser: function(uid){
      this.$router.push({
        path: '/user/' + uid
      })
    }
  }
}
</script>

<style>
</style>
