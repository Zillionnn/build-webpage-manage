<template>
 <div class="head-bar">
     <div class="logo">
         <img v-if="logo" :src="logo"/>
     </div>
     <div>
         <a>发布</a>
     </div>
 </div>
</template>

<script>
export default {
  name: 'HeadBar',
  components: {

  },
  props: {
    logo: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.head-bar{
    background: #000000;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}
.logo{
    width: 50px;
    height: 50px;
}
a{
    text-decoration: none;
    color: #bbb;
}
</style>
