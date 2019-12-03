<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="年份">
            <el-select v-model="searchForm.year" size="mini" filterable  placeholder="请选择">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left;margin-top:1px;" type="primary" icon="el-icon-search"  size="mini" @click="loadData(true)">查询</el-button>
          <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/FMSAccCalendar.xls?'+$util.getRandom())" type="text">下载模板</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="400"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="financingYear"
        label="财务年"
        width="100">
      </el-table-column>
      <el-table-column
        prop="financingMonth"
        label="财务月"
        width="100">
      </el-table-column>
      <el-table-column
        prop="startDate"
        :formatter="formatter"
        label="开始时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="endDate"
        :formatter="formatter"
        label="结束时间"
        width="160">
      </el-table-column>    
      <el-table-column
        prop="weekMonth"
        label="周/月"
        width="160">
      </el-table-column>
      <el-table-column
        prop="weekYear"
        label="周/年"
        width="160">
      </el-table-column> 
      <!-- <el-table-column
        prop="updateTime"
        label="更新时间"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="updateByName"
        label="更新人"
        width="120">
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        Dictions:{
          system_parameters:[]
        },
        years:[],
        loading:false,
        currentPage:1,
        tableLoading:false,
        total:0,
        searchForm:{
          year:'',
        },
        tableData: [
        ]
      }
    },
    watch:{
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.beginTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.beginTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          this.Dictions.system_parameters.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='startDate' || column.property =='endDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property =='updateTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            financingYear:datas.sheet0[i][0],
            financingMonth:datas.sheet0[i][1],
            startDate:datas.sheet0[i][2],
            endDate:datas.sheet0[i][3],
            weekMonth:datas.sheet0[i][4],
            weekYear:datas.sheet0[i][5]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'/system-parameters/monthForFinancing/v2/insertList','POST',arr,{},'',false,'').then(res=>{
          thiz.$notify.success({
            title: '成功提示',
            message: '成功导入数据'
          });
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'employee/login/export','POST',data).then(res=>{
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
        thiz.$tupHttp(thiz,'/system-parameters/monthForFinancing/selectByYear','POST',thiz.searchForm.year,{},'',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["system_parameters"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      let currentYear = (new Date()).getFullYear();
      this.searchForm.year = currentYear;
      for(let i=currentYear;i<=parseInt(currentYear+1);i++){
        this.years.push({
          value:i,
          lable:i
        })
      }
      $('.el-upload__input').hide();
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
