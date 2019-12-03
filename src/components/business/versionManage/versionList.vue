<template>
  <div class="maintain">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>版本管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 10px;">
        <el-radio-button :label="true">IOS</el-radio-button>
        <el-radio-button :label="false">Android</el-radio-button>
      </el-radio-group> -->
      <div class="handle-box">
        <el-input v-model="ruleForm.condition.keyword" size="mini" style="width:150px;" placeholder="版本描述"></el-input>
        <span>&nbsp;&nbsp;状态:</span>
        <el-select v-model="ruleForm.condition.status" placeholder="状态" size="mini" style="width:100px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="正在使用" value="USING"></el-option>
          <el-option label="历史版本" value="HISTORY"></el-option>
        </el-select>
        <span>&nbsp;&nbsp;所属平台:</span>
        <el-select v-model="ruleForm.condition.platform" placeholder="平台" size="mini" style="width:100px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="惠厨房" value="WECHAT-SHOP"></el-option>
          <el-option label="会生意" value="POS"></el-option>
          <el-option label="慧管理" value="MANAGE"></el-option>
        </el-select>
        <span>&nbsp;&nbsp;设备系统:</span>
        <el-select v-model="ruleForm.condition.device" placeholder="设备系统" size="mini" style="width:100px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="IOS" value="IOS"></el-option>
          <el-option label="Android" value="ANDROID"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="handleAdd()" type="primary" class="publish-btn">+新增</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="versions" sortable label="版本号" width="100"></el-table-column>
        <el-table-column prop="desc" label="版本描述" width="200" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column prop="isForceValue" label="更新性质" width="120"></el-table-column>
        <el-table-column prop="publishTimeValue" label="上线时间" width="150"></el-table-column>
        <el-table-column prop="isGrayValue" label="发布机制" width="130"></el-table-column>
        <el-table-column prop="statusValue" label="状态" width="130"></el-table-column>
        <el-table-column prop="updateUserId" label="操作人" width="80"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="small"  @click="handleUpdate(scope.row.id, scope.row.updateUserId)">查看</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="ruleForm.pagingQuery.pageIndex"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog class="text-l"
        title="添加版本"
        :visible.sync="dialogVisible"
        width="50%">
        <el-form ref="addData" label-width="20%" size="small">
            <el-form-item label="所属平台：">
                <el-radio v-model="addData.platform" label="WECHAT-SHOP">惠厨房</el-radio>
                <el-radio v-model="addData.platform" label="POS">会生意</el-radio>
                <el-radio v-model="addData.platform" label="MANAGE">慧管理</el-radio>
            </el-form-item>
            <el-form-item label="设备系统：">
                <el-radio v-model="addData.device" label="IOS">IOS</el-radio>
                <el-radio v-model="addData.device" label="ANDROID">Android</el-radio>
            </el-form-item>
            <el-form-item label="版本号：" required>
                <span>V</span>
                <el-input size="mini" placeholder="主版本号" style="width:18%;" v-model="addData.mainVersion"></el-input>
                <span>.</span>
                <el-input size="mini" placeholder="次版本号" style="width:18%;" v-model="addData.subVersion"></el-input>
                <span>.</span>
                <el-input size="mini" placeholder="修订版本号" style="width:18%;" v-model="addData.reviseVersion"></el-input>
            </el-form-item>
            <el-form-item label="更新性质：" required>
                <el-radio v-model="addData.isForce" label="0">非强制更新</el-radio>
                <el-radio v-model="addData.isForce" label="1">强制更新</el-radio>
            </el-form-item>
            <el-form-item label="安装包：" required>
                <span>地址：</span>
                <el-input placeholder="地址" style="width:80%;" v-model="addData.installUrl"></el-input>
            </el-form-item>
            <el-form-item label="版本更新说明：" required>
                <el-input type="textarea" :rows="5" style="width:90%;" v-model="addData.versionDesc" placeholder="请输入版本更新说明"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input type="textarea" :rows="3" style="width:90%;" v-model="addData.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="更新白名单：" required>
                <el-radio v-model="addData.isGray" label="0">全国</el-radio>
                <el-radio v-model="addData.isGray" label="1">灰度发布</el-radio>
            </el-form-item>
            <el-form-item label="">
                <el-input v-show="addData.isGray === '1'" type="textarea" v-model="addData.grayList" :rows="3" style="width:calc(90% - 85px);margin-left:85px;" placeholder="灰度发布名单，多个以英文逗号隔开"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onClose()">取 消</el-button>
            <el-button type="primary" @click="handleSave()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog class="text-l"
        title="查看版本"
        :visible.sync="lookVisible"
        width="50%">
        <el-row>
          <el-col :span="12">
            <el-form label-width="40%" size="small">
              <el-form-item label="版本号：">
                <span>{{update.versionDesc}}</span>
              </el-form-item>
              <el-form-item label="设备系统：">
                <span>{{update.deviceValue}}</span>
              </el-form-item>
              <el-form-item label="更新性质：">
                <span>{{update.isForceValue}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-width="40%" size="small">
              <el-form-item label="所属平台：">
                <span>{{update.platformValue}}</span>
              </el-form-item>
              <el-form-item label="状态：">
                <span>{{update.statusValue}}</span>
              </el-form-item>
              <el-form-item label="发布时间：">
                <span>{{update.createTime}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-form label-width="20%" size="small">
            <el-form-item label="安装包：">
                <span>{{update.installUrl}}</span>
            </el-form-item>
            <el-form-item label="操作人员：">
                <span>{{update.maker}}</span>
            </el-form-item>
            <el-form-item label="版本更新说明：">
                <span>{{update.versionDesc}}</span>
            </el-form-item>
            <el-form-item label="备注：" v-if="update.remark != ''">
                <span>{{update.remark}}</span>
            </el-form-item>
            <el-form-item label="发布机制：">
                <span>{{update.isGrayValue}}</span>
            </el-form-item>
            <el-form-item label="白名单：" v-if="update.isGray == 1">
                <span>{{update.grayList}}</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="lookVisible=false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activityList',
  data () {
    return {
      lookVisible: false,
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          device: '',
          keyword: '',
          mainVersion: '',
          orderBy: '',
          platform: '',
          reviseVersion: '',
          status: '',
          subVersion: ''
        },
        pagingQuery: {
          pageIndex: 0,
          pageSize: 10
        }
      },
      addData: {
        createUserId: '',
        device: 'IOS',
        grayList: '',
        id: 0,
        installUrl: '',
        isForce: '0',
        isGray: '0',
        mainVersion: '',
        platform: 'WECHAT-SHOP',
        remark: '',
        reviseVersion: '',
        subVersion: '',
        updateUserId: '',
        versionDesc: ''
      },
      update: {},
      total: 0,
      dialogVisible: false
    }
  },
  methods: {
    search () {
      this.ruleForm.pagingQuery.pageIndex = 1
      this._getData()
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原，是否还继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'pos-version/version/delete', 'POST', {id}).then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    handleAdd () {
      this.dialogVisible = true
    },
    handleUpdate (id, name) {
      this.lookVisible = true
      this.$hsyHttp(this, 'pos-version/version/get?id=' + id, 'GET').then(res => {
        this.update = res.data.model
        this.update.createTime = new Date(this.update.createTime).format('yyyy-MM-dd hh:mm:ss')
        this.update.maker = name
      })
    },
    handleSave () {
      if (this.addData.mainVersion === '') {
        this.$message.error('主版本号不能为空')
        return
      }
      if (this.addData.subVersion === '') {
        this.$message.error('次版本号不能为空')
        return
      }
      if (this.addData.reviseVersion === '') {
        this.$message.error('修订版本号不能为空')
        return
      }
      if (this.addData.installUrl === '') {
        this.$message.error('安装包地址不能为空')
        return
      }
      if (this.addData.versionDesc === '') {
        this.$message.error('版本更新说明不能为空')
        return
      }
      if (this.addData.isGray === '1' && this.addData.grayList === '') {
        this.$message.error('灰度名单不能为空')
        return
      }
      let saveUrl = 'pos-version/version/add'
      this.$hsyHttp(this, saveUrl, 'POST', this.addData).then(res => {
        this.dialogVisible = false
        this.$message.success('保存成功')
        this._getData()
        this.addData = {
          createUserId: '',
          device: 'IOS',
          grayList: '',
          id: 0,
          installUrl: '',
          isForce: '0',
          isGray: '0',
          mainVersion: '',
          platform: 'WECHAT-SHOP',
          remark: '',
          reviseVersion: '',
          subVersion: '',
          updateUserId: '',
          versionDesc: ''
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'pos-version/version/query', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.models.map(item => {
          item.versions = 'V' + item.version
        })
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    onClose () {
      this.dialogVisible = false
    }
  },
  created () {
    // this._getData()
  }
}
</script>

<style lang="scss">
.maintain {
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

  .crumbs {
    margin-bottom: 20px;
  }

  .pagination {
    margin: 20px 0;
    text-align: right;
    display: block;
  }
  .title{
    color: #ff7000;
    cursor: pointer;
  }

  .title-header {
    color: #909399;
  }
}
</style>

