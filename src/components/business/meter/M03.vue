<template>
  <div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="500"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        prop="year"
        label="年"
        fixed="left"
        width="80">
      </el-table-column>
      <el-table-column
        prop="month"
        fixed="left"
        label="月"
        width="50">
      </el-table-column>
      <el-table-column
        prop="area"
        fixed="left"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="province"
        fixed="left"
        label="省办"
        width="100">
      </el-table-column>
      <el-table-column label="当月" align="center">
        <el-table-column label="平台" align="center">
          <el-table-column
            prop="monthTup"
            label="TUP销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthWaterPurifier"
            label="净水器销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthClass"
            label="理家课堂销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthCustomize"
            label="私人定制销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthMember"
            label="会员销售占比"
            width="140">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="年累计" align="center">
        <el-table-column label="平台" align="center">
          <el-table-column
            prop="yearTup"
            label="TUP销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearWaterPurifier"
            label="净水器销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearClass"
            label="理家课堂销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearCustomize"
            label="私人定制销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearMember"
            label="会员销售占比"
            width="140">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id:this.$route.params.id,
        loading:false,
        currentPage:1,
        total:0,
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
    },
    methods: {
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        window.open(row.resultUrl)
      },
      loadData(){
        let thiz = this;
        thiz.tableLoading = true;
        thiz.$tupHttp(thiz,'dashBoard/getTableDetail?tableType=M03','POST',{id:this.id}).then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
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
