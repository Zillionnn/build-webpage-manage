<template>
  <div class="canvas-wrap">
    {{box}}
    <v-transform
      :canvas="canvas"
      :y="box.y"
      :x="box.x"
      :width="box.width"
      :height="box.height"
      :rotate="box.rotate"
      @update="update"
    >
      <div style="width:100%;height:100%;">123</div>
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
      canvas: {
        top: 60,
        left: 100
      },
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 200,
        rotate: 0
      }
    }
  },
  methods: {
    update (conf) {
      console.log('UPDATE >> ', conf)

      this.box = Object.assign(this.box, conf)
      if (conf.x) {
        this.box.x = conf.x - 100
      }
      if (conf.y) {
        this.box.y = conf.y - 60
      }
      console.log('box', this.box.width)
    }
  }
}
</script>

<style scoped>
.canvas-wrap {
  border: 1px solid;
  width: 800px;
  height: 800px;
  margin-left: 100px;
  margin-top: 60px;
  position: relative;
}
</style>
