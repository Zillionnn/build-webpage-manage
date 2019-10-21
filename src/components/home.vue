<template>
  <div style="position:relative">
    <v-transform  :top="100" :left="200" :width="100" :height="100">
      <div style="width:100px;height:100px;">
        123
      </div>
    </v-transform>
  </div>
</template>

<script>
import VTransform from './common/VTransform.vue'

export default {
  name: 'home',
  components: {
    VTransform
  },
  data () {
    return {
      elements: [
        {
          id: 'el-1',
          x: 100,
          y: 50,
          scaleX: 1,
          scaleY: 1,
          width: 100,
          height: 100,
          angle: 0,
          classPrefix: 'tr',
          styles: {
            background: 'linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
  .tr-transform--active{
        position: absolute;
        z-index: 5;
    }

    .tr-transform__content{
        user-select: none;
    }
    .tr-transform__rotator {
        top: -45px;
        left: calc(50% - 7px);
    }

    .tr-transform__rotator,
    .tr-transform__scale-point {
        background: #fff;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .tr-transform__rotator:hover,
    .tr-transform__scale-point:hover {
        background: #F1F5F8;
    }

    .tr-transform__rotator:active,
    .tr-transform__scale-point:active {
        background: #DAE1E7;
    }

    .tr-transform__scale-point {

    }

    .tr-transform__scale-point--tl {
        top: -7px;
        left: -7px;
    }

    .tr-transform__scale-point--ml {
        top: calc(50% - 7px);
        left: -7px;
    }

    .tr-transform__scale-point--tr {
        left: calc(100% - 7px);
        top: -7px;
    }

    .tr-transform__scale-point--tm {
        left: calc(50% - 7px);
        top: -7px;
    }

    .tr-transform__scale-point--mr {
        left: calc(100% - 7px);
        top: calc(50% - 7px);
    }

    .tr-transform__scale-point--bl {
        left: -7px;
        top: calc(100% - 7px);
    }

    .tr-transform__scale-point--bm {
        left: calc(50% - 7px);
        top: calc(100% - 7px);
    }

    .tr-transform__scale-point--br {
        left: calc(100% - 7px);
        top: calc(100% - 7px);
    }
</style>
