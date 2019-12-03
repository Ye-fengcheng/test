<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >账户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/account/underLine'}">线下充值</el-breadcrumb-item>
      <el-breadcrumb-item>充值详情</el-breadcrumb-item>
    </el-breadcrumb>

    <br/>
    <el-row :gutter="20">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16">
        <el-form :model="comForm" :rules="comRules" label-position="right" ref="comForm" label-width="120px">
          <el-form-item label="充值单据号" prop="billNo">
            <el-input disabled="true" v-model="comForm.billNo"  placeholder="充值单据号"></el-input>
          </el-form-item> 
          <el-form-item label="付款金额" >
            <el-input disabled="true" v-model="amount"  placeholder="付款金额"></el-input>
          </el-form-item>   
          <el-form-item label="货款金额" prop="balance">
            <el-input-number :min="0" v-model="balance" disabled="true" placeholder="货款金额"></el-input-number>
          </el-form-item>
          <el-form-item label="保证金金额" prop="deposit">
            <el-input-number :min="0" v-model="deposit" disabled="true" placeholder="保证金金额"></el-input-number>
          </el-form-item>      
          <el-form-item label="客户提交时间" prop="createTime">
            <el-input disabled="true" v-model="createTime"  placeholder="客户提交时间"></el-input>
          </el-form-item> 
          <el-form-item label="打款时间" prop="commitTime">
            <el-input disabled="true" v-model="commitTime"  placeholder="打款时间"></el-input>
          </el-form-item>      
          <el-form-item label="收款银行">
            <el-select v-model="comForm.bank" clearable filterable disabled="true" placeholder="请选择">
              <el-option label="建设银行" value="8796113174619"></el-option>
              <el-option label="工商银行" value="8796113076315"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select disabled="true" v-model="comForm.auditStatus" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.audit_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专卖店编号" prop="title">
            <el-input disabled="true" v-model="comForm.creatorId"  placeholder="专卖店编号"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="title">
            <el-input disabled="true" v-model="comForm.creator"  placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item label="款项用途" prop="title">
            <el-select disabled="true" v-model="comForm.type" clearable filterable  placeholder="请选择">
              <el-option label="保证金" value="8796120940635"></el-option>
              <el-option label="货款" value="8796120907867"></el-option>
              <el-option label="同时转货款和保证金" value="8796121071707"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单币种" prop="title">
            <el-input disabled="true"  placeholder="人民币"></el-input>
          </el-form-item>
          <el-form-item label="票据1" prop="credential1">
            <el-button v-if="comForm.credential1" @click="showPic(comForm.credential1)"  type="primary">查看</el-button> 
          </el-form-item>
          <el-form-item label="票据2" prop="credential2">
            <el-button v-if="comForm.credential2" @click="showPic(comForm.credential2)"  type="primary">查看</el-button> 
          </el-form-item>
          <el-form-item label="客服审核人员" prop="auditor1">
            <el-input disabled="true" v-model="comForm.auditor1"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="客服审核时间" prop="auditor1Time">
            <el-input disabled="true" v-model="auditor1Time"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="客服处理意见" prop="comment1">
            <el-input disabled="true" type="textarea" :row="2" v-model="comForm.comment1"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="财务审核人员" prop="auditor2">
            <el-input disabled="true" v-model="comForm.auditor2"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="财务审核时间" prop="auditor2Time">
            <el-input disabled="true" v-model="auditor2Time"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="财务处理意见" prop="comment2">
            <el-input disabled="true" type="textarea" :row="2" v-model="comForm.comment2"  placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="最后更新时间" prop="updateTime">
            <el-input disabled="true" v-model="updateTime"  placeholder="最后更新时间"></el-input>
          </el-form-item> 
          <el-form-item label="备注" prop="remark">
            <el-input  type="textarea" disabled="true" :row="2" v-model="comForm.remark"  placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>    
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>          
    </div>
    <el-dialog title="图片预览" width="95%" top="5%" style="text-align:center" :visible.sync="dialogVisible">
      <div style="text-align:left;margin-bottom:15px;"><el-button icon="el-icon-refresh" circle title="旋转" @click="transform"></el-button><el-button type="text"  @click="openWin">查看原图</el-button></div>
      <img :src="picUrl" style="max-width:80%;height:auto; " ref="img"/>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tramsferNum:0,
        imgBili:0,
        id:this.$route.params.id,
        dialogVisible:false,
        current:0,
        picUrl:'',
        Dictions:{
          audit_status:[]
        },
        comForm:{
          auditor1:'',
          auditor1Id:'',
          auditor2:'',
          auditor2Id:'',
          balance:'',
          bank:'',
          commitTime:'',
          createTime:'',
          creator:'',
          creatorId:'',
          credential1:'',
          credential2:'',
          comment1:'',
          comment2:'',
          deposit:'',
          id:'',
          remark:'',
          auditStatus:'',
          auditor1Time:'',
          auditor2Time:'',
          type:'',
          updateTime:''
        },
        balance:'',
        deposit:'',
        comRules:{
        },
        areas: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
        loading:false,
        activeName:'zero',
        treeLoading:false,
        commitTime:'',
        createTime:'',
        auditor1Time:'',
        auditor2Time:'',
        updateTime:''
      }
    },
    watch:{
      balance:function(val){
        this.comForm.balance = val
      },
      deposit:function(val){
        this.comForm.deposit = val
      },
      'comForm.createTime':function(val){
        if(val)
          this.createTime = new Date(val).format("yyyy-MM-dd hh:mm:ss")
      },
      'comForm.commitTime':function(val){
        if(val)
          this.commitTime = new Date(val).format("yyyy-MM-dd hh:mm:ss")
      },
      'comForm.auditor1Time':function(val){
        if(val)
          this.auditor1Time = new Date(val).format("yyyy-MM-dd hh:mm:ss");
      },
      'comForm.auditor2Time':function(val){
        if(val)
          this.auditor2Time = new Date(val).format("yyyy-MM-dd hh:mm:ss");
      },
      'comForm.updateTime':function(val){
        if(val)
          this.updateTime = new Date(val).format("yyyy-MM-dd hh:mm:ss");
      }
    },
    computed: {
      amount:function(){
        return this.balance + this.deposit
      }
    },
    methods: {
      transform(){
        this.current = (this.current+90)%360;
        debugger
        if(this.tramsferNum === 0){
          this.imgBili = this.$refs.img.width/this.$refs.img.height
        }
        this.tramsferNum ++ ;
        if(this.tramsferNum % 2 === 1){
          this.$refs.img.style.width = this.$refs.img.width*this.imgBili +'px'
          this.$refs.img.style.height = this.$refs.img.height*this.imgBili +'px'
        }        
        else {
          this.$refs.img.style.width = this.$refs.img.width/this.imgBili +'px'
          this.$refs.img.style.height = this.$refs.img.height/this.imgBili +'px'
        }
        this.$refs.img.style.transform = 'rotate('+this.current+'deg)';
        
      },
      openWin(){
        window.open(this.picUrl)
      },
      showPic(url){
        this.tramsferNum = 0;
        this.dialogVisible = true;
        this.picUrl = url;
        this.current = 0;
        this.$refs.img.style.transform = 'rotate(0deg)';
      },
      editItem(index, row) {
        this.gotoUrl('/frame/promotion/promotionDetail/'+row.id)
      },
      treeChange(node,isSelect,hasChild){
        let keys = this.$refs.areaTree.getCheckedKeys();
        this.comForm.targetAreas=keys.indexOf('0')==-1 ? this.$refs.areaTree.getCheckedKeys() : [0];
      },
      commitData(pass){
        let thiz = this;
        this.loading = true;
        let data = {
          balance:this.comForm.balance,
          comment:this.comForm.comment1,
          deposit:this.comForm.deposit,
          bank:this.comForm.bank,
          id:this.comForm.id,
          pass:pass,
          remark:this.comForm.remark
        }
        thiz.$tupHttp(thiz,'account/charge/customer/audit','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '处理成功'
          });
          this.gotoUrl('/frame/account/underLineForCs')
        },res=>{
          thiz.loading = false;
        })
      }, 
      financeCommitData(pass){
        let thiz = this;
        this.loading = true;
        let data = {
          balance:this.comForm.balance,
          comment:this.comForm.comment2,
          deposit:this.comForm.deposit,
          bank:this.comForm.bank,
          id:this.comForm.id,
          pass:pass,
          remark:this.comForm.remark
        }
        thiz.$tupHttp(thiz,'account/charge/finance/audit','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '处理成功'
          });
          this.gotoUrl('/frame/account/underLineForFinance')
        },res=>{
          thiz.loading = false;
        })
      }, 
      financeCommit(pass){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.financeCommitData(pass);
          } else {
            return false;
          }
        });
      },
      commit(pass){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData(pass);
          } else {
            return false;
          }
        });
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      },
      formatter(row, column) {
      return row.publicTime;
      },
      editItem(index, row) {
        this.gotoUrl('/frame/order/areaConfig')
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'account/charge/offline/info/'+this.id,'POST').then(res=>{ 
          thiz.comForm = res.body.model; 
          thiz.balance = thiz.comForm.balance/100
          thiz.deposit = thiz.comForm.deposit/100
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["audit_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadDictions();
      this.getInfo();      
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
</style>