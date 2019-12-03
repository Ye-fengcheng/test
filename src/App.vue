<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  watch:{
    $route:function(val){
      let noneUrl = !this.$route.matched || this.$route.matched.length === 0;
      if(noneUrl){
        this.$router.push({ path: '/frame/welcome' });
      }
    }
  },
  mounted(){
    if(this.$storage.getToken() && this.$route.fullPath =='/login'){
      this.$router.push({ path: '/frame/welcome' });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
