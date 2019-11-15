<template>
  <div class="event-config">
    <div class="event-index">
      交互{{index+1}} <i class="icon-bin" @click="deleteEvent()"></i>
    </div>
    <div>
      <label>
        <span>事件</span>
      </label>
      <el-select v-model="info.eventType" placeholder="请选择">
        <el-option
          v-for="item in eventTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div>
      <label>
        <span>动作</span>
      </label>
      <el-select v-model="info.actionType">
        <el-option
          v-for="item in actionTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import env from '@/config/env.js'

export default {
  name: 'EventConfigBox',
  components: {},
  props: {
    info: {
      type: Object,
      required: true
    },
    index: {
      type: [String, Number],
      required: true,
      default: 0
    },
    componentType: {
      type: String,
      required: true,
      default: 'text'
    }
  },
  data () {
    return {
      eventTypeList: env.eventTypeList[this.componentType],
      actionTypeList: env.actionTypeList[this.componentType]
    }
  },
  methods: {
    deleteEvent () {
      this.$emit('remove', this.index)
    }
    // #################### methods ##############
  }
}
</script>

<style scoped>
</style>
