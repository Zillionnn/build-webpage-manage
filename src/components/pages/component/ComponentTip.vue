<template>
 <div class="component-tip">
     <div>
         {{type[showComponentTipType].title}}
     </div>
     <div>
         {{type[showComponentTipType].des}}
     </div>
     <div>
         <img src=""/>
     </div>
 </div>
</template>

<script>
export default {
  name: 'ComponentTip',
  components: {

  },
  props: {
    showComponentTipType: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      type: {
        text: {
          title: '文字',
          des: '支持静态输入'
        },
        image: {
          title: '图',
          des: '展示图片资源'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
