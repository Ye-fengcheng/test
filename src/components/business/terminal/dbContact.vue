<template>
  <div>
    <el-row>
      <el-col :span="18">   
        &nbsp;     
      </el-col>
      <el-col :span="6" style="text-align:right"><el-button @click="goBack()">返回</el-button></el-col>
    </el-row>
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
        prop="pContractType"
        label="合同类型"
        width="100">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? '挑战者合同':'分销商合同'}}
        </template>
      </el-table-column>      
      <el-table-column
        prop=""
        label="分销商编号"
        width="100">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? searchForm.clientId:searchForm.clientId}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pDbProtocolNo"
        label="合同编号"
        width="100">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? scope.row.pCgProtocolNo:scope.row.pDbProtocolNo}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pAuthorizeNo"
        label="分销商授权书编号"
        width="150">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? '':scope.row.pAuthorizeNo}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pArchivesNo2"
        label="档案编号"
        width="150">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? scope.row.pArchivesNo2:scope.row.pArchivesNo}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pDbProtocolDateS"
        label="合同有效开始日期"
        width="130">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? (scope.row.pCgProtocolDateS ? new Date(scope.row.pCgProtocolDateS).format("yyyy-MM-dd"):''):(scope.row.pDbProtocolDateS ? new Date(scope.row.pDbProtocolDateS).format("yyyy-MM-dd"):'')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pDbProtocolDateE"
        label="合同有效结束日期"
        width="130">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? (scope.row.pCgProtocolDateE ? new Date(scope.row.pCgProtocolDateE).format("yyyy-MM-dd"):''):(scope.row.pDbProtocolDateE ? new Date(scope.row.pDbProtocolDateE).format("yyyy-MM-dd"):'')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatetime"
        label="更新时间"
        width="100">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? new Date(scope.row.updatetime2).format("yyyy-MM-dd"):new Date(scope.row.updatetime).format("yyyy-MM-dd")}}
        </template>
      </el-table-column>
       <el-table-column
        prop="updateby"
        label="更新人"
        width="100">
        <template slot-scope="scope">
          {{scope.row.pContractType == 2 ? scope.row.updateby2:scope.row.updateby}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100, 200]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="合同详情" width="90%" top="5%" :visible.sync="dialogVisible">    
      <el-form :model="contract" label-width="180px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分销商合同编号：">
              {{contract.pDbProtocolNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商合同乙方客户名称：">
              {{contract.pOrganName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商合同法人身份证号："> 
              {{contract.pCardNo1}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分销商合同样板店地址：">
              {{contract.pDbProtocolAddr}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{contract.remark}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分销商合同开始日期：">
              {{formatter({'pDbProtocolDateS':contract.pDbProtocolDateS},{property:'pDbProtocolDateS'})}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商合同结束日期：">
              {{formatter({'pDbProtocolDateE':contract.pDbProtocolDateE},{property:'pDbProtocolDateE'})}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商授权书编号：">
              {{contract.pAuthorizeNo}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分销商合同档案编号：">
              {{contract.pArchivesNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新日期：">
                {{formatter({'updatetime':contract.updatetime},{property:'updatetime'})}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新人：">
              {{contract.updateby}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分销商合同封面图片：">
              <div class="img" v-if="contract.pDbFrontPhoto">
                <img :src="contract.pDbFrontPhoto" @click="showPic(contract.pDbFrontPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商合同首页图片：">
              <div class="img" v-if="contract.pDbCoverPhoto">
                <img :src="contract.pDbCoverPhoto" @click="showPic(contract.pDbCoverPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分销商合同签名页图片：">
              <div class="img" v-if="contract.pDbSignPhoto">
                <img :src="contract.pDbSignPhoto" @click="showPic(contract.pDbSignPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="挑战者合同编号：">
              {{contract.pCgProtocolNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挑战者合同乙方客户名称：">
              {{contract.pOrganName2}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挑战者合同法人身份证号："> 
              {{contract.pCardNo2}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="挑战者合同开始时间：">
              {{formatter({'pCgProtocolDateS':contract.pCgProtocolDateS},{property:'pCgProtocolDateS'})}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挑战者合同结束时间：">
              {{formatter({'pCgProtocolDateE':contract.pCgProtocolDateE},{property:'pCgProtocolDateE'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="挑战者合同样板店地址：">
              {{contract.pDbProtocolAddr2}}
            </el-form-item>
          </el-col>      
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{contract.remark2}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="挑战者合同档案编号：">
              {{contract.pArchivesNo2}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新人：">
              {{contract.updateby2}}
            </el-form-item>
          </el-col>          
          <el-col :span="8">
            <el-form-item label="更新日期：">
                {{formatter({'updatetime2':contract.updatetime2},{property:'updatetime2'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="挑战者合同封面图片：">
              <div class="img" v-if="contract.pCgFrontPhoto">
                <img :src="contract.pCgFrontPhoto" @click="showPic(contract.pCgFrontPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挑战者合同首页图片：">
              <div class="img" v-if="contract.pCgCoverPhoto">
                <img :src="contract.pCgCoverPhoto" @click="showPic(contract.pCgCoverPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挑战者合同签名页图片：">
              <div class="img" v-if="contract.pCgSignPhoto">
                <img :src="contract.pCgSignPhoto" @click="showPic(contract.pCgSignPhoto)" style="width:200px;">
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible:false,
        approveForm:{
          newClientId:'',
          oldClientId:''
        },
        pics:[],
        contract:{},
        loading:false,
        currentPage:1,
        total:0,
        Dictions:{
        },//本页面使用的所有字典
        searchForm:{
          clientId:this.$route.params.id,
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [],
        tableLoading:false
      }
    },
    watch:{
    },
    methods: {
      goBack(){
        this.gotoUrl('/frame/terminal/customerDbDetail/'+this.$route.params.id+'/'+this.$route.params.type)
      },
      formatter(row, column) {
        let txt = ''
        if(column.property == 'pDbProtocolDateS' || column.property == 'pDbProtocolDateE' 
        || column.property == 'updatetime' || column.property == 'pCgProtocolDateS'
        || column.property == 'pCgProtocolDateE' || column.property =='updatetime2'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },  
      showPic(picUrl){
        window.open(picUrl)
      },
      view(index, row) {
        this.dialogVisible = true;
        this.contract = row;
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'user/contract/history','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      }
    },
    mounted(){
      this.loadData();
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
