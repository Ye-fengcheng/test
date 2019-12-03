<template>
  <div class="batch-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>批次查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <div class="handle-box">
        <el-input v-model.trim="sn" size="mini" style="width:150px;" placeholder="请输入批次号"></el-input>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="toPublish" type="primary" class="publish-btn">新增批次</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="sn" label="批次号" width="" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column prop="createTime" label="导入日期" width=""></el-table-column>
        <el-table-column prop="createBy" label="操作人" width=""></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="small" @click="handleLook(scope.row.id)">查看</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="small" @click="handleEdit(scope.row.id,scope.row.sn,scope.row.productSourceTemplateId)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="pageIndex"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
        title="批次信息"
        :visible.sync="dialogVisible"
        width="340px">
        <el-carousel v-loading="temloading" :interval="5000" :height="height" :autoplay="false" indicator-position="none" arrow="always">
          <el-carousel-item v-for="(item, index) in batchInfo" :key="index">
            <div class="sourceBatchShow">
              <img ref="imgH" :src="item.image">
              <div class="sourceBatchWord">
                <p v-show="item.eventTime" class="sourceDate">日期：<span>{{item.eventTime}}</span></p>
                <p v-show="item.address" class="sourceAddress"><i class="el-icon-location"></i><span>{{item.address}}</span></p>
                <p v-show="item.events" v-for="(items, indexs) in item.events.split('\n')" :key="indexs">{{items}}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'batchList',
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      tableLoading: false,
      sn: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      temloading: false,
      batchInfo: [],
      height: '500px'
    }
  },
  methods: {
    search () {
      this._getData()
    },
    toPublish () {
      this.$router.push({
        path: '/frame/sourceInfo/selectTemplate'
      })
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this._getData()
    },
    handleLook (id) {
      this.dialogVisible = true
      this.temloading = true
      this.$hsyHttp(this, 'benefit-service/product/source/info/detail?id=' + id, 'GET').then(res => {
        this.temloading = false
        this.batchInfo = res.data.models
        let thiz = this
        let newImg = new Image()
        newImg.src = res.data.models[0].image
        newImg.onload = function () {
          thiz.height = thiz.$refs.imgH[0].height + 'px'
        }
      }).catch(() => {
        this.temloading = false
      })
    },
    handleEdit (id, sn, templateId) {
      this.$router.push({
        path: '/frame/sourceInfo/sourceBatchEdit',
        query: {
          id: id,
          sn: sn,
          templateId: templateId
        }
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'benefit-service/product/source/info/delete?id=' + id, 'GET').then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    _getData () {
      this.tableLoading = true
      let sn = ''
      if (this.sn) {
        sn = '&sn=' + this.sn
      }
      this.$hsyHttp(this, 'benefit-service/product/source/info/list?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + sn, 'GET').then(res => {
        this.tableLoading = false
        this.tableData = res.data.models.map(item => {
          item.createTime = new Date(item.createTime).format('yyyy-MM-dd hh:mm:ss')
          return item
        })
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
.batch-list {
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
  .sourceBatchShow{
    position: relative;
    width: 300px;
    padding: 0;
    margin:0;
    float: left;
    .sourceBatchWord{
      position: absolute;
      left:0;top: 300px;
      padding:0 0 18px 24px;
    }
    p{
      color:#fff;
      font-size: 12px;
      margin: 0;
      padding: 0;
      line-height:18px;
    }
    .sourceDate{
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 130px;
      span{border-bottom: 1px solid #fff;}
    }
    .sourceAddress{
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    img{
      width: 100%;
    }
  }
  .el-carousel__container{height: 530px;}
}
</style>
