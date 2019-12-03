<template>
  <div>
    <el-form :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="类型名称">
            <el-input v-model="searchForm.name" size="mini" placeholder="类型名称"></el-input>
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
        prop="id"
        label="类型代码"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="类型名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="picUrl"
        label="入口图片"
        width="120">
        <template slot-scope="scope">
          <el-button @click="getDetail(scope.row.picUrl)" type="text" size="small">查看</el-button>
        </template>    
      </el-table-column>      
      <el-table-column
        prop="createUser"
        label="创建人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="updateUser"
        label="编辑人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="编辑时间"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="推送状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="remark"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="update(scope.row,2)" v-show="scope.row.status == 1" type="text" size="small">禁用</el-button>
          <el-button @click="update(scope.row,1)" v-show="scope.row.status == 2" type="text" size="small">启用</el-button>
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
    <el-dialog title="新建消息类型" width="50%" top="10%" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="130px">
        <el-form-item label="消息类型名称" prop="name">
          <el-input v-model="model.name" placeholder="消息类型名称"></el-input>
        </el-form-item>
        <el-form-item label="消息类型入口图片" prop="picUrl">
          <tup-picture-select v-model="pics"></tup-picture-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="commitAdd">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑消息类型" width="50%" top="10%" :close-on-click-modal="false" :visible.sync="dialogVisible3">
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="130px">
        <el-form-item label="消息类型名称" prop="name">
          <el-input v-model="model.name" placeholder="消息类型名称"></el-input>
        </el-form-item>
        <el-form-item label="消息类型入口图片" prop="picUrl">
          <tup-picture-select v-model="pics"></tup-picture-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible3 = false">关闭</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="commitEdit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片" width="50%" top="10%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form" :model="detail" label-width="100px;" size="small" height="450">
        <img :src="picUrl" width="200" max-width="300">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      currentPage: 1,
      total: 0,
      tableLoading: false,
      model:{
        id:'',
        picUrl: '',
        status: 1,
        name: ''
      },
      modelRules:{
        name: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        picUrl: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      pics:[],
      searchForm: {
        name: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 20
        }
      },
      picUrl:'',
      time: [],
      roleData: [],
      tableData: [],
      detail: {}
    }
  },
  watch : {
    pics :function(val){
      if(val.length){
        this.model.picUrl = val[0].url
      }
      else{
        this.model.picUrl = ''
      }
    }
  },
  methods: {
    commitAdd () {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          this.add();
        } else {
          return false;
        }
      });
    },
    add () {
      let data = this.$util.deepClone(this.model);
      if(data.name.length > 4){
        this.$notify.error({
          title: '成功提示',
          message: '不能超过4个字'
        });
        return ;
      }
      this.loading = true;
      this.$tupHttp(this, 'manage/pushMessage/addPushMessageType', 'POST',data).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '添加成功'
        });
        this.model= {
          id:'',
          picUrl: '',
          status: 1,
          name: ''
        }
        this.dialogVisible = false
        this.loading = false
        this.pics = []
        this.loadData()
      },res =>{
        this.loading = false
      })
    },
    commitEdit () {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          this.updateType();
        } else {
          return false;
        }
      });
    },
    updateType () {
      let data = this.$util.deepClone(this.model);
      if(data.name.length > 4){
        this.$notify.error({
          title: '成功提示',
          message: '不能超过4个字'
        });
        return ;
      }
      this.loading = true;
      this.$tupHttp(this, 'manage/pushMessage/updatePushMessageType', 'POST',data).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '保存成功'
        });
        this.loading = false
        this.loadData()
      },res =>{
        this.loading = false
      })
    },
    create () {
      this.dialogVisible = true
      this.model= {
        id:'',
        picUrl: '',
        status: 1,
        name: ''
      }
      this.pics = []
    },
    formatter(row, column) {
      let txt = ''
      if (column.property == 'status') {
        txt = row[column.property] === 1 ? '启用' : '禁用'
      }
      if (column.property =='updateTime' || column.property == 'createTime') {
        if(row[column.property])
          txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss")
      }
      return txt
    },
    getMenu (id) {
      let thiz = this
      this.$tupHttp(this, 'manage/pushMessage/getPushMessageById?pushMessageId=' + id, 'POST').then(res => {
        thiz.roleData = res.data.model.users.split(',').map(item => {
          return {id: item}
        })
        this.dialogVisible = true
      })
    },
    getDetail (picUrl) {
      this.dialogVisible2 = true
      this.picUrl = picUrl
    },
    update (row,val){
      let data = this.$util.deepClone(row);
      data.status = val;
      this.$tupHttp(this, 'manage/pushMessage/updatePushMessageType', 'POST',data).then(res => {
        this.$notify.success({
          title: '成功提示',
          message: '操作成功'
        });
        this.loadData()
      })
    },
    edit (row) {
      this.dialogVisible3 = true;
      this.model = row;
      if(row.picUrl){
        this.pics = [{url:row.picUrl}]
      }
      else{
        this.pics = []
      }
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
      this.$tupHttp(thiz, 'manage/pushMessage/getAllPushMessageTypePage', 'POST', thiz.searchForm).then(res => {
        thiz.tableData = res.body.models
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0       
      }, res => {
        thiz.tableLoading = false
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
.jg-content-html img {
  max-width: 100%;
}
.jg-content-html p {
  white-space: normal;
  word-break: break-all;
}
</style>
