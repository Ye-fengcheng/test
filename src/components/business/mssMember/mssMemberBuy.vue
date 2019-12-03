<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 购买记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="handle-box">
        <div class="handle-til clearfix">
          <span>数据筛选</span>
          <el-button type="primary" size="mini" icon="search" v-popover:popover1 class="publish-btn">高级检索</el-button>
        </div>
        <el-popover
            ref="popover1"
            placement="bottom-end"
            width="400"
            trigger="click">
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">区域:</el-row>
                <el-row>
                    <el-select placeholder="选择区域" v-model="ruleForm.condition.regionCode" @change="choseArea" class="handle-select">
                        <el-option
                          v-for="item in area"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">省办:</el-row>
                <el-row>
                    <el-select placeholder="选择省办" v-model="ruleForm.condition.provinceCode" class="handle-select">
                        <el-option
                          v-for="item in province"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="11" :push="0"><el-row class="mb10">分销商:</el-row>
            <el-row><el-input placeholder="请输入分销商编号/名称" v-model="ruleForm.condition.distributorKeyword"></el-input></el-row>
          </el-col>
          <el-col :span="11" :push="2"><el-row class="mb10">使用专卖店状态:</el-row>
            <el-row>
              <el-select placeholder="使用专卖店状态" style="width:100%;" v-model="ruleForm.condition.status">
                <el-option key="" label="请选择" value=""></el-option>
                <el-option key="1" label="使用中" value="1"></el-option>
                <el-option key="0" label="停用" value="0"></el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="height-search">
          <el-col :span="24">
            <el-button size="mini" type="" @click="resetSearch">重置</el-button>
            <el-button size="mini" type="primary" @click="_getData(false, true)" :loading="tableLoading">开始检索</el-button>
          </el-col>
        </el-row>
        </el-popover>
        <el-form label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
            <el-col :span="8">
            <el-form-item label="使用专卖店">
                <el-input v-model="ruleForm.condition.storeKeyword" size="mini" placeholder="专卖店编号/名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="会员">            
                <el-input v-model="ruleForm.condition.memberKeyword" size="mini"  placeholder="会员编号/名称/手机号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="产品编码">
                <el-input v-model="ruleForm.condition.productCode" size="mini" placeholder="产品编码"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="产品唯一码">
                <el-input v-model="ruleForm.condition.uniqueCode" size="mini" placeholder="产品唯一码"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">    
            <el-form-item label="单价">
                <el-input v-model="ruleForm.condition.priceBegin" size="mini" placeholder="请输入金额" style="width:49%"></el-input>
                <el-input v-model="ruleForm.condition.priceEnd" size="mini" placeholder="请输入金额" style="width:49%"></el-input>
            </el-form-item>     
            </el-col>  
            <el-col :span="8">    
            <el-form-item label="购买时间">
                <el-date-picker
                style="width:100%"
                v-model="buyDate"
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
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="_getData(true, true)">查询</el-button>
            <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberCode" label="会员编码" width="80"></el-table-column>
        <el-table-column align="center" prop="memberName" label="姓名" width="80"></el-table-column>
        <el-table-column align="center" prop="uniqueCode" label="产品唯一码" width="120"></el-table-column>
        <el-table-column align="center" prop="productCode" label="产品编码" width="100"></el-table-column>
        <el-table-column align="center" prop="productName" label="产品名称" width="100"></el-table-column>
        <el-table-column align="center" prop="couponId" label="使用优惠券ID" width="120"></el-table-column>
        <el-table-column align="center" prop="price" label="单价" width="140"></el-table-column>
        <el-table-column align="center" prop="quantity" label="数量" width="145"></el-table-column>
        <el-table-column align="center" prop="amount" label="优惠金额" width="145"></el-table-column>
        <el-table-column align="center" prop="storeCode" label="使用专卖店编号" width="120"></el-table-column>
        <el-table-column align="center" prop="storeName" label="使用专卖店名称" width="120"></el-table-column>
        <el-table-column align="center" prop="buyDate" label="购买日期" width="90"></el-table-column>
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
  name: 'mssMemberBuy',
  data () {
    return {
      buyDate: [],
      area: [],
      province: [],
      loading: false,
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          buyDateBegin: '',
          buyDateEnd: '',
          distributorKeyword: '',
          memberId: '',
          memberKeyword: '',
          priceBegin: '',
          priceEnd: '',
          productCode: '',
          provinceCode: '',
          regionCode: '',
          status: '',
          storeKeyword: '',
          uniqueCode: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0
    }
  },
  methods: {
    resetSearch () {
      this.buyDate = []
      this.ruleForm.condition.buyDateBegin = ''
      this.ruleForm.condition.uniqueCode = ''
      this.ruleForm.condition.buyDateEnd = ''
      this.ruleForm.condition.distributorKeyword = ''
      this.ruleForm.condition.memberKeyword = ''
      this.ruleForm.condition.priceBegin = ''
      this.ruleForm.condition.priceEnd = ''
      this.ruleForm.condition.productCode = ''
      this.ruleForm.condition.provinceCode = ''
      this.ruleForm.condition.regionCode = ''
      this.ruleForm.condition.status = ''
      this.ruleForm.condition.storeKeyword = ''
      this.ruleForm.condition.status = ''
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
      thiz.$tupHttp(thiz, 'mss/purchase-record/export', 'POST', data).then(res => {
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
    _getData (search, isSearch) {
      if (this.buyDate.length === 0) {
        this.$message.error('请选择购买时间')
        return
      } else if (Date.parse(new Date(this.ruleForm.condition.buyDateEnd)) - Date.parse(new Date(this.ruleForm.condition.buyDateBegin)) > 60 * 60 * 24 * 31 * 1000) {
        this.$message.error('购买时间最大范围为31天')
        return
      }
      if (search === true) {
        this.ruleForm.condition.provinceCode = ''
        this.ruleForm.condition.regionCode = ''
        this.ruleForm.condition.status = ''
        this.ruleForm.condition.distributorKeyword = ''
      }
      if (isSearch === true) {
        this.ruleForm.pagingQuery.pageIndex = 1
      }
      this.tableLoading = true
      this.$tupHttp(this, 'mss/purchase-record/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          if (item.hiredate) {
            item.hiredate = item.hiredate.substring(0, 10)
          }
          if (item.dimission) {
            item.dimission = item.dimission.substring(0, 10)
          }
          if (item.couponId === 0) {
            item.couponId = ''
          }
        })
        this.tableData = res.data.models
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
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
      this.ruleForm.condition.provinceCode = ''
      this._getProvinceData(e)
    }
  },
  created () {
    let thiz = this
    var newDate = new Date(Date.parse(new Date())).format('yyyy-MM-dd')
    var prevDate = new Date(parseInt(Date.parse(new Date()) - 60 * 60 * 24 * 30 * 1000)).format('yyyy-MM-dd')
    thiz.buyDate = [prevDate, newDate]
    setTimeout(function () {
      // thiz._getData()
    }, 500)
    // this._getData()
    this._getAreaData()
  },
  watch: {
    'buyDate': function (val) {
      if (!val) {
        this.ruleForm.condition.buyDateBegin = ''
        this.ruleForm.condition.buyDateEnd = ''
      } else {
        this.ruleForm.condition.buyDateBegin = val[0]
        this.ruleForm.condition.buyDateEnd = val[1]
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
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
