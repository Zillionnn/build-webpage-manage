<template>
  <div class="config-datasource" v-if="showDataSource">
    <div class="config-panel-title flex-space-between">
      <span>{{configType[dataSourceConfigType]}}</span>
      <i class="icon-cross" @click="toggleDataSource('text')"></i>
    </div>
    <div class="config-panel-content">
      <div>选择数据源</div>
      <div>
        <button>接口</button>
      </div>
      <div>
        接口来源
        <el-select>
          <el-option :label="'custom'">自定义接口</el-option>
        </el-select>
      </div>
      <div>请求方式</div>
      <div>
        <el-select v-model="dataSource.method">
          <el-option label="get" :value="'get'"></el-option>
          <el-option label="post" :value="'post'"></el-option>
        </el-select>
      </div>
      <div>请求地址</div>
      <div>
        <input v-model="dataSource.url" placeholder="请输入http://url" />
      </div>
      <div>参数</div>
      <div>
        <textarea></textarea>
      </div>
      <div>返回结果</div>
      <div>
       {{response}}
      </div>
      <div>
        <button>验证数据</button>
      </div>
      <div>
        <button @click="subDataSource">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '@/service/requestService.js'

export default {
  name: 'ConfigTextDataSource',
  components: {},
  props: {
    dataSourceConfigType: {
      type: String,
      required: false,
      default: 'text'
    },
    showDataSource: {
      type: Boolean,
      required: true,
      default: false
    },
    boxDataSource: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      dataSource: {
        configType: 'text',
        method: 'get',
        url: '',
        data: null
      },
      configType: {
        text: '文字内容-数据源配置',
        chart: '展示数据-数据源配置'
      },
      response: ''
    }
  },
  watch: {
    showDataSource (val, old) {
      console.log(val)
      if (val) {
        this.dataSource = Object.assign(this.dataSource, this.boxDataSource)
      }
    }
  },
  methods: {
    toggleDataSource (p) {
      this.$emit('toggleDataSource')
    },
    /**
     * 提交datasource
     */
    async subDataSource () {
      const method = this.dataSource.method
      const url = this.dataSource.url
      const r = await $http[method](url)
      this.dataSource.data = r.data
      this.response = r.data
      this.$emit('assignDataSource', this.dataSource)
    }
  }
}
</script>

<style scoped>

.config-datasource {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: #ffffff;
  width: 350px;
  z-index: 10;
}
.config-panel-title {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #cccccc;
}
.config-panel-content {
  padding: 15px;
}
</style>
