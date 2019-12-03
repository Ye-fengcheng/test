<template>
  <div>
    <el-form  :model="searchForm" label-width="130px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-meter-select v-model="searchForm.condition.provinceObject"></tup-arae-meter-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用产品唯一码">
            <el-input v-model="searchForm.condition.usedProductUniqueCode" size="mini" placeholder="使用产品唯一码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="会员编号">
            <el-input v-model="searchForm.condition.memberId" size="mini" placeholder="会员编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">            
             <el-input v-model="searchForm.condition.distributorCode" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="会员手机号码">
            <el-input v-model="searchForm.condition.memberMobile" size="mini" placeholder="会员手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠券使用状态">
            <el-select v-model="searchForm.condition.benefitCouponStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="未使用" :value="0"></el-option>
              <el-option label="已使用" :value="1"></el-option>
            </el-select>
          </el-form-item>         
        </el-col>  
      </el-row>
      <el-row :gutter="5"> 
        <el-col :span="8">
          <el-form-item label="DM">
            <el-input v-model="searchForm.condition.cmCode" size="mini" placeholder="DM编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="FS">
            <el-input v-model="searchForm.condition.fsCode" size="mini" placeholder="FS编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用专卖店编号">
            <el-input v-model="searchForm.condition.storeCode" size="mini" placeholder="使用专卖店编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">  
        <el-col :span="8">    
          <el-form-item label="优惠券有效时间">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.condition.availableDate"
              size="mini"
              type="daterange"
              value-format="timestamp"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>     
        </el-col>             
        <el-col :span="8">    
          <el-form-item label="领券日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.condition.obtainTime"
              size="mini"
              type="daterange"
              value-format="timestamp"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>     
        </el-col>
        <el-col :span="8">    
          <el-form-item label="优惠券使用时间">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.condition.usedTime"
              size="mini"
              type="daterange"
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
        <el-button type="primary" icon="el-icon-search" :loading="loading" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>   
      <el-table-column
        prop="regionCode"
        label="区域编号"
        sortable
        width="100">
      </el-table-column>       
      <el-table-column
        prop="regionName"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceCode"
        label="省办编号"
        sortable
        width="100">
      </el-table-column>    
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="cmCode"
        label="DM编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cmName"
        label="DM姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="fsCode"
        label="FS编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="FS名称"
        width="120">
      </el-table-column>
      <!-- <el-table-column
        prop="distributor"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="distributorName"
        label="分销商名称"
        width="120">
      </el-table-column>-->
      <el-table-column
        prop="distributorCode"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="distributorName"
        label="分销商姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="redundantCurrentStoreCode"
        label="专卖店编号(旧)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="jdeCode"
        label="专卖店编号(新)"
        width="120">
      </el-table-column>
      <!-- <el-table-column
        prop="storeName"
        label="专卖店编号(新)"
        width="120">
      </el-table-column>-->
      <el-table-column
        prop="redundantCurrentStoreName"
        label="所属专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="usedMemberId"
        label="会员编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="redundantUsedMemberName"
        label="会员姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="redundantUsedMemberMobile"
        label="会员手机号码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="benefitCouponSn"
        label="优惠券编码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="benefitFrontName"
        label="优惠券名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="couponBenefitType"
        :formatter="formatter"
        label="优惠券类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="benefitCouponStatus"
        :formatter="formatter"
        label="优惠券状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="availableStartTime"
        :formatter="formatter"
        label="有效时间开始时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="availableEndTime"
        :formatter="formatter"
        label="有效时间结束时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="obtainTime"
        :formatter="formatter"
        label="领取日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="usedTime"
        :formatter="formatter"
        label="使用日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="usedProductUniqueCode"
        :formatter="formatter"
        label="使用唯一码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="isBilling"
        :formatter="formatter"
        label="结算状态"
        width="100">
      </el-table-column>      
      <el-table-column
        prop="redundantUsedStoreCode"
        label="使用专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="redundantUsedStoreName"
        label="使用专卖店名称"
        width="120">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        multipleSelection:[],
        Dictions:{
          declaration_type:[],
          order_project_type:[],
          bsorder_draft_status:[],
          order_apply_type:[]
        },//所有的字典
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{
          condition: {
            provinceObject:[],
            availableDate:'',
            obtainTime:'',
            usedTime:'',
            availableEndTimeEnd: '',
            availableEndTimeStart: '',
            benefitCouponStatus: '',
            distributorCode: '',
            cmCode: '',
            fsCode: '',
            isBilling: '',
            memberId: '',
            memberMobile: '',
            obtainTimeEnd: '',
            obtainTimeStart: '',
            provinceCode: '',
            regionCode: '',
            storeCode: '',
            usedProductUniqueCode: '',
            usedTimeEnd: '',
            usedTimeStart: ''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: []
      }
    },
    watch: {
      'searchForm.condition.usedTime': function (val) {
        if (!val) {
          this.searchForm.condition.usedTimeStart = ''
          this.searchForm.condition.usedTimeEnd = ''
        } else {
          this.searchForm.condition.usedTimeStart = val[0] / 1000
          this.searchForm.condition.usedTimeEnd = val[1] / 1000
        }
      },
      'searchForm.condition.obtainTime': function (val) {
        if (!val) {
          this.searchForm.condition.obtainTimeStart = ''
          this.searchForm.condition.obtainTimeEnd = ''
        } else {
          this.searchForm.condition.obtainTimeStart = val[0] / 1000
          this.searchForm.condition.obtainTimeEnd = val[1] / 1000
        }
      },
      'searchForm.condition.availableDate': function (val) {
        if (!val) {
          this.searchForm.condition.availableEndTimeStart = ''
          this.searchForm.condition.availableEndTimeEnd = ''
        } else {
          this.searchForm.condition.availableEndTimeStart = val[0] / 1000
          this.searchForm.condition.availableEndTimeEnd = val[1] / 1000
        }
      },
      'searchForm.condition.provinceObject': function (arr) {
        let val = arr[0]
        if (val.code == '00') {
          this.searchForm.condition.regionCode = ''
          this.searchForm.condition.provinceCode = ''
        } else {
          if (val.pCitprovincialoffice) {
            this.searchForm.condition.provinceCode = val.pCitprovincialoffice
            this.searchForm.condition.regionCode = val.pCitregionoffice
          } else {
            this.searchForm.condition.regionCode = val.pCitregionoffice
            this.searchForm.condition.provinceCode = ''
          }
        }
      }
    },
    methods: {
      formatter (row, column) {
        let txt = ''
        if (column.property === 'availableStartTime' || column.property === 'availableEndTime' || column.property === 'obtainTime' || column.property === 'usedTime') {
          if (row[column.property]) {
            txt = new Date(row[column.property] * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
        }
        if (column.property === 'couponBenefitType') {
          if (row[column.property] == 1) {
            txt = '打折'
          }
          if (row[column.property] == 2) {
            txt = '固定金额'
          }
        }
        if (column.property === 'benefitCouponStatus') {
          if (row[column.property] == 0) {
            txt = '未使用'
          }
          if (row[column.property] == 1) {
            txt = '已使用'
          }
        }
        if (column.property === 'usedProductUniqueCode') {
          if (row[column.property] == 0) {
            txt = ''
          } else {
            txt = row[column.property]
          }
        }
        if (column.property === 'isBilling') {
          if (row[column.property]) {
            txt = '已结算'
          } else {
            txt = '未结算'
          }
        }
        return txt
      },
      resetForm () {
        this.searchForm = {
          condition: {
            provinceObject:[],
            availableDate:'',
            obtainTime:'',
            usedTime:'',
            availableEndTimeEnd: '',
            availableEndTimeStart: '',
            benefitCouponStatus: '',
            distributorCode: '',
            cmCode: '',
            fsCode: '',
            isBilling: '',
            memberId: '',
            memberMobile: '',
            obtainTimeEnd: '',
            obtainTimeStart: '',
            provinceCode: '',
            regionCode: '',
            storeCode: '',
            usedProductUniqueCode: '',
            usedTimeEnd: '',
            usedTimeStart: ''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        // delete data.pagingQuery;
        thiz.$hsyHttp(thiz,'mss-service/benefit/Coupon/export','POST',data,{Accept: '*/*'},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },    
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadData(isSearch){
        if(this.loading){
          return false
        } 
        let thiz = this;
        thiz.tableLoading = true;
        thiz.loading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$hsyHttp(this,'mss-service/benefit/Coupon/list','POST',thiz.searchForm).then(res=>{
          thiz.loading = false;
          if(res.body.pageInfo!=null){
            thiz.tableData = res.body.models
            thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;
          }else{
            thiz.tableData = []
            thiz.total = 0
          }
          thiz.tableLoading = false;
          
        },res=>{
          thiz.tableLoading = false;
          thiz.loading = false;
        })
      }
    },
    mounted(){
      // this.loadData(true)
      this.$util.onKeyCode(this,'loadData',[true])
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
</style>
