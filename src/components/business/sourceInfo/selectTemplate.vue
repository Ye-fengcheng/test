<template>
  <div class="template-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>选择模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <!-- <div class="handle-box">
        <el-input v-model="ruleForm.condition.title" size="mini" style="width:180px;" placeholder="请输入模板编号或名称"></el-input>
        <el-button type="primary" size="mini" @click="search">查询</el-button>
      </div> -->
      <div class="template" v-loading="tableLoading">
        <div v-for="(item,index) in tableData" :key="index" class="templateCon" :style="templateNum==item.id ? 'border-color:#ff7000':''" @click="templateNum=item.id">
          <h3>{{item.templateName}}</h3>
          <p>编号:{{item.id}}</p>
          <img :src="item.items[0].image">
        </div>
      </div>
      <el-button type="primary" size="small" @click="toSaveNew">确定</el-button>
      <el-button type="" size="small" @click="toBack">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'templateList',
  data () {
    return {
      templateNum: 0,
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
    toSaveNew () {
      this.$router.push({
        path: '/frame/sourceInfo/sourceBatchAdd',
        query: {
          sourceTemplateId: this.templateNum
        }
      })
    },
    toBack () {
      this.$router.push({
        path: '/frame/sourceInfo/sourceBatch'
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'benefit-service/product/source/template/listDetail?pageIndex=1&pageSize=100', 'GET').then(res => {
        this.tableLoading = false
        this.templateNum = res.data.models[0].id
        this.tableData = res.data.models
      })
    }
  },
  created () {
    this._getData()
  }
}
</script>

<style lang="scss">
.template-list {
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
  .templateCon{
    border: 1px solid #ddd;
    width: 200px;
    padding: 10px 0;
    margin:0 20px 20px 0;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    h3{
      font-weight: normal;
      color: #333;
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    p{
      color: #666;
      font-size: 12px;
      margin: 0;
      padding: 0;
      line-height:30px;
    }
    img{
      width: 80%;
    }
  }
}
</style>
