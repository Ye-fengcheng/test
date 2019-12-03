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
        <el-button type="primary" icon="el-icon-search"  size="mini" @click="loadData(true)">查询</el-button>
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
        prop="year"
        label="年份"
        width="50">
      </el-table-column>
      <el-table-column
        prop="beginDate"
        label="开始时间"
        width="160">
        <template slot-scope="scope">
          <el-date-picker
            style="width:140px"
            size="mini"
            v-model="scope.row.beginDate"
            type="date"
            placeholder="选择时间"
            value-format="yyyy-MM-dd"
            align="right">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="结束时间"
        width="160">
        <template slot-scope="scope">
          <el-date-picker
            style="width:140px"
            size="mini"
            v-model="scope.row.endDate"
            type="date"
            placeholder="选择时间"
            value-format="yyyy-MM-dd"
            align="right">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="类型"
        width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.tag" size="mini" filterable  placeholder="请选择">
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>      
      <el-table-column
        prop="updateTime"
        label="更新时间"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="更新人"
        width="120">
      </el-table-column>
      <el-table-column width="160" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"          
            type="primary"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
        </template>
      </el-table-column>
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
        tags:[
          {
            value:'元旦',
            label:'元旦'
          },
          {
            value:'春节',
            label:'春节'
          },
          {
            value:'清明节',
            label:'清明节'
          },
          {
            value:'劳动节',
            label:'劳动节'
          },
          {
            value:'端午节',
            label:'端午节'
          },
          {
            value:'中秋',
            label:'中秋'
          },
          {
            value:'国庆',
            label:'国庆'
          },
          {
            value:'周末',
            label:'周末'
          }
        ],
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
        thiz.$tupHttp(thiz,'/system-parameters/holidayDate/list','POST',thiz.searchForm.year,{},'',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableData.map(item=>{
            item.beginDate =  new Date(item.beginDate).format("yyyy-MM-dd")
            item.endDate =  new Date(item.endDate).format("yyyy-MM-dd")
          })
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'/system-parameters/holidayDate/update','POST',row,{},'',false,'').then(res=>{
          thiz.loadData()
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
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
