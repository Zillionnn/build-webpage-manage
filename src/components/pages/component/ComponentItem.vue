<template>
 <div class="component-item" @dragstart="dragstart" @mouseover="toggleTip(true)" @mouseleave="toggleTip(false)">
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

    toggleTip (b) {
      this.$emit('toggleTip', b)
    }
  }
}
</script>

<style scoped>
.component-item{
    width: 50%;
    margin: 10px 0;
}
</style>
