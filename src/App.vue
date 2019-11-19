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
@import url("./config/custom.css");
body,html{
  margin:0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  position: relative;
}
.flex-space-between{
  display:flex;
  justify-content: space-between;
  align-items: center;
}
.flex-align-items-center{
  display: flex;
  align-items: center;
}
</style>
