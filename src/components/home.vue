<template>
  <div class="body">

    <div style="position:absolute;top:10px; left:10px;">
      <div class="component-drag" draggable="true" @dragstart="startDrag('text')">文字</div>
      <div class="component-drag" draggable="true" @dragstart="startDrag('pic')">图片</div>
    </div>
    <div class="canvas-wrap" @dragover="allowDrop" @drop="drop">
      {{currentBox}}
      <div>
        x:
        <input type="number" v-model="currentBox.x" />
        y:
        <input type="number" v-model="currentBox.y" />
       imgsrc: <input type="text" v-model="currentBox.info.attrs.src" />
      </div>

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
          <div :id="box.id" style="width:100%;height:100%;">
            <v-render
              :componentInfo="box.info"
              :tag="'span'"
              :attrs="box.info.attrs"
              :content="box.info.content"
            ></v-render>
          </div>
        </v-transform>
      </div>
    </div>
  </div>
</template>

<script>
import VTransform from './common/VTransform.vue'
import Vue from 'vue'
import { $http } from '@/service/requestService.js'

export default {
  name: 'home',
  components: {
    VTransform
  },
  data () {
    return {
      mousePosition: {
        x: 0,
        y: 0
      },
      canvas: {
        top: 60,
        left: 100
      },
      currentBox: {
        info: {
          attrs: {
            src: ''
          }
        }
      },
      elements: [
        {
          id: 'f1',
          x: 100,
          y: 100,
          width: 100,
          height: 200,
          rotate: 0,
          info: {
            tagName: 'span',
            attrs: {
              id: 'f1'
            },
            content: '文字'
          }
        },
        {
          id: 'f2',
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          rotate: 0,
          info: {
            tagName: 'span',
            attrs: {
              id: 'f1'
            },
            content: '文字'
          }
        }
      ],
      dragItem: null
    }
  },
  created () {
    // this.getWebJson()
    // console.log('###########TEMPLATE PAGE################')
    this.listenEvent()
    Vue.component('v-render', {
      render: function (createElement) {
        console.log('componentInfo', this.componentInfo)

        return createElement('div', [

          createElement(
            this.componentInfo.tagName,
            {
              attrs: this.componentInfo.attrs
            },
            this.componentInfo.content
          )
        ])
      },
      props: {
        componentInfo: {
          type: Object,
          required: false
        }
      },
      mount () {
        console.log('render', 'mou')
      }
    })
  },
  methods: {
    listenEvent () {
      document.addEventListener('mousemove', this.getMousePosition)
    },
    getMousePosition (event) {
      this.mousePosition.x = event.x
      this.mousePosition.y = event.y
    },
    getWebJson () {
      $http
        .get('http://127.0.0.1:3000/api/v1/webjson')
        .then(res => {
          this.webJson = res.data.data
        })
        .catch(err => {
          console.error(err)
        })
    },
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
    },
    allowDrop (e) {
      e.preventDefault()
    },

    startDrag (p) {
      this.dragItem = p
    },
    drop () {
      console.log(this.dragItem)
      if (this.dragItem === 'text') {
        this.elements.push({
          id: 'f1',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotate: 0,
          info: {
            tagName: 'p',
            attrs: {
              id: 'f1'
            },
            content: '文字'
          }
        })
      }
      if (this.dragItem === 'pic') {
        this.elements.push({
          id: 'f1',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotate: 0,
          info: {
            tagName: 'img',
            attrs: {
              width: '100%',
              height: '100%',
              src: ''
            }
          }
        })
      }
    }
    // ###########################methods#########################
  }
}
</script>

<style scoped>
.body {
  display: flex;
  justify-content: flex-start;
}
.component-drag {
  padding: 10px;
  border: 1px solid #00ccff;
}
.canvas-wrap {
  border: 1px solid;
  width: 800px;
  height: 800px;
  margin-left: 100px;
  margin-top: 60px;
  position: relative;
}
</style>
