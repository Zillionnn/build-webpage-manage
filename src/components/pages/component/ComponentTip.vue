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
        },
        chart_bar: {
          title: '柱状图',
          des: '数据用柱状图展示'
        },
        chart_line: {
          title: '折线图',
          des: '数据用折线图展示'
        },
        chart_pie: {
          title: '饼图',
          des: '数据用饼图展示'
        },
        table: {
          title: '表格',
          des: '数据用表格展示'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
