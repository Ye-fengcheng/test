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
          <el-form-item label="栏目名称">
            <el-input v-model="searchForm.name" size="mini" placeholder="栏目名称"></el-input>
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
        prop="nameOne"
        label="一级栏目"
        width="100">
      </el-table-column>
      <el-table-column
        label="一级入口图片"
        width="120">
        <template slot-scope="scope">
          <el-button @click="showImg(1, scope.row.picOne)" v-if="scope.row.picOne" type="text" size="small">查看</el-button>
        </template>    
      </el-table-column>
      <el-table-column
        prop="nameTwo"
        label="二级栏目"
        width="100">
      </el-table-column>
      <el-table-column
        label="二级入口图片"
        width="120">
        <template slot-scope="scope">
          <el-button @click="showImg(2, scope.row.picTwo)" v-if="scope.row.picTwo" type="text" size="small">查看</el-button>
        </template>    
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
        prop="sort"
        label="排序"
        width="60">
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
    <el-dialog
      :title="title"
      :visible.sync="imgVisible"
      width="500px">
      <img :src="image" style="max-width: 100%;"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'keepAlive-course-columnManage',
  data () {
    return {
      image: '',
      title: '',
      imgVisible: false,
      tableLoading: false,
      searchForm: {
        platform: '',
        name: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      total: 0,
      tableData: []
    }
  },
  watch: {
    $route (val, oldVal) {
      if (val.path === '/frame/course/columnManage' && oldVal.path === '/frame/course/columnAdd') {
        // this.$util.onKeyCode(this, 'loadData', [true])
        this.loadData()
      }
    }
  },
  methods: {
    create () {
      this.$router.push({
        path: '/frame/course/columnAdd'
      })
    },
    showImg (index, img) {
      this.title = index === 1 ? '一级入口图片' : '二级入口图片'
      this.image = img
      this.imgVisible = true
    },
    formatter(row, column) {
      let txt = ''
      if (column.property == 'platform') {
        txt = row[column.property] === 1 ? '慧管理' : row[column.property] === 2 ? '会生意' : '惠厨房'
      }
      if (column.property == 'status') {
        txt = row[column.property] === 1 ? '待推送' : row[column.property] === 2 ? '已完成' : '推送中'
      }
      if (column.property =='insertTime' || column.property == 'updateTime') {
        txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss")
      }
      return txt
    },
    edit (id) {
      this.$router.push({
        path: '/frame/course/columnAdd',
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
      this.$hsyHttp(thiz, 'manage-app/course/backend/column/listAll', 'POST', thiz.searchForm).then(res => {
        thiz.tableData = res.body.models
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0       
      }, res => {
        thiz.tableLoading = false
      })
    },
    switchChange (id, status) {
      this.$hsyHttp(this, 'manage-app/course/backend/column/updateStatus', 'POST', {
        id: id,
        status: status 
      }).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '操作成功'
        })
        this.loadData()
      })
    }
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
</style>
