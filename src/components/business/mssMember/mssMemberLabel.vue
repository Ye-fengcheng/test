<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 标签管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="export-box">
          <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addLabel">添加</el-button>
              </el-col>
          </el-row>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
        <el-table-column align="center" prop="tagName" label="标签名称" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column align="center" prop="memberNum" label="会员人数"></el-table-column>
        <el-table-column align="center" prop="tagType" label="标签类型"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope" v-if="scope.row.tagTypeCode==1">
            <el-button size="small" @click="handleEdit(scope.row.tagId,scope.row.tagName)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.tagId)" :loading="loading">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
      title="添加标签"
      :visible.sync="addVisible"
      width="30%">
      <el-form label-width="25%" size="small">
        <el-form-item label="标签名称：" required>
          <el-input size="mini" v-model="tagName" placeholder="请输入标签名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseQuit()">取 消</el-button>
        <el-button type="primary" @click="saveQuitTime()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="text-l"
      title="编辑标签"
      :visible.sync="editVisible"
      width="30%">
      <el-form label-width="25%" size="small">
        <el-form-item label="标签名称：" required>
          <el-input size="mini" v-model="tagNameEdit" placeholder="请输入标签名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseEdit()">取 消</el-button>
        <el-button type="primary" @click="saveEdit()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'mssMemberLabel',
  data () {
    return {
      addVisible: false,
      editVisible: false,
      loading: false,
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          memberId: '',
          tagId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      tagName: '',
      tagId: '',
      tagNameEdit: ''
    }
  },
  methods: {
    addLabel () {
      this.addVisible = true
    },
    onCloseQuit () {
      this.addVisible = false
    },
    handleEdit (id, name) {
      this.editVisible = true
      this.tagId = id
      this.tagNameEdit = name
    },
    onCloseEdit () {
      this.editVisible = false
    },
    saveQuitTime () {
      const thiz = this
      if (thiz.tagName.trim() === '') {
        thiz.$message.error('标签名称不能为空')
        return
      }
      thiz.loading = true
      thiz.$tupHttp(thiz, 'mss/tag/add', 'POST', { tagName: thiz.tagName }).then(res => {
        thiz.$message.success('保存成功')
        thiz.addVisible = false
        thiz.loading = false
        thiz._getData()
      }, res => {
        thiz.loading = false
      })
    },
    saveEdit () {
      const thiz = this
      if (thiz.tagNameEdit.trim() === '') {
        thiz.$message.error('标签名称不能为空')
        return
      }
      thiz.loading = true
      thiz.$tupHttp(thiz, 'mss/tag/update', 'POST', { tagId: thiz.tagId, tagName: thiz.tagNameEdit }).then(res => {
        thiz.$message.success('保存成功')
        thiz.editVisible = false
        thiz.loading = false
        thiz._getData()
      }, res => {
        thiz.loading = false
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.loading = true
        thiz.$tupHttp(thiz, 'mss/tag/delete', 'POST', { tagId: id }).then(res => {
          thiz.loading = false
          this.$message.success('删除成功')
          thiz._getData()
        }, res => {
          thiz.loading = false
        })
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    // 获取列表数据
    _getData () {
      this.tableLoading = true
      this.$tupHttp(this, 'mss/tag/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    this._getData()
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
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
