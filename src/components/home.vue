<template>
  <div class="canvas-wrap">
    {{currentBox}}
    <div v-for="(box, index) in elements" :key="index">
      <v-transform
        :id="box.id"
        :canvas="canvas"
        :y="box.y"
        :x="box.x"
        :width="box.width"
        :height="box.height"
        :rotate="box.rotate"
        @update="update(box,arguments)"
      >
        <div :id="box.id" style="width:100%;height:100%;">123</div>
      </v-transform>
    </div>
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
      currentBox: {},
      elements: [
        {
          id: 'f1',
          x: 100,
          y: 100,
          width: 100,
          height: 200,
          rotate: 0
        },
        {
          id: 'f2',
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          rotate: 0
        }
      ]

    }
  },
  methods: {
    update (box, args) {
      const conf = args[0]
      this.currentBox = box
      console.log('UPDATE >> ', conf)

      box = Object.assign(box, conf)
      if (conf.x) {
        box.x = conf.x - 100
      }
      if (conf.y) {
        box.y = conf.y - 60
      }
      console.log('box', box.width)
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
