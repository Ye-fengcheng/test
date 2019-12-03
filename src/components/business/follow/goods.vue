<template>
  <div>
    <el-form :model="additionalOrderDTO" label-width="120px" class="demo-form-inline" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="财务月份">
            <el-date-picker v-model="yearMonthNo" type="month" format="yyyyMM"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-popover placement="right-start" title="产品明细功能说明：" width="400" trigger="hover">
            <p>功能说明：</p>
            <p>1.用途：每月下单期间，可按客户进行查询和导出当月客户的意向订购产品和已订购产品的名称、数量及金额统计，以便于跟进客户下单情况；</p>
            <p>2.使用用户：DFS、DM、PSA、区域职能人员</p>
            <p>名词解释：</p>
            <p>1.意向订购数量：是指客户放入购物车（草稿）的产品数量，按销售口径取SKU数；</p>
            <p>2.已订购数量：是指客户已下订单的产品数量，按销售口径取SKU数；</p>
            <p>3.草稿是指客户将产品放入购物车</p>
            <p>备注：</p>
            <p style="color: red;">1.报表数据每隔10分钟更新1次。如：客户下单10分钟后可在此查询到。</p>
            <div class="tips" slot="reference">?</div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="区域">
            <tup-arae-select type="area" v-model="areaObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="分销商编码">
            <el-input v-model="additionalOrderDTO.sDbStr" placeholder="分销商编码"></el-input>
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
          <el-form-item label="产品编码">
            <el-input v-model="additionalOrderDTO.itemNo" placeholder="产品编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="additionalOrderDTO.itemName" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button type="primary" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-if="tableData"
    v-loading="tableLoading" 
    style="width: 100%;"
    highlight-current-row 
    :default-sort="{prop: 'itemNo', order: 'descending'}"
    show-summary
    :summary-method="setSummary" >
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
      <el-table-column prop="itemNo" label="产品编码" width="90">
      </el-table-column>
      <el-table-column prop="itemName" label="产品" show-overflow-tooltip sortable width="150">
      </el-table-column>
      <el-table-column label="草稿" align="center">
        <el-table-column prop="cQty" label="意向订购数量" width="95"></el-table-column>
        <el-table-column prop="cAmt" label="订单零售价" width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="客户已提交" align="center">
        <el-table-column prop="oQty" label="已订购数量" width="90"></el-table-column>
        <el-table-column prop="oAmt" label="优惠后零售金额" width="110"></el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column prop="totalQty" label="订购数量" width="80"></el-table-column>
        <el-table-column prop="totalAmt" label="金额" width="110"></el-table-column>
      </el-table-column>
    </el-table>
    <div style="text-align:right;margin-top:15px;">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNo" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
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
      areaObject:[],
      type: '',
      province: '',
      loading: false,
      tableLoading: false,
      additionalOrderDTO: {
        yearMonthNo: '',
        sProvince: [],
        sRegion: [],
        sDbStr: '',
        dbName: '',
        organNo: '',
        organName: '',
        itemNo: '',
        itemName: '',
        dmNo: '',
        fsNo: ''
      },
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      totalData: {}
    }
  },
  watch: {
    provinceObject (val, oldVal) {
      let datas = []
      val.map(item => {
        if (item.code != '999') {
          datas.push(item.code)
        }
      })
      this.additionalOrderDTO.sProvince = datas
    },
    areaObject (val) {
      let datas = []
      val.map(item => {
        if(item.code != '999')
          datas.push(item.code)
      })
      this.additionalOrderDTO.sRegion = datas
    }
  },
  methods: {
    format(num){
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
      this.loadData();
    },
    setSummary (param) {
      const sums = []
      if (this.totalData === null || !this.totalData.hasOwnProperty('cQty')) {
        return sums
      }
      param.columns.forEach((column, index) => {
        switch (column.property) {
          case 'itemName':
            sums[index] = '所有合计'
            break
          case 'cQty':
            sums[index] = this.totalData.cQty
            break
          case 'cAmt':
            sums[index] = this.format(this.totalData.cAmt)
            break
          case 'oQty':
            sums[index] = this.totalData.oQty
            break
          case 'oAmt':
            sums[index] = this.format(this.totalData.oAmt)
            break
          case 'totalQty':
            sums[index] = this.totalData.totalQty
            break
          case 'totalAmt':
            sums[index] = this.format(this.totalData.totalAmt)
            break
          default:
            sums[index] = ''
        }
      })
      return sums
    },
    downLoad () {
      let thiz = this
      thiz.loading = true
      thiz.additionalOrderDTO.yearMonthNo = new Date(this.yearMonthNo).format("yyyyMM")
      // thiz.additionalOrderDTO.regionNo = this.type === 'region' ? this.province : ''
      // thiz.additionalOrderDTO.provinceNo = this.type === 'province' ? this.province : ''
      let data = thiz.$util.deepClone(thiz.additionalOrderDTO)
      thiz.$tupHttp(thiz, 'additionalOrder/exportAnlCartTrackerExcel', 'POST', data, {Accept: '*/*'}, '', true).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    loadData(isSearch) {
      let thiz = this
      thiz.tableLoading = true
      if (isSearch) {
        thiz.pageNo = 1 // 重置为第一页
      }
      this.additionalOrderDTO.yearMonthNo = new Date(this.yearMonthNo).format("yyyyMM")
      // this.additionalOrderDTO.regionNo = this.type === 'region' ? this.province : ''
      // this.additionalOrderDTO.provinceNo = this.type === 'province' ? this.province : ''

      this.$tupHttp(this, 'additionalOrder/getAdditionalOrder2?pageNo=' + thiz.pageNo + '&pageSize=' + thiz.pageSize, 'POST', this.additionalOrderDTO).then(res => {
        if (res.body.models.length) {
          thiz.tableData = res.body.models.map(item => {
            item.updateDatetime = new Date(item.updateDatetime).format("yyyy-MM-dd hh:mm")
            item.cAmt = this.format(item.cAmt)
            item.oAmt = this.format(item.oAmt)
            item.totalAmt = this.format(item.totalAmt)
            return item
          })
        } else {
          thiz.tableData = res.body.models
        }
        thiz.totalData = res.body.extra
        thiz.tableLoading = false
        thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0
      }, res => {
        thiz.tableLoading = false
      })
    },
    initData() {
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
    }
  },
  mounted() {
    // this.initData()
  }
}
</script>
<style>
.demo-form-inline {
  margin-bottom: 10px;
  padding: 25px 25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
.el-table thead.is-group th {
  background-color: #fff !important;
}
.el-table__footer-wrapper .cell{
  font-weight: bold;
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
</style>

