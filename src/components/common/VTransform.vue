<template>
  <div
    class="container"
    :style="`top:${top}px;left:${left}px;width:${width}px;height:${height}px;`"
    @click="toggleOperates(true)"
  >
    <div class="wrap" :style="`transform:rotate(${rotate}deg);`" :class="{'wrap-box-shadow':showOperate}">
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
    top: {
      type: [String, Number],
      required: false,
      default: 0
    },
    left: {
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
      showOperate: false
    }
  },
  created () {
    this.listenClick()
  },
  methods: {
    listenClick () {
      document.addEventListener('mousedown', e => {
        if (e.target.classList[0] !== 'container' &&
        e.target.classList[0] !== 'wrap' &&
        e.target.classList[0] !== 'content-op' &&
        e.target.classList[0] !== 'operate'
        ) {
          this.toggleOperates(false)
        }
      })
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
.wrap {
    position: relative;
}
.wrap-box-shadow{
    box-shadow:0 0 0 0.5px #0cf, inset 0 0 0 0.5px #0cf;
}
.operate{
    width: 10px;
    height: 10px;
    background: #ffffff;
    border: 1px solid #cccccc;
    position: absolute;
}
.top-left{
    top: -5px;
    left: -5px;
}
.top {
    top: -5px;
    left: 50%;
    margin-left: -5px;
}
.top-right{
    top: -5px;
    right: -5px;
}
.right {
    top: 50%;
    right: -5px;
    margin-top: -5px;
}
.bottom-right{
    bottom: -5px;
    right: -5px;
}
.bottom{
    bottom: -5px;
    left: 50%;
    margin-left: -5px;
}
.bottom-left{
    bottom: -5px;
    left: -5px;
}
.left{
    top: 50%;
    left: -5px;
    margin-top: -5px;
}

</style>
