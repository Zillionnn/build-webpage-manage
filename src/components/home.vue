<template>
  <div class="canvas-wrap">
    {{box}}
    <v-transform  :y="box.y" :x="box.x" :width="box.width" :height="box.height" @update="update">
      <div style="width:100px;height:100px;">
        123
      </div>
    </v-transform>

  </div>
</template>

<script>
import VTransform from './common/VTransform.vue'

export default {
  name: 'home',
  components: {
    VTransform
  },
  data () {
    return {
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }
    }
  },
  methods: {
    update (pos) {
      this.box.x = pos.x - 100
      this.box.y = pos.y - 60
    }
  }
}
</script>

<style scoped>
.canvas-wrap{
  border: 1px solid;
  width: 800px;
  height: 800px;
  margin-left: 100px;
  margin-top: 60px;
  position: relative;
}
</style>
