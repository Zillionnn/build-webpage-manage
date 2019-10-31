<template>
  <div class="body">
    <div class="side-bar">
      <div class="item" @click="active=0">页面</div>
      <div class="item" @click="active=1">组件</div>
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
              <div
                v-if="item.edit===false"
                @click="selectedPage(item)"
                :class="{'active-page':activePage===item.page_id}"
                style="display:flex;justify-content:space-between;"
              >
                <span>{{item.name}}</span>
                <span>
                  <i class="icon-edit-solid" @click="resetPageEdit(item)"></i>
                  <i class="icon-bin" @click="deletePage(item)"></i>
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
        <div class="component-drag" draggable="true" @dragstart="startDrag('chart-bar')">柱状图</div>
        <div class="component-drag" draggable="true" @dragstart="startDrag('chart-line')">折线图</div>
      </div>

    </div>
    <!-- ###################################画布 操作界面 ########################################-->
    <div class="canvas-body">
      <div
        class="canvas-wrap"
        :style="`margin-left: ${canvas.left-300}px;  margin-top: ${canvas.top-50}px;`"
        @dragover="allowDrop"
        @drop="drop"
      >
        <div class="top-nav"></div>
        <div class="left-nav">
          <div
            class="left-nav-menu-item"
            v-for="(item,index) in menuList"
            :key="index"
          >{{item.name}}</div>
        </div>
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
                <!-- <el-radio-group v-model="formMenu.link">
                  <el-radio
                    v-for="(item,index) in pageList"
                    :key="index"
                    :label="item.url"
                  >{{item.name}}</el-radio>
                </el-radio-group>-->
                <el-radio-group v-model="formMenu.link">
                  <el-radio
                    style="display:block;padding:10px;"
                    v-for="(item,index) in pageList"
                    :key="index"
                    :label="item.page_id"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </div>
              <div v-else>
                <input v-model="formMenu.link" placeholder="http:// 或 https:// 开头" />
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
      <div v-if="configType==='menu'" class="config_">
        <div class="tab-title">菜单配置</div>
        <div class="menu-list" v-for="(item,index) in menuList" :key="index">
          {{item.name}}
          <i class="icon-cog-solid" @click="openMenuDetail(item)"></i>
          <i class="icon-bin" @click="deleteMenu(item)"></i>
        </div>
        <button @click="addParentMenu()">新增主菜单</button>
      </div>
      <div v-if="configType==='component'" class="config_">
        x:
        <input v-model="currentBox.x" />
        y:
        <input v-model="currentBox.y" />
        宽:
        <input v-model="currentBox.width" />
        高:
        <input v-model="currentBox.height" />
        角度:
        <input v-model="currentBox.rotate" />
        <div v-if="componentType==='text'">
          <!-- {{currentBox}} -->
          content:
          <input v-model="currentBox.info.content" />
          <div>
            <span>颜色:</span>
            <el-color-picker v-model="currentBox.info.style.color"></el-color-picker>
          </div>

          <div>
            <span>字号:</span>
            <el-select v-model="currentBox.info.style.fontSize">
              <el-option
                v-for="(item,index) in fontSizeList"
                :key="index"
                :value="item.value"
              >{{item.name}}</el-option>
            </el-select>
          </div>
        </div>
        <div v-if="componentType==='image'">
          <!-- {{currentBox}} -->
          content:
          <input v-model="currentBox.info.content" />
          <div>
            <span>图片源:</span>
            <input v-model="currentBox.info.attrs.src" />
          </div>
        </div>
        <div v-if="componentType==='chart-bar'">
          <!-- {{currentBox}} -->
          width:
          <input v-model="currentBox.info.style.width" />
           height:
          <input v-model="currentBox.info.style.height" />
          <div>
            <span>图片源:</span>
            <input v-model="currentBox.info.attrs.src" />
          </div>
        </div>
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
import env from '@/config/env'
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
      appInfo: null,
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
        // 画布到上策距离
        top: 60,
        // 画布到左侧距离
        left: 400
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
      componentType: '',

      dragItem: null,
      selectedIdx: 0,
      menuList: [],
      formMenu: {
        name: ''
      },
      menuDialogVisible: false,
      showMenuDetailSetting: false,
      pageList: [],
      activePage: '',
      fontSizeList: env.fontSizeList
    }
  },
  watch: {
    doSave (val) {
      if (val === true) {
        console.log(val)
        this.saveApp()
      }
    }
  },
  created () {
    this.getAppInfo(this.appId)
    this.getAppMenu()
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
                attrs: {
                  // 为了echart 的属性
                  options: {...this.componentInfo.options},
                  ...this.componentInfo.attrs
                },
                style: this.componentInfo.style
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
    /**
     * 应用信息
     */
    getAppInfo () {
      api.base
        .getAppInfo(this.appId)
        .then(res => {
          this.appInfo = res.data.data
          this.layout = this.appInfo.layout
        })
        .catch(err => {
          console.error(err)
        })
    },

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
        this.page.components.splice(this.selectedIdx, 1)
      }
    },

    /**
     * 选中的组件
     */
    setSelect (index) {
      this.selectedIdx = index
      this.configType = 'component'

      this.currentBox = this.page.components[index]
      console.log(this.currentBox.type)
      this.componentType = this.currentBox.type
      console.log('index', index)
    },
    update (box, args) {
      console.log(box)
      const conf = args[0]
      this.currentBox = box
      box = Object.assign(box, conf)
      console.log(box)
      if (conf.x) {
        box.x = conf.x - this.canvas.left
      }
      if (conf.y) {
        box.y = conf.y - this.canvas.top
      }
      if (box.type.indexOf('chart') > -1) {
        box.info.style.width = box.width + 'px'
        box.info.style.height = box.height + 'px'
        console.log('currentBox>>', this.currentBox)
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
      console.log(this.page)
      let components = this.page.components
      if (this.dragItem === 'text') {
        components.push({
          id: id,
          x: 300,
          y: 300,
          width: 100,
          height: 100,
          rotate: 0,
          type: 'text',
          info: {
            tagName: 'div',
            attrs: {
              id: id
            },
            style: {
              position: 'absolute',
              color: '#000000',
              fontSize: '12px'
            },
            content: '文字'
          }
        })
      }
      if (this.dragItem === 'pic') {
        components.push({
          id: 'f1',
          x: 300,
          y: 300,
          width: 100,
          height: 100,
          rotate: 0,
          type: 'image',
          info: {
            tagName: 'img',
            style: {
              position: 'absolute'
            },
            attrs: {
              width: '100%',
              height: '100%',
              src: ''
            }
          }
        })
      }

      //  <chart :options="ToolStatisticsChart"
      //              ref="chart"
      //              :autoResize="true"
      //              style="width: 3900px; height: 240px;" />
      if (this.dragItem === 'chart-bar') {
        components.push({
          id: id,
          x: 300,
          y: 300,
          width: 350,
          height: 300,
          rotate: 0,
          type: 'chart-bar',

          info: {
            tagName: 'v-echart',
            style: {
              position: 'absolute',
              width: '350px',
              height: '300px'
            },
            options: {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '直接访问',
                  type: 'bar',
                  barWidth: '60%',
                  data: [10, 52, 200, 334, 390, 330, 220]
                }
              ]
            },
            attrs: {
              autoResize: 'true'
            }
          }
        })
        console.log(this.page)
      }
      if (this.dragItem === 'chart-line') {
        components.push({
          id: id,
          x: 300,
          y: 300,
          width: 350,
          height: 300,
          rotate: 0,
          type: 'chart-line',

          info: {
            tagName: 'v-echart',
            style: {
              position: 'absolute',
              width: '350px',
              height: '300px'
            },
            options: {
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
              }]
            },
            attrs: {         
              autoResize: 'true'
            }
          }
        })
        console.log(this.page)
      }
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
      this.configType = 'menu'
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
      api.base.pageDetail(page.page_id).then(res => {
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
      console.log('this.page>>>', this.page)
      api.base
        .updatePageComponents(this.page)
        .then(res => {
          this.$store.dispatch('passSave', false)
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('passSave', false)
        })
    },

    /**
     * 保存页面布局
     */
    saveAppLayout () {
      this.appInfo.layout = this.layout
      api.base
        .updateAppInfo(this.appInfo)
        .then(res => {
          this.getAppInfo()
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * 保存app
     */
    saveApp () {
      this.savePage()
      this.saveAppLayout()
    },

    /**
     * 删除页面
     */
    deletePage (page) {
      this.$confirm('删除后将无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.base
            .deletePage(page.page_id)
            .then(res => {
              this.getPages()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /**
     * 组件上的右键菜单
     */
    rightBtnMenu (event) {
      console.log(event)
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
  width: 1920px;
  height: 1080px;
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
.canvas-body {
  position: absolute;
  top: 0;
  left: 297px;
  bottom: 0;
  right: 260px;
  background: #f1f1f1;
  overflow: auto;
}

.tab-title {
  padding: 10px;
  text-align: left;
  cursor: pointer;
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
.active-page {
  background: #00ccff;
}
.config_ {
  width: 240px;
  border: 1px solid;
  padding: 10px;
}
.top-nav {
  background: #000000;
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.left-nav {
  background: #000000;
  width: 200px;
  position: absolute;
  top: 50px;
  left: 0px;
  bottom: 0;
  color: #ffffff;
}
.left-nav-menu-item {
  padding: 10px;
  text-align: center;
}
</style>
