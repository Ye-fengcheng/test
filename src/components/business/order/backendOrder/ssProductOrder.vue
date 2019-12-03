<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>后台单创建</el-breadcrumb-item>
      <el-breadcrumb-item>批量创建SS员工自购单</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div>
      <el-form ref="comForm" label-width="160px">
        <div class="grid-content bg-purple">
          <fms-backend-table v-model="comForm.datas" type="SS" type-name="SS-员工自购单"></fms-backend-table>
        </div> 
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="back">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
    <el-dialog title="导入出错数据" width="60%" top="5%" :visible.sync="dialogVisible">
      <el-table
        :data="errorTableData"
        style="width: 100%;"
        height="450"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          prop="excelIndex"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="areaCode"
          label="区域"
          width="100">
        </el-table-column>
        <el-table-column
          prop="provinceCode"
          label="省办"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="quotaQty"
          label="配额"
          width="150">
        </el-table-column>
        <el-table-column
          prop="isFirstorder"
          label="是否限定首订"
          width="150">
        </el-table-column>
        <el-table-column
          prop="isNonfirstorder"
          label="是否限定非首订"
          width="150">
        </el-table-column>
        <el-table-column
          prop="beginTime"
          label="开始时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息"
          width="150">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import fmsBackendTable from '@/components/business/order/ass-fms-backend-table'
  export default {
    data() {
      return {        
        comForm:{
          datas:[]
        },
        errorTableData: [
        ],
        dialogVisible:false,
        areaData:{
          isarea:'1',
          data:[]
        },
        loading:false
      }
    },
    components: {
      fmsBackendTable
    },
    watch:{
      areaData:function(val){
        this.getArea(val);
      }
    },
    methods: {
      back(){
        let thiz = this;
        if(this.comForm.datas.length > 0){
          this.$confirm('是否放弃提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            thiz.$router.go(-1)
          }).catch(() => {    
             
          });
        }
        else{
          this.$router.go(-1)
        }
      },
      commit(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm.datas);
        thiz.$tupHttp(thiz,'order/saveDrafts','POST',{draftList:data,orderType:'SS',plusOrMinusAdjust:''}).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '提示',
              message: '批量插入成功'
            });
            thiz.comForm.datas = [];
          }else{
            thiz.$notify.error({
              title: '错误提示',
              message: '部分数据有误'
            });
            //thiz.errorTableData = res.body.models;
            //thiz.dialogVisible = true;
          }           
        },res=>{
          thiz.loading = false;
        })
      }
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 10px;
  text-align: right;
}
.grid-content{
  border: 0px solid #eee;
  padding: 5px;
  border-radius: 5px;
}
.transition-box {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #ff7700;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
