<template>
  <div id="app">
    <head-bar></head-bar>
    <router-view/>
  </div>
</template>

<script>
import HeadBar from './components/common/HeadBar.vue'

export default {
  name: 'App',
  components: {
    HeadBar
  }
}
</script>

<style>
body,html{
  margin:0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  position: relative;
}
</style>
