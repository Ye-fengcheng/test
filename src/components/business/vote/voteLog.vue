<template>
  <div class="vote-log">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>投票日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <span>活动名称：</span>
        <el-select v-model="condition.voteId" placeholder="活动名称" size="mini" style="width:150px;">
          <el-option v-for="item in activityData"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
        <span>投票对象编号：</span>
        <el-input placeholder="投票对象编号" v-model.trim="condition.mathId" size="mini" style="width:130px;"></el-input>
        <span>投票时间：</span>
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
          size="mini"
          style="width:320px; margin-bottom: 10px;">
        </el-date-picker>
        <br/>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button type="success" size="mini" v-popover:popover>高级检索</el-button>
        <el-button type="success" size="mini" @click="downLoad" :loading="downLoading">导出</el-button>
        <el-popover
          ref="popover"
          placement="bottom-start"
          width="400"
          trigger="click"
          v-model="visible">
          <el-row class="mb10">
            <el-col :span="11" :push="0">
              <el-row class="mb10">专卖店编号:</el-row>
              <el-row>
                <el-input placeholder="专卖店编号" v-model.trim="condition.currentStoreCode" size="mini"></el-input>
              </el-row>
            </el-col>
            <el-col :span="11" :push="2">
              <el-row class="mb10">专卖店名称:</el-row>
              <el-row>
                <el-input placeholder="专卖店名称" v-model.trim="condition.currentStoreName" size="mini"></el-input>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="11" :push="0">
              <el-row class="mb10">投票人手机号:</el-row>
              <el-row>
                <el-input placeholder="投票人手机号" v-model.trim="condition.memberMobile" size="mini"></el-input>
              </el-row>
            </el-col>
            <el-col :span="11" :push="2">
              <el-row class="mb10">会员编号:</el-row>
              <el-row>
                <el-input placeholder="会员编号" v-model.trim="condition.memberId" size="mini"></el-input>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="height-search">
            <el-col :span="24">
              <el-button size="mini" type="" @click="resetSearch">重置</el-button>
              <el-button size="mini" type="primary" @click="highSearch">开始检索</el-button>
            </el-col>
          </el-row>
        </el-popover>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column prop="title" label="活动名称" width="120"></el-table-column>
        <el-table-column prop="region" label="区域" width="60"></el-table-column>
        <el-table-column prop="province" label="省办" width="60"></el-table-column>
        <el-table-column prop="mathName" label="投票对象名称" width="120"></el-table-column>
        <el-table-column prop="mathId" label="投票对象编号" width="100"></el-table-column>
        <el-table-column prop="memberName" label="投票人名称" width="90"></el-table-column>
        <el-table-column prop="memberMobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="memberId" label="会员编码" width="80"></el-table-column>
        <el-table-column prop="openId" label="openid" width="90"></el-table-column>
        <el-table-column prop="memberState" label="是否新用户" width="90"></el-table-column>
        <el-table-column prop="memberGroupId" label="会员等级" width="90"></el-table-column>
        <el-table-column prop="currentStoreCode" label="所属店" width="80"></el-table-column>
        <el-table-column prop="currentStoreName" label="所属店名" width="120"></el-table-column>
        <el-table-column prop="voteTime" label="投票时间" width="150"></el-table-column>
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
  name: 'voteLog',
  data () {
    return {
      activityData: [],
      tableData: [],
      tableLoading: false,
      date: [],
      condition: {
        voteId: '',
        mathId: '',
        startDate: '',
        endDate: '',
        currentStoreCode: '',
        currentStoreName: '',
        memberMobile: '',
        memberId: ''
      },
      pagingQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      visible: false,
      downLoading: false
    }
  },
  watch: {
    date (newValue) {
      this.condition.startDate = newValue ? new Date(newValue[0]).valueOf() : ''
      this.condition.endDate = newValue ? new Date(newValue[1]).valueOf() : ''
    }
  },
  methods: {
    search () {
      this.pagingQuery.pageIndex = 1
      this._getData()
    },
    resetSearch () {
      this.condition.currentStoreCode = ''
      this.condition.currentStoreName = ''
      this.condition.memberMobile = ''
      this.condition.memberId = ''
    },
    highSearch () {
      this.pagingQuery.pageIndex = 1
      this.search()
      this.visible = false
    },
    handleCurrentChange (val) {
      this.pagingQuery.pageIndex = val
      this._getData()
    },
    downLoad () {
      this.downLoading = true
      this.$hsyHttp(this, 'dolls-service/vote-manage/log/export', 'POST', {
        condition: this.condition
      }).then(res => {
        this.downLoading = false
        this.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        this.downLoading = false
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'dolls-service/vote-manage/log/list', 'POST', {
        condition: this.condition,
        pagingQuery: this.pagingQuery
      }).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    _getActivityData () {
      this.$hsyHttp(this, 'dolls-service/vote-manage/list', 'POST').then(res => {
        this.activityData = res.data.models
        if (res.data.models.length > 0) {
          this.condition.voteId = res.data.models[0].id
        }
        // this._getData()
      })
    }
  },
  created () {
    this._getActivityData()
  }
}
</script>

<style lang="scss">
.vote-log {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
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
.mb10 {
  margin-bottom: 10px;
}
.height-search {
  padding-top: 10px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>

