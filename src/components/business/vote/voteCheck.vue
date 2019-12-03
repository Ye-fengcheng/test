<template>
  <div class="vote-check">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>报名审核</el-breadcrumb-item>
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
        <span>审核状态：</span>
        <el-select v-model="condition.statusCode" placeholder="审核状态" size="mini" style="width:150px;">
          <el-option key="" label="全部" value=""></el-option>
          <el-option key="0" label="通过" value="1"></el-option>
          <el-option key="1" label="待审核" value="0"></el-option>
          <el-option key="2" label="不通过" value="2"></el-option>
        </el-select>
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
              <el-row class="mb10">参赛人手机号:</el-row>
              <el-row>
                <el-input placeholder="参赛人手机号" v-model.trim="condition.memberMobile" size="mini"></el-input>
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
        <el-table-column prop="matchId" label="投票编号" width="80"></el-table-column>
        <el-table-column prop="region" label="区域" width="60"></el-table-column>
        <el-table-column prop="province" label="省办" width="60"></el-table-column>
        <el-table-column prop="memberName" label="参赛人" width="90"></el-table-column>
        <el-table-column prop="memberMobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="memberId" label="会员编码" width="80"></el-table-column>
        <el-table-column prop="currentStoreCode" label="所属店编" width="90"></el-table-column>
        <el-table-column prop="currentStoreName" label="所属门店" width="150"></el-table-column>
        <el-table-column prop="matchTime" label="报名时间" width="150"></el-table-column>
        <el-table-column prop="voteNum" label="投票数" width="80"></el-table-column>
        <el-table-column label="置顶" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isTop" active-text="" inactive-text="" size="mini"
            :active-value=1 :inactive-value=0
            @change="switchChange(scope.row.matchId, scope.row.isTop)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="100"></el-table-column>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleRead(scope.row)">查看</el-button>
            <el-button size="mini" @click="handleCheck(scope.row.matchId)">审核</el-button>
            <el-button size="mini" @click="handleEdit(scope.row.matchId, scope.row.voteNum)">编辑</el-button>
          </template>
        </el-table-column>
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
    <el-dialog title="查看"
      :visible.sync="readVisible"
      width="50%">
      <el-row>
        <el-form>
          <el-form-item label="参赛人：">
            <span>{{readItem.memberName}}</span>
          </el-form-item>
          <el-form-item label="会员编号：">
            <span>{{readItem.memberId}}</span>
          </el-form-item>
          <el-form-item label="手机号：">
            <span>{{readItem.memberMobile}}</span>
          </el-form-item>
          <el-form-item label="报名时间：">
            <span>{{readItem.matchTime}}</span>
          </el-form-item>
          <el-form-item label="简介：">
            <span>{{readItem.matchDesc}}</span>
          </el-form-item>
          <el-form-item label="参赛照片（点击照片查看大图）：">
          </el-form-item>
          <div v-for="item in readItem.matchImg" class="img-box" @click="showImg(item)">
            <img :src="item + '!300'" class="img"/>
          </div>
          <el-form-item label="">
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-radio v-model="statusCode" :label="2">不通过</el-radio>
            <el-radio v-model="statusCode" :label="1">通过</el-radio>
            <el-button type="primary" size="mini" @click="saveCheck">提交</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <el-dialog
      title="参赛照片"
      :visible.sync="imgVisible"
      width="320px">
      <img :src="image + '!300'" style="max-width: 100%;"/>
    </el-dialog>
    <el-dialog title="审核"
      :visible.sync="checkVisible"
      width="30%">
      <el-row>
        <el-radio v-model="statusCode" :label="2">不通过</el-radio>
        <el-radio v-model="statusCode" :label="1">通过</el-radio>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveCheck">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑票数"
      :visible.sync="editVisible"
      width="30%">
      <el-row>
        <el-input size="mini" type="number" v-model="voteNum" style="width:90%"></el-input>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveEdit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'voteCheck',
  data () {
    return {
      activityData: [],
      tableData: [],
      tableLoading: false,
      condition: {
        voteId: '',
        statusCode: '',
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
      checkVisible: false,
      editVisible: false,
      readVisible: false,
      imgVisible: false,
      image: '',
      id: '',
      statusCode: '',
      voteNum: '',
      readItem: {},
      downLoading: false
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
    handleCheck (id) {
      this.id = id
      this.statusCode = ''
      this.checkVisible = true
    },
    downLoad () {
      this.downLoading = true
      this.$hsyHttp(this, 'dolls-service/vote-manage/match/export', 'POST', {
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
    saveCheck () {
      this.$hsyHttp(this, 'dolls-service/vote-manage/match/update', 'POST', {
        matchId: this.id,
        statusCode: this.statusCode
      }).then(res => {
        this.checkVisible = false
        this.readVisible = false
        this.$notify.success({
          title: '成功提示',
          message: '审核成功'
        })
        this._getData()
      })
    },
    switchChange (id, isTop) {
      this.$hsyHttp(this, 'dolls-service/vote-manage/match/update', 'POST', {
        matchId: id,
        isTop: isTop
      }).then(res => {
        this.$message.success('操作成功')
        this._getData()
      })
    },
    handleEdit (id, num) {
      this.id = id
      this.voteNum = num
      this.editVisible = true
    },
    saveEdit () {
      this.$hsyHttp(this, 'dolls-service/vote-manage/match/update', 'POST', {
        matchId: this.id,
        voteNum: this.voteNum
      }).then(res => {
        this.editVisible = false
        this.$notify.success({
          title: '成功提示',
          message: '修改成功'
        })
        this._getData()
      })
    },
    handleRead (row) {
      this.readItem = this.$util.deepClone(row)
      this.readItem.matchImg = this.readItem.matchImg.split(',')
      this.id = this.readItem.matchId
      this.statusCode = this.readItem.statusCode
      this.readVisible = true
    },
    showImg (img) {
      this.imgVisible = true
      this.image = img
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'dolls-service/vote-manage/match/list', 'POST', {
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
.vote-check {
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
  .el-form-item__content, .el-form-item__label {
    line-height: 30px;
  }
  .img-box {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 15px;
    border: 1px solid #e9e9e9;
    cursor: pointer;
    text-align: center;
    line-height: 96px;
    vertical-align: middle;
  }
  .img {
    max-width: 100%;
    max-height: 100%;
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

