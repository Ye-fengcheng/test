<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 会员事件列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="handle-box">
        <div class="handle-til clearfix">
          <span>数据筛选</span>
        </div>
        <el-form label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="事件编码">
                <el-input v-model="ruleForm.condition.eventCode" size="mini" placeholder="事件编码"></el-input>
            </el-form-item>     
            </el-col>
            <el-col :span="8">    
            <el-form-item label="事件状态">
                <el-select placeholder="事件状态" style="width:100%;" size="mini" v-model="ruleForm.condition.eventStatus">
                  <el-option key="0" label="初始" :value="0"></el-option>
                  <el-option key="1" label="成功" :value="1"></el-option>
                  <el-option key="2" label="失败" :value="2"></el-option>
                </el-select>
            </el-form-item>
            </el-col>  
        </el-row>   
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="会员编码">
                <el-input v-model="ruleForm.condition.memberId" size="mini" placeholder="会员编码"></el-input>
            </el-form-item>     
            </el-col>
            <el-col :span="8">    
            <el-form-item label="产品唯一码">
                <el-input v-model="ruleForm.condition.productUniqueCode" size="mini" placeholder="产品唯一码"></el-input>
            </el-form-item>  
            </el-col>  
        </el-row> 
        <el-form-item>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="_getData(true)">查询</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberId" label="会员编码" width="80"></el-table-column>
        <el-table-column align="center" prop="productUniqueCode" label="产品唯一码" width="120"></el-table-column>
        <el-table-column align="center" prop="eventCode" label="事件编码" width="110"></el-table-column>
        <el-table-column align="center" prop="eventStatus" label="事件状态" width="90"></el-table-column>
        <el-table-column align="center" prop="errorMsg" label="事件结果" width="140"></el-table-column>
        <el-table-column align="center" prop="updateDate" label="处理时间" width="145"></el-table-column>
        <el-table-column align="center" prop="createDate" label="创建时间" width="145"></el-table-column>
        <el-table-column align="center" prop="createEmployee" label="操作人" width=""></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page="ruleForm.pagingQuery.pageIndex" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mssMemberModify',
  data () {
    return {
      area: [],
      province: [],
      loading: false,
      tableData: [],
      tableLoading: false,
      modifyDate: [],
      ruleForm: {
        condition: {
          eventCode: '',
          eventStatus: 0,
          memberId: '',
          productUniqueCode: ''
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
    resetSearch () {
      this.modifyDate = []
      this.ruleForm.condition.eventCode = ''
      this.ruleForm.condition.eventStatus = 0
      this.ruleForm.condition.memberId = ''
      this.ruleForm.condition.productUniqueCode = ''
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    // 获取列表数据
    _getData (isSearch) {
      if (isSearch === true) {
        this.ruleForm.pagingQuery.pageIndex = 1
      }
      this.tableLoading = true
      this.$hsyHttp(this, 'benefit-service/member/event/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.models.forEach(item => {
          if (item.eventStatus === 0) { item.eventStatus = '初始' }
          if (item.eventStatus === 1) { item.eventStatus = '成功' }
          if (item.eventStatus === 2) { item.eventStatus = '失败' }
          if (item.updateDate) {
            item.updateDate = new Date(item.updateDate).format('yyyy-MM-dd hh:mm:ss')
          }
          if (item.createDate) {
            item.createDate = new Date(item.createDate).format('yyyy-MM-dd hh:mm:ss')
          }
        })
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    }
  },
  created () {
    // this._getData()
  },
  watch: {
    'modifyDate': function (val) {
      if (!val) {
        this.ruleForm.condition.changeDateBegin = ''
        this.ruleForm.condition.changeDateEnd = ''
      } else {
        this.ruleForm.condition.changeDateBegin = val[0]
        this.ruleForm.condition.changeDateEnd = val[1]
      }
    }
  }
}
</script>

<style lang="scss">
.mb10{margin-bottom: 10px;}
.clearfix {overflow: auto;zoom: 1;}
.psmUp .el-upload__input{display:none!important;}
.red{color:red;}
.info-p{margin:0;padding:0;line-height:30px;}
.mss-radio{padding-left:8%;}
.text-l{text-align:left;}
.text-r{text-align:right;}
.el-upload--text {border: none;width:auto;height:auto;}
input[type=file] {display: none;}
.height-search{margin-top:10px;padding-top:10px;border-top:1px solid #eee;text-align:right;}
.mssMember-list {padding: 30px 0 30px 30px;}
.mssMember-list .handle-box {margin-bottom: 20px;border:1px solid #eee;padding:10px 20px;border-radius: 5px;}
.mssMember-list .handle-til {border-bottom: 1px solid #eee;padding-bottom: 5px;}
.mssMember-list .handle-til span:nth-child(1) {padding-top: 5px;display: inline-block;}
.mssMember-list .mssMembercontainer {padding-right: 10px;}
.mssMember-list .crumbs {margin-bottom: 20px;}
.mssMember-list .pagination {margin: 20px 0;text-align: right;display: block;}
.mssMember-list .title {color: #ff7000;cursor: pointer;}
.mssMember-list .title-header {color: #909399;}
.mssMember-list {
.handle-box {margin-bottom: 10px;
.publish-btn {float: right;}
}
.handle-input {width: 150px;}
.handle-select {width:100%;}
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
