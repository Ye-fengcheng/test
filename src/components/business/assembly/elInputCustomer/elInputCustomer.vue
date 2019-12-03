<template>
  <div>
    <el-input
      placeholder="请选择"
      :size="size"
      disabled
      v-model="code">
      <el-button @click="showDialog()" :size="size" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-dialog
      title="选择客户"
      :visible.sync="visible"  
      append-to-body
      width="60%">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="地区">
          <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
        </el-form-item>
        <el-form-item :label="codeTitle" v-if="this.type == 'DB'">
          <el-input v-model="searchForm.sDbStr" size="mini" :placeholder="codeTitle"></el-input>
        </el-form-item>
        <el-form-item :label="codeTitle" v-else>
          <el-input v-model="searchForm.organId" size="mini" :placeholder="codeTitle"></el-input>
        </el-form-item>
        <el-form-item :label="nameTitle">
          <el-input v-model="searchForm.name" size="mini" :placeholder="nameTitle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="loadData(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="datas"
        @row-dblclick="rowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pCitregionoffice"
          label="区域"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pCitprovincialoffice"
          label="省办"
          sortable
          width="80">
        </el-table-column>
        <el-table-column
          prop="pUid"
          :label="codeTitle">
        </el-table-column>  
        <el-table-column
          prop="pName"
          :label="nameTitle">
        </el-table-column> 
        <el-table-column
          prop="pOrganName2"
          label="专卖店/分销商名称"
          width="150">
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
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'elInputCustomer',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: "customer"
    },
    size: {
      type: String,
      default: ""
    },
    param: {
      type: Object,
      default: {}
    },
    value:{
      type: String,
      default: ''
    }
  },
  data(){
    return {
      code:this.value ? this.value.pUid :'',
      visible:false,
      datas:[],
      total:0,
      codeTitle:this.type == 'DB' ? '客户编号' :(this.type == 'ALL' ? '客户编号' : '客户编号'),
      nameTitle:this.type == 'DB' ? '客户名' :(this.type == 'ALL' ? '客户名' : '客户名'),
      searchForm:{
        organName:'',
        dm:'',
        effectiveOIO:'',
        provinceObject:[],
        citorganlevel:this.type == 'DB' ? 5 :(this.type == 'ALL' ? '' : 6),
        sProvince:[],
        fs:'',
        cityno:'',
        cnid:'',
        name:'',
        graduationDate:[],
        clientTypeList:[],
        challengeDate:[],
        firstorderDate:[],
        openningDate:[],
        organId:'',
        outletStatus2:'',
        citoutletproperty:'',
        citparentno:'',
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
    }
  },
  watch:{
    value:function(val){
      this.code = val.pUid;
    },
    "searchForm.provinceObject":function(val){
      let datas = [];
      val.map(item=>{
        if(item.code !='999')
          datas.push(item.code)
      })
      this.searchForm.sProvince = datas;
    },
  },
  methods: {    
    showDialog(){
      this.visible = true;
    },
    resetForm(){
      this.searchForm = {
        organName:'',
        effectiveDB:'',
        dm:'',
        effectiveOIO:'',
        provinceObject:[],
        citorganlevel:this.type == 'DB' ? 5 :(this.type == 'ALL' ? '' : 6),
        sProvince:[],
        fs:'',
        cityno:'',
        cnid:'',
        name:'',
        graduationDate:[],
        clientTypeList:[],
        challengeDate:[],
        firstorderDate:[],
        openningDate:[],
        organId:'',
        outletStatus2:'',
        citoutletproperty:'',
        citparentno:'',
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
    },
    rowDblClick(row, event){
      this.visible = false;
      this.code = row.pUid;      
      this.$emit('add',row);
      this.$emit('onSelect',this.param,row);
      //清除之前的搜索选项
      this.resetForm();
      this.loadData();
    },
    handleCurrentChange(val) {
      this.searchForm.pagingQuery.pageIndex = val;
      this.loadData();
    },
    loadData(isSearch){
      let thiz = this;
      thiz.tableLoading = true;
      if(isSearch)
        thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
      let url = this.type == 'DB' ?'user/list/v2':'user/list/v1';
      thiz.$tupHttp(thiz,url,'POST',thiz.searchForm).then(res=>{
        thiz.datas = res.body.models;
        thiz.total = res.body.pageInfo.total
        thiz.tableLoading = false;
      },res=>{
        thiz.tableLoading = false;
      })
    },
  },
  mounted () {
    //this.loadData();
  },
  computed: {
  }
}
</script>

<style scoped>
.leftTree{
    overflow-x: hidden;
    overflow-y: scroll;
    height: 400px;
}
</style>

