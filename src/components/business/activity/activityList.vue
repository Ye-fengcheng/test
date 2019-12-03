<template>
  <div class="activity-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <div class="handle-box">
        <el-input v-model="ruleForm.condition.title" size="mini" style="width:150px;" placeholder="活动名称"></el-input>
        <el-select v-model="ruleForm.condition.status" placeholder="活动状态" size="mini" style="width:150px;">
          <el-option key="1" label="全部" value="all"></el-option>
          <el-option key="2" label="未开始" value="not"></el-option>
          <el-option key="3" label="进行中" value="starting"></el-option>
          <el-option key="4" label="已结束" value="end"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="toPublish" type="primary" class="publish-btn">发布活动</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row @cell-click="toDetail">
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="title" label="活动名称" width="200" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column prop="beginTimeValue" label="开始时间" width="130"></el-table-column>
        <el-table-column prop="endTimeValue" label="结束时间" width="130"></el-table-column>
        <el-table-column prop="enrollEndTimeValue" label="报名截止时间" sortable width="130"></el-table-column>
        <el-table-column label="上架/下架" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isEnable" active-text="" inactive-text="" 
            :active-value=1 :inactive-value=0 :disabled="scope.row.status === '已结束'"
            @change="switchChange(scope.row.id, scope.row.isEnable)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="enrollNum" label="报名人数" width="80"></el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="small" type="primary" @click="download(scope.row.id)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="ruleForm.pagingQuery.pageIndex"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
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
        condition: {
          title: '',
          status: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0
    }
  },
  methods: {
    search () {
      this._getData()
    },
    toPublish () {
      this.$router.push({
        path: '/frame/activity/activityAdd'
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    switchChange (id, isEnable) { // isEnable为修改后的状态
      if (isEnable === 1) { // 上架
        this.$hsyHttp(this, 'backend/prom/enable', 'POST', {id: id}).then(res => {
        })
      } else if (isEnable === 0) { // 下架
        this.$hsyHttp(this, 'backend/prom/disable', 'POST', {id: id}).then(res => {
        })
      }
    },
    download (id) {
      this.$hsyHttp(this, 'backend/prom/export/' + id).then(res => {
        window.open(res.data.model)
      })
    },
    handleEdit (id) {
      this.$router.push({
        path: '/frame/activity/activityEdit',
        query: {
          id: id
        }
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，已生效活动链接也相应失效！你确认删除该条活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'backend/prom/delete', 'POST', { id: id }).then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    toDetail (row, column) {
      if (column.property !== 'title') {
        return
      }
      this.$router.push({
        path: '/frame/activity/activity',
        query: {
          id: row.id
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/prom/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    // this._getData()
  }
}
</script>

<style lang="scss">
.activity-list {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
    .publish-btn {
      float: right;
    }
  }
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
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
