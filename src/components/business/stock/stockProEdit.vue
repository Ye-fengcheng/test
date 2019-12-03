<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >库存盘点数据</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/stockProductManage'}">库存产品信息维护</el-breadcrumb-item>
      <el-breadcrumb-item>修改库存产品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="stockInfo">库存盘点时间段  ： {{comForm.yearMonth}} &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;盘点填报时间段  ： 
      <el-date-picker
        v-model="comForm.date"
        type="daterange"
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div>
      <el-form ref="comForm" label-width="160px">
        <div class="grid-content bg-purple">
          <stock-product-table v-model="comForm.stockProductManageList"></stock-product-table>
        </div> 
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  import stockProductTable from '@/components/business/stock/stock-product-table'
  export default {
    data() {
      return {   
        rowId:this.$route.params.rowId,
        extra:'',     
        comForm:{
          yearMonth:'',
          date:'',
          stockProductManageList:[],
          stockStartTime:'',
          stockEndTime:'',
          stockProductViewId:'',
        },
        loading:false
      }
    },
    components: {
      stockProductTable
    },
    watch:{
      'comForm.date':function(val){
        if(!val){
          this.comForm.stockStartTime = '';
          this.comForm.stockEndTime = '';
        }
        else{
          this.comForm.stockStartTime = val[0];
          this.comForm.stockEndTime = val[1];
        }
      }
    },
    methods: {
      commit(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        if(data.date){
          data.stockStartTime = data.date[0];
          data.stockEndTime = data.date[1];
        }
        thiz.$tupHttp(thiz,'stockProductManage/createOrUpdateStockProductDetail','POST',data).then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '提示',
              message: '修改成功'
            });
          },res=>{
          thiz.loading = false;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      }, 
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'stockProductManage/getOrCreateStockProductDetail','POST',{rowId:thiz.rowId}).then(res=>{
          if(res.body.model)
          {
            let data = res.body.model;
            data.date = '';
            thiz.comForm = res.body.model; 
            if(res.body.model.stockStartTime){
              thiz.comForm.date = [new Date(res.body.model.stockStartTime).format("yyyy-MM-dd"),new Date(res.body.model.stockEndTime).format("yyyy-MM-dd")]
            }
          }
        })
      }
    },
    mounted () {
      this.loadData()
    },
  }
</script>
<style scoped>
.stockInfo{
  margin:25px 0px 15px 5px;
}
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
