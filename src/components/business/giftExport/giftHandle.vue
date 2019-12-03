<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 高会礼品订单处理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="handle-box">
        <div class="handle-til clearfix">
          <span>数据筛选</span>
          <!-- <el-button type="primary" size="mini" icon="search" v-popover:popover1 class="publish-btn">高级检索</el-button> -->
        </div>
        <el-popover
            ref="popover1"
            placement="bottom-end"
            width="400"
            trigger="click">
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">省:</el-row>
                <el-row>
                    <el-select placeholder="选择省份" v-model="sheng" @change="choseArea" class="handle-select">
                        <el-option
                          v-for="item in area"
                          :key="item.index"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">市:</el-row>
                <el-row>
                    <el-select placeholder="选择城市" v-model="shi" @change="choseProvince" class="handle-select">
                        <el-option
                          v-for="item in province"
                          :key="item.index"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="11"><el-row class="mb10">区:</el-row>
            <el-row>
              <el-select placeholder="选择区" v-model="qu" class="handle-select">
                <el-option
                  v-for="item in region"
                  :key="item.index"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
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
        <el-form label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
            <el-col :span="8">
            <el-form-item label="订单编号">
                <el-input v-model="ruleForm.condition.orderSn" size="mini" placeholder="订单编号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="所属专卖店">
                <el-input v-model="ruleForm.condition.redundantCurrentStoreCode" size="mini" placeholder="专卖店编号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="会员">            
                <el-input v-model="ruleForm.condition.memberIdOrMobile" size="mini"  placeholder="会员编号/手机号"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="订单状态">
              <el-select size="mini" placeholder="订单状态" style="width:100%;" v-model="ruleForm.condition.orderStatus">
                <el-option key="" label="全部" value=""></el-option>
                <el-option key="1" label="未审核" value="1"></el-option>
                <el-option key="2" label="已审核" value="2"></el-option>
                <el-option key="3" label="已安排发货" value="3"></el-option>
                <el-option key="4" label="已发货" value="4"></el-option>
                <el-option key="5" label="已收货" value="5"></el-option>
                <el-option key="6" label="已取消" value="6"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">    
            <el-form-item label="时间类型">
              <el-select size="mini" placeholder="时间类型" style="width:100%;" v-model="ruleForm.condition.timeType">
                <el-option key="0" label="下单时间" value="0"></el-option>
                <el-option key="1" label="发货时间" value="1"></el-option>
                <el-option key="2" label="取消时间" value="2"></el-option>
              </el-select>
            </el-form-item>     
            </el-col>  
            <el-col :span="8">    
            <el-form-item label="选择时间">
                <el-date-picker
                style="width:100%"
                v-model="checkDate"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>     
            </el-col>    
        </el-row>   
        <el-form-item>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="loadData(true)">查询</el-button>
        </el-form-item>
        </el-form>
      </div>
      <div class="export-box">
          <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="success" size="mini" @click="showApproved">批量审核</el-button>
                <!-- <el-button type="primary" size="mini">一键补发礼品资格</el-button>
                <el-upload
                    action=""
                    style="display:inline-block;margin-left:10px;"
                    :show-file-list="false"
                    :multiple="true"
                    :httpRequest="uploadfile"
                    class="psmUp">
                    <el-button icon="el-icon-upload2" size="mini" type="success">导入发货</el-button>
                </el-upload> -->
              </el-col>
          </el-row>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" prop="orderSn" label="订单编号" width="130" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column align="center" prop="orderType" label="订单类型" width="80"></el-table-column>
        <el-table-column align="center" prop="memberId" label="会员编号" width="80"></el-table-column>
        <el-table-column align="center" prop="memberName" label="会员姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="giftOrderConsignee" label="收货人姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="giftOrderTel" label="收货人手机号" width="120"></el-table-column>
        <el-table-column align="center" prop="redundantCurrentStoreCode" label="所属专卖店旧编" width="145"></el-table-column>
        <el-table-column align="center" prop="jdeCode" label="所属专卖店新编" width="145"></el-table-column>
        <el-table-column align="center" prop="redundantCurrentStoreName" label="所属专卖店名称" width="145"></el-table-column>
        <el-table-column align="center" prop="redundantProductCode" label="产品编号" width="120"></el-table-column>
        <el-table-column align="center" prop="redundantProductNameCn" label="产品名称" width="120"></el-table-column>
        <el-table-column align="center" prop="regTime" label="注册日期" width="150"></el-table-column>
        <el-table-column align="center" prop="createTime" label="下单日期" width="150"></el-table-column>
        <!-- <el-table-column align="center" prop="obtainTime" label="下单日期" width="150"></el-table-column> -->
        <el-table-column align="center" prop="orderStatusName" label="订单状态" width="120"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope" v-if="scope.row.orderStatusName=='已审核'">
            <el-button size="small" @click="showCancel(scope.row.giftOrderId)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page="ruleForm.pagingQuery.pageIndex" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
      title="一键补发礼品资格"
      :visible.sync="giftVisible"
      width="40%">
      <el-form label-width="25%" size="small">
        <el-form-item label="选择时间：" required>
          <el-date-picker
            style="width:100%"
            size="mini"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <p class="text-r">时间范围：时间最大选择为两周</p>
          <p><span class="red">漏发高会礼品资个数：100</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);">下载漏发明细</a></p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="saveQuitTime()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="text-l"
      title="批量审核"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form label-width="30%" size="small">
          <el-form-item label="选择时间：" required>
            <el-date-picker
                style="width:100%"
                v-model="selDate"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="onClose()">取 消</el-button>
          <el-button type="primary" @click="setApproved()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="text-l"
      title="取消礼品资格"
      :visible.sync="cancelVisible"
      width="40%">
      <el-form label-width="35%" size="small">
          <el-form-item label="是否返回礼品资格:">
            <el-radio-group v-model="typeName">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="giftOrderRemark"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="onClose()">取 消</el-button>
          <el-button type="primary" @click="toCancel()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'psmPersonList',
  data () {
    return {
      sheng: '',
      shi: '',
      qu: '',
      checkDate: [],
      selDate: [],
      selTime: {
        endTime: 0,
        startTime: 0
      },
      giftVisible: false,
      dialogVisible: false,
      cancelVisible: false,
      area: [],
      province: [],
      region: [],
      loading: false,
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          endTime: '',
          memberId: '',
          memberIdOrMobile: '',
          mobile: '',
          orderSn: '',
          orderStatus: '',
          redundantCurrentStoreCode: '',
          startTime: '',
          timeType: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      multipleSelection: [],
      type: 0,
      typeName: '否',
      giftOrderRemark: '',
      giftOrderId: ''
    }
  },
  methods: {
    setApproved () {
      if (this.selDate.length === 0) {
        this.$message.error('请选择时间')
        return
      }
      this.loading = true
      this.$hsyHttp(this, 'mss-service/benefit/gift/order/approved', 'POST', this.selTime).then(res => {
        this.loading = false
        this.$notify.success({
          title: '成功提示',
          message: '批量审核成功'
        })
        this.dialogVisible = false
      }, res => {
        this.loading = false
      })
    },
    showApproved () {
      this.dialogVisible = true
    },
    loadData () {
      this.ruleForm.pagingQuery.pageIndex = 1
      this._getData()
    },
    saveQuitTime () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val.filter(item => {
        return item.saralyId
      }).map(item => {
        return item.saralyId
      }) // 去除没有saralyId的记录
    },
    search () {
      this._getData()
    },
    resetSearch () {
      this.ruleForm.condition.endTime = ''
      this.ruleForm.condition.memberId = ''
      this.ruleForm.condition.memberIdOrMobile = ''
      this.ruleForm.condition.mobile = ''
      this.ruleForm.condition.orderSn = ''
      this.ruleForm.condition.orderStatus = ''
      this.ruleForm.condition.redundantCurrentStoreCode = ''
      this.ruleForm.condition.startTime = ''
      this.ruleForm.condition.timeType = ''
      this.checkDate = []
    },
    showCancel (id) {
      this.cancelVisible = true
      this.giftOrderId = id
    },
    toCancel () {
      if (this.typeName === '否') { this.type = 0 }
      if (this.typeName === '是') { this.type = 1 }
      let data = {
        'giftOrderId': this.giftOrderId,
        'giftOrderRemark': this.giftOrderRemark,
        'type': this.type
      }
      const thiz = this
      this.$confirm('取消后将无法复原数据，你确认取消该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(this, 'mss-service/benefit/gift/order/cancel', 'POST', data).then(res => {
          thiz.$notify.success({
            title: '成功提示',
            message: '取消成功'
          })
          this.cancelVisible = false
          this.typeName = '否'
          this.giftOrderRemark = ''
          this._getData()
        })
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    // 获取列表数据
    _getData () {
      if (this.ruleForm.condition.orderSn === '' && this.ruleForm.condition.memberIdOrMobile === '' && this.checkDate.length === 0) {
        this.$message.error('请选择时间')
        return
      } else if (this.ruleForm.condition.endTime - this.ruleForm.condition.startTime > 60 * 60 * 24 * 30) {
        this.$message.error('选择时间最大范围为30天')
        return
      } else if (this.ruleForm.condition.timeType === ''){
        this.$message.error('请选择时间类型')
        return
      }
      this.tableLoading = true
      this.$hsyHttp(this, 'mss-service/benefit/gift/order/list', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          item.orderType = '礼品订单'
          if (item.regTime) {
            item.regTime = new Date(item.regTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.regTime = ''
          }
          if (item.createTime) {
            item.createTime = new Date(item.createTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.createTime = ''
          }
          if (item.obtainTime) {
            item.obtainTime = new Date(item.obtainTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.obtainTime = ''
          }
          if (item.orderStatus === 1) { item.orderStatusName = '未审核' }
          if (item.orderStatus === 2) { item.orderStatusName = '已审核' }
          if (item.orderStatus === 3) { item.orderStatusName = '已安排发货' }
          if (item.orderStatus === 4) { item.orderStatusName = '已发货' }
          if (item.orderStatus === 5) { item.orderStatusName = '已收货' }
          if (item.orderStatus === 6) { item.orderStatusName = '已取消' }
        })
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
    // 选省份
    choseArea (e) {
      let thiz = this
      thiz.province = []
      thiz.provinceList.forEach(function (item) {
        if (item.parent === e) {
          thiz.province.push(item)
        }
      })
    },
    // 选城市
    choseProvince (e) {
      let thiz = this
      thiz.region = []
      thiz.provinceList.forEach(function (item) {
        if (item.parent === e) {
          thiz.region.push(item)
        }
      })
    },
    onClose () {
      this.giftVisible = false
      this.dialogVisible = false
      this.cancelVisible = false
      this.selDate = []
    }
  },
  created () {
    // let thiz = this
    // var newDate = Date.parse(new Date())
    // var prevDate = newDate - 60 * 60 * 24 * 30 * 1000
    // this.checkDate = [prevDate, newDate]
    // setTimeout(function () {
    //   thiz._getData()
    // }, 500)
    // this._getAreaData()
  },
  watch: {
    'checkDate': function (val) {
      if (!val) {
        this.ruleForm.condition.startTime = ''
        this.ruleForm.condition.endTime = ''
      } else {
        this.ruleForm.condition.startTime = val[0] / 1000
        this.ruleForm.condition.endTime = val[1] / 1000
      }
    },
    'selDate': function (val) {
      if (!val) {
        this.selTime.startTime = ''
        this.selTime.endTime = ''
      } else {
        this.selTime.startTime = val[0] / 1000
        this.selTime.endTime = val[1] / 1000
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
