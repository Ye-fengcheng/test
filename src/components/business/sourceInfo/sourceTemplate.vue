<template>
  <div class="Template-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>模板管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <div class="handle-box">
        <!-- <el-input v-model="ruleForm.condition.title" size="mini" style="width:150px;" placeholder="请输入模板编号或名称"></el-input>
        <el-button type="primary" size="mini" @click="search">查询</el-button> -->
        <el-button size="mini" @click="toPublish" type="primary" class="publish-btn">新增模板</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row @cell-click="toDetail">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="id" label="模板编号" width="" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column prop="templateName" label="模板名称" width=""></el-table-column>
        <el-table-column prop="createTime" label="创建日期" width=""></el-table-column>
        <el-table-column prop="createBy" label="操作人" width=""></el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="scope">
            <el-button size="small" @click="handleLook(scope.row.id,scope.row.templateName)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row.id,scope.row.templateName)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="small" type="primary" @click="handleAdd(scope.row.id)">新增批次</el-button>
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
        :title="templateName"
        :visible.sync="dialogVisible"
        width="340px">
        <el-carousel v-loading="temloading" :interval="5000" :autoplay="false" indicator-position="none" arrow="always" :height="height">
          <el-carousel-item v-for="(item, index) in temInfo" :key="index">
            <div class="sourceTemplateShow">
              <p>{{item.title}}</p>
              <img ref="imgH" :src="item.image">
              <p>{{index+1}}/{{temInfo.length}}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TemplateList',
  data () {
    return {
      height: '500px',
      dialogVisible: false,
      tableData: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      temInfo: [],
      templateName: '',
      temloading: false
    }
  },
  methods: {
    search () {
      this._getData()
    },
    toPublish () {
      this.$router.push({
        path: '/frame/sourceInfo/sourceTemplateAdd'
      })
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this._getData()
    },
    handleLook (num, name) {
      this.dialogVisible = true
      this.templateName = name
      this.temloading = true
      this.$hsyHttp(this, 'benefit-service/product/source/template/detail?id=' + num, 'GET').then(res => {
        this.temloading = false
        this.temInfo = res.data.models
        let thiz = this
        let newImg = new Image()
        newImg.src = res.data.models[0].image
        newImg.onload = function () {
          thiz.height = thiz.$refs.imgH[0].height + 76 + 'px'
        }
      }).catch(() => {
        this.temloading = false
      })
    },
    handleEdit (id, name) {
      this.$router.push({
        path: '/frame/sourceInfo/sourceTemplateAdd',
        query: {
          id: id,
          name: name
        }
      })
    },
    handleAdd (id) {
      this.$router.push({
        path: '/frame/sourceInfo/sourceBatchAdd',
        query: {
          sourceTemplateId: id
        }
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后会影响使用该模板的批次信息显示，是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'benefit-service/product/source/template/delete?id=' + id, 'GET').then(res => {
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
      this.$hsyHttp(this, 'benefit-service/product/source/template/list?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize, 'GET').then(res => {
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
    this._getData()
  }
}
</script>

<style lang="scss">
.Template-list {
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
  .sourceTemplateShow{
    position: relative;
    width: 300px;
    padding: 0;
    margin:0;
    p{
      color:#333;
      font-size: 14px;
      margin: 0;
      padding: 10px 0;
      line-height:18px;
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
  // .el-carousel__container{height:600px;}
  .el-dialog__body{padding-top:0;}
}
</style>
