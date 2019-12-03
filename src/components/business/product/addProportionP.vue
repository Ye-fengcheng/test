<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >订货比例</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/proportionProvince'}">区域/省办</el-breadcrumb-item>
      <el-breadcrumb-item>批量创建</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div>
      <el-form ref="comForm" label-width="160px">
        <div class="grid-content bg-purple">
          <fms-propotion-table v-model="comForm.datas"></fms-propotion-table>
        </div> 
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
    <el-dialog title="出错数据" width="60%" top="5%" :visible.sync="dialogVisible">
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
          <template slot-scope="scope">
            {{scope.row.excelIndex - 1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="区域"
          width="100">
        </el-table-column>
        <el-table-column
          prop="provinceName"
          label="省办"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderRatio"
          label="订货比率"
          width="150">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import fmsPropotionTable from '@/components/business/product/ass-fms-propotion-table'
  export default {
    data() {
      return {
        
        promotionThemeType:this.$route.params.promotionThemeType,
        comForm:{
          datas:[]
        },
        errorTableData: [
        ],
        dialogVisible:false,
        loading:false
      }
    },
    components: {
      fmsPropotionTable
    },
    methods: {
      commit(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm.datas);
        if(data.length == 0){
          thiz.$notify.error({
            title: '错误提示',
            message: '数据不能为空'
          });
          return;
        }        
        thiz.$tupHttp(thiz,'public-service/product/batchInsertOrderProportion','POST',{list:data},{},'/public-service/',false,'').then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '提示',
              message: '批量插入成功'
            });
            thiz.comForm.datas = [];
          }else{
            /* thiz.$notify.error({
              title: '错误提示',
              message: res.body.message
            }); */
            thiz.errorTableData = res.body.models;
            if(thiz.errorTableData.length > 0){
              thiz.dialogVisible = true;
            }
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
