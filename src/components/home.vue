<template>
  <div class="body">
    <div style="width: 100%;">
      <button style="float:left; margin: 20px;" @click="openAddAppDialog()">新建</button>
      <el-table :data="appList">
        <el-table-column label="app" prop="name"></el-table-column>
        <el-table-column label="updatetime" prop="update_time"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <router-link :to="`/page-config/${scope.row.id}`">打开</router-link>
            <span @click="deleteApp(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <span>应用名称</span>
        <input v-model="form.name" />
      </div>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subApp()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api'

export default {
  name: 'home',
  components: {},
  data () {
    return {
      appList: [],
      dialogVisible: false,
      form: {
        name: null
      }
    }
  },
  created () {
    this.getAppList()
  },
  methods: {
    getAppList () {
      api.base.appList().then(res => {
        this.appList = res.data.data
      })
    },

    openAddAppDialog () {
      this.dialogVisible = true
    },

    /**
     * 提交app
     */
    subApp () {
      api.base.addApp(this.form).then(res => {
        this.getAppList()
      })
      this.dialogVisible = false
    },

    deleteApp (id) {
      api.base.deleteApp(id).then(res => {
        this.getAppList()
      })
    }
    // ###########################methods#########################
  }
}
</script>

<style scoped>
.body {
  padding: 20px;
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
  border: 1px solid;
}
</style>
