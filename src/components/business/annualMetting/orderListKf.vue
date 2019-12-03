<template>
<el-container>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card" >
      <el-tab-pane label="未支付" name="first">
        <el-button type="primary" icon="el-icon-refresh" @click="loadOrderData" :loading="loading">刷新</el-button>
        <el-input v-model="code" style="width:250px" placeholder="请输入工号/姓名"></el-input>
        <el-table
            :data="orderData"
            style="width: 100%;"
            height="470">
          <el-table-column
              type="index"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="orderNo"
              label="订单编号"
              width="300">
          </el-table-column>
          <el-table-column
              prop="orderOwner"
              width="150"
              label="员工工号">
          </el-table-column>
          <el-table-column
              prop="orderOwnerName"
              width="150"
              label="员工姓名">
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="状态"
              :formatter="statusFormatter"
              width="80">
          </el-table-column>
          <el-table-column
              prop="orderSum"
              label="订单金额"
              :formatter="formatter"
              width="150">
          </el-table-column>
          <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                  @click="handleDetail(scope.$index, scope.row)"
                  type="text">订单详情</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已支付" name="second">
        <el-table
            :data="orderDataPayed"
            style="width: 100%;"
            height="505">
          <el-table-column
              type="index"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="orderNo"
              label="订单编号"
              width="300">
          </el-table-column>
          <el-table-column
              prop="orderOwner"
              width="150"
              label="员工工号">
          </el-table-column>
          <el-table-column
              prop="orderOwnerName"
              width="150"
              label="员工姓名">
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="状态"
              :formatter="statusFormatter"
              width="80">
          </el-table-column>
          <el-table-column
              prop="orderSum"
              label="订单金额"
              :formatter="formatter"
              width="150">
          </el-table-column>
          <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                  @click="handleDetail(scope.$index, scope.row)"
                  type="text">订单详情</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
  </el-tabs>
  </el-main>
  <el-dialog
    title="订单详情"
    :visible.sync="dialogVisible"
    top="5%"
    width="80%">
    <el-table
      :data="orderDeatilData"
      show-summary
      height="350"
      :summary-method="getSummaries"
      style="width: 100%">
      <el-table-column
        prop="productCode"
        label="产品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productUnit"
        idth="60"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="productPrice"
        :formatter="formatter"
        label="单价">
      </el-table-column>
      <el-table-column
        prop="productNum"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="productSum"
        :formatter="formatter"
        label="合计">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
    </span>
  </el-dialog>
</el-container>
</template>

<script>
  export default {
    data() {
      return {
        code:'',
        loading:false,
        activeName:'first',
        dialogVisible:false,
        allData:[],
        orderData: [],//未支付订单数据
        orderDataPayed:[],//已支付订单数据
        orderDeatilData:[]//订单详情数据
      }
    },
    watch:{
      code:function(val){
        debugger
        this.orderData = this.allData.filter(item => {
          debugger
          return item.orderOwner.toLowerCase()
            .indexOf(val.toLowerCase()) > -1 || item.orderOwnerName.toLowerCase()
            .indexOf(val.toLowerCase()) > -1;
        })
      }
    },
    methods: {
       getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          }
          if(column.property!='productSum'){
            return ;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = '￥ ' + sums[index];
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
      formatter(row, column) {
        let txt = '';
        if(!!row[column.property]){
          txt = '￥'+row[column.property];
        }
        return txt;
      },
      statusFormatter(row, column) {
        let txt = '';
        if(row[column.property]==1){
          txt = '已付款';
        }
        else{
          txt = '未付款';
        }
        return txt;
      },
      loadOrderDataPayed(){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/list/payed','GET').then(res=>{
          thiz.orderDataPayed=res.body.data;
        })
      },
      loadOrderData(){
        let thiz = this;
        this.loading=true
        thiz.$tupHttp(thiz,'order/list/new','GET').then(res=>{
          thiz.loading=false;
          thiz.allData = res.body.data;
          thiz.orderData=res.body.data;
        },res=>{
          thiz.loading=false;
        })
      },
      handleDetail(index,row){
        let thiz =this;
        this.dialogVisible = true;
        thiz.$tupHttp(thiz,'order/info?orderId='+row.id,'GET').then(res=>{
          thiz.orderDeatilData=res.body.data;
        },res=>{
          thiz.orderDeatilData = [];
        })
      },
      handleClick(tab, event) {
        switch(tab.name){
          case 'first':
            this.loadOrderData();
          break;
          case 'second':tab
            this.loadOrderDataPayed();
          break;
        }
      },
      handleEdit(index,row){
        let thiz = this;
        this.$confirm('是否确认已收款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          debugger
          thiz.loading=true;
          thiz.$tupHttp(thiz,'order/pay?orderId='+row.id,'POST').then(res=>{
            thiz.loading=false;
            if(res.body.code==0){
              thiz.$notify({
                type: 'success',
                message: '确定成功!'
              });
            }
            else{
              thiz.$notify.erroe({
                type: 'success',
                message: res.body.msg
              });
            }
            thiz.loadOrderData();
          },res=>{
            thiz.loading=false;
          })
        }).catch(() => {         
        });
      }
    },
    mounted(){
      this.loadOrderData();
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
