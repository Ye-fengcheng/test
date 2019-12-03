<template>
  <div class="combineList-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>广告管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contain-er">
      <div class="handle-box">
        <!-- <el-input v-model="rulesForm.condition.id" size="mini" style="width:150px;" placeholder="请输入卡片号"></el-input>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button> -->
        <el-button size="mini" @click="toAdd" type="primary" class="publish-btn">添加启动页</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row>
        <el-table-column prop="id" label="编号" width=""></el-table-column>
        <el-table-column prop="title" label="标题" width=""></el-table-column>
        <el-table-column label="图片" width="">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl+'!90'" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <!-- <el-table-column prop="remark" label="位置" width=""></el-table-column> -->
        <el-table-column prop="createTimeMs" label="上传时间" width=""></el-table-column>
        <el-table-column prop="size" label="大小" width=""></el-table-column>
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
          // beginTimeMs: '',
          // endTimeMs: '',
          // id: '',
          // imgUrl: '',
          // isEnable: '',
          // link: '',
          // size: '',
          // title: ''
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
      this.$confirm('你是否确定删除广告位？删除后将无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'mbr-content/v1/ad/delete?id=' + id, 'GET').then(res => {
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
        path: '/frame/advertManage/addAdvert'
      })
    },
    handleCurrentChange (val) {
      this.rulesForm.pagingQuery.pageIndex = val
      this._getData()
    },
    edit (id) {
      this.$router.push({
        path: '/frame/advertManage/addAdvert',
        query: {
          id: id
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'mbr-content/v1/ad/list', 'POST', this.rulesForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models.map(item => {
          item.createTimeMs = new Date(item.createTimeMs).format('yyyy-MM-dd hh:mm:ss')
          item.size = item.size + ' KB'
          return item
        })
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    this._getData()
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
