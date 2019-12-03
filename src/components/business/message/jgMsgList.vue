<template>
  <div>
    <el-form :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="平台">
            <el-select v-model="searchForm.platform" size="mini" filterable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="慧管理" value="1"></el-option>
              <el-option label="会生意" value="2"></el-option>
              <el-option label="惠厨房" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作人">            
            <el-input v-model="searchForm.operationUser" size="mini" placeholder="操作人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" filterable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="待推送" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="推送中" value="3"></el-option>
              <el-option label="部分失败" value="4"></el-option>
            </el-select>
          </el-form-item>          
        </el-col>        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" size="mini" placeholder="标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="副标题">
            <el-input v-model="searchForm.subtitle" size="mini" placeholder="副标题"></el-input>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="time"
              style="width:100%"
              size="mini"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="推送类型">
            <el-select v-model="searchForm.type" size="mini" filterable placeholder="请选择">
              <el-option
                v-for="item in typeDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>          
        </el-col>   
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="create">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台"
        :formatter="formatter"
        width="80">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="推送类型"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="推送标题"
        width="100">
      </el-table-column>
      <el-table-column
        prop="subtitle"
        label="推送副标题"
        width="100">
      </el-table-column>
      <el-table-column
        prop="title"
        label="推送内容"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getDetail(scope.row.id)" type="text" size="small">查看</el-button>
        </template>    
      </el-table-column>
      <el-table-column
        prop="title"
        label="推送名单"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getMenu(scope.row)" type="text" size="small" v-if="scope.row.userType !='all' && scope.row.userType">查看</el-button>
          <span v-else>全部</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="推送失败名单"
        width="120">
        <template slot-scope="scope">
          <el-button v-show="scope.row.status == 4" @click="getFail(scope.row.id)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="已读名单"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getRead(scope.row.id)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="推送状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="operationUser"
        label="操作人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pushTime"
        label="推送时间"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="operationTime"
        label="创建时间"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="remark"
        fixed="right"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" v-show="scope.row.status == 1" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row.id)" v-show="scope.row.status != 3" type="text" size="small">删除</el-button>
        </template>        
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="slot, prev, pager, next, jumper"
        :total="total">
        <span class="el-pagination__total" v-if="total < $baseData.maxNumber">共&nbsp;{{total}}&nbsp;条</span>
        <span class="el-pagination__total" v-else>{{$baseData.maxTitle}}</span>
      </el-pagination>
    </div>
    <el-dialog title="推送名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-table
        :data="roleData"
        v-show="customerShow"
        style="width: 100%;"
        height="450"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="编号">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;" v-show="customerShow">
        <el-pagination
          @current-change="handleCurrentChangeRole"
          background
          :current-page="pushMessageRoleForm.pagingQuery.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="roleTotal">
        </el-pagination>
      </div>
      <tup-arae-store-select v-show="!customerShow" ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="已读名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="readedDialogVisible">
      <el-table
        :data="readedData"
        style="width: 100%;"
        height="350"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="clientId"
          label="编号">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChangeRead"
          background
          :current-page="pushMessageForm.pagingQuery.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="readTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="readedDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="失败名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="failDialogVisible">
      <el-table
        :data="failData"
        style="width: 100%;"
        height="350"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="编号">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChangeFail"
          background
          :current-page="pushMessageFailForm.pagingQuery.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="failTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="failDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送内容" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form" :model="detail" label-width="100px;" size="small" height="450">
        <el-form-item label="标题：">{{detail.title}}</el-form-item>
        <el-form-item label="副标题：">{{detail.subtitle}}</el-form-item>
        <el-form-item label="外部详情页链接：">{{detail.linkUrl}}</el-form-item>
        <el-form-item label="入口图片：">
          <img :src="detail.picUrl" style="width: 80px;"/>
        </el-form-item>
        <el-form-item label="内容：">
        </el-form-item>
        <div v-html="detail.pageDetails" class="jg-content-html"></div>
        <el-form-item label="附件：">
        </el-form-item>
        <a :href="detail.attachment1" v-if="detail.attachment1" target="_blank">{{detail.attachmentName1}}</a><br/>
        <a :href="detail.attachment2" v-if="detail.attachment2" target="_blank">{{detail.attachmentName2}}</a><br/>
        <a :href="detail.attachment3" v-if="detail.attachment2" target="_blank">{{detail.attachmentName3}}</a>&nbsp;&nbsp;
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      areaData:{
        isarea:'1',
        data:[]
      },
      loading: false,
      dialogVisible: false,
      dialogVisible2: false,
      readedDialogVisible:false,
      failDialogVisible:false,
      customerShow:false,
      currentPage: 1,
      total: 0,
      readTotal: 0,
      failTotal: 0,
      roleTotal:0,
      tableLoading: false,
      typeDatas:[],
      searchForm: {
        subtitle:'',
        type:'',
        platform: '',
        operationUser: '',
        status: '',
        title: '',
        beginTime: '',
        endTime: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      readedData: [],
      failData: [],
      time: [],
      roleData: [],
      tableData: [],
      detail: {},
      pushMessageRoleForm: {
        id:'',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      pushMessageForm: {
        pushMessageId:'',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      pushMessageFailForm: {
        pushMessageId:'',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
    }
  },
  methods: {
    create () {
      this.$router.push({
        path: '/frame/message/jgMsgAdd'
      })
    },
    formatter(row, column) {
      let txt = ''
      if (column.property == 'platform') {
        txt = row[column.property] === 1 ? '慧管理' : row[column.property] === 2 ? '会生意' : '惠厨房'
      }
      if (column.property == 'status') {
        txt = row[column.property] === 1 ? '待推送' : row[column.property] === 2 ? '已完成' : row[column.property] === 3 ? '推送中' : '部分失败'
      }
      if(column.property =='type'){
          this.typeDatas.map(item=>{
            if(row[column.property]==item.id){
              txt = item.name
            }
          })  
        }
      if (column.property =='operationTime' || column.property == 'pushTime') {
        txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss")
      }
      return txt
    },
    getMenu (row) {
      let thiz = this
      this.dialogVisible = true
      if(row.userType == 'defined'){
        this.customerShow = true
        this.pushMessageRoleForm.id = row.id ? row.id :this.pushMessageRoleForm.id 
        this.$tupHttp(this, 'manage/pushMessage/getPushUserPage', 'POST',this.pushMessageRoleForm).then(res => {
          thiz.roleData = res.data.models ? res.data.models : []   
          thiz.roleTotal = res.body.pageInfo.total ? res.body.pageInfo.total : 0         
        })
      }
      else if(row.userType != 'all'){
        this.customerShow = false
        thiz.areaData.data = []
        if(row.userType){
          let arr = row.userType.split(',')
          let arr1 = []
          arr.map(item =>{
            arr1.push({code:item})
          })
          setTimeout(function(){
            thiz.areaData = {
              data: arr1,
              isarea:'1',
            }
          })          
        }        
      }
    },
    getRead (pushMessageId) {
      let thiz = this
      this.pushMessageForm.pushMessageId = pushMessageId  ? pushMessageId : this.pushMessageForm.pushMessageId;
      this.readedDialogVisible = true
      this.$tupHttp(this, 'manage/pushMessage/getReadedUserPage', 'POST',this.pushMessageForm).then(res => {
        thiz.readedData = res.data.models   
        thiz.readTotal = res.body.pageInfo.total ? res.body.pageInfo.total : 0        
      })
    },
    getFail (pushMessageId) {
      let thiz = this
      this.pushMessageFailForm.id = pushMessageId ? pushMessageId : this.pushMessageFailForm.id;
      this.failDialogVisible = true
      this.$tupHttp(this, 'manage/pushMessage/getFailPushUserPage', 'POST',this.pushMessageFailForm).then(res => {
        thiz.failData = res.data.models     
        thiz.failTotal = res.body.pageInfo.total ? res.body.pageInfo.total : 0   
      })
    },
    handleCurrentChangeRole (val) {
      this.pushMessageRoleForm.pagingQuery.pageIndex = val
      this.getMenu({userType:'defined'})
    },
    handleCurrentChangeRead (val) {
      this.pushMessageForm.pagingQuery.pageIndex = val
      this.getRead()
    },
    handleCurrentChangeFail (val) {
      this.pushMessageFailForm.pagingQuery.pageIndex = val
      this.getFail()
    },
    getDetail (id) {
      this.dialogVisible2 = true
      this.$tupHttp(this, 'manage/pushMessage/getPushMessageById?pushMessageId=' + id, 'POST').then(res => {
        this.detail = res.data.model        
      })
    },
    edit (id) {
      this.$router.push({
        path: '/frame/message/jgMsgEdit',
        query: {
          id: id
        }
      })
    },
    del (id) {
      let thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$tupHttp(thiz, 'manage/pushMessage/delPushMessage?pushMessageById=' + id, 'POST').then(res => {
          this.$message.success('删除成功')
          thiz.loadData(true)
        })
      })
    },
    handleCurrentChange (val) {
      this.searchForm.pagingQuery.pageIndex = val
      this.loadData()
    },
    loadData (isSearch) {
      let thiz = this
      thiz.tableLoading = true
      if (isSearch) {
        thiz.searchForm.pagingQuery.pageIndex = 1
      }
      if (thiz.time.length) {
        thiz.searchForm.beginTime = thiz.time[0]
        thiz.searchForm.endTime = thiz.time[1]
      }
      this.$tupHttp(thiz, 'manage/pushMessage/getPushMessage', 'POST', thiz.searchForm).then(res => {
        thiz.tableData = res.body.models
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo ? res.body.pageInfo.total : 0       
      }, res => {
        thiz.tableLoading = false
      })
    },
    getType () {
      let thiz = this
      this.$tupHttp(thiz, 'manage/pushMessage/getValidPushMessageType', 'GET').then(res => {
        thiz.typeDatas = [{id:'',name:'全部'}].concat(res.body.models)
      })
    }
  },
  mounted(){
    this.getType()
  }
}
</script>
<style>
.demo-form-inline {
  margin-bottom: 10px;
  padding: 25px 25px 0;
  border-radius: 4px;
  border: 1px solid #eee;
}
.jg-content-html img {
  max-width: 100%;
}
.jg-content-html p {
  white-space: normal;
  word-break: break-all;
}
</style>
