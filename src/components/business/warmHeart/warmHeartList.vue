<template>
  <div class="combineList-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>暖心说卡片维护</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contain-er">
      <div class="handle-box">
        <el-input v-model="rulesForm.condition.id" size="mini" style="width:150px;" placeholder="请输入卡片号"></el-input>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <span>&nbsp;&nbsp;etup卡片功能：开启&nbsp;&nbsp;</span>
        <el-switch active-text="" inactive-text="" v-model="isEnable"
            :active-value=1 :inactive-value=0
            @change="switchChange(isEnable)">
        </el-switch>
        <el-button size="mini" @click="toAdd" type="primary" class="publish-btn">新增卡片</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row>
        <el-table-column prop="id" label="卡片编码" width="80"></el-table-column>
        <el-table-column label="卡片缩略图" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.imgDesc+'!90'" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column label="分享缩略图" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.thumbnail+'!90'" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="卡片名称"></el-table-column>
        <el-table-column prop="createTime" label="导入日期" width="150"></el-table-column>
        <el-table-column prop="createBy" label="操作人" width="150"></el-table-column>
        <el-table-column prop="sort" label="排序" width="50"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="rulesForm.pagingQuery.pageIndex"
          :page-size="rulesForm.pagingQuery.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'warmHeartList',
  data () {
    return {
      isEnable: 0,
      tableData: [],
      tableLoading: false,
      rulesForm: {
        condition: {
          id: '',
          imgDesc: '',
          remark: '',
          sort: '',
          thumbnail: ''
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
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据！你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'etup-product-service/card/delete?id=' + id, 'GET').then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    search () {
      this._getData()
    },
    toAdd () {
      this.$router.push({
        path: '/frame/warmHeart/addWarmHeart'
      })
    },
    handleCurrentChange (val) {
      this.rulesForm.pagingQuery.pageIndex = val
      this._getData()
    },
    switchChange (enable) {
      this.$hsyHttp(this, 'etup-product-service/card/enable?enable=' + enable, 'GET').then(res => {
        this.$notify.success({
          title: '成功',
          message: '设置成功'
        })
      })
    },
    edit (id) {
      this.$router.push({
        path: '/frame/warmHeart/addWarmHeart',
        query: {
          id: id
        }
      })
    },
    cardIsenable () {
      this.$hsyHttp(this, 'etup-product-service/card/isEnable', 'GET').then(res => {
        this.isEnable = res.data.model
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'etup-product-service/card/list', 'POST', this.rulesForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models.map(item => {
          item.createTime = new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss")
          return item
        })
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    // this._getData()
    this.cardIsenable()
  }
}
</script>

<style lang="scss">
.combineList-wrapper {
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
}
</style>
