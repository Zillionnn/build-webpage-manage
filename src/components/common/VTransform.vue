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
      <div class="operate top-left" v-show="showOperate" @mousedown="setSizeCross('UP','LEFT')" @mouseup="setSize(0)"></div>
      <div class="operate top" v-show="showOperate" @mousedown="setSize(1, 'UP')" @mouseup="setSize(0)"></div>
      <div class="operate top-right" v-show="showOperate" @mousedown="setSizeCross('UP','RIGHT')" @mouseup="setSize(0)"></div>
      <div class="operate right" v-show="showOperate" @mousedown="setSize(1, 'RIGHT')" @mouseup="setSize(0)"></div>
      <div class="operate bottom-right" v-show="showOperate" @mousedown="setSizeCross('DOWN','RIGHT')" @mouseup="setSize(0)"></div>
      <div class="operate bottom" v-show="showOperate" @mousedown="setSize(1, 'DOWN')" @mouseup="setSize(0)"></div>
      <div class="operate bottom-left" v-show="showOperate" @mousedown="setSizeCross('DOWN','LEFT')" @mouseup="setSize(0)"></div>
      <div class="operate left" v-show="showOperate" @mousedown="setSize(1,'LEFT')" @mouseup="setSize(0)"></div>
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
        LEFT: false,
        UP: false,
        RIGHT: false,
        DOWN: false
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
      preWidth: 0,
      preHeight: 0,
      preX: 0,
      preY: 0,
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
      document.addEventListener('mouseup', e => {
        this.setSize(0)
      })
      document.addEventListener('mousemove', this.getMousePosition)
    },
    // 鼠标位置
    getMousePosition (event) {
      this.mousePosition.x = event.x
      this.mousePosition.y = event.y
      // console.log(event.offsetX - this.width)
      console.log(this.canReSize)
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
        console.log('this.DIRECTION.UP', this.DIRECTION.UP)
        if (this.DIRECTION.UP) {
          const d = (this.preY + this.canvas.top - this.mousePosition.y) + this.preHeight
          console.log('d', d)
          const y = this.mousePosition.y
          if (d > 1) {
            this.$emit('update', {y: y, height: d})
          }
        }
        if (this.DIRECTION.RIGHT) {
          const d = this.mousePosition.x - this.x - this.canvas.left
          this.$emit('update', {width: d})
        }
        if (this.DIRECTION.LEFT) {
          const d = (this.preX + this.canvas.left - this.mousePosition.x) + this.preWidth
          console.log('d', d)
          const x = this.mousePosition.x
          if (d > 1) {
            this.$emit('update', {x: x, width: d})
          }
        }
        if (this.DIRECTION.DOWN) {
          const d = this.mousePosition.y - this.y - this.canvas.top
          this.$emit('update', {height: d})
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
      console.warn('DO RESET')
      if (p === 1) {
        this.canReSize = true
        this.preWidth = this.width
        this.preHeight = this.height
        this.preX = this.x
        this.preY = this.y
        this.DIRECTION[direction] = true
      } else {
        this.canReSize = false
        this.DIRECTION = {
          LEFT: false,
          UP: false,
          RIGHT: false,
          DOWN: false
        }
      }
    },
    setSizeCross (r, c) {
      this.setSize(1, r)
      this.setSize(1, c)
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
