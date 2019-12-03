<template>
  <div class="table psm-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> PSM人员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="psmcontainer">
      <div class="handle-box">
        <el-input v-model="ruleForm.name" placeholder="请输入PSM姓名" class="handle-input"></el-input>
        <el-button type="primary" icon="search" @click="checkSearch">查询</el-button>
        <el-button type="primary" icon="search" v-popover:popover1 class="publish-btn">高级检索</el-button>
        <el-popover
            ref="popover1"
            placement="bottom-end"
            width="400"
            trigger="click">
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">分销商编号:</el-row><el-row><el-input placeholder="分销商编号" v-model="ruleForm.pUid"></el-input></el-row></el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">分销商姓名:</el-row><el-row><el-input placeholder="分销商姓名" v-model="ruleForm.pName"></el-input></el-row></el-col>
        </el-row>
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">PSM姓名:</el-row><el-row><el-input placeholder="PSM姓名" v-model="ruleForm.name"></el-input></el-row></el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">区域:</el-row>
                <el-row>
                    <el-select placeholder="选择区域" v-model="ruleForm.pCitregionoffice" @change="choseArea" class="handle-select">
                        <el-option
                          v-for="item in area"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">省办:</el-row>
                <el-row>
                    <el-select placeholder="选择省办" v-model="ruleForm.pCitprovincialoffice" class="handle-select">
                        <el-option
                          v-for="item in province"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">城市:</el-row>
                <el-row><el-input placeholder="城市" v-model="ruleForm.pCityno"></el-input></el-row>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :push="0"><el-row class="mb10">日期:</el-row>
            <el-row>
              <el-date-picker
                v-model="ruleForm.date"
                type="month"
                placeholder="选择日期"
                @change="pickTime"
                value-format="yyyy-MM" style="width:170px;">
              </el-date-picker>
            </el-row>
          </el-col>
          <el-col :span="11" :push="2"><el-row class="mb10">是否离职:</el-row>
              <el-row>
                <el-radio v-model="ruleForm.isDimission" label="1">是</el-radio>
                <el-radio v-model="ruleForm.isDimission" label="0">否</el-radio>
              </el-row>
          </el-col>
        </el-row>
        <el-row class="height-search">
          <el-col :span="24">
            <el-button size="mini" type="" @click="resetSearch">重置</el-button>
            <el-button size="mini" type="primary" @click="search">开始检索</el-button>
          </el-col>
        </el-row>
        </el-popover>
      </div>
      <div class="export-box">
          <el-row>
              <el-col :span="12">
                <el-button style="float:left;margin-right:10px;" size="mini" type="success" @click="addPsm">添加PSM</el-button>
                <el-upload
                    action=""
                    style="float:left;margin-right:10px;"
                    :show-file-list="false"
                    :multiple="true"
                    :httpRequest="uploadfile"
                    class="psmUp">
                    <el-button icon="el-icon-upload2" size="mini" type="success" v-if="isBatchInsert">批量导入</el-button>
                </el-upload>
                <el-button size="mini" @click="$util.winOpen('static/useJs/doc/PSMBaseInfo.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
                （当前月份：{{nowMonth}}月）  
              </el-col>
              <el-col :span="12" class="text-r">
                  <el-button size="mini" type="danger" @click="remove(1)" :disabled="!multipleSelection2.length" v-if="isBatchDelete">批量删除PSM人员</el-button>
                  <el-button size="mini" type="danger" @click="remove(2)" :disabled="!multipleSelection.length" v-if="isBatchDelete">批量删除PSM薪酬</el-button>
                  <el-button size="mini" type="success" @click="dialogVisible = true">重置分销商密码</el-button>
                  <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出数据</el-button>
                  <el-dialog class="text-l"
                    title="修改密码"
                    :visible.sync="dialogVisible"
                    width="30%">
                    <el-form ref="form" :model="dbform" :rules="dbrules" label-width="30%" size="small">
                      <el-form-item label="分销商编号：" required prop="clientId">
                        <el-input v-model="dbform.clientId" placeholder="请输入分销商编号" style="width:90%;"></el-input>
                      </el-form-item>
                      <el-form-item label="新密码：" required prop="newPassword">
                        <el-input type="password" onkeypress="return event.keyCode>=48&&event.keyCode<=57" v-model="dbform.newPassword" placeholder="请输入密码" style="width:90%;"></el-input>
                      </el-form-item>
                      <el-form-item label="确认密码：" required prop="dbNewPswCek">
                        <el-input type="password" onkeypress="return event.keyCode>=48&&event.keyCode<=57" v-model="dbform.dbNewPswCek" placeholder="请输入密码" style="width:90%;"></el-input>
                      </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="onClose()">取 消</el-button>
                      <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
                    </span>
                  </el-dialog>
              </el-col>
          </el-row>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <!--<el-table-column align="center" type="index" label="序号" width="50"></el-table-column>-->
        <el-table-column align="center" prop="regionName" label="区域" width="80" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column align="center" prop="provinceName" label="省办" width="80"></el-table-column>
        <el-table-column align="center" prop="pCityno" label="城市" width="80"></el-table-column>
        <el-table-column align="center" prop="pUid" label="分销商编号" width="100">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="分销商编号" v-model.trim="scope.row.pUid" v-if='!scope.row.id'></el-input>
            <span v-else>{{scope.row.pUid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="pName" label="分销商姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="name" label="PSM姓名" width="100">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="PSM姓名" v-model.trim="scope.row.name" v-if='!scope.row.id'></el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="birth" label="出生年月" width="140" sortable>
          <template slot-scope="scope">
            <el-date-picker type="month" size="mini" style="width:100%;" value-format="yyyy-MM" placeholder="出生年月" :editable="false" v-model="scope.row.birth"  v-if='!scope.row.id'></el-date-picker>
            <span v-else>{{scope.row.birth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hiredate" label="入职时间" width="145" sortable>
          <template slot-scope="scope">
            <el-date-picker type="date" size="mini" style="width:100%;" value-format="yyyy-MM-dd" placeholder="入职时间" :editable="false" v-model="scope.row.hiredate" v-if='!scope.row.id'></el-date-picker>
            <span v-else>{{scope.row.hiredate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dimission" label="离职时间" width="145" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.dimission}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phone" label="手机号码" width="120">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="手机号码" v-model.trim="scope.row.phone" v-if='!scope.row.id'></el-input>
            <span v-else>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totalSaraly" label="薪酬" width="120"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="small" @click="saveNew" v-if='!scope.row.id'>保存</el-button>
            <el-button size="small" @click="toDetail(scope.row.id,scope.row.name)" v-if='scope.row.id'>查看详情</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)" v-if='isBatchDelete && scope.row.id'>删除</el-button>
            <el-button size="small" type="danger" @click="handleQuit(scope.row.id,scope.row.dimission)" v-if='scope.row.id'>离职</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
      <el-dialog class="text-l"
        title="填写离职时间"
        :visible.sync="quitVisible"
        width="30%">
        <el-form label-width="25%" size="small">
          <el-form-item label="离职时间：">
            <el-date-picker type="date" size="mini" style="width:100%;" value-format="yyyy-MM-dd" placeholder="离职时间" :editable="false" v-model="dimission"></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onCloseQuit()">取 消</el-button>
          <el-button type="primary" @click="saveQuitTime()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'psmPersonList',
  data () {
    return {
      dbform: {
        clientId: '',
        newPassword: '',
        dbNewPswCek: ''
      },
      dbrules: {
        clientId: [
          { required: true, message: '请输入分销商编号', trigger: 'blur' },
          { min: 5, max: 6, message: '分销商编号为5到6位阿拉伯数字', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 6, message: '密码为6位阿拉伯数字', trigger: 'blur' }
        ],
        dbNewPswCek: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 6, message: '密码为6位阿拉伯数字', trigger: 'blur' }
        ]
      },
      area: [],
      province: [],
      loading: false,
      uploadUrl: '',
      dialogVisible: false,
      quitVisible: false,
      tableData: [],
      addData: {
        birth: '',
        date: '',
        fmsEmployee: '',
        hiredate: '',
        id: '',
        isDelete: '',
        name: '',
        pCitprovincialoffice: '',
        pCitregionoffice: '',
        pCityno: '',
        pName: '',
        pUid: '',
        pagingQuery: '',
        phone: '',
        provinceName: '',
        regionName: '',
        saralyId: '',
        totalSaraly: '',
        updateby: '',
        updatetime: ''
      },
      tableLoading: false,
      ruleForm: {
        name: '',
        pUid: '',
        pName: '',
        pCitregionoffice: '',
        pCitprovincialoffice: '',
        pCityno: '',
        date: '',
        isDimission: '',
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      multipleSelection: [],
      multipleSelection2: [],
      nowMonth: '',
      dimissionId: '',
      dimission: '',
      isBatchDelete: '',
      isBatchInsert: ''
    }
  },
  methods: {
    handleQuit (id, dimission) {
      this.quitVisible = true
      this.dimissionId = id
      this.dimission = dimission
    },
    onCloseQuit () {
      this.quitVisible = false
    },
    saveQuitTime () {
      const thiz = this
      thiz.$tupHttp(thiz, 'psm/user/dimission', 'POST', { id: thiz.dimissionId, dimission: thiz.dimission }).then(res => {
        this.$message.success('保存成功')
        this.quitVisible = false
        thiz._getData()
      })
    },
    addPsm () {
      let data = Object.assign({}, JSON.parse(JSON.stringify(this.addData)))
      this.tableData.unshift(data)
    },
    saveNew () {
      let thiz = this
      let arr = []
      arr.push({
        pUid: thiz.tableData[0].pUid,
        name: thiz.tableData[0].name,
        birth: thiz.tableData[0].birth,
        hiredate: thiz.tableData[0].hiredate,
        phone: thiz.tableData[0].phone,
        pagingQuery: thiz.ruleForm.pagingQuery
      })
      if (thiz.tableData[0].pUid === '') {
        this.$message.error('请输入分销商编号')
        return false
      }
      if (thiz.tableData[0].name === '') {
        this.$message.error('请输入PSM姓名')
        return false
      }
      if (thiz.tableData[0].birth === '') {
        this.$message.error('请选择出生年月')
        return false
      }
      if (thiz.tableData[0].hiredate === '') {
        this.$message.error('请选择入职时间')
        return false
      }
      if (thiz.tableData[0].phone === '') {
        this.$message.error('请输入手机号码')
        return false
      }
      thiz.$tupHttp(thiz, 'psm/user/batchInsert', 'POST', {voList: arr}).then(res => {
        this._getData()
        thiz.$notify.success({
          title: '成功提示',
          message: '保存成功'
        })
      }, res => {
      })
    },
    getDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      return year + '-' + month
    },
    pickTime (val) {
      this.ruleForm.date = val + '-01'
    },
    handleSelectionChange (val) {
      this.multipleSelection = val.filter(item => {
        return item.saralyId
      }).map(item => {
        return item.saralyId
      }) // 去除没有saralyId的记录
      this.multipleSelection2 = val.filter(item => {
        return item.id
      }).map(item => {
        return item.id
      })
    },
    remove (type) {
      let thiz = this
      thiz.loading = true
      let info = ''
      let url = ''
      let data = {}
      if (type === 2) {
        info = '是否确认批量删除PSM薪酬?'
        url = 'psm/saraly/batchDelete'
        data = {idList: this.multipleSelection}
      } else {
        info = '是否确认批量删除PSM人员?'
        url = 'psm/user/batchDelete'
        data = {idList: this.multipleSelection2}
      }
      this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        thiz.$tupHttp(thiz, url, 'POST', data).then(res => {
          thiz.loading = false
          thiz._getData()
        }, res => {
          thiz.loading = false
        })
      }).catch(() => {
        thiz.loading = false
      })
    },
    uploadfile (option) {
      this.$util.readExcel(option.file, this.treatDatas)
    },
    treatDatas (datas, file) {
      let arr = []
      for (let i = 1; i < datas.sheet0.length; i++) {
        arr.push({
          pUid: datas.sheet0[i][0],
          name: datas.sheet0[i][1],
          birth: datas.sheet0[i][2],
          hiredate: datas.sheet0[i][3],
          phone: datas.sheet0[i][4],
          pagingQuery: this.ruleForm.pagingQuery
        })
      }
      let thiz = this
      this.loading = true

      thiz.$tupHttp(thiz, 'psm/user/batchInsert', 'POST', {voList: arr}).then(res => {
        this._getData()
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '成功导入'
        })
      }, res => {
        thiz.loading = false
      })
    },
    checkSearch () {
      this.ruleForm.pUid = ''
      this.ruleForm.pName = ''
      this.ruleForm.pCitregionoffice = ''
      this.province = []
      this.ruleForm.pCitprovincialoffice = ''
      this.ruleForm.pCityno = ''
      this._getData()
    },
    search () {
      this._getData()
    },
    resetSearch () {
      this.ruleForm.name = ''
      this.ruleForm.pUid = ''
      this.ruleForm.pName = ''
      this.ruleForm.pCitregionoffice = ''
      this.province = []
      this.ruleForm.pCitprovincialoffice = ''
      this.ruleForm.pCityno = ''
      this.ruleForm.date = this.getDate() + '-01'
    },
    toDetail (id, name) {
      this.$router.push({
        path: '/frame/psm/psmPersonDetail',
        query: {
          id: id,
          name: name
        }
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$tupHttp(thiz, 'psm/user/delete', 'POST', { id: id }).then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
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
      thiz.$tupHttp(thiz, 'psm/user/export', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    // 获取列表数据
    _getData () {
      this.tableLoading = true
      this.$tupHttp(this, 'psm/user/getByCondition', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          if (item.hiredate) {
            item.hiredate = item.hiredate.substring(0, 10)
          }
          if (item.dimission) {
            item.dimission = item.dimission.substring(0, 10)
          }
        })
        this.tableData = res.data.models
        this.nowMonth = new Date(this.ruleForm.date).getMonth() + 1
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    // 获取区域数据
    _getAreaData () {
      this.$hsyHttp(this, '/backend/area/regions', 'GET').then(res => {
        this.area = res.data.models
      })
    },
    // 获取省办数据
    _getProvinceData (regionCode) {
      this.$hsyHttp(this, '/backend/area/provinces/' + regionCode, 'GET').then(res => {
        this.province = res.data.models
      })
    },
    // 选区域
    choseArea (e) {
      this.ruleForm.pCitprovincialoffice = ''
      this._getProvinceData(e)
    },
    onSubmit (form) {
      let thiz = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (thiz.dbform.newPassword !== thiz.dbform.dbNewPswCek) {
            thiz.$notify.error({
              title: '错误提示',
              message: '密码不一致'
            })
            return false
          }
          thiz.loading = true
          thiz.$tupHttp(this, 'psm/saraly/updatePassword?clientId=' + this.dbform.clientId + '&newPassword=' + this.dbform.newPassword, 'GET').then(res => {
            thiz.loading = false

            thiz.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            thiz.$router.push({
              path: '/frame/psm/psmPersonList'
            })
          }, res => {
            thiz.loading = false
          })
        }
      })
    },
    onClose () {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    }
  },
  created () {
    this.isBatchDelete = JSON.parse(localStorage.getItem('power'))['backend.psm.user.batchDelete']
    this.isBatchInsert = JSON.parse(localStorage.getItem('power'))['backend.psm.user.batchInsert']
    this.ruleForm.date = this.getDate() + '-01'
    this.nowMonth = new Date(this.ruleForm.date).getMonth() + 1
    this._getData()
    this._getAreaData()
  },
  computed: {
    dialogVis () {
      return this.dialogVisible
    }
  },
  watch: {
    dialogVis (newValue, oldValue) {
      if (!newValue) {
        this.$refs['form'].resetFields()
      }
    }
  }
}
</script>

