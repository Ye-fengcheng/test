<template>
  <div class="vote-setup">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>投票设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <span>活动名称：</span>
        <el-input v-model="condition.title" size="mini" style="width:150px;" placeholder="活动名称"></el-input>
        <span>活动状态：</span>
        <el-select v-model="condition.status" placeholder="活动状态" size="mini" style="width:150px;">
          <el-option key="" label="全部" value=""></el-option>
          <el-option key="0" label="未开始" value="0"></el-option>
          <el-option key="1" label="进行中" value="1"></el-option>
          <el-option key="2" label="已结束" value="2"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="handleAdd()" type="primary" class="publish-btn">新增投票</el-button>
        <el-button size="mini" @click="handleCoupon()" type="primary" class="publish-btn">批量发奖</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column prop="id" label="投票活动ID" width="90"></el-table-column>
        <el-table-column prop="title" label="投票活动名称" width="220"></el-table-column>
        <el-table-column prop="date" label="活动时间" width="220"></el-table-column>
        <el-table-column label="上架/下架" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isEnable" active-text="" inactive-text="" size="mini"
            :active-value=1 :inactive-value=0
            :disabled="scope.row.status === '已结束'"
            @change="switchChange(scope.row.id, scope.row.isEnable)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" width="80"></el-table-column>
        <el-table-column prop="createBy" label="创建人" width="80"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
            <!--<el-button size="mini" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="pagingQuery.pageIndex"
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
  name: 'voteSetup',
  data () {
    return {
      tableData: [],
      tableLoading: false,
      condition: {
        title: '',
        status: ''
      },
      pagingQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  methods: {
    search () {
      this._getData()
    },
    handleCurrentChange (val) {
      this.pagingQuery.pageIndex = val
      this._getData()
    },
    switchChange (id, isEnable) {
      this.$hsyHttp(this, 'dolls-service/vote-manage/enable', 'POST', {
        id: id,
        isEnable: isEnable
      }).then(res => {
        this.$message.success('操作成功')
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，已生效活动链接也相应失效！你确认删除该条活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'backend/dolls/activity/delete?id=' + id, 'POST').then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    handleAdd () {
      this.$router.push({
        path: '/frame/vote/addVote'
      })
    },
    handleCoupon () {
      this.$router.push({
        path: '/frame/vote/issueCoupon'
      })
    },
    handleUpdate (id) {
      this.$router.push({
        path: '/frame/vote/editVote',
        query: {
          id: id
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'dolls-service/vote-manage/list', 'POST', {
        condition: this.condition,
        pagingQuery: this.pagingQuery
      }).then(res => {
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
.vote-setup {
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
}
</style>

