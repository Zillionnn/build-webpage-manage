<template>
 <div class="component-item" @dragstart="dragstart" @mouseover="toggleTip" @mouseleave="toggleTip">
     <div style="text-align:center;">
         <i :class="icon"></i>
     </div>
     <div style="text-align:center;">
         <slot></slot>
     </div>
 </div>
</template>

<script>
export default {
  name: 'ComponentItem',
  components: {

  },
  props: {
    icon: {
      type: String,
      required: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    dragstart () {
      this.$emit('dragstart')
    },

    toggleTip () {
      this.$emit('toggleTip')
    }
  }
}
</script>

<style scoped>
.component-item{
    width: 70px;
    margin: 10px;
}
</style>
