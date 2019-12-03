<template>
  <div>
    <div style="width:100%;margin:20px 0px 20px 0px;text-align:center;font-size:20px">
      客户通知单（新建）
    </div>
    <div style="width:95%;margin:0px 20px 20px 20px;">
      <el-form :model="stepModel" ref="modelForm" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item class="liHight" label="专卖店名称：">
              {{model.outletName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称：">
              {{model.clientName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="店主姓名：">
              {{model.storekeeperName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店主身份证号：">
              {{model.storekeeperIdcard}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="专卖店联系电话：">
              {{model.outletPhone}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
           <el-form-item label="专卖店地址：">
              {{model.outletAddress ? model.outletAddress.replace('//','') : ''}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">基础资料</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务联系人：">
              {{model.businessContact}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开业时间：">
              {{formatter({'openDate':model.openDate},{property:'openDate'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属城市：">
              {{model.city}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专卖店区域：">
              {{model.regionName}}
            </el-form-item>
          </el-col>          
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专卖店省办：">
              {{model.provinceName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺类型：">
              {{formatter({'storeType':model.storeType},{property:'storeType'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="店铺性质：">
              {{formatter({'storeProperty':model.storeProperty},{property:'storeProperty'})}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新店上级类型：">
              {{formatter({'parentStatus':model.parentStatus},{property:'parentStatus'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属分销商编号：">
              {{model.dbNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分销商名称：">
              {{model.dbName}}
            </el-form-item>
          </el-col>        
        </el-row>
        <div class="itemsTitle">发票资料</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否一般纳税人：">
              {{model.isTaxpayer == 0 ? '是':(model.isTaxpayer == 1 ? '否（不邮寄发票）':'否（邮寄发票）')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司税号：">
              {{model.companyTax}}
            </el-form-item>
          </el-col>     
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司名称：">
              {{model.companyName}}
            </el-form-item>
          </el-col>    
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司地址：">
              {{model.companyAddress}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{model.companyPhone}}
            </el-form-item>
          </el-col>     
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户行：">
              {{model.openningBank}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户账号：">
              {{model.openningBankNumber}}
            </el-form-item>
          </el-col>   
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发票邮寄地址：">
              {{model.mailAddress ? model.mailAddress.replace('//','') :''}}
            </el-form-item>
          </el-col>    
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收件人姓名：">
              {{model.consigneeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人联系电话：">
              {{model.consigneePhone}}
            </el-form-item>
          </el-col> 
        </el-row>
        <div class="itemsTitle">收货信息</div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收货仓库/地点：">
              {{model.receiptAddress ? model.receiptAddress.replace('//',''):''}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收货联系电话：">
              {{model.receiptPhone}}
            </el-form-item>
          </el-col> 
        </el-row>
        <br/>
        <el-row>
          <el-col :span="12">
            <el-form-item label="拓展人：">
              {{stepModel.applyUserName+'('+stepModel.applyUser+')'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期：">
              {{formatter({createTime:stepModel.createTime},{property:'createTime'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in stepModel.steps" :key="index">
          <el-col :span="12">
            <el-form-item :label="getStepName(index)+'审批人：'">
              {{item.auditorName}}({{item.auditorId}})
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getStepName(index)+'日期：'">
              {{formatter({'item.createTime':item.createTime},{property:'item.createTime'})}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="getStepName(index)+'审批备注：'">
              {{item.comment}}
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noPassdialogVisible:false,
        passdialogVisible:false,
        active:0,
        pass:true,
        fwiForm:{},
        stepModel:{},
        passForm:{
          pass:true,
          remark:' ',
          userIds:''
        },
        noPassForm:{
          pass:false,
          remark:''
        },
        noPassFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ],
        },
        passFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        id:this.$route.params.id,
        applyId:this.$route.params.applyId,
        multipleSelection:[],
        customerModel:{},
        model:{
          client:{},
          fwi:{}
        },
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          outlet_show:[],
          outlet_property:[],
          outlet_address_source:[],
          msg_source:[],
          bop_explain:[]
        },
        loading:false,
        activeName:'zero',
        treeLoading:false,
        persons:[]
      }
    },
    watch:{
    },
    methods: {
      getStepName(ind){
        let txt = ''
        switch(ind){
          case 0:
            txt = '省办'
          break
          case 1:
            txt = '区域'
          break
          case 2:
            txt = '渠道部'
          break
          case 3:
            txt = '客服'
          break
        }
        return txt;
      },
      showPic(picUrl){
        window.open(picUrl)
      },
      updateFwi(row){
        this.pass = row.auditStatus > -1;
        if(this.pass){
          this.active = row.auditStatus + 1 == 6 ? 6 : row.auditStatus;
        }
        else{
          this.active = Math.abs(row.auditStatus) - 1;
        }
      },
      commitData(pass){
        let thiz = this;
        this.loading = true;
        debugger
        let remark = pass ? this.passForm.remark : this.noPassForm.remark;
        let userIds = pass ? this.passForm.userIds : '';
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/audit?applyId='+this.applyId+'&userIds='+userIds+'&pass='+pass+'&remark='+window.encodeURIComponent(remark),'GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '操作成功'
          });
          thiz.gotoUrl('/frame/customerApprove/customerOpeningApprove')
        },res=>{
          thiz.loading = false;
        })
      },
      passFun(){
        this.$refs.passForm.validate((valid) => {
          if (valid) {
            this.commitData(true);
          } else {
            return false;
          }
        });
      },
      noPass(){
        this.$refs.noPassForm.validate((valid) => {
          if (valid) {
            this.commitData(false);
          } else {
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      returnGoods(){
        let thiz = this;
        this.loading = true;
        let txt = '订单尚未发货，是否确认退货?';
        if(this.model.orderStatus == 6){
          txt = '订单已发货，是否确认为客户退货?'
        }
        let data = {
          orderNo : this.orderNo,
          details : this.multipleSelection
        }
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/fullOrPartReturn','POST',data).then(res=>{
            thiz.gotoUrl('/frame/order/returnOrderAndGoods')
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      printOpeningApprove(){
        window.open('/#/printOpeningApprove/'+this.id+'/'+this.applyId)
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      editItem(index, row) {
        this.gotoUrl('/frame/order/areaConfig')
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='pCitoutletproperty'){
          this.Dictions.outlet_property.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }  
        else if(column.property =='pOutletStatus'){
          this.Dictions.outlet_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }            
        else if(column.property =='pGradeType'){
          this.Dictions.grade_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }          
        else if(column.property =='pCitoutletproperty2'){
          this.Dictions.outlet_property2.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.visualizeGrade'){
          this.Dictions.visualize_grade.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.graduationReason'){
          this.Dictions.graduation_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='parentStatus'){
          this.Dictions.superior_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })        
        }
        else if(column.property =='information'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='bop'){
          this.Dictions.bop_explain.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='storeProperty'){
          this.Dictions.outlet_property.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='shoppers'){
          this.Dictions.address_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        
        else if(column.property =='storekeeperSex'){
          this.Dictions.gender.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='storeType'){
          this.Dictions.outlet_show2.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property == 'createTime' ||  column.property =='item.createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='openDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property =='contractValidityStart' || column.property =='contractValidityEnd' || column.property =='client.pGraduationDate' || 
        column.property == 'contract.pDbProtocolDateE' || column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      saveFwi(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientFwi','POST',this.fwiForm).then(res=>{
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      getTaskInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/taskInfo?applyId='+this.applyId,'GET').then(res=>{
          let model = res.body.model;  
          thiz.stepModel = model
          if(model){
            thiz.updateFwi(model)
          }
        }) 
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/getStoreInfoById?id='+this.id,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
          setTimeout(function(){
            window.print()
          },1000)
        }) 
      },
      getPerson(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/getReviewer?applyId='+this.applyId+'&regionNo='+this.$storage.getValue('regionNo')+'&provinceNo='+this.$storage.getValue('provinceNo'),'GET').then(res=>{
          let model = res.body.models;  
          thiz.persons = model; 
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["superior_type","outlet_property","outlet_address_source","outlet_show","bop_explain","msg_source","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code","outlet_show2"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getInfo();   
      this.getPerson(); 
      this.getTaskInfo();
      this.loadDictions();  
      
    }
  }
</script>

<style scoped>
.el-row {
  height: 35px !important;
}
.el-form-item {
  height: 35px !important;
}

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
</style>