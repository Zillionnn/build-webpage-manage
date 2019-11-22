<template>
 <div class="context-menu">
     <div>
         <a class="menu-item" @click="doCMD('up')">上一层</a>
         <a class="menu-item" @click="doCMD('down')">下一层</a>
         <a class="menu-item" v-if="!isLock" @click="doCMD('lock')">锁定</a>
         <a class="menu-item" v-if="isLock" @click="doCMD('unlock')">解锁</a>
     </div>

 </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  components: {

  },
  props: {
    isLock: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    doCMD (p) {
      this.$emit('doCmd', p)
    }
  }
}
</script>

<style scoped>
.context-menu{
    border: 1px solid #cccccc;
    background: #ffffff;
    padding: 8px 20px;
    width: 200px;
}
.menu-item{
    margin: 0 -20px;
    padding: 0 20px;
    line-height: 30px;
    display: block;
}
.menu-item:hover{
    display: block;
    line-height: 30px;
    background-color: hsla(0,0%,84.7%,.2);
    margin: 0 -20px;
    padding: 0 20px;
}
</style>
