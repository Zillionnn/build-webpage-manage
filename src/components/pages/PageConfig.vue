<template>
  <div class="body">
    <div class="side-bar">
      <div class="item" @click="active=0">页面</div>
      <div class="item" @click="active=1">组件</div>
      <div class="component-drag" draggable="true" @dragstart="startDrag('text')">文字</div>
      <div class="component-drag" draggable="true" @dragstart="startDrag('pic')">图片</div>
    </div>

    <div class="side-bar-menu">
      <div v-show="active===0">
        <div style="border-bottom: 1px solid #bbb;">
          <div @click="showNavigator= !showNavigator" class="tab-title">导航布局</div>
          <div v-show="showNavigator">
            <div class="layout-wrap">
            <layout-thumbnail :type="'none'" :class="{'activeLayout':layout==='none'}" @change="setLayout('none')"/>
            <layout-thumbnail :type="'top-nav'" :class="{'activeLayout':layout==='top-nav'}" @change="setLayout('top-nav')"/>
            <layout-thumbnail :type="'left-nav'" :class="{'activeLayout':layout==='left-nav'}" @change="setLayout('left-nav')"/>
            <layout-thumbnail :type="'left-top-nav'" :class="{'activeLayout':layout==='left-top-nav'}" @change="setLayout('left-top-nav')"/>
            </div>

            <button>页面设置</button>
          </div>
        </div>
        <div>
          <div @click="showPages= !showPages" class="tab-title">页面</div>
          <div v-show="showPages">
            <div v-for="(item,index) in pages" :key="index">{{item}}</div>
          </div>
        </div>
      </div>
      <div v-show="active===1">
        <button>组件</button>
      </div>
    </div>
    <!-- 画布 操作界面 -->
    <div
      class="canvas-wrap"
      :style="`margin-left: ${canvas.left}px;  margin-top: ${canvas.top-50}px;`"
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
          @select="setSelect(index)"
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
        <div class="tab-title">菜单配置</div>
        <div v-for="(item,index) in menuList" :key="index">
          {{item.name}}
        </div>
        <button @click="addParentMenu()">新增主菜单</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api'
import VTransform from '@/components/common/VTransform.vue'
import LayoutThumbnail from '@/components/common/LayoutThumbnail.vue'

import Vue from 'vue'

export default {
  name: 'PageConfig',
  components: {
    VTransform,
    LayoutThumbnail
  },
  data () {
    return {
      active: 0,
      showNavigator: false,
      showPages: false,
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
        top: 60 + 50,
        left: 100
      },
      currentBox: {
        info: {
          attrs: {
            src: ''
          }
        }
      },
      layout: '',
      configType: '',

      dragItem: null,
      selectedIdx: 0,
      menuList: []
    }
  },
  created () {
    this.getPages()
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
      document.addEventListener('keyup', this.keyEvent)
    },
    getMousePosition (event) {
      this.mousePosition.x = event.x
      this.mousePosition.y = event.y
    },
    getPages () {
      api.base
        .appPageList(this.$route.params.id)
        .then(res => {
          console.log(res.data.data)
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * 删除组件
     */
    keyEvent (event) {
      if (event.keyCode === 46) {
        this.page.elements.splice(this.selectedIdx, 1)
      }
    },

    /**
     * 选中的组件
     */
    setSelect (index) {
      this.selectedIdx = index
      console.log('index', index)
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
        api.base.addPage(this.page).then(res => {
          // this.page.page_id
        })
      }
    },

    setLayout (p) {
      this.layout = p
    },

    addParentMenu () {
      this.menuList.push({
        name: '',
        link: ''
      })
    }
    // ###########################methods#########################
  }
}
</script>

<style scoped>
.body {
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
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
  width: 300px;
  border: 1px solid #bbb;
  background: #ffffff;
}

.side-bar {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0;
  color: #ffffff;
  background: #000000;
}
.side-bar .item {
  border-bottom: 1px solid #bbb;
  padding: 10px;
}

.side-bar-menu {
  position: absolute;
  top: 0;
  left: 55px;
  bottom: 0;
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #bbb;
}
.tab-title {
  padding: 10px;
  text-align: left;
}
.layout-wrap{
  display:flex;
  justify-content:space-between;
  flex-wrap:wrap;
  padding: 20px;
}
.activeLayout{
  border: 3px solid #00ccff;
}
</style>
