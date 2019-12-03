<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="跟单订单明细" name="list">
            <el-form :model="additionalOrderDTO" label-width="120px" class="demo-form-inline" size="mini">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="财务月份">
                    <el-date-picker v-model="yearMonthNo" type="month" format="yyyyMM"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="地区">
                    <tup-arae-select v-model="provinceObject" :code="code" :codeType="codeType"></tup-arae-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-popover placement="right-start" title="订单明细功能说明：" width="400" trigger="hover">
                    <p>功能说明：</p>
                    <p>1.用途：每月下单期间，可按客户进行查询和导出当月客户的意向订购品和已订购产品的金额统计，以便于跟进客户下单情况；</p>
                    <p>2.使用用户：DFS、DM、PSA、区域职能人员</p>
                    <p>名词解释：</p>
                    <p>1.草稿是指客户将产品放入购物车</p>
                    <p>备注：</p>
                    <p style="color: red;">1.报表数据每隔10分钟更新1次。如：客户下单10分钟后可在此查询到。</p>
                    <div class="tips" slot="reference">?</div>
                  </el-popover>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="分销商编码">
                    <el-input v-model="additionalOrderDTO.dbNo" placeholder="分销商编码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="分销商名称">
                    <el-input v-model="additionalOrderDTO.dbName" placeholder="分销商名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="专卖店编码">
                    <el-input v-model="additionalOrderDTO.organNo" placeholder="专卖店编码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="专卖店名称">
                    <el-input v-model="additionalOrderDTO.organName" placeholder="专卖店名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="订单状态">
                    <el-select v-model="orderStatus" placeholder="请选择订单状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="草稿" value=0></el-option>
                      <el-option label="客户已提交" value=1></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
                <el-button type="primary" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()">导出</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="tableData" v-loading="tableLoading" style="width: 100%;" 
            highlight-current-row :default-sort="{prop: 'createDatetime', order: 'descending'}"
            show-summary :summary-method="setSummary" @cell-click="toDetail">
              <el-table-column prop="regionName" label="区域" width="50">
              </el-table-column>
              <el-table-column prop="provinceName" label="省办" width="70">
              </el-table-column>
              <el-table-column prop="dbNo" label="分销商编码" width="65">
              </el-table-column>
              <el-table-column prop="dbName" label="分销商名称" width="100">
              </el-table-column>
              <el-table-column prop="organNo" label="专卖店编码" width="65">
              </el-table-column>
              <el-table-column prop="organName" label="专卖店名称" show-overflow-tooltip sortable width="140">
              </el-table-column>
              <el-table-column prop="fsName" label="FS" width="70">
              </el-table-column>
              <el-table-column prop="month" label="财务月份" width="50">
              </el-table-column>
              <el-table-column prop="orderNo" label="订单号" min-width="140" 
              label-class-name="order-header" class-name="order-no">
              </el-table-column>
              <el-table-column prop="orderType" label="订单状态" width="120">
              </el-table-column>
              <el-table-column prop="amt" label="订单金额" width="120">
              </el-table-column>
              <el-table-column prop="netAmt" label="净额" width="120">
              </el-table-column>
              <el-table-column prop="createDatetime" label="创建时间" sortable width="150">
              </el-table-column>
            </el-table>
            <div style="text-align:right;margin-top:15px;">
              <el-pagination background @current-change="handleCurrentChange" :current-page="pageNo" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="订单详情" name="detail" v-if="ifDetail && ifSuccess">
            <div class="detail-content" v-if="ifCaoGao">
              <div class="detail-item">
                <div class="detail-header">草稿信息</div>
                <el-row>
                  <el-col :span="8">订单号：{{detailData.extra.cart_no}}</el-col>
                  <el-col :span="8">客户：{{detailData.extra.organ_no}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">状态：{{detailData.extra.order_type}}</el-col>
                  <el-col :span="8">门店：{{detailData.extra.organ_name}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">区域：{{detailData.extra.region_name}}</el-col>
                  <el-col :span="8">省办：{{detailData.extra.province_name}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">总价：{{detailData.extra.p_totalprice}}</el-col>
                  <el-col :span="8">创建日期：{{detailData.extra.create_datetime}}</el-col>
                </el-row>
              </div>
              <div class="table-header">购物车明细</div>
              <el-table :data="detailData.models" style="width: auto;" highlight-current-row>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="itemName" label="产品名称" min-width="300">
                </el-table-column>
                <el-table-column prop="pQuantity" label="订货数量" width="120">
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="120">
                </el-table-column>
                <el-table-column prop="pBaseprice" label="订购单价" width="150">
                </el-table-column>
                <el-table-column prop="pTotalprice" label="总价" width="150">
                </el-table-column>
              </el-table>
            </div>
            <div class="detail-content" v-if="!ifCaoGao">
              <div class="detail-item">
                <div class="detail-header">基本信息</div>
                <el-row>
                  <el-col :span="8">订单号：{{detailData.extra.AllFmsOrderDetailInfo.sheet_no}}</el-col>
                  <el-col :span="8">门店：{{detailData.extra.AllFmsOrderDetailInfo.organ_name}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">地区：{{detailData.extra.AllFmsOrderDetailInfo.region_name}}-{{detailData.extra.AllFmsOrderDetailInfo.province_name}}</el-col>
                  <el-col :span="8">分销商：{{detailData.extra.AllFmsOrderDetailInfo.db_no}}-{{detailData.extra.AllFmsOrderDetailInfo.db_name}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">订单状态：{{detailData.extra.AllFmsOrderDetailInfo.order_status}}</el-col>
                  <el-col :span="8">创建日期：{{detailData.extra.AllFmsOrderDetailInfo.create_date}}</el-col>
                </el-row>
              </div>
              <div class="detail-item">
                <div class="detail-header">结算信息</div>
                <el-row>
                  <el-col :span="8">打折产品总金额：{{detailData.extra.selectPayInfo.discount_total_amt}}</el-col>
                  <el-col :span="8">不打折产品总金额：{{detailData.extra.selectPayInfo.no_discount_total_amt}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">打折产品应付金额：{{detailData.extra.selectPayInfo.discount_total_pay_amt}}</el-col>
                  <el-col :span="8">本单应付金额：{{detailData.extra.selectPayInfo.total_pay_amt}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">折扣率：{{detailData.extra.selectPayInfo.organ_discount}}</el-col>
                  <el-col :span="8">实际支付金额：{{detailData.extra.selectPayInfo.total_real_amt}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">净额：{{detailData.extra.selectPayInfo.total_net_amt}}</el-col>
                </el-row>
              </div>
              <div class="table-header">订单条目</div>
              <el-table :data="detailData.models" style="width: auto;" highlight-current-row>
                <el-table-column type="index" prop="regionName" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="itemName" label="产品名称" min-width="300">
                </el-table-column>
                <el-table-column prop="realQtyS" label="订货数量" width="120">
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="120">
                </el-table-column>
                <el-table-column prop="realPriceS" label="订购单价" width="150">
                </el-table-column>
                <el-table-column prop="netAmt" label="净额" width="150">
                </el-table-column>
                <el-table-column prop="amt" label="总价" width="150">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code:'',
      codeType:'',
      yearMonthNo: new Date(),
      currentPage: 1,
      total: 0,
      provinceObject: [],
      type: '',
      province: '',
      loading: false,
      tableLoading: false,
      orderStatus: '',
      additionalOrderDTO: {
        yearMonthNo: '',
        provinceNo: '',
        regionNo: '',
        dbNo: '',
        dbName: '',
        organNo: '',
        organName: '',
        orderStatus: '',
        dmNo: '',
        fsNo: ''
      },
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      totalData: {},
      activeName: 'list',
      ifDetail: false,
      ifSuccess: false,
      ifCaoGao: true,
      detailData: {}
    }
  },
  watch: {
    provinceObject: function(val, oldVal) {
      let thiz = this
      val.map(item => {
        this.province = item.code
        if(item.codeType){
          thiz.type = item.codeType
        }
        else{
          if(item.code=='00'){
            thiz.type = 'country'
          }
          else if(item.pCitparentno){
            thiz.type = 'province'
          }
          else{
            thiz.type = 'region'
          }
        }
      })
      // if (!oldVal.length) {
      //   this.loadData(true)
      // }
    }
  },
  methods: {
    format (num) {
      // debugger
      // num = !num ? 0 : num.toFixed(0)
      // let reg = /\d{1,3}(?=(\d{3})+$)/g
      // return (num + '').replace(reg, '$&,')
      num = !num ? 0 : num
      num = String(num).replace(/^(\d*)$/, "$1.")
      num = (num + "00").replace(/(\d*\.\d\d)\d*/, "$1")
      num = num.replace(".", ",")
      let re = /(\d)(\d{3},)/
      while (re.test(num)) {
        num = num.replace(re, "$1,$2")
      }
      num = num.replace(/,(\d\d)$/, ".$1")
      return num.replace(/^\./, "0.")
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.loadData()
    },
    setSummary (param) {
      const sums = []
      if (this.totalData === null || !this.totalData.hasOwnProperty('amt')) {
        return sums
      }
      param.columns.forEach((column, index) => {
        switch (column.property) {
          case 'orderType':
            sums[index] = '所有合计'
            break
          case 'amt':
            sums[index] = this.format(this.totalData.amt)
            break
          case 'netAmt':
            sums[index] = this.format(this.totalData.net_amt)
            break
          default:
            sums[index] = ''
        }
      })
      return sums
    },
    toDetail (row, column) {
      if (column.property !== 'orderNo') {
        return
      }
      if (!this.ifDetail) {
        this.ifDetail = true
      }
      this.ifCaoGao = row.orderType === '草稿' ? true : false
      this.ifSuccess = false
      this._getDetail({
        orderNo: row.orderNo, 
        orderType: row.orderType
      })
    },
    downLoad (){        
      let thiz = this
      thiz.loading = true
      thiz.additionalOrderDTO.yearMonthNo = new Date(this.yearMonthNo).format("yyyyMM")
      thiz.additionalOrderDTO.regionNo = this.type === 'region' ? this.province : ''
      thiz.additionalOrderDTO.provinceNo = this.type === 'province' ? this.province : ''
      thiz.additionalOrderDTO.orderStatus = this.orderStatus === '0' ? 0 : this.orderStatus === '1' ? 1 : ''

      let data = thiz.$util.deepClone(thiz.additionalOrderDTO)
      thiz.$tupHttp(thiz, 'additionalOrder/exportAnlCartTrackerByOrderExcel', 'POST', data, {Accept: '*/*'}, '', true).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    loadData (isSearch) {
      let thiz = this
      thiz.tableLoading = true
      if (isSearch) {
        thiz.pageNo = 1 // 重置为第一页
      }
      this.additionalOrderDTO.yearMonthNo = new Date(this.yearMonthNo).format("yyyyMM")
      this.additionalOrderDTO.regionNo = this.type === 'region' ? this.province : ''
      this.additionalOrderDTO.provinceNo = this.type === 'province' ? this.province : ''
      this.additionalOrderDTO.orderStatus = this.orderStatus === '0' ? 0 : this.orderStatus === '1' ? 1 : ''

      this.$tupHttp(this, 'additionalOrder/getAdditionalOrder1?pageNo=' + thiz.pageNo + '&pageSize=' + thiz.pageSize, 'POST', this.additionalOrderDTO).then(res => {
        thiz.tableData = res.body.models.map(item => {
          item.createDatetime = new Date(item.createDatetime).format("yyyy-MM-dd hh:mm")
          item.amt = this.format(item.amt)
          item.netAmt = item.netAmt === null ? '-' : this.format(item.netAmt)
          return item
        })
        thiz.totalData = res.body.extra
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0
      }, res => {
        thiz.tableLoading = false
      })
    },
    initData () {
      if (this.$storage.getValue('provinceNo')) {
        this.code = this.$storage.getValue('provinceNo')
        this.codeType = 'province'
        this.type = 'province'
        this.provinceObject = [{ code: this.code, codeType: 'province', name: this.$storage.getValue('province') }]
      } else if (this.$storage.getValue('regionNo')) {
        this.code = this.$storage.getValue('regionNo')
        this.codeType = 'region'
        this.type = 'region'
        this.provinceObject = [{ code: this.code, codeType: 'region', name: this.$storage.getValue('region') }]
      } else {
        this.code = '00'
        this.codeType = 'country'
        this.type = 'country'
        this.provinceObject = [{ code: this.code, codeType: 'country', name: '全国' }]
      }
      this.additionalOrderDTO.dmNo = this.$storage.getValue('pDmCode')
      this.additionalOrderDTO.fsNo = this.$storage.getValue('pFscode')
    },
    _getDetail (row) {
      this.$tupHttp(this, 'additionalOrder/getOrderDetail?orderNo=' + row.orderNo + '&orderType=' + row.orderType + '&yearMonthNo=' + this.additionalOrderDTO.yearMonthNo, 'POST').then(res => {
        this.activeName = 'detail'
        this.detailData = res.data
        if (this.ifCaoGao) {
          this.detailData.extra.p_totalprice = this.format(res.data.extra.p_totalprice)
          this.detailData.extra.create_datetime = new Date(res.data.extra.create_datetime).format("yyyy-MM-dd hh:mm:ss")
          for (let i = 0; i < this.detailData.models.length; i++) {
            this.detailData.models[i].itemName = this.detailData.models[i].itemNo + ' - ' + this.detailData.models[i].itemName
            this.detailData.models[i].pTotalprice = this.format(this.detailData.models[i].pTotalprice)
            this.detailData.models[i].pBaseprice = this.format(this.detailData.models[i].pBaseprice)
          }
        } else {
          for (let i = 0; i < this.detailData.models.length; i++) {
            this.detailData.models[i].itemName = this.detailData.models[i].itemNo + ' - ' + this.detailData.models[i].itemName
            this.detailData.models[i].realPriceS = this.format(this.detailData.models[i].realPriceS)
            this.detailData.models[i].amt = this.format(this.detailData.models[i].amt)
            this.detailData.models[i].netAmt = this.format(this.detailData.models[i].netAmt)
          }
          this.detailData.extra.AllFmsOrderDetailInfo.create_date = new Date(res.data.extra.AllFmsOrderDetailInfo.create_date).format("yyyy-MM-dd hh:mm:ss")
          this.detailData.extra.selectPayInfo.discount_total_amt = this.format(this.detailData.extra.selectPayInfo.discount_total_amt)
          this.detailData.extra.selectPayInfo.discount_total_pay_amt = this.format(this.detailData.extra.selectPayInfo.discount_total_pay_amt)
          this.detailData.extra.selectPayInfo.no_discount_total_amt = this.format(this.detailData.extra.selectPayInfo.no_discount_total_amt)
          this.detailData.extra.selectPayInfo.organ_discount = this.format(this.detailData.extra.selectPayInfo.organ_discount)
          this.detailData.extra.selectPayInfo.total_pay_amt = this.format(this.detailData.extra.selectPayInfo.total_pay_amt)
          this.detailData.extra.selectPayInfo.total_real_amt = this.format(this.detailData.extra.selectPayInfo.total_real_amt)
          this.detailData.extra.selectPayInfo.total_net_amt = this.format(this.detailData.extra.selectPayInfo.total_net_amt)
          this.detailData.extra.selectPayInfo.organ_discount = this.detailData.extra.selectPayInfo.organ_discount / 100
        }
        this.ifSuccess = true
      })
    }
  },
  mounted() {
    this.initData()
  }
}
</script>
<style>
.demo-form-inline {
  margin-bottom: 10px;
  padding: 25px 25px 0px;
  border-radius: 4px;
}
.order-header {
  color: #909399;
}
.order-no {
  color: #4b7cf1;
  cursor: pointer;
}
.detail-content {
  padding: 20px 30px 0;
  margin-bottom: 40px;
}
.detail-content .el-row {
  margin-bottom: 15px;
}
.detail-item {
  border: 1px solid #ff70004d;
  padding: 20px 20px 0;
  margin-bottom: 20px;
  position: relative;
  background-color: #fff;
}
.detail-item .detail-header {
  position: absolute;
  top: -10px;
  background-color: #f8f8f8;
  padding: 0 10px;
}
.table-header {
  margin: -5px 0 10px 5px;
}
.tips {
  width: 28px;
  height: 28px;
  float: right;
  margin-top: 5px;
  border-radius: 50%;
  color: #ff7000;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  border: 1px solid #ff7c24;
  background-color: #fff1e6;
}
.el-table__footer-wrapper .cell{
  font-weight: bold;
}
</style>
