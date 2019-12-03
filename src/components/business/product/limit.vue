<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.condition.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.condition.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>      
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left"  icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
          <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/ProductArea.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
        </div>
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
        prop="pCode"
        label="产品编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="firstBookProviceCodes"
        label="首订地区设置"
        width="150">
        <template slot-scope="scope">
          <div>
            {{scope.row.firstBookProviceCodes == '999' ?'全国' :scope.row.firstBookProviceNames}}
            <el-button 
            @click="editItemFirstBook(scope.$index, scope.row)"
            size="mini" 
            icon="el-icon-edit"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="commonBookProviceCodes"
        label="普订地区设置"
        width="150">
        <template slot-scope="scope">
          <div>
            {{scope.row.commonBookProviceCodes == '999' ?'全国' :scope.row.commonBookProviceNames}}
            <el-button 
            @click="editItemCommonBook(scope.$index, scope.row)"
            size="mini" 
            :loading="loading"
            icon="el-icon-edit"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100, 200]"
        layout="slot,sizes, prev, pager, next, jumper"
        :total="total">
        <span class="el-pagination__total" v-if="total < $baseData.maxNumber">共&nbsp;{{total}}&nbsp;条</span>
        <span class="el-pagination__total" v-else>{{$baseData.maxTitle}}</span>
      </el-pagination>
    </div>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="dialogVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        areaData:{
          isarea:'1',
          data:[]
        },
        loading:false,
        currentPage:1,
        total:10,
        searchForm:{
          condition:{
            pCode:'',
            pName:'',
            pStatus: 1
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        isFirst:true
      }
    },
    watch:{
    },
    methods: {
      resetForm(){
        this.searchForm = {
          condition:{
            pCode:'',
            pName:'',
            pStatus: 1
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet1.length;i++){
          if(datas.sheet1[i][0] == '0'){
            break;
          }
          arr.push({
            pCode:datas.sheet1[i][0],
            firstBookProviceCodes:datas.sheet1[i][1],
            commonBookProviceCodes:datas.sheet1[i][2]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importProductArea','POST',arr).then(res=>{
          thiz.$notify.success({
            title: '成功提示',
            message: res.body.message
          });
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getArea(){
        let val = this.$refs.areaSelect.getValues();
        if(!val){
          val = this.areaData;
        }
        if(val.isarea==='1'){
          let codeArray = [];
          let nameArray = [];
          val.targetAreas.map(item=>{
            codeArray.push(item.code);
            nameArray.push(item.name);
          })
          if(this.isFirst){
            this.tableData[this.itemIndex].firstBookProviceCodes = codeArray.join(',');
            this.tableData[this.itemIndex].firstBookProviceNames = nameArray.join(',');            
          }
          else{
            this.tableData[this.itemIndex].commonBookProviceCodes = codeArray.join(',');
            this.tableData[this.itemIndex].commonBookProviceNames = nameArray.join(',');
          }
        }
      },
      saveArea(){     
        let thiz = this;
        this.getArea();
        this.dialogVisible = false;
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/updateProductArea','POST',[row]).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      setArea(val){
        let thiz = this;  
        let firstBookProviceCodes = this.tableData[val].firstBookProviceCodes ? this.tableData[val].firstBookProviceCodes:"";
        let firstBookProviceNames = this.tableData[val].firstBookProviceNames ? this.tableData[val].firstBookProviceNames:"";        
        let commonBookProviceCodes = this.tableData[val].commonBookProviceCodes ? this.tableData[val].commonBookProviceCodes:"";
        let commonBookProviceNames = this.tableData[val].commonBookProviceNames ? this.tableData[val].commonBookProviceNames:"";    
        let areas = this.isFirst ? firstBookProviceCodes.split(',') : commonBookProviceCodes.split(',');
        let names = this.isFirst ? firstBookProviceNames.split(',') : commonBookProviceNames.split(',');
        if(areas){
          let datas = [];
          for(let i=0;i<areas.length;i++){
            datas.push({
              code:areas[i],
              name:names[i]
            })
          }
          setTimeout(function(){
            thiz.areaData = {
              isarea:'1',
              data: datas
            }
          })          
        }
        else{
          setTimeout(function(){
              thiz.areaData = {
                isarea:'1',
                data: []
              }
          }) 
        } 
      },
      editItemFirstBook(ind,row){
        this.itemIndex = ind;
        this.isFirst = true;
        this.setArea(ind);
        this.dialogVisible = true;        
      },
      editItemCommonBook(ind,row){
        this.itemIndex = ind;
        this.isFirst = false;
        this.setArea(ind);
        this.dialogVisible = true;        
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'product/exportProductArea','POST',data,{},'',true).then(res=>{
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
        this.$baseData.productList(this,this.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      //this.loadData();
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
