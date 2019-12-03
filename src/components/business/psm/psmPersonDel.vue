<template>
  <div class="table psm-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> PSM删除历史</el-breadcrumb-item>
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
                value-format="yyyy-MM">
              </el-date-picker>
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
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="regionName" label="区域" width="80" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column align="center" prop="provinceName" label="省办" width="80"></el-table-column>
        <el-table-column align="center" prop="pCityno" label="城市" width="80"></el-table-column>
        <el-table-column align="center" prop="pUid" label="分销商编号" width="100"></el-table-column>
        <el-table-column align="center" prop="pName" label="分销商姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="name" label="PSM姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="birth" label="出生年月" width="140" sortable></el-table-column>
        <el-table-column align="center" prop="hiredate" label="入职时间" width="143" sortable></el-table-column>
        <el-table-column align="center" prop="dimission" label="离职时间" width="120"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号码" width="120"></el-table-column>
        <el-table-column align="center" prop="totalSaraly" label="薪酬" width="120"></el-table-column>
        <el-table-column align="center" prop="updateby" label="删除人员" width="90"></el-table-column>
        <el-table-column align="center" prop="updatetime" label="删除时间" width="90"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
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
      tableData: [],
      tableLoading: false,
      ruleForm: {
        name: '',
        pUid: '',
        pName: '',
        pCitregionoffice: '',
        pCitprovincialoffice: '',
        pCityno: '',
        date: '',
        isDelete: 1,
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      multipleSelection: [],
      nowMonth: ''
    }
  },
  methods: {
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
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
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
          if (item.updatetime) {
            item.updatetime = new Date(item.updatetime).format('yyyy-MM-dd hh:mm:ss')
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
    }
  },
  created () {
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
