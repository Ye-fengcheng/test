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
      <el-table-column label="营销组长" align="center">
        <el-table-column
          prop="marketingRsdpsdShould"
          label="RSD/PSD应配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="marketingRsdpsdReality"
          label="RSD/PSD实配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="marketingPsdReality"
          label="PSD实配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="marketingRmsShould"
          label="RMS应配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="marketingRmsReality"
          label="RMS实配人数"
          width="160">
        </el-table-column>
      </el-table-column>
      <el-table-column label="发展组长" align="center">
        <el-table-column
          prop="developmentRfdpfdShould"
          label="RFD/PFD应配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="developmentRfdReality"
          label="RFD实配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="developmentPfdReality"
          label="PFD实配人数"
          width="160">
        </el-table-column>
      </el-table-column>
      <el-table-column label="拓展组长" align="center">
        <el-table-column
          prop="expansionRcdpcdShould"
          label="RCD/PCD应配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="expansionRcdReality"
          label="RCD实配人数"
          width="160">
        </el-table-column>
        <el-table-column
          prop="expansionPcdReality"
          label="PCD实配人数"
          width="160">
        </el-table-column>
      </el-table-column>
      <el-table-column label="PM" align="center">
        <el-table-column
          prop="pmDistributionRate"
          label="配置率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pmWorkingYears"
          label="岗龄"
          width="60">
        </el-table-column>
        <el-table-column
          prop="pmQuitRate"
          label="离职率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pmQuitQuantity"
          label="离职人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pmWorkingYearsQuantity1"
          label="岗龄大于3年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pmWorkingYearsQuantity2"
          label="岗龄1-2年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pmWorkingYearsQuantity3"
          label="岗龄1年以内人数"
          width="80">
        </el-table-column>
      </el-table-column>
      <el-table-column label="DM" align="center">
        <el-table-column
          prop="dmTotalCount"
          label="总数"
          width="60">
        </el-table-column>
        <el-table-column
          prop="dmDistributionRate"
          label="配置率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dmQuitRate"
          label="离职率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dmQuitQuantity"
          label="离职人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dmWorkingYearsQuantity1"
          label="岗龄大于3年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dmWorkingYearsQuantity2"
          label="岗龄1-2年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dmWorkingYearsQuantity3"
          label="岗龄1年以内人数"
          width="80">
        </el-table-column>
      </el-table-column>
      <el-table-column label="DFS" align="center">
        <el-table-column
          prop="dfsTotalCount"
          label="总数"
          width="60">
        </el-table-column>
        <el-table-column
          prop="dmDistributionRate"
          label="配置率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dfsQuitRate"
          label="离职率"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dfsQuitQuantity"
          label="离职人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dfsWorkingYearsQuantity1"
          label="岗龄大于3年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dfsWorkingYearsQuantity2"
          label="岗龄1-2年人数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dfsWorkingYearsQuantity3"
          label="岗龄1年以内人数"
          width="80">
        </el-table-column>
      </el-table-column>
      <el-table-column label="员工总数" align="center">
        <el-table-column
          prop="employeeReality"
          label="实际"
          width="60">
        </el-table-column>
        <el-table-column
          prop="employeePlan"
          label="计划"
          width="60">
        </el-table-column>
        <el-table-column
          prop="employeeLastYear"
          label="去年同期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="employeeComparePlan"
          label="比计划"
          width="80">
        </el-table-column>
        <el-table-column
          prop="employeeCompareYear"
          label="比去年"
          width="80">
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
        thiz.$tupHttp(thiz,'dashBoard/getTableDetail?tableType=H01','POST',{id:this.id}).then(res=>{
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
