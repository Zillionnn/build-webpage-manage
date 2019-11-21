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
        <div class="components-list">
          <component-item
            :icon="'icon-text-height'"
            draggable="true"
            @dragstart="startDrag('text')"
            @toggleTip="toggleTip('text', arguments)"
          >文字</component-item>
          <component-item
            :icon="'icon-image'"
            @toggleTip="toggleTip('image',arguments)"
            draggable="true"
            @dragstart="startDrag('pic')"
          >图片</component-item>
          <component-item
            :icon="'icon-chart-bar-solid'"
            draggable="true"
            @dragstart="startDrag('chart-bar')"
            @toggleTip="toggleTip('chart_bar', arguments)"
          >柱状图</component-item>
          <component-item
            :icon="'icon-chart-line-solid'"
            draggable="true"
            @dragstart="startDrag('chart-line')"
            @toggleTip="toggleTip('chart_line', arguments)"
          >折线图</component-item>
          <component-item
            :icon="'icon-pie-chart'"
            draggable="true"
            @dragstart="startDrag('chart-pie')"
            @toggleTip="toggleTip('chart_pie', arguments)"
          >饼图</component-item>
          <component-item
            :icon="'icon-table'"
            draggable="true"
            @dragstart="startDrag('table')"
            @toggleTip="toggleTip('table', arguments)"
          >表格</component-item>
        </div>
      </div>
    </div>
    <div class="componentip" v-show="showComponentTip">
      <component-tip :showComponentTipType="showComponentTipType" />
    </div>

    <!-- ###################################画布 操作界面 ########################################-->

    <div class="canvas-body" ref="canvasBody" @scroll="scrollCanvas">
      <!-- <div class="slider-scale">
        <el-slider v-model="canvasScale" :step="10" @change="scaleCanvas"></el-slider>
      </div>-->
      <!-- :style="`transform:scale(${canvasBodyScale*0.01})`" -->
      <div
        class="canvas-wrap"
        :style="`margin-left: ${canvasMarginLeft}px;  margin-top: ${canvasMarginTop}px;`"
        @dragover="allowDrop"
        @drop="drop"
      >
        <div class="top-nav" :style="`background-color:${menuConfig.top.backgroundColor}`">
          <div class="logo">
            <img :src="menuConfig.top.logo" />
          </div>
          <span :style="`color:${menuConfig.top.appNameColor}`">{{menuConfig.top.appName}}</span>
        </div>
        <div class="left-nav" :style="`background-color: ${menuConfig.left.backgroundColor}`">
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
            @doneReset="doneReset(box)"
          >
            <div v-if="box.show" :id="box.id" style="width:100%;height:100%;">
              <v-render :componentInfo="box.info"></v-render>
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
        <div class="component-config-tab">
          <a
            v-if=" layout.indexOf('left')>-1"
            :class="{'tab-active': menuConfigActiveTab===1 && layout.indexOf('top')>-1}"
            @click="menuConfigActiveTab=1"
          >左导航</a>
          <a
            v-if=" layout.indexOf('top')>-1"
            :class="{'tab-active': menuConfigActiveTab===2 && layout.indexOf('left')>-1}"
            @click="menuConfigActiveTab=2"
          >顶部</a>
        </div>

        <!-- ########################## 左导航 ###################### -->
        <div
          v-if="layout.indexOf('left-nav')===0 || layout.indexOf('left-top-nav')>-1  && menuConfigActiveTab===1"
        >
          <div class="flex-align-items-center">
            <label>背景</label>
            <el-color-picker v-model="menuConfig.left.backgroundColor"></el-color-picker>
          </div>

          <div>
            <p>菜单样式</p>
            <!-- <div class="flex-align-items-center">
              <span>背景色</span>
              <el-color-picker v-model="menuConfig.left.menu.backgroundColor"></el-color-picker>
            </div>-->
            <div class="flex-align-items-center">
              <span>文字默认色</span>
              <el-color-picker v-model="menuConfig.left.menu.textColor"></el-color-picker>
            </div>
            <div class="flex-align-items-center">
              <span>文字选中色</span>
              <el-color-picker v-model="menuConfig.left.menu.textActiveColor"></el-color-picker>
            </div>
          </div>
        </div>
        <!-- ########################## 顶部 ###################### -->
        <div
          v-if="layout.indexOf('top-nav')===0 || layout.indexOf('left-top-nav')>-1 && menuConfigActiveTab===2"
        >
          <label>顶部栏背景</label>
          <el-color-picker v-model="menuConfig.top.backgroundColor"></el-color-picker>
          <div>
            <label>logo</label>
            <button>上传</button>
            <input type="text" v-model="menuConfig.top.logo" />
          </div>
          <div>
            <label>应用名称</label>
            <input type="text" v-model="menuConfig.top.appName" />
          </div>
          <div>
            <label>应用名称颜色</label>
            <el-color-picker v-model="menuConfig.top.appNameColor"></el-color-picker>
          </div>
        </div>
        <hr />
        <div class="tab-title">菜单配置</div>
        <div class="menu-list" v-for="(item,index) in menuList" :key="index">
          {{item.name}}
          <i class="icon-cog-solid" @click="openMenuDetail(item)"></i>
          <i class="icon-bin" @click="deleteMenu(item)"></i>
        </div>
        <button @click="addParentMenu()">新增主菜单</button>
      </div>
      <div v-if="configType==='component'" class="config_">
        <div class="component-config-tab">
          <a
            :class="{'tab-active': componentConfigActiveTab===1}"
            @click="componentConfigActiveTab=1"
          >样式</a>
          <a
            :class="{'tab-active': componentConfigActiveTab===2}"
            @click="componentConfigActiveTab=2"
          >交互</a>
        </div>
        <!-- 样式 -->
        <div v-if="componentConfigActiveTab===1">
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
            内容:
            <div class="flex-space-between">
              <input v-model="currentBox.info.content" />
              <i
                v-if="!currentBox.info.dataSource"
                class="icon-database"
                style="color:#bbb;"
                @click="toggleDataSource('text')"
              ></i>
              <span style="width: 50px;" v-else>
                <i class="icon-pen-solid" style="color:#bbb;" @click="toggleDataSource('text')"></i>
                <i class="icon-bin" style="color:#bbb;" @click="clearDataSource"></i>
              </span>
            </div>

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

          <!-- IMAGE CONFIG -->
          <div v-if="componentType==='image'">
            <!-- {{currentBox}} -->
            <image-config v-model="currentBox.info.attrs.src" />
          </div>

          <!-- CHART CONFIG -->
          <div v-if="componentType.indexOf('chart')>-1">
            <!-- {{currentBox}} -->
            width:
            <input v-model="currentBox.info.style.width" />
            height:
            <input v-model="currentBox.info.style.height" />
            <!-- 配置数据源 -->
            <div>
              <span>配置数据源</span>
              <i
                v-if="!currentBox.info.dataSource"
                class="icon-database"
                style="color:#bbb;"
                @click="toggleDataSource('chart')"
              ></i>
              <span style="width: 50px;" v-else>
                <i class="icon-pen-solid" style="color:#bbb;" @click="toggleDataSource('chart')"></i>
                <i class="icon-bin" style="color:#bbb;" @click="clearDataSource"></i>
              </span>
            </div>
            <div v-if="!isPie">
              <el-checkbox v-model="currentBox.info.props.options.xAxis.axisLabel.show">显示x轴</el-checkbox>
              <el-checkbox v-model="currentBox.info.props.options.yAxis.axisLabel.show">显示y轴</el-checkbox>
            </div>
            <el-checkbox v-model="currentBox.info.props.options.legend.show">显示图例</el-checkbox>

            <div v-if="!isPie">
              <div v-for="(serie,index) in currentBox.info.props.options.series" :key="index">
                <div>系列{{index+1}}名称</div>
                <div class="flex-space-between">
                  <input v-model="serie.name" />
                  <div>
                    <el-color-picker v-model="currentBox.info.props.options.color[index]"></el-color-picker>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div>
                标题
                <input v-model="currentBox.info.props.options.title.text" />
              </div>
              <div
                v-for="(serie,index) in currentBox.info.props.options.series[0].data"
                :key="index"
              >
                <div>系列{{index+1}}名称</div>
                <div class="flex-space-between">
                  <span>{{serie.name}}</span>
                  <div>
                    <el-color-picker v-model="currentBox.info.props.options.color[index]"></el-color-picker>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="componentType.indexOf('table')>-1">
            <div>
              <span>配置数据源</span>
              <i
                v-if="!currentBox.info.dataSource"
                class="icon-database"
                style="color:#bbb;"
                @click="toggleDataSource('chart')"
              ></i>
              <span style="width: 50px;" v-else>
                <i class="icon-pen-solid" style="color:#bbb;" @click="toggleDataSource('table')"></i>
                <i class="icon-bin" style="color:#bbb;" @click="clearDataSource"></i>
              </span>
            </div>
          </div>

          <!-- ######### 配置数据源######### -->
          <config-text-data-source
            :dataSourceConfigType="dataSourceConfigType"
            :showDataSource="showDataSource"
            :boxDataSource="currentBox.info.dataSource"
            @assignDataSource="subDataSource"
            @toggleDataSource="toggleDataSource"
          />
        </div>
        <!-- 交互 -->
        <div v-if="componentConfigActiveTab===2" style="padding: 12px;">
          <div class="event-list">
            <div v-for="(item, index) in currentBox.eventList" :key="index">
              <event-info-box
                :componentType="currentBox.type"
                :info="item"
                :index="index"
                @remove="removeEvent"
              />
            </div>
          </div>
          <button class="next-btn" @click="addCurrentBoxEvent">新增交互</button>
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
import { $http } from '@/service/requestService.js'
import Vue from 'vue'

