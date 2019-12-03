<template>
  <div>
    <el-form :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="平台">
            <el-select v-model="searchForm.platform" size="mini" filterable placeholder="请选择" @change="selPlatform">
              <el-option label="全部" value=""></el-option>
              <el-option label="慧管理" value="1"></el-option>
              <el-option label="会生意" value="2"></el-option>
              <el-option label="惠厨房" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="一级栏目">            
            <el-select v-model="searchForm.parentId" size="mini" filterable placeholder="请选择" @change="selParentId">
              <el-option
                v-for="item in column1"
                :key="item.id"
                :label="item.nameOne"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="二级栏目">            
            <el-select v-model="searchForm.columnId" size="mini" filterable placeholder="请选择">
              <el-option
                v-for="item in column2"
                :key="item.id"
                :label="item.nameOne"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>      
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" filterable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>          
        </el-col>  
        <el-col :span="8">
          <el-form-item label="课件标题">
            <el-input v-model="searchForm.title" size="mini" placeholder="标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="time"
              style="width:100%"
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetForm">重置</el-button>
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
        prop="nameOne"
        label="一级栏目"
        width="100">
      </el-table-column>
      <el-table-column
        prop="nameTwo"
        label="二级栏目"
        width="100">
      </el-table-column>
      <el-table-column
        prop="title"
        label="课件标题"
        width="100">
      </el-table-column>
      <el-table-column
        label="课件详情"
        width="120">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">查看</el-button>
        </template>    
      </el-table-column>
      <el-table-column
        label="可见名单"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getMenu(scope.row)" type="text" size="small" v-if="scope.row.visibleType !== 0">查看</el-button>
          <span v-else>全部</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="studyCount"
        label="学习人数"
        width="100">
      </el-table-column>
      <el-table-column
        label="学习人名单"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getStudyMenu(scope.row.id)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-text="" inactive-text="" size="mini"
          :active-value=1 :inactive-value=0
          @change="switchChange(scope.row.id, scope.row.status)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="60">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="编辑人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="编辑时间"
        :formatter="formatter"
        width="160">
      </el-table-column>
      <el-table-column
        prop="insertBy"
        label="创建人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="insertTime"
        label="创建时间"
        :formatter="formatter"
        width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
        </template>        
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="可见名单" width="60%" top="5%" :visible.sync="dialogVisible">
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
          prop="pUid"
          label="编号">
        </el-table-column>
      </el-table>
      <div v-show="customerShow" style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChange1"
          background
          :current-page="comForm.pagingQuery.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </div>
      <tup-arae-store-select v-show="!customerShow" ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
    </el-dialog>
    <el-dialog title="学习人名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible1">
      <el-table
        :data="studyData"
        style="width: 100%;"
        height="450"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="pUid"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="pName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="pRegion"
          label="区域">
        </el-table-column>
        <el-table-column
          prop="pProvince"
          label="省办">
        </el-table-column>
        <el-table-column
          prop="pPositionabbr"
          label="职位">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChange2"
          background
          :current-page="studyForm.pagingQuery.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" v-show="studyData.length" @click="downLoad" :loading="downLoading">导出学习名单</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送内容" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form" :model="detail" label-width="100px;" size="small" height="450">
        <el-form-item label="标题：">{{detail.title}}</el-form-item>
        <el-form-item label="副标题：">{{detail.subTitle}}</el-form-item>
        <el-form-item label="入口图片：">
          <img :src="detail.pic" style="width: 80px;"/>
        </el-form-item>
        <el-form-item label="内容：">
        </el-form-item>
        <div v-html="detail.content" class="jg-content-html"></div>
        <el-form-item label="附件：">
        </el-form-item>
        <div v-if="detail.attachments" v-for="(item,index) in detail.attachments" :key="index"><a :href="item.url" target="_blank">{{item.name}}</a></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'keepAlive-course-courseManage',
  data () {
    return {
      customerShow: true,
      loading: false,
      dialogVisible2: false,
      total: 0,
      tableLoading: false,
      column1: [],
      column2: [],
      time: [],
      tableData: [],
      searchForm: {
        platform: '',
        parentId: '',
        columnId: '',
        status: '',
        title: '',
        startTime: '',
        endTime: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      comForm: {
        id: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      roleData: [],
      total1: 0,
      dialogVisible: false,
      studyForm: {
        id: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      studyData: [],
      total2: 0,
      dialogVisible1: false,
      downLoading: false,
      detail: '',
      areaData: {
        data: [],
        isarea:'1',
      }
    }
  },
  watch: {
    $route (val, oldVal) {
      if (val.path === '/frame/course/courseManage' && oldVal.path === '/frame/course/courseAdd') {
        // this.$util.onKeyCode(this, 'loadData', [true])
        this.loadData()
      }
    }
  },
  methods: {
    create () {
      this.$router.push({
        path: '/frame/course/courseAdd'
      })
    },
    resetForm () {
      this.searchForm = {
        platform: '',
        parentId: '',
        columnId: '',
        status: '',
        title: '',
        startTime: '',
        endTime: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      }
      this.time = []
    },
    selPlatform () {
      // this._getColumn1({
      //   platform: this.searchForm.platform,
      //   level: 1
      // })
      // this.searchForm.parentId = ''
      // this.searchForm.columnId = ''
      // this.column1 = []
      // this.column2 = []
    },
    selParentId () {
      // this._getColumn1({
      //   platform: this.searchForm.platform,
      //   parentId: this.searchForm.parentId,
      //   level: 2
      // })
      // this.searchForm.columnId = ''
      // this.column2 = []
    },
    formatter (row, column) {
      let txt = ''
      if (column.property == 'platform') {
        txt = row[column.property] === 1 ? '慧管理' : row[column.property] === 2 ? '会生意' : '惠厨房'
      }
      if (column.property == 'status') {
        txt = row[column.property] === 1 ? '待推送' : row[column.property] === 2 ? '已完成' : '推送中'
      }
      if (column.property == 'insertTime' || column.property == 'updateTime') {
        txt = new Date(row[column.property]).format('yyyy-MM-dd hh:mm:ss')
      }
      return txt
    },
    showDetail (content) {
      this.detail = content
      this.dialogVisible2 = true
    },
    getMenu (row) {
      this.comForm.id = row.id
      this.comForm.pagingQuery.pageIndex = 1
      this._getVisibleList(row.visibleType)
    },
    getStudyMenu (id) {
      this.studyForm.id = id
      this.studyForm.pagingQuery.pageIndex = 1
      this._getStudyList()
    },
    handleCurrentChange1 (val) {
      this.comForm.pagingQuery.pageIndex = val
      this._getVisibleList(1)
    },
    handleCurrentChange2 (val) {
      this.studyForm.pagingQuery.pageIndex = val
      this._getStudyList()
    },
    downLoad () {
      this.downLoading = true
      this.$hsyHttp(this, 'manage-app/course/backend/ware/study/list/export', 'POST', this.studyForm).then(res => {
        this.downLoading = false
        this.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        this.downLoading = false
      })
    },
    switchChange (id, status) {
      this.$hsyHttp(this, 'manage-app/course/backend/ware/updateStatus', 'POST', {
        id: id,
        status: status
      }).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '操作成功'
        })
        this.loadData()
      })
    },
    edit (id) {
      this.$router.push({
        path: '/frame/course/courseAdd',
        query: {
          id: id
        }
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
        thiz.searchForm.startTime = thiz.time[0]
        thiz.searchForm.endTime = thiz.time[1]
      }
      this.$hsyHttp(thiz, 'manage-app/course/backend/ware/listAll', 'POST', thiz.searchForm).then(res => {
        thiz.tableData = res.body.models
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0
      }, res => {
        thiz.tableLoading = false
      })
    },
    _getVisibleList (type) {
      let thiz = this
      this.$hsyHttp(this, 'manage-app/course/backend/ware/visible/list', 'POST', this.comForm).then(res => {
        this.roleData = res.data.models
        this.dialogVisible = true
        this.total1 = res.body.pageInfo.total ? res.body.pageInfo.total : 0
        thiz.areaData.data = []
        if(type == 2){
          this.customerShow = false
          let arr1 = []
          this.roleData.map(item =>{
            arr1.push({code:item.pUid})
          })
          setTimeout(function(){
            thiz.areaData = {
              data: arr1,
              isarea:'1',
            }
          })          
        }
        else{
          this.customerShow = true
        }
      })
    },
    _getStudyList () {
      this.$hsyHttp(this, 'manage-app/course/backend/ware/study/list', 'POST', this.studyForm).then(res => {
        this.studyData = res.data.models
        this.dialogVisible1 = true
        this.total2 = res.body.pageInfo.total ? res.body.pageInfo.total : 0
      })
    },
    _getColumn1 (data) {
      this.$hsyHttp(this, 'manage-app/course/backend/column/listByCondition', 'POST', data).then(res => {
        if (data.level == 1) {
          this.column1 = res.data.models
        } else if (data.level == 2) {
          this.column2 = res.data.models
        }
      })
    }
  },
  created () {
    this._getColumn1({level: 1})
    this._getColumn1({level: 2})
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
