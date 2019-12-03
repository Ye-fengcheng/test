<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 会员转移</el-breadcrumb-item>
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
            <el-form-item label="会员">            
                <el-input v-model="ruleForm.condition.memberKeyword" size="mini"  placeholder="会员编号/名称/手机号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="转出专卖店">
                <el-input v-model="ruleForm.condition.fromStoreKeyword" size="mini" placeholder="专卖店编号/名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="转入专卖店">
                <el-input v-model="ruleForm.condition.toStoreKeyword" size="mini" placeholder="专卖店编号/名称"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="状态">
                <el-select placeholder="状态" size="mini" v-model="ruleForm.condition.transferStatus" style="width:100%;">
                    <el-option key="" label="全部" value=""></el-option>
                    <!-- <el-option key="0" label="作废" value="0"></el-option> -->
                    <el-option key="1" label="待审核" value="1"></el-option>
                    <el-option key="2" label="已审核" value="2"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">    
            <el-form-item label="转移原因">
                <el-input v-model="ruleForm.condition.transferReason" size="mini" placeholder="请输入关键字"></el-input>
            </el-form-item>     
            </el-col>  
            <el-col :span="8">    
            <el-form-item label="导入时间">
                <el-date-picker
                style="width:100%"
                v-model="createDate"
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
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="loadData()">查询</el-button>
            <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <div class="export-box">
          <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multipleSelection.length" @click="batchMake(1)">批量删除</el-button>
                <el-button type="primary" icon="el-icon-document" size="mini" :disabled="!multipleSelection2.length" @click="batchMake(2)">批量审核</el-button>
                <el-upload
                    action=""
                    style="display:inline-block;margin-left:10px;"
                    :show-file-list="false"
                    :multiple="true"
                    :httpRequest="uploadfileMember"
                    class="psmUp">
                    <el-button icon="el-icon-upload2" size="mini" type="success">批量导入（会员）</el-button>
                </el-upload>
                <el-button size="mini" @click="$util.winOpen('static/useJs/doc/mssMemberTransfer.xlsx?'+$util.getRandom())" type="text">单个会员批量转移模板</el-button>
                <el-upload
                    action=""
                    style="display:inline-block;margin-left:10px;"
                    :show-file-list="false"
                    :multiple="true"
                    :httpRequest="uploadfileStore"
                    class="psmUp">
                    <el-button icon="el-icon-upload2" size="mini" type="success">批量导入（店）</el-button>
                </el-upload>
                <el-button size="mini" @click="$util.winOpen('static/useJs/doc/mssStoreTransfer.xlsx?'+$util.getRandom())" type="text">批量转移（店）模板</el-button>
                
              </el-col>
          </el-row>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberCode" label="会员编号" width="80"></el-table-column>
        <el-table-column align="center" prop="memberName" label="会员姓名" width="80"></el-table-column>
        <el-table-column align="center" prop="fromStoreCode" label="转出专卖店编号" width="130"></el-table-column>
        <el-table-column align="center" prop="fromStoreName" label="转出专卖店名称" width="130"></el-table-column>
        <el-table-column align="center" prop="toStoreCode" label="转入专卖店编号" width="130"></el-table-column>
        <el-table-column align="center" prop="toStoreName" label="转入专卖店名称" width="130"></el-table-column>
        <el-table-column align="center" prop="reason" label="转移原因" width="140"></el-table-column>
        <el-table-column align="center" prop="transferTime" label="导入时间" width="90"></el-table-column>
        <el-table-column align="center" prop="createEmployee" label="操作人" width="145"></el-table-column>
        <el-table-column align="center" prop="approvalEmployee" label="审核人" width="120"></el-table-column>
        <el-table-column align="center" prop="approvalTime" label="审核时间" width="90"></el-table-column>
        <el-table-column align="center" prop="transferStatusValue" label="状态" width="120"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="toEdit(scope.row)" v-if='scope.row.transferStatusValue === "待审核"'>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page="ruleForm.pagingQuery.pageIndex" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
      title="会员转移"
      :visible.sync="editVisible"
      width="50%">
      <el-row>
        <el-col :span="6">
          <el-form label-width="50%" size="small">
            <el-form-item label="会员：">
              <span>{{memberInfo.memberName}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="9">
          <el-form label-width="60%" size="small">
            <el-form-item label="转移前所属专卖店：">
              <span>{{memberInfo.fromStoreCode}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="9">
          <el-form label-width="70%" size="small">
            <el-form-item label="转移前所属专卖店状态：">
              <span>{{memberInfo.fromStoreStatus}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="18">
          <el-form label-width="25%" size="small">
            <el-form-item label="转移专卖店类型：">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="storeType in storeType" :label="storeType" :key="storeType"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="12">
          <el-form label-width="50%" size="small">
            <el-form-item label="转移后所属专卖店：">
              <el-input size="mini" v-model="memberInfo.toStoreCode" placeholder="请输入专卖店编号" style="width:90%"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="storeStatus">{{memberInfo.toStoreName}} | {{memberInfo.toStoreStatus}}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseEdit()">取 消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'psmPersonList',
  data () {
    return {
      checkList: [],
      memberInfo: {},
      storeType: ['所属专卖店', '入会专卖店', '升级专卖店'],
      editVisible: false,
      loading: false,
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          createDateBegin: '',
          createDateEnd: '',
          fromStoreKeyword: '',
          memberId: '',
          memberKeyword: '',
          toStoreKeyword: '',
          transferReason: '',
          transferStatus: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      createDate: [],
      total: 0,
      multipleSelection: [],
      multipleSelection2: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val.filter(item => {
        return item.transferStatusValue === '待审核'
      }).map(item => {
        return item.id
      })
      this.multipleSelection2 = val.filter(item => {
        return item.transferStatusValue === '待审核'
      }).map(item => {
        return item.id
      })
    },
    batchMake (type) {
      let thiz = this
      // thiz.loading = true
      let info = ''
      let url = ''
      let tip = ''
      let data = {}
      if (type === 1) {
        info = '是否确认批量删除会员转移记录?'
        url = 'mss-service/transfer/delete'
        tip = '批量删除成功'
        data = {ids: this.multipleSelection}
      } else {
        info = '是否确认批量审核会员转移记录?'
        url = 'mss-service/transfer/approve'
        tip = '批量审核成功'
        data = {ids: this.multipleSelection2}
      }
      this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        thiz.$hsyHttp(thiz, url, 'POST', data).then(res => {
          // thiz.loading = false
          thiz.$notify.success({
            title: '成功提示',
            message: tip
          })
          thiz._getData()
        }, res => {
          // thiz.loading = false
        })
      }).catch(() => {
        // thiz.loading = false
      })
    },
    uploadfileMember (option) {
      this.$util.readExcel(option.file, this.treatDatasMember)
    },
    treatDatasMember (datas, file) {
      let arr = []
      for (let i = 1; i < datas.sheet0.length; i++) {
        let isBeStore
        let isRegStore
        let isUpdateStore
        if (datas.sheet0[i][2] === '是') { isBeStore = 1 } else { isBeStore = 0 }
        if (datas.sheet0[i][3] === '是') { isRegStore = 1 } else { isRegStore = 0 }
        if (datas.sheet0[i][4] === '是') { isUpdateStore = 1 } else { isUpdateStore = 0 }
        arr.push({
          mobile: datas.sheet0[i][0],
          toStoreCode: datas.sheet0[i][1],
          isBeStore: isBeStore,
          isRegStore: isRegStore,
          isUpdateStore: isUpdateStore,
          reason: datas.sheet0[i][5]
        })
      }
      let thiz = this
      thiz.$hsyHttp(thiz, 'mss-service/transfer/import', 'POST', {members: arr}).then(res => {
        this.loadData()
        thiz.$notify.success({
          title: '成功提示',
          message: '成功导入'
        })
      })
    },
    uploadfileStore (option) {
      this.$util.readExcel(option.file, this.treatDatasStore)
    },
    treatDatasStore (datas, file) {
      let arr = []
      for (let i = 1; i < datas.sheet0.length; i++) {
        let isBeStore
        let isRegStore
        let isUpdateStore
        if (datas.sheet0[i][2] === '是') { isBeStore = 1 } else { isBeStore = 0 }
        if (datas.sheet0[i][3] === '是') { isRegStore = 1 } else { isRegStore = 0 }
        if (datas.sheet0[i][4] === '是') { isUpdateStore = 1 } else { isUpdateStore = 0 }
        arr.push({
          fromStoreCode: datas.sheet0[i][0],
          toStoreCode: datas.sheet0[i][1],
          isBeStore: isBeStore,
          isRegStore: isRegStore,
          isUpdateStore: isUpdateStore,
          reason: datas.sheet0[i][5]
        })
      }
      let thiz = this
      thiz.$hsyHttp(thiz, 'mss-service/transfer/import', 'POST', {stores: arr}).then(res => {
        this.loadData()
        thiz.$notify.success({
          title: '成功提示',
          message: '成功导入'
        })
      })
    },
    resetSearch () {
      this.ruleForm.condition.createDateBegin = ''
      this.ruleForm.condition.createDateEnd = ''
      this.ruleForm.condition.fromStoreKeyword = ''
      this.ruleForm.condition.memberId = ''
      this.ruleForm.condition.memberKeyword = ''
      this.ruleForm.condition.toStoreKeyword = ''
      this.ruleForm.condition.transferReason = ''
      this.ruleForm.condition.transferStatus = ''
      this.createDate = []
    },
    toEdit (info) {
      this.editVisible = true
      if (info.fromStoreStatus == 1) { info.fromStoreStatus = '启用中' }
      if (info.fromStoreStatus == 0) { info.fromStoreStatus = '停用' }
      if (info.toStoreStatus == 1) { info.toStoreStatus = '启用中' }
      if (info.toStoreStatus == 0) { info.toStoreStatus = '停用' }
      this.checkList = []
      if (info.isBeStore === 1) { this.checkList.push('所属专卖店') }
      if (info.isRegStore === 1) { this.checkList.push('入会专卖店') }
      if (info.isUpdateStore === 1) { this.checkList.push('升级专卖店') }
      this.memberInfo = this.$util.deepClone(info)
    },
    saveEdit () {
      if (this.memberInfo.toStoreStatus !== '启用中') {
        this.$message.error('请输入启用中的专卖店编号')
        return
      }
      let isBeStore = 0
      let isRegStore = 0
      let isUpdateStore = 0
      this.checkList.forEach(function (item) {
        if (item === '所属专卖店') { isBeStore = 1 }
      })
      this.checkList.forEach(function (item) {
        if (item === '入会专卖店') { isRegStore = 1 }
      })
      this.checkList.forEach(function (item) {
        if (item === '升级专卖店') { isUpdateStore = 1 }
      })
      let data = {
        id: this.memberInfo.id,
        isBeStore: isBeStore,
        isRegStore: isRegStore,
        isUpdateStore: isUpdateStore,
        toStoreCode: this.memberInfo.toStoreCode
      }
      this.loading = true
      this.$hsyHttp(this, 'mss-service/transfer/update', 'POST', {record: data}).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '操作成功'
        })
        this.loadData()
        this.loading = false
        this.editVisible = false
      }, res => {
        this.loading = false
      })
    },
    onCloseEdit () {
      this.editVisible = false
    },
    getStore (storeCode) {
      this.$hsyHttp(this, 'mss-service/transfer/store?storeCode=' + storeCode, 'GET').then(res => {
        if (res.data.model) {
          this.memberInfo.toStoreCode = res.data.model.toStoreCode
          this.memberInfo.toStoreName = res.data.model.toStoreName
          if (res.data.model.toStoreStatus == 1) { this.memberInfo.toStoreStatus = '启用中' }
          if (res.data.model.toStoreStatus == 0) { this.memberInfo.toStoreStatus = '停用' }
        } else {
          this.memberInfo.toStoreName = '查无此店'
          this.memberInfo.toStoreStatus = ''
        }
      })
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
      thiz.$hsyHttp(thiz, 'mss-service/transfer/export', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    loadData () {
      this.ruleForm.pagingQuery.pageIndex = 1
      this._getData()
    },
    // 获取列表数据
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'mss-service/transfer/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    // this._getData()
  },
  watch: {
    'createDate': function (val) {
      if (!val) {
        this.ruleForm.condition.createDateBegin = ''
        this.ruleForm.condition.createDateEnd = ''
      } else {
        this.ruleForm.condition.createDateBegin = val[0]
        this.ruleForm.condition.createDateEnd = val[1]
      }
    },
    'memberInfo.toStoreCode': function (val) {
      if (val && val.length > 4) {
        this.getStore(val)
      }
    }
  }
}
</script>

<style lang="scss">
.storeStatus{line-height:30px;}
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
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
