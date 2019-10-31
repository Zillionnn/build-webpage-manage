<template>
 <div class="head-bar">
     <div class="logo">
         <img v-if="logo" :src="logo"/>
     </div>
     <div>
         <a @click="savePage()">保存</a>
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
  },
  methods: {
    savePage () {
      this.$store.dispatch('passSave', true)
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
    cursor:pointer;
}
</style>
