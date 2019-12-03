<template>
  <div class="maintain">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>优惠券数据下载</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="handleAdd">申请导出</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="startDate" label="开始时间"></el-table-column>
        <el-table-column prop="endDate" label="结束时间"></el-table-column>
        <el-table-column prop="exportedDate" label="导出时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" :loading="loading" type="primary" v-show="scope.row.exportedDate" @click="handleDownload(scope.row.bucket,scope.row.fileName)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="ruleForm.page"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
      title="下载进度"
      :visible.sync="dialogVisible"
      width="30%">
      <p>{{downloadText}}</p>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="blobSize" color="#ff7000"></el-progress>
    </el-dialog>
    <el-dialog class="text-l"
      title="申请导出"
      :visible.sync="dialogVisibles"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="30%" size="small">
          <el-form-item label="使用时间：" required prop="makeDate">
          <el-date-picker
              style="width:100%"
              v-model="form.makeDate"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="onClose()">取 消</el-button>
          <el-button type="primary" @click="handleSave('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'couponList',
  data () {
    return {
      tableData: [],
      tableLoading: false,
      ruleForm: {
        page: 1,
        size: 10
      },
      total: 0,
      blobLength: 0,
      blobSize: 0,
      dialogVisible: false,
      dialogVisibles: false,
      loading: false,
      downloadText: '下载中...',
      form: {
        makeDate: '',
        endDate: '',
        startDate: ''
      },
      rules: {
        makeDate: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.makeDate': function (val) {
      if (!val) {
        this.form.startDate = ''
        this.form.endDate = ''
      } else {
        this.form.startDate = val[0] + ' 00:00:00'
        this.form.endDate = val[1] + ' 23:59:59'
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.ruleForm.page = val
      this._getData()
    },
    handleAdd () {
      this.dialogVisibles = true
    },
    handleDownload (bucket, fileName) {
      if (this.loading) {
        return false
      }
      // var data = ''
      let thiz = this
      this.dialogVisible = true
      this.loading = true
      var url = this.$serviceIp + '/backend/load/ossDownloadfile?bucket=' + bucket + '&filename=' + fileName
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)      // 也可以使用POST方式，根据接口
      xhr.setRequestHeader('x_auth_token', window.localStorage.getItem('token'))
      xhr.setRequestHeader('x_request_platform', 'WEB')
      xhr.setRequestHeader('x_user_id', window.localStorage.getItem('pUid'))
      xhr.responseType = 'blob'   // 返回类型blob
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onreadystatechange = function () {
        var data = this.response
        const blob = new Blob([data])
        // thiz.blobLength += blob.size
        if (xhr.readyState === 3) {
          if (thiz.blobLength <= 97) {
            thiz.blobLength = thiz.blobLength + 0.1
          }
          thiz.blobSize = parseInt(thiz.blobLength)
          // thiz.blobSize = parseInt(thiz.blobLength * 1000000 / xhr.getResponseHeader('Content-Length'))
        }
        if (xhr.readyState === 4) {
          // 请求完成
          thiz.loading = false
          thiz.downloadText = '下载完成√'
          const blobUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = fileName
          a.href = blobUrl
          a.click()
          a.remove()
          // thiz.blobSize = parseInt(thiz.blobLength * 100 / xhr.getResponseHeader('Content-Length'))
          thiz.blobSize = 100
          setTimeout(function () {
            thiz.dialogVisible = false
          }, 2000)
        }
      }
      // 发送ajax请求
      xhr.send()
    },
    _getData () {
      if (this.tableLoading) {
        return false
      }
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/benefit/biCouponExport/list?page=' + this.ruleForm.page + '&size=' + this.ruleForm.size, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.map(item => {
          item.startDate = new Date(item.startDate).format('yyyy-MM-dd hh:mm:ss')
          item.endDate = new Date(item.endDate).format('yyyy-MM-dd hh:mm:ss')
          if (item.exportedDate) {
            item.exportedDate = new Date(item.exportedDate).format('yyyy-MM-dd hh:mm:ss')
          }
        })
        this.tableData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    handleSave (form) {
      let thiz = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          thiz.loading = true
          delete thiz.form.makeDate
          thiz.$hsyHttp(this, 'backend/benefit/biCouponExport/add', 'POST', thiz.form).then(res => {
            thiz.loading = false

            thiz.$refs[form].resetFields()

            thiz.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.dialogVisibles = false
            thiz._getData()
          }, res => {
            thiz.loading = false
          })
        }
      })
    },
    onClose () {
      this.dialogVisibles = false
    }
  },
  created () {
    this._getData()
  }
}
</script>

<style lang="scss">
.mb20{margin-bottom:20px!important;}
.maintain {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
    .publish-btn {
      float: right;
    }
  }
  .container {
    padding: 0px;
    background: #fff;
  }

  .crumbs {
    margin-bottom: 20px;
  }

  .pagination {
    margin: 20px 0;
    text-align: right;
    display: block;
  }
  .title{
    color: #ff7000;
    cursor: pointer;
  }

  .title-header {
    color: #909399;
  }
}
</style>

