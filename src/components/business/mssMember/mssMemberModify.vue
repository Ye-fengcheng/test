<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 修改记录</el-breadcrumb-item>
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
            <el-form-item label="区域">
                <el-select placeholder="选择区域" size="mini" v-model="ruleForm.condition.regionCode" @change="choseArea" class="handle-select">
                    <el-option
                      v-for="item in area"
                      :key="item.index"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="省办">            
                <el-select placeholder="选择省办" size="mini" v-model="ruleForm.condition.provinceCode" class="handle-select">
                    <el-option
                      v-for="item in province"
                      :key="item.index"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="所属专卖店">
                <el-input v-model="ruleForm.condition.storeKeyword" size="mini" placeholder="专卖店编号/名称"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="操作类型">
                <el-select placeholder="操作类型" style="width:100%;" size="mini" v-model="ruleForm.condition.opType">
                  <el-option key="" label="请选择" value=""></el-option>
                  <el-option key="0" label="会员操作" value="0"></el-option>
                  <el-option key="1" label="后台更新" value="1"></el-option>
                  <el-option key="2" label="删除" value="2"></el-option>
                  <el-option key="3" label="转店" value="3"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">    
            <el-form-item label="会员">
                <el-input v-model="ruleForm.condition.memberKeyword" size="mini" placeholder="会员编号/名称/手机号"></el-input>
            </el-form-item>     
            </el-col>  
            <el-col :span="8">    
            <el-form-item label="修改时间">
                <el-date-picker
                style="width:100%"
                v-model="modifyDate"
                size="mini"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>     
            </el-col>    
        </el-row>   
        <el-form-item>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="_getData(true)">查询</el-button>
            <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberCode" label="会员编码" width="80"></el-table-column>
        <el-table-column align="center" prop="memberName" label="姓名" width="80"></el-table-column>
        <el-table-column align="center" prop="memberMobile" label="会员手机号" width="110"></el-table-column>
        <el-table-column align="center" prop="changeDate" label="修改日期" width="90"></el-table-column>
        <el-table-column align="center" prop="opTypeValue" label="操作类型" width="100"></el-table-column>
        <el-table-column align="center" prop="currentStoreCode" label="所属专卖店编号" width="140"></el-table-column>
        <el-table-column align="center" prop="currentStoreName" label="所属专卖店名称" width="140"></el-table-column>
        <el-table-column align="center" prop="registerStoreCode" label="入会专卖店编号" width="145"></el-table-column>
        <el-table-column align="center" prop="registerStoreName" label="入会专卖店名称" width="145"></el-table-column>
        <el-table-column align="center" prop="upgradeStoreCode" label="升级专卖店新编" width="120"></el-table-column>
        <el-table-column align="center" prop="upgradeStoreName" label="升级专卖店名称" width="120"></el-table-column>
        <el-table-column align="center" prop="updateEmployee" label="操作人" width="120"></el-table-column>
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
          changeDateBegin: '',
          changeDateEnd: '',
          memberId: '',
          memberKeyword: '',
          opType: '',
          provinceCode: '',
          regionCode: '',
          storeKeyword: ''
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
      this.ruleForm.condition.changeDateBegin = ''
      this.ruleForm.condition.changeDateEnd = ''
      this.ruleForm.condition.memberId = ''
      this.ruleForm.condition.memberKeyword = ''
      this.ruleForm.condition.opType = ''
      this.ruleForm.condition.provinceCode = ''
      this.ruleForm.condition.regionCode = ''
      this.ruleForm.condition.storeKeyword = ''
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    downLoad () {
      let thiz = this
      thiz.loading = true
      let data = thiz.$util.deepClone(thiz.ruleForm)
      delete data.pagingQuery
      thiz.$tupHttp(thiz, 'mss/change-record/export', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    // 获取列表数据
    _getData (isSearch) {
      if (isSearch === true) {
        this.ruleForm.pagingQuery.pageIndex = 1
      }
      this.tableLoading = true
      this.$tupHttp(this, 'mss/change-record/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取区域数据
    _getAreaData () {
      this.$hsyHttp(this, '/backend/area/regions', 'GET').then(res => {
        this.area = res.data.models
      })
    },
    // 获取省办数据
    _getProvinceData (regionCode) {
      this.$hsyHttp(this, '/backend/area/provinces/' + regionCode, 'GET').then(res => {
        this.province = res.data.models
      })
    },
    // 选区域
    choseArea (e) {
      this.ruleForm.condition.provinceCode = ''
      this._getProvinceData(e)
    }
  },
  created () {
    // this._getData()
    this._getAreaData()
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
