<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >库存盘点数据</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/stock/stockProductManage'}">库存产品信息维护</el-breadcrumb-item>
      <el-breadcrumb-item>创建</el-breadcrumb-item>
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
      &nbsp;
      <el-button @click="downLoad" :loading="loading" type="primary">导出TopN产品</el-button>
      产品最新导入时间 ： {{extra}}
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
        if(!data.stockStartTime){
          thiz.$notify.error({
            title: '提示',
            message: '日期不能为空'
          });
          this.loading = false;
          return;
        }
        let unitEmpty = data.stockProductManageList.some(item=>{
          return !item.unit || !item.productName
        })
        if(unitEmpty){
          thiz.$notify.error({
            title: '提示',
            message: '产品名称/单位/不能为空'
          });
          this.loading = false;
          return;
        }
        thiz.$tupHttp(thiz,'stockProductManage/createOrUpdateStockProductDetail','POST',data).then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '提示',
              message: '插入成功'
            });
            thiz.gotoUrl('/frame/stock/stockProductManage')   
          },res=>{
          thiz.loading = false;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      }, 
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'stockProductManage/exportAllTopN','POST',null).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'stockProductManage/getOrCreateStockProductDetail','POST',{}).then(res=>{
          thiz.extra = res.body.extra
          if(res.body.model){
            thiz.comForm.yearMonth = res.body.model.yearMonth;
            if(!thiz.comForm.yearMonth){
              thiz.$notify.error({
                title: '错误提示',
                message: '该时间已存在盘点产品库存信息'
              })
              thiz.gotoUrl('/frame/stock/stockProductManage')
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
