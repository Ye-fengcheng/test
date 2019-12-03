<template>
  <div class="psm-detail">
    <div class="crumbs">
      <el-row>
          <el-col :span="12">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                <i class="el-icon-tickets"></i>人员管理 > {{form.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="12" class="text-r">
              <el-date-picker
                v-model="newToday"
                type="month"
                placeholder="选择日期"
                @change="pickTime"
                value-format="yyyy-MM">
              </el-date-picker>
              <el-button size="xs" type="success" @click="downLoad">导出所有数据</el-button>
          </el-col>
      </el-row>
    </div>
    <el-container class="container" v-show="form.model">
      <el-header class="psm-detail-header"><i class="el-icon-document"></i>  {{form.date}}月 薪资合计 <span>{{form.totalSaraly}}元</span>       </el-header>
      <el-main class="psm-detail-main">
          <div class="psm-detail-list">
              <span>基本工资</span>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'#f9f9f9'}"
                :cell-style="cellStyle1">
                <el-table-column
                prop="workYears"
                label="工作年限(年)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="isAText"
                label="是否是A类（省会）城市"
                align="center">
                </el-table-column>
                <el-table-column
                prop="baseSalary"
                label="基本工资(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="changeSalaryByWorkYears"
                label="岗龄调薪(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="subsidy"
                label="补助等（或基本工资调整）(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="totalBaseSalary"
                label="基本工资合计(元)"
                align="center">
                </el-table-column>
            </el-table>
          </div>
          <div class="psm-detail-list">
              <span>业绩奖金</span>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'#f9f9f9'}"
                :cell-style="cellStyle2">
                <el-table-column
                prop="orderAmount"
                label="业绩达成（销售额）(万)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="orderTarget"
                label="业绩指标（销售额）(万)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="orderTargetRate"
                label="订单达标率(%)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="orderExtract"
                label="订单提成比例（建议8‰）(%)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="vipAmount"
                label="VIP达成(个)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="vipTarget"
                label="VIP目标(个)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="vipTargetRate"
                label="VIP达标率(%)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="totalPerformanceBonus"
                label="业绩奖金合计(元)"
                align="center">
                </el-table-column>
            </el-table>
          </div>
          <div class="psm-detail-list">
              <span>项目奖金</span>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'#f9f9f9'}"
                :cell-style="cellStyle3">
                <el-table-column
                prop="clientGrowthCount"
                label="新店成长奖数量(个)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="clientGrowthBonusByEach"
                label="新店成长奖金(元/店)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="clientGrowthBonus"
                label="新店成长奖金合计(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="ptCount"
                label="合格PT场次（每场销售1万元以上）(场)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="ptBonusByEach"
                label="单店PT奖金(元/场)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="ptBonus"
                label="单店PT奖金合计(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="otherBonus"
                label="其它奖金(元)"
                align="center">
                </el-table-column>
                <el-table-column
                prop="totalProjectBonus"
                label="项目奖金合计(元)"
                align="center">
                </el-table-column>
            </el-table>
          </div>
      </el-main>
    </el-container>
    <el-container class="container" v-show="!form.model">
      <div class="norecode">
        <img src="static/useJs/norecode.png"/>
        <p>当前无薪资记录</p>
      </div>
    </el-container>
    <el-col :span="4" class="mt20">
        <el-button size="xs" type="success" @click="handleBack">返回列表</el-button>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'psmPersonDetail',
  data () {
    return {
      newToday: '',
      loading: false,
      searchRule: {
        userId: '',
        date: getDate() + '-01'
      },
      tableData: [],
      form: {
        id: '',
        date: getDate(),
        name: '',
        model: '',
        baseSalary: '',
        isA: '',
        isAText: '',
        changeSalaryByWorkYears: '',
        totalBaseSalary: '',
        workYears: '',
        subsidy: '',
        orderAmount: '',
        orderTarget: '',
        orderTargetRate: '',
        orderExtract: '',
        vipAmount: '',
        vipTarget: '',
        vipTargetRate: '',
        totalPerformanceBonus: '',
        clientGrowthCount: '',
        clientGrowthBonus: '',
        ptCount: '',
        ptBonus: '',
        totalProjectBonus: '',
        totalSaraly: '',
        userId: ''
      }
    }
  },
  methods: {
    _getDetail () {
      this.$tupHttp(this, 'psm/saraly/getByUserId', 'POST', this.searchRule).then(res => {
        this.form.model = res.data.model
        if (res.data.model == null) {
          return false
        }
        this.form.id = res.data.model.id
        this.form.name = res.data.model.name
        this.form.date = res.data.model.date.substring(0, 7)
        this.form.baseSalary = res.data.model.baseSalary
        this.form.isA = res.data.model.isA
        if (res.data.model.isA === 0) {
          this.form.isAText = '否'
        } else {
          this.form.isAText = '是'
        }
        this.form.changeSalaryByWorkYears = res.data.model.changeSalaryByWorkYears
        this.form.totalBaseSalary = res.data.model.totalBaseSalary
        this.form.workYears = res.data.model.workYears
        this.form.subsidy = res.data.model.subsidy

        this.form.orderAmount = res.data.model.orderAmount
        this.form.orderTarget = res.data.model.orderTarget
        this.form.orderTargetRate = res.data.model.orderTargetRate
        this.form.orderExtract = res.data.model.orderExtract
        this.form.vipAmount = res.data.model.vipAmount
        this.form.vipTarget = res.data.model.vipTarget
        this.form.vipTargetRate = res.data.model.vipTargetRate
        this.form.totalPerformanceBonus = res.data.model.totalPerformanceBonus

        this.form.clientGrowthCount = res.data.model.clientGrowthCount
        this.form.clientGrowthBonus = res.data.model.clientGrowthBonus
        this.form.clientGrowthBonusByEach = res.data.model.clientGrowthBonusByEach
        this.form.ptCount = res.data.model.ptCount
        this.form.ptBonus = res.data.model.ptBonus
        this.form.ptBonusByEach = res.data.model.ptBonusByEach
        this.form.otherBonus = res.data.model.otherBonus
        this.form.totalProjectBonus = res.data.model.totalProjectBonus

        this.form.totalSaraly = res.data.model.totalSaraly
        this.tableData = [this.form]
      })
    },
    pickTime (val) {
      this.searchRule.date = val + '-01'
      this._getDetail()
    },
    downLoad () {
      let thiz = this
      thiz.loading = true
      let data = thiz.$util.deepClone(thiz.form)
      delete data.model
      delete data.isAText
      delete data.date
      thiz.$tupHttp(thiz, 'psm/saraly/export', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    cellStyle1 ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0 && columnIndex === 2 || columnIndex === 3) {
        return 'background:#eee'
      } else {
        return ''
      }
    },
    cellStyle2 ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0 && columnIndex === 2 || columnIndex === 6) {
        return 'background:#eee'
      } else {
        return ''
      }
    },
    cellStyle3 ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0 && columnIndex === 1 || columnIndex === 3) {
        return 'background:#eee'
      } else {
        return ''
      }
    },
    handleBack () {
      this.$router.push({
        path: '/frame/psm/psmPersonList'
      })
    }
  },
  created () {
    this.newToday = new Date()
    this.searchRule.userId = Number(this.$route.query.id)
    this.form.userId = Number(this.$route.query.id)
    this.form.name = this.$route.query.name
    // this.searchRule.date = new Date()
    this._getDetail()
  }
}
function getDate () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  return year + '-' + month
}
</script>

<style lang="scss">
.text-l{text-align:left;}
.text-r{text-align:right;}
.norecode{text-align: center;width:100%;line-height: 40px;font-size:18px;}
.mt20{margin-top: 20px!important;}
.psm-detail {
  padding: 30px;
  color: #606266;
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .crumbs {
      width:100%;
    margin-bottom: 20px;
  }
  .el-breadcrumb{
    line-height: 40px;
  }
  .psm-detail-handle{
      float:right;

  }
  .psm-detail-header{
      background:#f9f9f9;
      padding:0;
      line-height:60px;
      width:100%;
      font-size:18px;
      color:#1ABC9C;
  }
  .psm-detail-header span{
      font-size:22px;
      padding:0 5px;
      font-weight:600;
  }
  .psm-detail-main{
      padding:10px 0;
  }
  .psm-detail-main span{
      font-size:16px;
      line-height:40px;
  }
  thead th.is-center:nth-last-child(2){
      background: #1ABC9C!important;
      color:#fff;
  }
  tbody td:nth-last-child(1){
      color:#1ABC9C;
      font-weight:600;
  }
  .psm-detail-list{margin-bottom:20px;}
}
</style>
