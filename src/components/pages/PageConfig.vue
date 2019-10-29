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
              <layout-thumbnail
                :type="'none'"
                :class="{'activeLayout':layout==='none'}"
                @change="setLayout('none')"
              />
              <layout-thumbnail
                :type="'top-nav'"
                :class="{'activeLayout':layout==='top-nav'}"
                @change="setLayout('top-nav')"
              />
              <layout-thumbnail
                :type="'left-nav'"
                :class="{'activeLayout':layout==='left-nav'}"
                @change="setLayout('left-nav')"
              />
              <layout-thumbnail
                :type="'left-top-nav'"
                :class="{'activeLayout':layout==='left-top-nav'}"
                @change="setLayout('left-top-nav')"
              />
            </div>

            <button @click="getAppMenu()">页面设置</button>
          </div>
        </div>
        <div>
          <div @click="showPages= !showPages" class="tab-title">
            页面
            <i style="float:right;" class="icon-plus" @click="addPage"></i>
          </div>
          <div>
            <div v-for="(item,index) in pageList" :key="index">
              <div v-if="item.edit===false" @click="selectedPage(item)" :class="{'active-page':activePage===item.page_id}">
                <span>{{item.name}}</span>
                <span style="float:right;">
                  <i class="icon-edit-solid" @click="resetPageEdit(item)"></i>
                  <i class="icon-bin"></i>
                </span>
              </div>
              <div v-else>
                <input v-model="item.name" @keydown="confirmUpdate(item,arguments)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="active===1">
        <button>组件</button>

          <div class="component-drag" draggable="true" @dragstart="startDrag('text')">文字</div>
          <div class="component-drag" draggable="true" @dragstart="startDrag('pic')">图片</div>

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
      <div v-for="(box, index) in page.components" :key="index">
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
    <!-- ############################################### 配置 ######################################## -->
    <div class="config-panel">
      <div class="menu-detail" v-if="showMenuDetailSetting">
        <div>
          <span>菜单配置</span>
          <i style="float:right;" class="icon-cross" @click="showMenuDetailSetting=false"></i>
        </div>
        <br />
        <div>
          <div>
            <span>菜单名称</span>
            <input v-model="formMenu.name" />
          </div>

          <div>
            <span>目标链接</span>
            <div>
              <el-select v-model="formMenu.linkType">
                <el-option label="当前应用页面" :value="0"></el-option>
                <el-option label="指定链接" :value="1"></el-option>
              </el-select>
              <div
                v-if="formMenu.linkType===0"
                style="border: 1px solid;height: 500px; overflow:auto;"
              >
                <el-radio-group v-model="formMenu.link">
                  <el-radio
                    v-for="(item,index) in pageList"
                    :key="index"
                    :label="item.url"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </div>
              <div v-else>
                <input v-model="formMenu.link" placeholder="http:// 开头" />
              </div>
            </div>
          </div>

          <div>
            <button @click="updateMenu()">确定</button>
            <button>取消</button>
          </div>
        </div>
      </div>
      <!-- 菜单列表 -->
      <div style="width: 240px; border: 1px solid;">
        <div class="tab-title">菜单配置</div>
        <div class="menu-list" v-for="(item,index) in menuList" :key="index">
          {{item.name}}
          <i class="icon-cog-solid" @click="openMenuDetail(item)"></i>
          <i class="icon-bin" @click="deleteMenu(item)"></i>
        </div>
        <button @click="addParentMenu()">新增主菜单</button>
      </div>
    </div>

    <el-dialog title :visible.sync="menuDialogVisible" width="30%">
      <div>
        <span>菜单名</span>
        <input v-model="formMenu.name" />
      </div>

      <span slot="footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subMenu()">确 定</el-button>
      </span>
    </el-dialog>
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
  computed: {
    appId () {
      console.log(this.$route)
      return this.$route.params.id
    },
    doSave () {
      return this.$store.getters.doSave
    }
  },

  data () {
    return {
      active: 0,
      showNavigator: false,
      showPages: false,
      // 页面
      page: {
        appId: '',
        name: '',
        components: [
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
        left: 300
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
      menuList: [],
      formMenu: {
        name: ''
      },
      menuDialogVisible: false,
      showMenuDetailSetting: false,
      pageList: [],
      activePage: ''
    }
  },
  watch: {
    doSave (val) {
      if (val === true) {
        console.log(val)
        this.savePage()
      }
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
        .appPageList(this.appId)
        .then(res => {
          this.pageList = res.data.data.map(e => {
            return {
              ...e,
              edit: false
            }
          })
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
    /**
     * 开始拖动组件
     */
    startDrag (p) {
      this.dragItem = p
    },

    /**
     * 组件拖放到 画布
     */
    drop () {
      console.log(this.dragItem)
      const id = 't' + parseInt(Math.random() * 100)
      let components = this.page.components
      if (this.dragItem === 'text') {
        components.push({
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
        components.push({
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
      this.page = {
        appId: this.appId,
        name: '自定义页面',
        components: []
      }
      api.base.addPage(this.page).then(res => {
        this.getPages()
      })
    },

    setLayout (p) {
      this.layout = p
    },

    /**
     * 获取app 菜单
     */
    getAppMenu () {
      api.base
        .appMenuList(this.appId)
        .then(res => {
          this.menuList = res.data.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    addParentMenu () {
      this.menuDialogVisible = true
    },
    subMenu () {
      this.formMenu.appId = this.appId
      api.base
        .addAppMenu(this.formMenu)
        .then(res => {
          this.getAppMenu()
          this.menuDialogVisible = false
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * 菜单详情设置
     * link etc
     */
    openMenuDetail (menu) {
      this.showMenuDetailSetting = true
      this.formMenu = { ...menu }
      console.log(menu)
    },

    /**
     * 更新一个菜单
     */
    updateMenu () {
      console.log(this.formMenu)
      api.base
        .updateMenu(this.formMenu)
        .then(res => {
          this.getAppMenu()
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * 删除菜单
     */
    deleteMenu (menu) {
      api.base
        .deleteMenu(menu.menu_id)
        .then(res => {
          this.getAppMenu()
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * 点击编辑 其他页面 编辑状态=false
     */
    resetPageEdit (page) {
      this.pageList.map(e => {
        e.edit = false
      })
      page.edit = true
    },

    /**
     * 按下回车 更新页面名称
     */
    confirmUpdate (page, e) {
      console.log(e)
      if (e[0].keyCode === 13) {
        page.edit = false
        api.base
          .updatePageName(page)
          .then(res => {
            this.getPages()
          })
          .catch(err => {
            console.error(err)
          })
      }
    },

    /**
     * 选中页面 显示 该页面的组件
     *  查询页面detail
     */
    selectedPage (page) {
      this.activePage = page.page_id
      api.base.pageDetail(page.page_id)
        .then(res => {
          this.page = res.data.data
          this.page.components = this.page.components.map(e => {
            return JSON.parse(e)
          })
        })
    },

    /**
     * 保存页面
     */
    savePage () {
      console.log(this.page)
      api.base.updatePageComponents(this.page)
        .then(res => {
          this.$store.dispatch('passSave', false)
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('passSave', false)
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
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
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
  padding: 10px;
}
.tab-title {
  padding: 10px;
  text-align: left;
}
.layout-wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
}
.activeLayout {
  border: 3px solid #00ccff;
}

.menu-list {
  text-align: left;
  background: #cccccc;
  padding: 5px;
}
.menu-detail {
  background: #ffffff;
  border: 1px solid #bbb;
  width: 300px;
  height: 100%;
  padding: 10px;
}
.active-page{
  background: #00ccff;
}
</style>