import VTransform from '@/components/common/VTransform.vue'
import LayoutThumbnail from '@/components/common/LayoutThumbnail.vue'
import ConfigTextDataSource from './component/ConfigTextDataSource.vue'
import ImageConfig from './component/ImageConfig.vue'
import EventInfoBox from './component/EventInfoBox.vue'
import ComponentItem from './component/ComponentItem.vue'
import ComponentTip from './component/ComponentTip.vue'

export default {
  name: 'PageConfig',
  components: {
    VTransform,
    LayoutThumbnail,
    ConfigTextDataSource,
    ImageConfig,
    EventInfoBox,
    ComponentItem,
    ComponentTip
  },
  computed: {
    appId () {
      console.log(this.$route)
      return this.$route.params.id
    },
    doSave () {
      return this.$store.getters.doSave
    },

    isPie () {
      return this.componentType.indexOf('pie') > -1
    }
  },

  data () {
    return {
      showSelectComponent: true,
      canvasScale: 0.5,
      appInfo: null,
      active: 0,
      showNavigator: true,
      showPages: false,
      // 页面
      page: {
        appId: '',
        name: '',
        components: []
      },
      mousePosition: {
        x: 0,
        y: 0
      },
      canvas: {
        // 画布到上策距离
        originTop: 60,
        top: 60,
        // 画布到左侧距离
        originLeft: 400,
        left: 400
      },
      canvasMarginLeft: 0,
      canvasMarginTop: 0,
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
      fontSizeList: env.fontSizeList,
      // 数据源
      showDataSource: false,
      dataSourceConfigType: '',
      dataSource: {
        configType: 'text',
        method: 'get',
        url: '',
        data: null
      },

      componentConfigActiveTab: 1,
      menuConfigActiveTab: 1,
      menuConfig: {
        top: {
          backgroundColor: '#000000',
          appName: '',
          logo: ''
        },
        left: {
          backgroundColor: '#000000',
          menu: {
            backgroundColor: '#000000',
            textColor: '#ffffff',
            textActiveColor: '#00cd2f'
          }
        }
      },
      showComponentTip: false
      // ###### return ######
    }
  },
  watch: {
    doSave (val) {
      if (val === true) {
        console.log(val)
        this.saveApp()
      }
    },

    canvasScale (val) {
      this.canvasBodyScale = val
    }
  },
  created () {
    this.canvasMarginLeft = this.canvas.left - 300
    this.canvasMarginTop = this.canvas.top - 50
    this.getAppInfo(this.appId)
    this.getAppMenu()
    this.getPages()
    const _self = this
    // console.log('###########TEMPLATE PAGE################')
    this.listenEvent()
    Vue.component('v-render', {
      render: function (createElement) {
        console.log('componentInfo', this.componentInfo)
        if (this.componentInfo.tagName === 'v-echart') {
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
                  attrs: this.componentInfo.attrs,
                  props: {
                    // 为了echart 的属性
                    options: this.componentInfo.props.options
                  },
                  style: this.componentInfo.style
                },
                this.componentInfo.content
              )
            ]
          )
        } else {
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
                  attrs: this.componentInfo.attrs,
                  style: this.componentInfo.style,
                  props: this.componentInfo.props
                    ? this.componentInfo.props
                    : {},
                  on: {
                    changePage: p => {
                      _self.doEvent(this.componentInfo, p)
                    },
                    // TODO
                    click: () => {}
                  }
                },
                _self.returnChild(this.componentInfo)
              )
            ]
          )
        }
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
    returnChild (info) {
      if (info.hasOwnProperty('dataSource') && info.dataSource) {
        return info.dataSource.data
      } else {
        console.log(info)
        return info.content
      }
    },

    /**
     * 画布 滚动 调整
     */
    scrollCanvas (event) {
      const scrollLeft = this.$refs.canvasBody.scrollLeft
      const scrollTop = this.$refs.canvasBody.scrollTop

      console.log(scrollLeft, scrollTop)
      this.canvas.left = this.canvas.originLeft - scrollLeft
      this.canvas.top = this.canvas.originTop - scrollTop
      console.log(this.canvas)
    },
    /**
     * 应用信息
     */
    getAppInfo () {
      api.base
        .getAppInfo(this.appId)
        .then(res => {
          this.appInfo = res.data.data
          this.layout = this.appInfo.layout
          if (this.appInfo.menuConfig) {
            this.menuConfig = this.appInfo.menuConfig
          }
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
     *  TODO 选中关闭当前数据源配置
     */
    setSelect (index) {
      this.selectedIdx = index
      this.configType = 'component'

      this.currentBox = this.page.components[index]
      console.log(this.currentBox)
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
        box.show = false
        console.log('currentBox>>', this.currentBox)
      }
    },

    doneReset (box) {
      console.log('box')
      box.show = true
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
      let newComponent = null
      const defaultProp = {
        show: true,
        id: id,
        x: 300,
        y: 100,
        width: 100,
        height: 100,
        rotate: 0,
        eventList: []
      }
      if (this.dragItem === 'text') {
        newComponent = {
          ...defaultProp,
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
            content: '文字',
            dataSource: null
          }
        }
        components.push(newComponent)
      }

      // 图
      if (this.dragItem === 'pic') {
        newComponent = {
          ...defaultProp,
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
        }
        components.push(newComponent)
      }

      // 柱状图
      if (this.dragItem === 'chart-bar') {
        newComponent = {
          show: true,
          id: id,
          x: 300,
          y: 100,
          width: 350,
          height: 300,
          rotate: 0,
          type: 'chart-bar',
          eventList: [],
          info: {
            tagName: 'v-echart',
            style: {
              position: 'absolute',
              width: '350px',
              height: '300px'
            },
            props: {
              options: {
                color: ['#3398DB'],
                legend: {
                  show: true
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLabel: {
                    show: true
                  }
                },

                yAxis: {
                  type: 'value',
                  axisLabel: {
                    show: true
                  }
                },

                series: [
                  {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    barGap: '0%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                  }
                ]
              },
              autoResize: 'true'
            },
            attrs: {
              id: id
            }
          }
        }
        components.push(newComponent)
        console.log(this.page)
      }

      // 折线图
      if (this.dragItem === 'chart-line') {
        newComponent = {
          show: true,
          id: id,
          x: 300,
          y: 100,
          width: 350,
          height: 300,
          rotate: 0,
          eventList: [],
          type: 'chart-line',
          info: {
            tagName: 'v-echart',
            style: {
              position: 'absolute',
              width: '350px',
              height: '300px'
            },
            props: {
              options: {
                color: ['#3398DB'],
                legend: {
                  show: true
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                xAxis: {
                  type: 'category',
                  axisLabel: {
                    show: true
                  },
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    show: true
                  }
                },
                series: [
                  {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true
                  }
                ]
              },
              autoResize: 'true'
            },
            attrs: {
              id: id
            }
          }
        }
        components.push(newComponent)
        console.log(this.page)
      }

      // 饼图
      if (this.dragItem === 'chart-pie') {
        newComponent = {
          show: true,
          id: id,
          x: 300,
          y: 100,
          width: 350,
          height: 300,
          rotate: 0,
          eventList: [],
          type: 'chart-pie',
          info: {
            tagName: 'v-echart',
            style: {
              position: 'absolute',
              width: '350px',
              height: '300px'
            },
            props: {
              options: {
                color: [
                  '#c23531',
                  '#2f4554',
                  '#61a0a8',
                  '#d48265',
                  '#91c7ae',
                  '#749f83',
                  '#ca8622',
                  '#bda29a',
                  '#6e7074',
                  '#546570',
                  '#c4ccd3'
                ],
                title: {
                  text: '',
                  subtext: '',
                  x: 'center'
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                  show: true
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                      { value: 335, name: '直接访问' },
                      { value: 310, name: '邮件营销' },
                      { value: 234, name: '联盟广告' },
                      { value: 135, name: '视频广告' },
                      { value: 1548, name: '搜索引擎' }
                    ],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              },
              autoResize: 'true'
            },
            attrs: {
              id: id
            }
          }
        }
        components.push(newComponent)
        console.log(this.page)
      }

      // 表格
      if (this.dragItem === 'table') {
        newComponent = {
          show: true,
          id: id,
          x: 300,
          y: 100,
          width: 400,
          height: 200,
          rotate: 0,
          eventList: [],
          type: 'table',
          info: {
            tagName: 'v-table',
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%'
            },
            props: {
              showPagination: true,
              data: {
                list: [[1, 2, 3], [4, 5, 6]],
                total: 15
              }
            },
            on: {
              changePage: p => {
                // TODO
                console.log('CHANGE >>', p)
                this.resetData(p)
                // console.log(this.componentInfo)
                // const method = this.componentInfo.dataSource.method
                // const url = this.componentInfo.dataSource.url + `?offset=${p * 10}&limit=${10}`
                // const r = $http[method](url)
                // this.componentInfo.dataSource.data = r.data
              }
            },
            attrs: {
              id: id
            }
          }
        }
        components.push(newComponent)
        console.log(this.page)
      }
      this.setSelect(components.length - 1)
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
      console.log(p)
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
    async selectedPage (page) {
      this.activePage = page.page_id
      const res = await api.base.pageDetail(page.page_id)
      console.log(res)
      this.page = res.data.data

      const components = [...this.page.components]
      this.page.components = []
      for (let i = 0; i < components.length; i++) {
        const e = components[i]
        let componentInfo = JSON.parse(e)
        console.log('selectedPage jsonObj>>>>', e, componentInfo)

        if (
          componentInfo.info.dataSource !== undefined &&
          componentInfo.info.dataSource
        ) {
          const method = componentInfo.info.dataSource.method
          const url = componentInfo.info.dataSource.url
          const r = await $http[method](url)
          componentInfo.info.dataSource.data = r.data
          this.generateData(componentInfo, r)

          this.page.components.push(componentInfo)
        } else {
          this.page.components.push(JSON.parse(e))
        }
      }
      // this.page.components = this.page.components.map(e => {
      //   const jsonObj = JSON.parse(e)

      // })
      // for (let i = 0; i < this.page.components.length; i++) {
      //   const e = this.page.components[i]
      // }

      console.log(this.page.components)
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
      this.appInfo.menuConfig = this.menuConfig
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
    },

    toggleDataSource (t) {
      this.dataSourceConfigType = t
      this.showDataSource = !this.showDataSource
      if (this.showDataSource) {
        if (this.currentBox.info.hasOwnProperty('dataSource')) {
          this.dataSource = Object.assign(
            this.dataSource,
            this.currentBox.info.dataSource
          )
        }
      }
    },

    /**
     * 提交datasource
     */
    async subDataSource (dataSource) {
      console.log('dataSource>>>', dataSource)
      this.currentBox.info.dataSource = dataSource
      if (this.currentBox.type.indexOf('pie') > -1) {
        this.currentBox.info.props.options.series = []

        let serie = {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: dataSource.data.data
        }
        this.currentBox.info.props.options.series.push(serie)
        console.log('SUB DATA SOURCE PIE', this.currentBox.info.props.options)
      } else if (this.currentBox.type.indexOf('chart') > -1) {
        let type = ''
        if (this.currentBox.type.indexOf('bar') > -1) {
          type = 'bar'
        } else {
          type = 'line'
        }
        this.currentBox.info.props.options.xAxis.data = dataSource.data.map(
          e => {
            return e[0]
          }
        )
        this.currentBox.info.props.options.series = []
        const item = dataSource.data[0]
        console.log(item)
        for (let i = 1; i < item.length; i++) {
          const data = dataSource.data.map(e => {
            return e[i]
          })
          let serie = {
            name: `系列${i}`,
            type: type,
            barWidth: '30%',
            barGap: '0%',
            smooth: true,
            data: data
          }
          this.currentBox.info.props.options.series.push(serie)
        }
        console.log(this.currentBox.info.props.options)
      } else if (this.currentBox.type.indexOf('table') > -1) {
        this.currentBox.info.props.data = dataSource.data
      }

      console.log(this.page)
    },

    async generateData (component, dataSource) {
      console.log('generateData>>>>>>', component, dataSource)
      if (component.type.indexOf('pie') > -1) {
        component.info.props.options.series = []

        let serie = {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: dataSource.data.data
        }
        component.info.props.options.series.push(serie)
        console.log('SUB DATA SOURCE PIE', component.info.props.options)
      } else if (component.type.indexOf('chart') > -1) {
        let type = ''
        if (component.type.indexOf('bar') > -1) {
          type = 'bar'
        } else {
          type = 'line'
        }
        component.info.props.options.xAxis.data = dataSource.data.map(e => {
          return e[0]
        })
        const seriesNameList = component.info.props.options.series.map(e => {
          return e.name
        })
        component.info.props.options.series = []
        const item = dataSource.data[0]
        console.log(item)
        for (let i = 1; i < item.length; i++) {
          const data = dataSource.data.map(e => {
            return e[i]
          })
          let serie = {
            name: seriesNameList[i - 1],
            type: type,
            barWidth: '30%',
            barGap: '0%',
            smooth: true,
            data: data
          }
          component.info.props.options.series.push(serie)
        }
        console.log(component.info.props.options)
      }

      console.log(this.page)
    },

    clearDataSource () {
      this.currentBox.info.dataSource = null
      console.log(this.page)
    },
    /**
     * 添加交互事件
     */
    addCurrentBoxEvent () {
      console.log(this.currentBox)
      this.currentBox.eventList.push({
        eventType: 0,
        actionType: 0
      })
    },
    /**
     *
     * 删除一个event
     */
    removeEvent (idx) {
      this.currentBox.eventList.splice(idx, 1)
    },

    doEvent (component, p) {
      console.log('>>>doEvent>>>>>>', this.currentBox.eventList)
      // 翻页
      if (this.currentBox.eventList[0].eventType === 1) {
        this.resetData(this.currentBox, p)
      }
    },

    /**
     * 组件事件重新render data
     */
    resetData (currentBox, p) {
      const method = currentBox.info.dataSource.method
      const url =
        currentBox.info.dataSource.url + `?offset=${p * 10}&limit=${10}`
      const r = $http[method](url)
      currentBox.info.dataSource.data = r.data
    },

    toggleTip (type, args) {
      this.showComponentTipType = type
      console.log(this.showComponentTipType, args)
      this.showComponentTip = args[0]
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
.slider-scale {
  position: absolute;
  bottom: 0;
  left: 100px;
  width: 800px;
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
  position: relative;
}
.top-nav {
  background: #000000;
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  width: 100px;
  height: 100%;
}
.logo img {
  width: 100%;
  height: 100%;
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
.component-config-tab {
  display: flex;
}
.component-config-tab a {
  width: 50%;
  flex: 1 1;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  background: #f2f2f2;
}
.tab-active {
  background: #ffffff !important;
}

.next-btn {
  color: #333;
  border: 1px solid #c6cbd1;
  background: #f9f9f9;
  border-radius: 3px;
  padding: 0 16px;
  line-height: 30px;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
}
.components-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  position: relative;
}
.componentip {
  width: 200px;
  height: 100px;
  position: absolute;
  top: 55px;
  left: 298px;
  border: 1px solid;
  z-index: 20;
  background: #ffffff;
}
</style>
