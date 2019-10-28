<template>
 <div class="layout-thum" @click="setLayout">
     <div v-if="type==='top-nav' || type==='left-top-nav'" class="layout-preview top-nav"></div>
     <div v-if="type==='left-nav'" class="layout-preview left-nav"></div>
     <div v-if="type==='left-top-nav'" class="layout-preview left-top-nav"></div>
 </div>
</template>

<script>
export default {
  name: 'LayoutThumbnail',
  components: {

  },
  props: {
    type: {
      type: String,
      required: false,
      default: 'none'
    }
  },
  data () {
    return {

    }
  },
  methods: {
    setLayout () {
      this.$emit('change', this.type)
    }
    //   ####################methods####################
  }
}
</script>

<style scoped>
.layout-thum{
    width: 74px;
    height: 53px;
    border: 1px solid #d8d8d8;
    position: relative;
    padding: 4px;
    margin-bottom: 10px;
}

.layout-preview{
    box-sizing: border-box;
    background: #e5f3ff;
}
.top-nav{
      height: 10px;
    width: 100%;
}
.left-nav{
      height: 100%;
    width: 10px;
}

.left-top-nav{
      height: 80%;
    width: 10px;
}
</style>
