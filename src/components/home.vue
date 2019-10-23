<template>
  <div class="body">
    <div style="position:absolute;top:10px; left:10px;">
      <div>
        页面
        <button @click="addPage('custom')">添加页面</button>
      </div>
      <div class="component-drag" draggable="true" @dragstart="startDrag('text')">文字</div>
      <div class="component-drag" draggable="true" @dragstart="startDrag('pic')">图片</div>
    </div>
    <!-- 画布 操作界面 -->
    <div
      class="canvas-wrap"
      :style="`margin-left: ${canvas.left}px;  margin-top: ${canvas.top}px;`"
      @dragover="allowDrop"
      @drop="drop"
    >
    <!-- 页面上的组件 -->
      <div v-for="(box, index) in page.elements" :key="index">
        <v-transform
          :ref="box.id"
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
    <!-- 配置 -->
    <div class="config-panel">
      <div>
        <div>
          x:
          <input type="number" v-model="currentBox.x" />
        </div>
        <div>
          y:
          <input type="number" v-model="currentBox.y" />
        </div>
        <div v-if="currentBox.info.attrs.hasOwnProperty('src')">
          imgsrc:
          <input type="text" v-model="currentBox.info.attrs.src" />
        </div>
        <div>
          content:
          <input type="text" v-model="currentBox.info.content" />
        </div>
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
      // 页面
      page: {
        name: '',
        elements: [
          {
            id: 'f1',
            x: 100,
            y: 100,
            width: 100,
            height: 200,
            rotate: 40,
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
        ]
      },
      mousePosition: {
        x: 0,
        y: 0
      },
      canvas: {
        top: 60,
        left: 200
      },
      currentBox: {
        info: {
          attrs: {
            src: ''
          }
        }
      },

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

        return createElement(
          'div',
          {
            style: {
              width: '100%',
              height: '100%'
            }
          },
          [
            createElement(
              this.componentInfo.tagName,
              {
                attrs: this.componentInfo.attrs
              },
              this.componentInfo.content
            )
          ]
        )
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
      box = Object.assign(box, conf)
      if (conf.x) {
        box.x = conf.x - this.canvas.left
      }
      if (conf.y) {
        box.y = conf.y - this.canvas.top
      }
    },
    allowDrop (e) {
      e.preventDefault()
    },

    startDrag (p) {
      this.dragItem = p
    },
    drop () {
      console.log(this.dragItem)
      const id = 't' + parseInt(Math.random() * 100)
      let elements = this.page.elements
      if (this.dragItem === 'text') {
        elements.push({
          id: id,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotate: 0,
          info: {
            tagName: 'div',
            attrs: {
              id: id
            },
            content: '文字'
          }
        })
      }
      if (this.dragItem === 'pic') {
        elements.push({
          id: 'f1',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotate: 0,
          info: {
            tagName: 'img',
            attrs: {
              style: {},
              width: '100%',
              height: '100%',
              src: ''
            }
          }
        })
      }

      this.$refs[id].toggleOperates(true)
    },

    /**
     * 添加页面
     */
    addPage (type) {
      if (type === 'custom') {
        this.page = {
          name: '自定义页面',
          elements: []
        }
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
  width: 900px;
  height: 800px;
  position: relative;
}
.config-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border: 1px solid;
}
</style>
