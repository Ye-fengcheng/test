<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 预约记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="handle-box">
        <div class="handle-til clearfix">
          <span>数据筛选</span>
        </div>
        <el-form label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
            <el-col :span="8">
            <el-form-item label="省份">
                <el-select size="mini" placeholder="选择省份" v-model="provinceName" @change="choseArea" class="handle-select">
                    <el-option
                        v-for="item in area"
                        :key="item.index"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="城市">            
                <el-select size="mini" placeholder="选择城市" v-model="cityName" class="handle-select">
                    <el-option
                        v-for="item in province"
                        :key="item.index"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="分销商">
                <el-row><el-input size="mini" placeholder="请输入分销商编号/名称" v-model="ruleForm.condition.distributorName"></el-input></el-row>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">
            <el-form-item label="服务专卖店">
                <el-input v-model="ruleForm.condition.storeKeyword" size="mini" placeholder="专卖店编号/名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="会员">            
                <el-input v-model="ruleForm.condition.memberKeyword" size="mini"  placeholder="会员编号/名称/手机号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="预约时间">
                <el-date-picker
                style="width:100%"
                v-model="promotionDate"
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
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="活动时间">
                <el-date-picker
                style="width:100%"
                v-model="activityDate"
                size="mini"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item> 
            </el-col>
            <el-col :span="8">    
            <el-form-item label="活动名称">
              <el-select size="mini" placeholder="活动名称" v-model="ruleForm.condition.title" style="width:100%;">
                <el-option
                    v-for="item in activityList"
                    :key="item.index"
                    :label="item.title"
                    :value="item.title">
                </el-option>
              </el-select>
            </el-form-item>     
            </el-col>  
        </el-row>   
        <el-form-item>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="_getData(true)">查询</el-button>
            <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="provinceName" label="省份" width="80"></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市" width="80"></el-table-column>
        <el-table-column align="center" prop="distributorName" label="分销商" width="80"></el-table-column>
        <el-table-column align="center" prop="storeCode" label="专卖店新编" width="100"></el-table-column>
        <el-table-column align="center" prop="memberName" label="姓名" width="140"></el-table-column>
        <el-table-column align="center" prop="memberMobile" label="客户手机号" width="140"></el-table-column>
        <el-table-column align="center" prop="enrollDate" label="报名时间" width="140"></el-table-column>
        <el-table-column align="center" prop="enrollNum" label="参加人数" width="120"></el-table-column>
        <el-table-column align="center" prop="title" label="参与活动名称" width="120"></el-table-column>
        <el-table-column align="center" prop="sessionDate" label="参与场次" width="140"></el-table-column>
        <el-table-column align="center" prop="intention" label="内容选择" width="120"></el-table-column>
        <el-table-column align="center" prop="status" label="活动状态" width="120"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page="ruleForm.pagingQuery.pageIndex" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
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
      promotionDate: [],
      activityDate: [],
      area: [],
      province: [],
      provinceList: [],
      activityList: [],
      loading: false,
      cityName: '',
      provinceName: '',
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          distributorName: '',
          enrollDateBegin: '',
          enrollDateEnd: '',
          memberKeyword: '',
          promoDateBegin: '',
          promoDateEnd: '',
          cityName: '',
          provinceName: '',
          storeKeyword: '',
          title: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      ruleFormAct: {
        condition: {
          title: '',
          status: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 999
        }
      }
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
    search () {
      this._getData()
    },
    resetSearch () {
      this.cityName = ''
      this.provinceName = ''
      this.ruleForm.condition.distributorName = ''
      this.ruleForm.condition.cityName = ''
      this.ruleForm.condition.provinceName = ''
      this.ruleForm.condition.title = ''
      this.ruleForm.condition.storeKeyword = ''
      this.ruleForm.condition.memberKeyword = ''
      this.province = []
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    downLoad () {
      let thiz = this
      this.area.forEach(function (item) {
        if (item.value === thiz.provinceName) {
          thiz.ruleForm.condition.provinceName = item.name
        }
      })
      this.province.forEach(function (item) {
        if (item.value === thiz.cityName) {
          thiz.ruleForm.condition.cityName = item.name
        }
      })
      thiz.loading = true
      let data = thiz.$util.deepClone(thiz.ruleForm)
      // delete data.pagingQuery
      thiz.$tupHttp(thiz, 'mss/promotion-record/export', 'POST', data).then(res => {
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
    _getData (isSearch) {
      if (isSearch === true) {
        this.ruleForm.pagingQuery.pageIndex = 1
      }
      let thiz = this
      this.area.forEach(function (item) {
        if (item.value === thiz.provinceName) {
          thiz.ruleForm.condition.provinceName = item.name
        }
      })
      this.province.forEach(function (item) {
        if (item.value === thiz.cityName) {
          thiz.ruleForm.condition.cityName = item.name
        }
      })
      this.tableLoading = true
      this.$tupHttp(this, 'mss/promotion-record/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取省份数据
    _getAreaData () {
      let thiz = this
      this.$hsyHttp(this, 'https://tup-templates.oss-cn-hangzhou.aliyuncs.com/pos_promotion_province.json').then(res => {
        res.data.models.unshift({
          name: '全国',
          parent: '0',
          value: '9999999'
        }, {
          name: '全国',
          parent: '9999999',
          value: '9999998'
        })
        res.data.models.forEach(function (item) {
          if (item.parent === '0') {
            thiz.area.push(item)
          }
        })
        thiz.provinceList = res.data.models
      })
    },
    // 获取城市数据
    _getProvinceData (regionCode) {
      this.$hsyHttp(this, '/backend/area/provinces/' + regionCode, 'GET').then(res => {
        this.province = res.data.models
      })
    },
    // 选省份
    choseArea (e) {
      let thiz = this
      this.cityName = ''
      thiz.province = []
      thiz.provinceList.forEach(function (item) {
        if (item.parent === e) {
          thiz.province.push(item)
        }
      })
    },
    _getActivityList () {
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/prom/list', 'POST', this.ruleFormAct).then(res => {
        this.tableLoading = false
        this.activityList = res.data.models
      })
    }
  },
  created () {
    // this._getData()
    this._getAreaData()
    this._getActivityList()
  },
  watch: {
    'promotionDate': function (val) {
      if (!val) {
        this.ruleForm.condition.enrollDateBegin = ''
        this.ruleForm.condition.enrollDateEnd = ''
      } else {
        this.ruleForm.condition.enrollDateBegin = val[0]
        this.ruleForm.condition.enrollDateEnd = val[1]
      }
    },
    'activityDate': function (val) {
      if (!val) {
        this.ruleForm.condition.promoDateBegin = ''
        this.ruleForm.condition.promoDateEnd = ''
      } else {
        this.ruleForm.condition.promoDateBegin = val[0]
        this.ruleForm.condition.promoDateEnd = val[1]
      }
    }
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
.handle-select{width:100%;}
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
