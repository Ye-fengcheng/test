<template>
  <div class="activityLog">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>会员活动日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <span>活动：</span>
        <el-select placeholder="活动名称" v-model="ruleForm.activityId" size="mini" style="width:150px;">
          <el-option
            v-for="item in options"
            :key="item.activityCode"
            :label="item.activityName"
            :value="item.id">
          </el-option>
        </el-select>
        <span>&nbsp;&nbsp;会员名称：</span>
        <el-input v-model.trim="ruleForm.memberName" size="mini" style="width:150px;" placeholder="会员名称"></el-input>
        <span>&nbsp;&nbsp;时间：</span>
        <el-date-picker
          v-model="value4"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="mini">
        </el-date-picker>
      </div>
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="search">查询</el-button>
        <el-button type="primary" size="mini" @click="downLoad" :loading="loading">导出数据</el-button>
        <el-button type="success" v-popover:popover1 size="mini">高级检索</el-button>
        <el-popover
            ref="popover1"
            placement="bottom-start"
            width="400"
            trigger="click"
            v-model="visible">
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">专卖店编号:</el-row><el-row><el-input placeholder="专卖店编号" v-model.trim="ruleForm.storeCode"></el-input></el-row></el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">专卖店名称:</el-row><el-row><el-input placeholder="专卖店名称" v-model.trim="ruleForm.storeName"></el-input></el-row></el-col>
        </el-row>
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">手机号码:</el-row><el-row><el-input placeholder="手机号码" v-model.trim="ruleForm.memberMobile"></el-input></el-row></el-col>
        </el-row>
        <el-row class="height-search">
          <el-col :span="24">
            <el-button size="mini" type="" @click="resetSearch">重置</el-button>
            <el-button size="mini" type="primary" @click="highSearch">开始检索</el-button>
          </el-col>
        </el-row>
        </el-popover>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="100"></el-table-column>
        <el-table-column prop="memberName" label="会员名" width="100"></el-table-column>
        <el-table-column prop="memberId" label="会员编码" width="80"></el-table-column>
        <el-table-column prop="memberMobile" label="手机号" width="120"></el-table-column>
        <el-table-column prop="memberGroupidText" label="会员等级" width="80"></el-table-column>
        <el-table-column prop="stateText" label="是否新用户" width="90"></el-table-column>
        <el-table-column prop="currentStoreCode" label="当前专卖店编号" width="120"></el-table-column>
        <el-table-column prop="currentStoreName" label="当前专卖店名称" width="120"></el-table-column>
        <el-table-column prop="prizeName" label="礼品名称" width="100"></el-table-column>
        <el-table-column prop="createDate" label="领取时间"></el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length">
        <el-pagination @current-change="handleCurrentChange" :current-page="ruleForm.page+1" background layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value4: '',
      tableLoading: false,
      loading: false,
      options: [],
      ruleForm: {
        activityId: '0',
        memberName: '',
        startDate: '',
        endDate: '',
        storeCode: '',
        storeName: '',
        memberMobile: '',
        page: 0,
        size: 10
      },
      total: 0,
      tableData: []
    }
  },
  methods: {
    search () {
      this.ruleForm.storeCode = ''
      this.ruleForm.storeName = ''
      this.ruleForm.memberMobile = ''
      this.ruleForm.page = 0
      this._getList()
    },
    downLoad () {
      let thiz = this
      thiz.loading = true
      if (this.value4) {
        this.ruleForm.startDate = this.value4[0]
        this.ruleForm.endDate = this.value4[1]
      } else {
        this.ruleForm.startDate = ''
        this.ruleForm.endDate = ''
      }
      this.$hsyHttp(this, 'backend/dolls/activity/exportDate?activityId=' + this.ruleForm.activityId + '&memberName=' + this.ruleForm.memberName + '&startDate=' + this.ruleForm.startDate + '&endDate=' + this.ruleForm.endDate + '&storeCode=' + this.ruleForm.storeCode + '&storeName=' + this.ruleForm.storeName + '&memberMobile=' + this.ruleForm.memberMobile, 'GET').then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.page = val - 1
      this._getList()
    },
    resetSearch () {
      this.ruleForm.storeCode = ''
      this.ruleForm.storeName = ''
      this.ruleForm.memberMobile = ''
      // this.visible = false
    },
    highSearch () {
      this.ruleForm.page = 0
      this._getList()
      this.visible = false
      // this.ruleForm.storeCode = ''
      // this.ruleForm.storeName = ''
      // this.ruleForm.memberMobile = ''
    },
    _getData () {
      this.$hsyHttp(this, 'backend/dolls/activity/searchByNameAndState?page=1&size=100&name=&state=', 'GET').then(res => {
        this.options = res.data.pageInfo.list
        if (res.data.pageInfo.list.length > 0) {
          this.ruleForm.activityId = res.data.pageInfo.list[0].id
        }
        // this.options.unshift({'id': '0', 'activityCode': '全部', 'activityName': '全部'})
      })
    },
    _getList () {
      this.tableLoading = true
      if (this.value4) {
        this.ruleForm.startDate = this.value4[0]
        this.ruleForm.endDate = this.value4[1]
      } else {
        this.ruleForm.startDate = ''
        this.ruleForm.endDate = ''
      }
      this.$hsyHttp(this, 'backend/dolls/activity/selectByCondition?activityId=' + this.ruleForm.activityId + '&memberName=' + this.ruleForm.memberName + '&startDate=' + this.ruleForm.startDate + '&endDate=' + this.ruleForm.endDate + '&storeCode=' + this.ruleForm.storeCode + '&storeName=' + this.ruleForm.storeName + '&memberMobile=' + this.ruleForm.memberMobile + '&page=' + this.ruleForm.page + '&size=' + this.ruleForm.size, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.map(item => {
          item.createDate = new Date(item.createDate).format('yyyy-MM-dd hh:mm:ss')
          if (item.state === '0') {
            item.stateText = '否'
          } else if (item.state === '1') {
            item.stateText = '是'
          }
          if (item.memberGroupid === 0) {
            item.memberGroupidText = '普通会员'
          } else if (item.memberGroupid === 1) {
            item.memberGroupidText = '高级会员'
          } else if (item.memberGroupid === 2) {
            item.memberGroupidText = '粉丝'
          }
        })
        this.tableData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    this._getData()
    // this._getList()
  }
}
</script>
<style lang="scss">
.mb10{
  margin-bottom: 10px;
}
.height-search{margin-top:10px;padding-top:10px;border-top:1px solid #eee;text-align:right;}
.activityLog {
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
  .pagination {
    margin: 20px 0;
    text-align: right;
    display: block;
  }
  .crumbs {
    margin-bottom: 20px;
  }
}

</style>

