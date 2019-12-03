<template>
  <div>
    <div>
      <el-upload
        style="float:left"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button size="mini" type="primary">上传</el-button>
      </el-upload>   
      &nbsp;     
      <el-button size="mini" type="success">点击下载模板</el-button>
    </div>
    <el-table
      :data="tableData"
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
        prop="status"
        label="操作时间"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作人"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="area"
        label="操作数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="excludedArea"
        label="已成功"
        width="120">
      </el-table-column>
      <el-table-column
        prop="province"
        label="已失败"
        width="120">
      </el-table-column>
      <el-table-column
        prop="excludedProvince"
        label="下载"
        width="150">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="备注">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加规则" :close-on-click-modal="false" width="90%" top="5%" :visible.sync="addDialogVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:false,
        currentPage:1,
        total:10,
        searchForm:{
          title:'',
          status:'0',
          startDate:'',
          endDate:'',
          date:'',
          pageQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
          {
            code: '98071180101',
            status:'已发布',
            name: '3月普订-西内蒙满3万换购刀具组合2套',
            area:'全国',
            excludedArea:'无',
            province:'全国',
            excludedProvince:'无',
            startTime:'2018-3-14',
            endTime: '2018-3-24'
          }
        ]
      }
    },
    watch:{
    },
    methods: {
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      }
    },
    mounted(){
      $('.el-upload__input').hide();
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
