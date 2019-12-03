<template>
<el-container>
  <el-header>
    <div style="padding-top:5px;">
      <div>
      <span class="title">区域：</span>{{$store.state.common.annualUser.area}}
      &nbsp;&nbsp;<span class="title">省办(部门)：</span>{{$store.state.common.annualUser.province}}
      &nbsp;&nbsp;<span class="title">姓名：</span>{{$store.state.common.annualUser.name}}
      &nbsp;&nbsp;<span class="title">电话：</span>{{$store.state.common.annualUser.phone}}
      &nbsp;&nbsp;<span class="title">工号：</span>{{$store.state.common.annualUser.code}}
      </div>
      <br/>
      <div><!-- 
        <div style="float:left;width:150px">
          <span style="width:25px;height:25px;background:#ccc;padding:5px;">无库存</span>
          <span style="width:25px;height:25px;background:#F56C6C;padding:5px;">出错行</span> 
        </div>  -->       
        <div style="float:left;">
          <input v-model="userName" placeholder="请输入工号" @keyup.enter="login">
        </div>
         <div style="float:left;width:250px;margin-left:5px">
           <el-button size="mini" type="primary" :disabled="!userName" :loading="loading" @click="login">获取员工信息</el-button>
           <el-button size="mini" type="primary" @click="goOrderListKf">查看订单</el-button>
         </div>
      </div>   
    </div>
  </el-header>
  <el-main>
    <el-table
        :data="productData"
        style="width: 100%;"
        height="450"
        :row-class-name="tableRowClassName">
        <el-table-column
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="productCode"
            label="产品编号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="产品名称">
        </el-table-column>
        <el-table-column
            prop="productUnit"
            label="单位"
            width="50">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="配额"
            width="180">
        </el-table-column>
        <el-table-column
            prop="productPrice"
            label="单价"
            width="80"
            :formatter="formatter">
        </el-table-column>
        <el-table-column
            prop="productNum"
            label="库存"
            width="80">
        </el-table-column>
        <el-table-column width="150" label="数量">
            <template slot-scope="scope">
              <el-input-number 
                v-model="scope.row.productAmount"
                @change="productAmountChange(scope.$index, scope.row)"
                :min="0" 
                size="mini"
                :max="scope.row.productLimit" 
                label="描述文字"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column
          label="错误信息"
          width="150"
          :formatter="msgFormatter">
        </el-table-column>
        <el-table-column
          prop="productSum"
          label="合计"
          width="80"
          sortable
          :formatter="formatter">
        </el-table-column>
    </el-table>
  </el-main>
  <el-footer>
    <div>
      <div style="font-size:30px;float:left">
        <span class="title" >员工应付总款:</span>￥{{total}}({{limitTotal}})
      </div>  
      <div style="float:right"><el-button :loading="loading" @click="orderCtreate" :disabled="commitOrderDisabled" type="primary">{{btnText}}</el-button></div>
    </div>
  </el-footer>
  <el-dialog
    title="消息提示"
    :visible.sync="dialogVisible"
    width="30%">
    <span>订单创建成功！</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible=false">确认</el-button>
    </span>
  </el-dialog>
</el-container>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible:false,
        userName:'',
        loading:false,
        total:0,
        limitTotal:0,
        productData: []
      }
    },
    computed:{
      commitOrderDisabled:function(){
        if(this.limitTotal>8000){
          /* this.$alert('订购产品不能超过8000', '超额提示', {
            confirmButtonText: '确定',
            type:'error'
          }); */
          return true;
          thiz.btnText = '总额超过8000';
        }
        return false;
      },
      btnText:function(){
        if(this.limitTotal>8000){
          return '总额超过8000';
        }
        return '提交订单';
      },
    },
    methods: {
      goOrderListKf(){
        window.open('/#/annualMeeting/orderListKf')
      },
      login(){
        let thiz = this;
        thiz.loading = true;
        this.$tupHttp(thiz,'user/login','POST',{userName:this.userName}).then(res=>{
            thiz.loading = false;
            debugger
            if(res.body.code!=0){
              thiz.$notify.error({
                title: '错误提示',
                message: res.body.msg
              });
              return ;
            }
            thiz.loadProductData();
            let data = res.body.user;
            thiz.$storage.setName(data.name);
            thiz.$storage.setArea(data.area);
            thiz.$storage.setPhone(data.phone);
            thiz.$storage.setProvince(data.province);
            thiz.$storage.setDept(data.dept);
            thiz.$storage.setCode(data.code);
            thiz.$storage.setToken(res.body.token);
            thiz.$store.commit('common/setAnnualUser',data);
            thiz.$router.push({ path: '/annualMeeting/order' });
          },res=>{
            thiz.loading = false;
          })
      },
      handleCommand(command) {
        switch(command){
          case "out":
            //this.$storage.clearAll();
            //this.$router.push({ path: '/annualMeeting/login' });
          break;
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (row.productAmount > row.productNum) {
          return 'error-row';
        }
        else if (0 === row.productNum) {
          return 'null-row';
        }
        return '';
      },
      msgFormatter(row, column){
        let txt = '';
        if(row.productAmount > row.productNum){
          txt = '库存剩余'+row.productNum+row.productUnit;
        }
        return txt;
      },
      formatter(row, column) {
        let txt = '';
        if(!!row[column.property]){
          txt = '￥'+row[column.property];
        }
        return txt;
      },
      getTotal(){
        let thiz = this;
        this.total = 0;
        this.limitTotal = 0;
        this.productData.forEach(item=>{
          let productSum = !!item.productSum ? item.productSum : 0;
          if(!!item.productNoSum){
            thiz.total += productSum;
          }
          else{
            thiz.total += productSum;
            thiz.limitTotal += productSum;
          }
        })
      },
      productAmountChange(index, row) {
        let thiz = this;
        this.$nextTick(()=>{
          row.productSum = row.productAmount * row.productPrice;
          thiz.getTotal();
        })        
      },
      loadProductData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'product/list','GET').then(res=>{
          thiz.productData=res.body.data;
        })
      },
      orderCtreate(){
        let data = [];
        let thiz = this;
        thiz.productData.forEach(item=>{
          if(item.productAmount>0){
            data.push(item)
          }
        })
        if(data.length>0){
          thiz.$tupHttp(thiz,'order/create','POST',data).then(res=>{
            if(res.body.code==0){
              thiz.dialogVisible = true;
              thiz.loadProductData();
            }else{
              thiz.$notify.error({
                title: '错误提示',
                message: res.body.msg
              });  
              let overStockProducts = res.body.overStockProducts;
              if(overStockProducts.length>0){
                overStockProducts.forEach(item=>{
                  thiz.productData.map(pro=>{
                    if(pro.productCode==item.productCode){
                      pro.productNum = item.productNum;
                    }
                  })
                })
              }
            }
          })
        }
      }
    },
    mounted(){
      this.loadProductData()
    }
  }
</script>
<style>
.title{
  color:#67C23A
}
.el-table .error-row {
  background: #F56C6C;
}
.el-table .null-row {
  background: #ccc;
}
</style>