<style lang="scss">
.mb10{
    margin-bottom: 10px;
}
.psmUp .el-upload__input{display:none!important;}
.text-l{text-align:left;}
.text-r{text-align:right;}
.el-upload--text {
    border: none;
    width:auto;
    height:auto;
}
input[type=file] {
    display: none;
}
.height-search{margin-top:10px;padding-top:10px;border-top:1px solid #eee;text-align:right;}
.psm-list {
  padding: 30px 0 30px 30px;
}
.psm-list .handle-box {
    margin-bottom: 20px;
}
.psm-list .handle-box .publish-btn {
      float: right;
}
.psm-list .psmcontainer {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.psm-list .crumbs {
    margin-bottom: 20px;
}
.psm-list .pagination {
    margin: 20px 0;
    text-align: right;
    display: block;
}
.psm-list .title {
    color: #ff7000;
    cursor: pointer;
}
.psm-list .title-header {
    color: #909399;
}
.psm-list {
  .handle-box {
    margin-bottom: 10px;
    .publish-btn {
      float: right;
    }
  }

  .handle-input {
    width: 150px;
  }

  .export-box{border-top:1px solid #eee;padding-top:10px;margin-bottom:10px;}
  
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center
  }

  .title{
    color: #409EFF;
    cursor: pointer;
  }

  .title-header {
    color: #909399;
  }
}
</style>
