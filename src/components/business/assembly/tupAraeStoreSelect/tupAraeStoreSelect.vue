<template>
  <div>    
    <el-form :model="comForm" ref="comForm" :disabled="allDisabled">
      <el-form-item v-if="needstore" label="" prop="isarea">
        <el-radio v-model="comForm.isarea" label="0">按全国参加</el-radio>
        <el-radio v-model="comForm.isarea" label="1">按区域参加</el-radio>
        <el-radio :disabled="outletDisabled" v-model="comForm.isarea" label="2">按门店范围参加<span v-if="outletDisabled">(请先将促销规则设置并保存，重新编辑时再导入门店数据)</span></el-radio>
      </el-form-item>
      <el-form-item v-show="comForm.isarea==='1'" label="">
        <div v-loading="treeLoading" style="height:250px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
          <el-tree
            @check-change='treeChange'
            :data="areas"
            :default-expand-all="true"
            ref="areaTree"
            show-checkbox
            node-key="code"
            :props="defaultProps">
          </el-tree>
        </div>
      </el-form-item>
      <el-form-item label=""  v-show="comForm.isarea==='2'">
        <div>
          <div style="line-height: 26px;width:500px;">
            <el-upload
              style="float:left;margin-left:10px;"
              ref="upload"
              :file-list="fileList"
              :auto-upload="false"
              :limit="1"
              :multiple="false"
              :httpRequest="upload">
              <el-button  :loading="loading" size="mini" type="primary">选取文件</el-button>
            </el-upload>  
            &nbsp;&nbsp;
            <el-button @click="$util.winOpen('static/useJs/doc/PromotionClient.xlsx?'+$util.getRandom())" size="mini" type="text">点击下载模板</el-button>
            <el-input
              style="float:left;margin:10px 0px 10px 10px;"
              type="textarea"
              :rows="2"
              placeholder="备注说明"
              v-model="remark">
            </el-input>
            <br/><br/>
            <el-button icon="el-icon-upload2"  style="float:left;margin-left:10px;" size="mini" type="success" @click="submitUpload">导入</el-button>
            <button style="float:left;margin-left:10px;"  type="button" class="el-button el-button--primary el-button--mini" @click="dialogVisible = true"><span>查看名单</span></button>
          </div>
          <el-table
            :data="tableData"
            v-loading="tableLoading"
            style="width: 100%;"
            :height="300"
            highlight-current-row
            :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="操作时间"
              :formatter="formatter"
              width="180">
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作人"
              sortable
              width="120">
            </el-table-column>
            <el-table-column
              prop="num"
              label="操作数量"
              width="100">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="120">
              <template slot-scope="scope">          
                {{scope.row.status==1 ? '成功':'失败'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="resultUrl"
              label="下载"
              width="150">
              <template slot-scope="scope">          
                <el-button
                  size="mini"          
                  type="primary"
                  @click="downLoad(scope.$index, scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog title="参加促销门店名单" :close-on-click-modal="false" width="50%" top="5%" :visible.sync="dialogVisible"> 
      <el-form  :model="clientForm1" label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="专卖店编号">
              <el-input v-model="clientForm1.code" size="mini" placeholder="专卖店编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专卖店名称">
              <el-input v-model="clientForm1.name" size="mini" placeholder="专卖店名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadPageClient(true)">查询</el-button>
          <el-button icon="el-icon-refresh" type="primary" size="mini" @click="clientForm1={name:'',code:''}">重置</el-button>
          <el-button icon="el-icon-plus" :disabled="allDisabled"  @click="addClientVisible = !addClientVisible" size="mini" >添加</el-button>
        </el-form-item>
      </el-form>   
      <div v-show="addClientVisible" style="border:1px solid #ccc;padding:10px;">
        <el-form ref="comForm" :model="clientForm" label-width="120px">
          <el-form-item label="专卖店编号" prop="pUid">          
            <el-input-customer @onSelect="handleSelect"  v-model="clientForm"></el-input-customer>
          </el-form-item> 
        </el-form>
      </div>
      <el-table
        :data="clientDatas"
        style="width: 99%;"
        height="350"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="code"
          width="150"
          label="专卖店编号">
        </el-table-column> 
        <el-table-column
          prop="name"
          label="专卖店名称">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete"  @click="deleteData(scope.$index, scope.row)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChangeClient"
          background
          :current-page="currentPage"
          :page-size="pageSize"
          :layout="allDisabled ? 'total, prev, pager, next':'total, prev, pager, next,jumper'"
          :total="clientTotal">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'tupAraeStoreSelect',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    needstore:{
      type:Boolean,
      default:true
    },
    refId:{
      type:String,
      default:''
    },
    outletDisabled:{
      type:Boolean,
      default:false
    },
    allDisabled:{
      type:Boolean,
      default:false
    },
    type:{
      type:String,
      default:'province'
    },
    value:{
      type: Object,
      default: {
        isarea:'0',//0代表全国,1代表是区域数据,2代表门店数据
        data:[]//1的时候是区域id,2的时候是{code:'',name:''}
      }
    }
  },
  data(){
    return {
      clientDatas:[],
      searchClientDatas:[],
      pageSize:20,
      currentPage:1,
      clientTotal:0,
      clientForm1:{
        name:'',
        code:''
      },
      addClientVisible:false,
      clientForm:{
        pUid:'',
        name:''
      },
      dialogVisible:false,
      comForm:{
        isarea:this.value.isarea,
        targetAreas:this.value.isarea==='1'?this.value.data:[],
        targetClients:this.value.isarea==='2'?this.value.data:[],
      },
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      areas:[],
      treeLoading:false,
      action:'',
      fileList:[],
      remark:'',
      areaData:{
        isarea:'1',
        data:[]
      },
      loading:false,
      searchForm:{
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
      tableData: [
      ],
      tableLoading:false
    }
  },
  watch:{
    value:function(val){
      debugger
      this.comForm.isarea=val.isarea;
      if(val.isarea=='2'){
        this.comForm.targetClients = val.data;
      }
      else{
        this.comForm.targetAreas = val.data;
        this.cheeckNode();
      }
    },
    "comForm.isarea":function(val){
      if(val=='0'){
        this.$emit('update',{isarea:'0',data:[]});
      }
    },
    "comForm.targetAreas":function(val){
      this.$emit('update',{isarea:this.comForm.isarea,data:val});
    },
    "comForm.targetClients":function(val){
      this.$emit('update',{isarea:'2',data:val});
    }
  },
  methods: {  
    handleSelect(param,val){
      this.addClients(1)
      this.loadPageClient(true);
    },
    loadPageClient(isFirst){
      let arr = []
      let thiz = this;
      if(isFirst){
        this.currentPage = 1
      }
      let datas = this.$util.deepClone(this.comForm.targetClients);
      if(this.clientForm1.name || this.clientForm1.code){
        this.searchClientDatas = datas.filter(item =>{
          return item.code.indexOf(thiz.clientForm1.code) != -1 && item.name.indexOf(thiz.clientForm1.name) != -1
        })
      }
      else{
        this.searchClientDatas  = datas
      }
      for(let i=(this.currentPage-1)*this.pageSize; i <this.currentPage*this.pageSize; i++){
        if(this.searchClientDatas.length <= i){
          break;
        }
        arr.push({
          code:this.searchClientDatas[i].code,
          name:this.searchClientDatas[i].name
        })
      }
      this.clientDatas = arr
      this.clientTotal = this.searchClientDatas.length
    },
    handleCurrentChangeClient(val){
      this.currentPage = val;
      this.loadPageClient()
    },
    addClients(num){
      if(this.clientForm.pUid){
        if(!num){
          num = 1;
        }
        for(let i=0;i<num;i++){
          this.comForm.targetClients.unshift({
            name:this.clientForm.pOrganName2,
            code:this.clientForm.pUid
          });
        }     
        this.clientForm = {}
        this.addClientVisible = false;
      } 
    },
    downLoad(index, row) {
      window.open(row.url)
    },
    formatter(row, column) {
      let txt = ''
      if(column.property =='createTime'){
        if(row[column.property])
          txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
      }
      return txt;
    },
    getValues(){
      return this.comForm;
    },
    cheeckNode(){
      let datas = this.comForm.targetAreas;
      let data = [];
      datas.map(item=>{
        if(item.code){
          data.push(item.code)
        }
        else{
          data.push(item)
        }
      })
      this.$refs.areaTree.setCheckedKeys(data);
    },
    upload(option){     
      this.$util.readExcel(option.file,this.treatDatas)
    },
    treatDatas(datas){
      let arr = [];
      for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            name:datas.sheet0[i][0],
            code:datas.sheet0[i][1]
          })  
      }
      let concatArr = arr;
      let uniqueArr = [];
      concatArr.forEach((item)=>{
        let had = uniqueArr.some(data=>{
          return data.code == item.code
        })
        if(!had)
          uniqueArr.push(item)
      })
      let thiz = this;
      this.loading = true;
      const loader = this.$loading({
        lock: true,
        text: '门店数据导入同步中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      thiz.$tupHttp(thiz,'user/outlet/check','POST',{list :uniqueArr,name:thiz.remark,refId:thiz.refId,module:'promotion'}).then(res=>{
        if(res.body.valid){
          thiz.$notify.success({
            title: '成功提示',
            message: '批量插入成功'
          });
          thiz.comForm.targetClients = uniqueArr;
        } else {
          thiz.$notify.error({
            title: '错误提示',
            message: '部分数据有误'
          });
        }
        loader.close();
        thiz.loadData()
        thiz.loading = false;
        thiz.fileList = [];
        thiz.remark = '';
      },res=>{
        loader.close();
        thiz.loading = false;
        thiz.fileList = [];
        thiz.remark = '';
      })       
    },
    deleteData(ind,row){
      let delNum = -1;
      for(let i = 0;i<this.comForm.targetClients.length;i++){
        if(this.comForm.targetClients[i].code == row.code && 
        this.comForm.targetClients[i].name == row.name){
          delNum =i;
          break;
        }
      }
      if(delNum > -1){
        this.comForm.targetClients.splice(delNum,1);
      }
      this.loadPageClient()
    },  
    treeChange(node,isSelect,hasChild){
      let keys = this.$refs.areaTree.getCheckedKeys();
      this.comForm.targetAreas=keys.indexOf('999')==-1 ? this.$refs.areaTree.getCheckedNodes(true) : [{code:'999',name:'全国'}];
    },
    submitUpload() {
      this.$refs.upload.submit();
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
      thiz.$tupHttp(thiz,'user/outlet/find?refId='+thiz.refId+'&module=promotion','GET',thiz.searchForm).then(res=>{
        thiz.tableData = res.body.models;
        thiz.tableLoading = false;
      },res=>{
        thiz.tableLoading = false;
      })
    },
    init(){
      let thiz = this;
      thiz.treeLoading = true;
      if(this.type=='area'){
        thiz.$baseData.area(thiz).then(res=>{
          thiz.areas = [
            {
              code:'999',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }
      else{
        thiz.$baseData.areaTree(thiz).then(res=>{
          thiz.areas = [
            {
              code:'999',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }
    }
  },
  mounted () {
    $('.el-upload__input').hide();
    if(this.refId){
      this.loadData(true);
    }
    if(this.comForm.isarea == '2'){
      this.loadPageClient(true)
    }
    this.init();
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

