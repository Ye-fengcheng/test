<template>
  <div>
    <el-form :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="奖励名称">
            <el-select v-model="searchForm.rewardType" size="mini" filterable placeholder="请选择">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="新店成长之星" :value="1"></el-option>
              <el-option label="新星奖" :value="2"></el-option>
              <el-option label="季度星级奖" :value="3"></el-option>
              <el-option label="升星奖" :value="4"></el-option>
              <el-option label="样板店增长奖" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="create">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="rewardName"
        label="奖励名称"
        width="">
      </el-table-column>
      <el-table-column
        prop="title"
        label="奖励说明"
        width="">
        <template slot-scope="scope">
          <el-button @click="getDetail(scope.row.id)" type="text" size="small">查看</el-button>
        </template>    
      </el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        width="">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatter"
        width="">
      </el-table-column>
      <el-table-column
        prop="updateUser"
        label="编辑人"
        width="">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="编辑时间"
        :formatter="formatter"
        width="">
      </el-table-column>
      <el-table-column
        prop="remark"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
        </template>        
      </el-table-column>
    </el-table>
    <el-dialog title="推送名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-table
        :data="roleData"
        style="width: 100%;"
        height="450"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="奖励内容" width="50%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form" :model="detail" label-width="100px;" size="small" height="450">
        <el-form-item label="内容：">
        </el-form-item>
        <div v-html="detail.content" class="jg-content-html"></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogVisible2: false,
      currentPage: 1,
      total: 0,
      tableLoading: false,
      searchForm: {
        rewardType: 0
      },
      time: [],
      roleData: [],
      tableData: [],
      detail: {}
    }
  },
  methods: {
    create () {
      this.$router.push({
        path: '/frame/awardScheme/awardAdd'
      })
    },
    formatter(row, column) {
      let txt = ''
      if (column.property =='createTime' || column.property == 'updateTime') {
        txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss")
      }
      return txt
    },
    getMenu (id) {
      let thiz = this
      this.$tupHttp(this, 'manage/pushMessage/getPushMessageById?pushMessageId=' + id, 'POST').then(res => {
        thiz.roleData = res.data.model.users.split(',').map(item => {
          return {id: item}
        })
        this.dialogVisible = true
      })
    },
    getDetail (id) {
      this.$hsyHttp(this, 'manage-app/rewardPlan/getRewardManageDetail', 'POST', {id: id}).then(res => {
        this.detail = res.data.model
        this.dialogVisible2 = true
      })
    },
    edit (id) {
      this.$router.push({
        path: '/frame/awardScheme/awardAdd',
        query: {
          id: id
        }
      })
    },
    del (id) {
      let thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$tupHttp(thiz, 'manage/pushMessage/delPushMessage?pushMessageById=' + id, 'POST').then(res => {
          this.$message.success('删除成功')
          thiz.loadData(true)
        })
      })
    },
    loadData (isSearch) {
      let thiz = this
      thiz.tableLoading = true
      this.$hsyHttp(thiz, 'manage-app/rewardPlan/getRewardManageToPC', 'POST', thiz.searchForm).then(res => {
        thiz.tableData = res.body.models
        thiz.tableLoading = false
      }, res => {
        thiz.tableLoading = false
      })
    }
  },
  created () {
    this.loadData()
  }
}
</script>
<style>
.demo-form-inline {
  margin-bottom: 10px;
  padding: 25px 25px 0;
  border-radius: 4px;
  border: 1px solid #eee;
}
.jg-content-html img {
  max-width: 100%;
}
.jg-content-html p {
  white-space: normal;
  word-break: break-all;
}
</style>
