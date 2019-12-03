<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>物流查询</el-breadcrumb-item>
      <el-breadcrumb-item>关联装箱单查询</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div>
      <div class="border-dap">
        <p>装箱单</p>
      </div>
      <br/>
      <el-form :model="model" ref="modelForm" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="拣货单号：">
              {{model.id}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户：">
              ({{model.clientPName}}){{model.clientId}}
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域：">
              {{model.areaCode}}-{{model.areaName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省办：">
              {{model.provinceCode}}-{{model.provinceName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分销商：">
              ({{model.parentClientName}}){{model.parentClientId}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="送货对象：">
              ({{model.shipToName}}){{model.shipTo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送货地址：">
              {{model.shipAddress}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话："> 
              {{model.shipMobile}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货箱数：">
              {{model.cartonCount}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货日期：">
              {{formatter({deliverTime:model.deliverTime},{property:'deliverTime'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计到货日期：">
              {{formatter({arrivalTime:model.arrivalTime},{property:'arrivalTime'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物流公司：">
              {{model.carrier}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号：">
              {{model.expressNos}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物流备注：">
              {{model.expressRemarks}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">装箱单产品信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="FMS订单号：">
              {{model.orderNos}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="JDE订单号：">
              <div class="ovflow">
                {{model.jdeOrderNos}}
              </div>    
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="model.pickList"
          style="width: 100%;"
          :height="310"
          highlight-current-row
          :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column
            type="index"
            label="序号"
            fixed="left"
            width="50">
          </el-table-column>
          <el-table-column
            prop="pCode"
            label="产品编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="pName"
            label="产品名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="kitCode"
            label="所属套装产品编号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="kitName"
            label="所属套装产品名称"
            width="140">
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="FMS订单号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="jdeOrderNo"
            label="JDE订单号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="clientId"
            label="专卖店编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="clientName"
            label="专卖店名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="clientPName"
            label="客户名"
            width="100">
          </el-table-column>      
          <el-table-column
            prop="sdsoqs"
            label="发货数量"
            width="120">
          </el-table-column>
          <el-table-column
            prop="carton"
            label="箱号"
            width="100">
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id:this.$route.params.id,
        model:{},
        loading:false,
      }
    },
    watch:{  
    },
    methods: {
      formatter(row, column) {
        let txt = ''
        if(column.property =='deliverTime' || column.property =='arrivalTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'purchase/boxing/get','POST',{id:this.id},{},'/manage-psi/',false,'').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
          if(!model || !model.carrier || !model.expressNos || !model.cartonCount || !model.deliverTime || !model.arrivalTime){
            thiz.$notify.error({
              title: '错误提示',
              message: '物流信息未生成'
            });
          }
        }) 
      }
    },
    mounted(){
      if(this.id){
        this.getInfo();    
      }      
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 16px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
.img{
  border: #ccc 1px solid;
  padding: 5px;
  width: 210px;
  border-radius: 5px;
}
.border-dap{
  border-top: #ccc 2px dashed;
  text-align: center
}
.border-dap p{
  position: absolute;
  margin-left: 40%;
  width: 60px;
  font-size: 16px;
  color: rgb(255, 102, 0);
  background: #fff;
  margin-top: -10px;
  margin-right: 60px;
}
.ovflow{
  width: 100%;
  word-break:break-all;
}
</style>