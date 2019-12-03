<template>
  <div>
    <el-form  :model="searchForm"  label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.dbNo" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">          
          <el-form-item label="DFS工号">
            <el-input v-model="searchForm.fsNo" size="mini" placeholder="DFS工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DFS姓名">
            <el-input v-model="searchForm.fsName" size="mini" placeholder="DFS姓名"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date"
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
          <el-form-item label="DM工号">
            <el-input v-model="searchForm.dmNo" size="mini" placeholder="DM工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DM姓名">
            <el-input v-model="searchForm.dmName" size="mini" placeholder="DM姓名"></el-input>
          </el-form-item>
        </el-col>  
      </el-row>
      <el-form-item>
        <el-button  style="float:left;margin-left:10px;" type="primary" icon="el-icon-search" size="mini" :loading="tableLoading" @click="loadData(true)">查询</el-button>
        <el-button style="float:left;margin-left:10px;"  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button style="float:left;margin-left:10px;" icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>   
    <el-table
      :data="tableData"
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
        prop="regionName"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="dbNo"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dbName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fsNo"
        label="DFS工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS人员"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmNo"
        label="DM工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="netAmt"
        label="2020年直属团队净额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.netAmt,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="teamOrdAmt"
        label="2020年直属团队订单额"
        width="120">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.teamOrdAmt,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actualAmt"
        label="2020年直属团队销售额"
        width="120">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.actualAmt,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="teamVip"
        label="2020年直属团队会员数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="tarOutlets"
        label="团队专卖店"
        width="150">
        <template slot-scope="scope"> 
          <span class="lookC" @click="showInfo(scope.row.tarOutlets,1,'团队专卖店')">查看</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="closeCount"
        label="关店调整数量目标"
        width="100">
      </el-table-column>
      <el-table-column
        prop="closeOutlets"
        label="计划关店专卖店名称"
        width="140">
        <template slot-scope="scope"> 
          <span class="lookC" @click="showInfo(scope.row.closeOutlets,2,'计划关店专卖店')">查看</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ordTotalAmt"
        label="老店订单目标规划合计"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.ordTotalAmt,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actTotalAmt"
        label="老店销售目标规划合计"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.actTotalAmt,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="vipTotal"
        label="老店会员目标规划合计"
        width="100">
      </el-table-column>
      <el-table-column
        prop="ordTarAmtDis"
        label="老店订单目标规划与总目标差距"
        width="140">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.ordTarAmtDis,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actTarAmtDis"
        label="老店销售目标规划与总目标差距"
        width="140">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.actTarAmtDis,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="vipTarDis"
        label="老店会员目标规划与总目标差距"
        width="140">
      </el-table-column>
      <el-table-column
        prop="cgCount"
        width="120"
        label="新出CG/二分数量目标">
      </el-table-column> 
      <el-table-column
        prop="cgOutlets"
        width="130"
        label="新出CG/二分明细">
        <template slot-scope="scope"> 
          <span class="lookC" @click="showInfo(scope.row.cgOutlets,3,'新出CG/二分明细')">查看</span>
        </template>
      </el-table-column> 
      <el-table-column
        prop="oioTarget"
        width="140"
        label="直属团队OIO目标">
      </el-table-column> 
      <el-table-column
        prop="oioTotal"
        width="130"
        label="老店规划OIO合计">
      </el-table-column> 
      <el-table-column
        prop="oioTotalTarDis"
        width="120"
        label="老店规划OIO与总目标差距">
      </el-table-column> 
      <el-table-column
        prop="openCount"
        width="120"
        label="计划新开店数量">
      </el-table-column>    
      <el-table-column
        prop="openOutlets"
        width="120"
        label="新开店明细">
        <template slot-scope="scope"> 
          <span class="lookC" @click="showInfo(scope.row.openOutlets,4,'新开店明细')">查看</span>
        </template>
      </el-table-column> 
      <el-table-column
        prop="newTotalAmt"
        width="120"
        label="新开店订单目标规划合计">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.newTotalAmt,2)}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="newActTotalAmt"
        width="120"
        label="新开店销售目标规划合计">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.newActTotalAmt,2)}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="newVipTotal"
        width="120"
        label="新开店会员目标规划合计">
      </el-table-column> 
      <el-table-column
        prop="ordTarAmtTotalDis"
        width="140"
        label="直属团队订单目标规划与总目标比较">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.ordTarAmtTotalDis,2)}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="actTarAmtTotalDis"
        width="140"
        label="直属团队销售目标规划与总目标比较">
        <template slot-scope="scope"> 
          {{$util.formatThousandNotFixed(scope.row.actTarAmtTotalDis,2)}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="vipTarTotalDis"
        width="140"
        label="直属团队会员目标规划与总目标比较">
      </el-table-column>  
      <el-table-column
        prop="oioTarTotalDis"
        width="140"
        label="直属团队OIO目标规划与总目标比较">
      </el-table-column>  
      <el-table-column
        prop="msg1"
        width="140"
        label="分解结果">
      </el-table-column> 
      <el-table-column
        prop="lastUpdateTime"
        :formatter="formatter"
        width="140"
        label="最后一次更新时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog class="text-l"
        :title="teamTil"
        :visible.sync="dialogVisible"
        width="50%">
        <el-table :data="teamStore" border v-loading="tableLoading" highlight-current-row v-show="type==1">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="pCode" label="专卖店编号"></el-table-column>
          <el-table-column prop="pName" label="专卖店名称" class-name="title" label-class-name="title-header"></el-table-column>
          <el-table-column prop="ordTar" label="2020年专卖店订单目标">
            <template slot-scope="scope"> 
              {{$util.formatThousandNotFixed(scope.row.ordTar,2)}}
            </template>
          </el-table-column>
          <el-table-column prop="actTar" label="2020年专卖店销售目标">
            <template slot-scope="scope"> 
              {{$util.formatThousandNotFixed(scope.row.actTar,2)}}
            </template>
          </el-table-column>
          <el-table-column prop="vipTar" label="2020年专卖店会员目标"></el-table-column>
        </el-table>
        <el-table :data="teamStore" border v-loading="tableLoading" highlight-current-row v-show="type==2">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="pCode" label="专卖店编号"></el-table-column>
          <el-table-column prop="pName" label="专卖店名称" class-name="title" label-class-name="title-header"></el-table-column>
        </el-table>
        <el-table :data="teamStore" border v-loading="tableLoading" highlight-current-row v-show="type==3">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="pCode" label="计划新出CG/二分专卖店编号"></el-table-column>
          <el-table-column prop="pName" label="计划新出CG/二分专卖店名称" class-name="title" label-class-name="title-header"></el-table-column>
        </el-table>
        <el-table :data="teamStore" border v-loading="tableLoading" highlight-current-row v-show="type==4">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="openDate" label="计划开业时间"></el-table-column>
          <el-table-column prop="ordTar" label="月均订单目标"></el-table-column>
          <el-table-column prop="actTar" label="月均销售目标"></el-table-column>
          <el-table-column prop="vipTar" label="月均会员目标"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        teamTil: '',
        type: 1,
        teamStore: [],
        dialogVisible: false,
        loading: false,
        currentPage: 1,
        tableLoading: false,
        total: 0,
        searchForm: {
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          dmNo:'',
          dmName:'',
          fsNo:'',
          fsName:'',
          date:'',
          dbNo: '',
          endTime: '',
          startTime: '',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ]
      }
    },
    watch: {
      "searchForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sProvince = datas;
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      showInfo (data, type, teamTil) {
        if (data) { this.teamStore = JSON.parse(data) } else { this.teamStore = [] }
        this.type = type
        this.teamTil = teamTil
        this.dialogVisible = true
      },
      resetForm () {
        this.searchForm = {
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          dmNo:'',
          dmName:'',
          fsNo:'',
          fsName:'',
          date:'',
          dbNo: '',
          endTime: '',
          startTime: '',
          pagingQuery: {
            pageIndex: 1,
            pageSize: 50
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='lastUpdateTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'dbTargetEstimate/getDbTarExport','POST',data,{},'/manage-psi/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'dbTargetEstimate/getDbTar','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
.lookC{cursor: pointer;color:#ff7000}
</style>
