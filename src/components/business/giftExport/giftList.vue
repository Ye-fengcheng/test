<template>
  <div class="maintain">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>高会领礼品订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="handleAdd">申请导出</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="approveTimeStart" label="审核开始时间"></el-table-column>
        <el-table-column prop="approveTimeEnd" label="审核结束时间"></el-table-column>
        <el-table-column prop="applyDate" label="申请报表时间"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <!-- <el-table-column prop="initChance" label="参与人数" width="80"></el-table-column> -->
        <!-- <el-table-column prop="stateText" label="状态" width="120"></el-table-column> -->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" v-show="scope.row.status=='未发送'" @click="handleDelete(scope.row.id)">删除</el-button>
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
      <el-dialog class="text-l"
        title="申请导出"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form ref="form" :model="form" :rules="rules" label-width="30%" size="small">
            <el-form-item label="邮箱地址：" required prop="email" class="mb20">
            <el-input placeholder="请输入邮箱地址" type="email" style="width:90%;" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="审核时间：" required prop="approveTimeStart">
            <el-date-picker type="date" style="width:90%;" value-format="yyyy-MM-dd" placeholder="请选择审核时间" :editable="false" v-model="form.approveTimeStart"></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onClose()">取 消</el-button>
            <el-button type="primary" @click="handleSave('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activityList',
  data () {
    return {
      tableData: [],
      tableLoading: false,
      ruleForm: {
        approveTime: '',
        statue: '',
        page: 1,
        size: 10
      },
      total: 0,
      dialogVisible: false,
      form: {
        approveTimeStart: '',
        email: '',
        status: 0
      },
      rules: {
        approveTimeStart: [
          { required: true, message: '请输入审核时间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.ruleForm.page = val
      this._getData()
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据！你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'backend/benefit/giftApply/delete?id=' + id, 'DELETE').then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    handleAdd () {
      this.dialogVisible = true
    },
    handleSave (form) {
      let thiz = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          thiz.loading = true
          thiz.$hsyHttp(this, 'backend/benefit/giftApply/save', 'POST', thiz.form).then(res => {
            thiz.loading = false

            thiz.$refs[form].resetFields()
            // thiz.time = []
            // thiz.intention = []
            // thiz.$refs.uploadImg.clearFiles()
            // thiz.$refs.uploadExcel.clearFiles()

            thiz.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.dialogVisible = false
            thiz._getData()
          }, res => {
            thiz.loading = false
          })
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/benefit/giftApply/getListByCondition?page=' + this.ruleForm.page + '&size=' + this.ruleForm.size, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.map(item => {
          item.approveTimeStart = new Date((item.approveTimeStart) * 1000).format('yyyy-MM-dd hh:mm:ss')
          item.approveTimeEnd = new Date((item.approveTimeEnd) * 1000).format('yyyy-MM-dd hh:mm:ss')
          item.applyDate = new Date(item.applyDate).format('yyyy-MM-dd hh:mm:ss')
          if (item.status === 0) {
            item.status = '未发送'
          }
          if (item.status === 1) {
            item.status = '已发送'
          }
          if (item.status === 2) {
            item.status = '出错'
          }
        })
        this.tableData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    onClose () {
      this.dialogVisible = false
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

