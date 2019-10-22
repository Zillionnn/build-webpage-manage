<template>
  <div
    class="container"
    :style="`top:${y}px;left:${x}px;width:${width}px;height:${height}px;`"
    @mousedown="setDrag(0,$event)"
    @mouseup="setDrag(1)"
    @mousemove="moveCointainer"
  >
    <div
      class="wrap"
      :style="`transform:rotate(${rotate}deg);`"
      :class="{'wrap-box-shadow':showOperate}"
    >
      <div class="content-op" :style="'opacity:'+opacity">
        <slot />
      </div>
      <div class="operate top-left" v-show="showOperate"></div>
      <div class="operate top" v-show="showOperate"></div>
      <div class="operate top-right" v-show="showOperate"></div>
      <div class="operate right" v-show="showOperate"></div>
      <div class="operate bottom-right" v-show="showOperate"></div>
      <div class="operate bottom" v-show="showOperate"></div>
      <div class="operate bottom-left" v-show="showOperate"></div>
      <div class="operate left" v-show="showOperate"></div>
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
      showOperate: false,
      canMove: false,
      mousePosition: {
        x: 0,
        y: 0
      },
      offsetX: 0,
      offsetY: 0
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
      console.log(event)
      this.drag()
    },
    drag (event) {
      if (this.canMove) {
        const top = this.mousePosition.y - this.offsetY
        const left = this.mousePosition.x - this.offsetX
        console.log(left, top)
        this.$emit('update', {x: left, y: top})
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
}
.wrap-box-shadow {
  box-shadow: 0 0 0 0.5px #0cf, inset 0 0 0 0.5px #0cf;
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
}
.top {
  top: -5px;
  left: 50%;
  margin-left: -5px;
}
.top-right {
  top: -5px;
  right: -5px;
}
.right {
  top: 50%;
  right: -5px;
  margin-top: -5px;
}
.bottom-right {
  bottom: -5px;
  right: -5px;
}
.bottom {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
}
.bottom-left {
  bottom: -5px;
  left: -5px;
}
.left {
  top: 50%;
  left: -5px;
  margin-top: -5px;
}
</style>
