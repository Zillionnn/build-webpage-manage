<template>
  <div class="container" :style="`top:${y}px;left:${x}px;width:${width}px;height:${height}px;`">
    <div
      class="wrap"
      :style="`width:100%;height: 100%;transform:rotate(${rotate}deg);`"
      :class="{'wrap-box-shadow':showOperate}"
    >
      <div
        class="content-op"
        :style="'opacity:'+opacity"
        @mousedown="setDrag(0,$event)"
        @mouseup="setDrag(1)"
        @mousemove="moveCointainer"
      >
        <slot />
      </div>
      <div class="operate top-left" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
      <div class="operate top" v-show="showOperate" @mousedown="setSize(1, 2)" @mouseup="setSize(0)"></div>
      <div class="operate top-right" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
      <div class="operate right" v-show="showOperate" @mousedown="setSize(1, 3)" @mouseup="setSize(0)"></div>
      <div class="operate bottom-right" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
      <div class="operate bottom" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
      <div class="operate bottom-left" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
      <div class="operate left" v-show="showOperate" @mousedown="setSize(1)" @mouseup="setSize(0)"></div>
    </div>
  </div>
</template>

<script>
/**
 * 1: position ， width, height
 * 2: rotate
 * 3: opacity
 * 4: content
 */
export default {
  name: 'VTransform',
  components: {},
  props: {
    canvas: {
      type: Object,
      required: false
    },
    y: {
      type: [String, Number],
      required: false,
      default: 0
    },
    x: {
      type: [String, Number],
      required: false,
      default: 0
    },
    width: {
      type: [String, Number],
      required: false,
      default: '200'
    },
    height: {
      type: [String, Number],
      required: false,
      default: '200'
    },
    rotate: {
      type: [String, Number],
      required: false,
      default: 0
    },
    opacity: {
      type: [String, Number],
      required: false,
      default: 1
    }
  },
  data () {
    return {
      DIRECTION: {
        LEFT: 1,
        UP: 2,
        RIGHT: 3,
        BOTTOM: 4
      },
      showOperate: false,
      canMove: false,
      canReSize: false,
      mousePosition: {
        x: 0,
        y: 0
      },
      offsetX: 0,
      offsetY: 0,
      resizeDirection: null
    }
  },

  created () {
    this.listenClick()
  },
  methods: {
    listenClick () {
      document.addEventListener('mousedown', e => {
        if (
          e.target.classList[0] !== 'container' &&
          e.target.classList[0] !== 'wrap' &&
          e.target.classList[0] !== 'content-op' &&
          e.target.classList[0] !== 'operate'
        ) {
          this.toggleOperates(false)
        }
      })
      document.addEventListener('mousemove', this.getMousePosition)
    },
    // 鼠标位置
    getMousePosition (event) {
      this.mousePosition.x = event.x
      this.mousePosition.y = event.y
      console.log(event.offsetX - this.width)
      this.drag()
    },
    drag (event) {
      if (this.canMove) {
        const top = this.mousePosition.y - this.offsetY
        const left = this.mousePosition.x - this.offsetX
        console.log(left, top)
        this.$emit('update', { x: left, y: top })
      }

      if (this.canReSize) {
        if (this.resizeDirection === 2) {
          const offsetHeight = this.mousePosition.y
          const top = offsetHeight
          this.$emit('update', {y: top, height: offsetHeight})
        }
        if (this.resizeDirection === 3) {
          const offsetWidth = this.mousePosition.x - this.x - this.canvas.left
          this.$emit('update', {width: offsetWidth})
        }
      }
    },

    // 是否可以拖动
    setDrag (p, event) {
      this.canMove = p === 0
      this.toggleOperates(true)
      if (this.canMove) {
        this.offsetX = event.offsetX
        this.offsetY = event.offsetY
        console.log(this.offsetX, this.offsetY)
      }
    },

    /**
     * 移动
     */
    moveCointainer (event) {
      event.preventDefault()
    },

    /**
     * 显示 操作
     */
    toggleOperates (s) {
      this.showOperate = s
    },

    /**
     * 设置是否可以改大小
     */
    setSize (p, direction) {
      p === 1 ? this.canReSize = true : this.canReSize = false
      this.resizeDirection = direction
    }
  }
}
</script>

<style scoped>
.container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: absolute;
}
.container:hover {
  position: absolute;
  cursor: move;
  background: #0cf;
  opacity: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.wrap {
  position: relative;
  width: 100% !important;
  height: 100% !important;
}
.wrap-box-shadow {
  position: relative;
   width: 100%;
  height: 100%;
  box-shadow: 0 0 0 0.5px #0cf, inset 0 0 0 0.5px #0cf;
}
.content-op{
  width: 100%;
  height: 100%;
}
.operate {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border: 1px solid #cccccc;
  position: absolute;
}
.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}
.top {
  top: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: ns-resize;
}
.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}
.right {
  top: 50%;
  right: -5px;
  margin-top: -5px;
  cursor: ew-resize;
}
.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}
.bottom {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: ns-resize;
}
.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}
.left {
  top: 50%;
  left: -5px;
  margin-top: -5px;
  cursor: ew-resize;
}
</style>
