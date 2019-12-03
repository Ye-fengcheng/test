<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>专卖店申请</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/customerApprove/customerCloseApprove'}">结业申请</el-breadcrumb-item>
      <el-breadcrumb-item>结业申请审核</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="专卖店信息" name="zero">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="结业原因：">
                  {{formatter({reason:model.reason},{property:'reason'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店编号：">
                  {{model.clientId}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店名称：">
                  {{model.client.pOrganName2}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店地址：">
                  {{model.client.pAddress2}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="区域：">
                  {{model.citregionoffice}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="省办：">
                  {{model.citprovincialoffice}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="城市级别：">
                  {{model.client.pCitylevel}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店状态：">
                  {{formatter({'client.pOutletStatus':model.client.pOutletStatus},{property:'client.pOutletStatus'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开业日期：">
                  {{formatter({'client.pOpenningDate':model.client.pOpenningDate},{property:'client.pOpenningDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="首订日期：">
                  {{formatter({'client.pFirstorderDate':model.client.pFirstorderDate},{property:'client.pFirstorderDate'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结业日期：">
                  {{formatter({'client.pGraduationDate':model.client.pGraduationDate},{property:'client.pGraduationDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="关店后货物处理：">
                  {{formatter({'cargoHandling':model.cargoHandling},{property:'cargoHandling'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际关店日期：">
                  {{formatter({'closeDate':model.closeDate},{property:'closeDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="width:95%;margin:30px 0px 30px 50px;">
      <el-steps :space="200" :active="active" :process-status="pass ? 'process' : 'error'" finish-status="success">
        <el-step title="创建成功"></el-step>
        <el-step title="省办"></el-step>
        <el-step title="区域"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div>
        <el-form :model="model" ref="modelForm" label-width="180px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建人：">
                {{model.creator}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间：">
                {{formatter({createTime:model.createTime},{property:'createTime'})}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in model.steps" :key="index">
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批人：'">
                {{item.auditorName}}({{item.auditorId}})
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批时间：'">
                {{formatter({'item.createTime':item.createTime},{property:'item.createTime'})}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批备注：'">
                {{item.comment}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div style="width:100%; text-align:center">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button icon="el-icon-close"  @click="noPassdialogVisible = true" type="danger">驳回</el-button>
      <el-button icon="el-icon-check" @click="passdialogVisible = true" type="success">审核通过</el-button>
    </div>
    <el-dialog title="驳回"  width="40%" top="5%" :visible.sync="noPassdialogVisible">
      <el-form :rules="noPassFormRules" :model="noPassForm" ref="noPassForm" label-width="60px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="noPassForm.remark"  placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="noPass">确认</el-button>
        <el-button size="mini" @click="noPassdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核通过"  width="40%" top="5%" :visible.sync="passdialogVisible">
      <el-form :rules="passFormRules" :model="passForm" ref="passForm" label-width="120px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="passForm.remark"  placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="passFun">确认</el-button>
        <el-button size="mini" @click="passdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
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
        passForm:{
          pass:true,
          remark:'',
        },
        noPassForm:{
          pass:false,
          remark:''
        },
        noPassFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        passFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        id:this.$route.params.id,
        multipleSelection:[],
        customerModel:{},
        model:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          graduation_reason:[]
        },
        loading:false,
        activeName:'zero',
        treeLoading:false
      }
    },
    watch:{
    },
    methods: {
      getStepName(ind){
        let txt = ''
        if(this.model.source != 1){
          txt = '区域'
        }
        else{
          switch(ind){
            case 0:
              txt = '省办'
            break
            case 1:
              txt = '区域'
            break
          }
        }        
        return txt;
      },
      showPic(picUrl){
        window.open(picUrl)
      },
      updateFwi(row){
        this.fwiForm = row.fwi ? row.fwi:{}
        this.pass = row.auditStatus > -1;
        if(this.pass){
          this.active = row.auditStatus == 0 ? 1 :(row.auditStatus == 3 ? 4 : row.auditStatus);
        }
        else{
          this.active = Math.abs(row.auditStatus + 1);
        }
      },
      commitData(pass){
        let thiz = this;
        this.loading = true;
        let remark = pass ? this.passForm.remark : this.noPassForm.remark;
        thiz.$tupHttp(thiz,'flow/graduation/audit?applyId='+this.id+'&pass='+pass+'&remark='+remark,'GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '操作成功'
          });
          thiz.gotoUrl('/frame/customerApprove/customerCloseApprove')
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
        if(column.property =='reason'){
          this.Dictions.graduation_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        } 
        else if(column.property =='cargoHandling'){
          this.Dictions.cargo_handling.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        } 
        else if(column.property =='client.pOutletStatus'){
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
        else if(column.property =='fwi.msgSource'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.outletShow'){
          this.Dictions.outlet_show.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.location'){
          this.Dictions.location.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.addressSource'){
          this.Dictions.address_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.bopExplain'){
          this.Dictions.bop_explain.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        
        else if(column.property =='fwi.ownerSex'){
          this.Dictions.gender.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='pOosCode'){
          this.Dictions.oos_code.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property == 'createTime' || column.property =='item.createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='client.pFirstorderDate' || column.property =='client.pOpenningDate' || column.property =='client.pGraduationDate' || 
        column.property == 'contract.pDbProtocolDateE' || column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime' || 
        column.property == 'closeDate'){
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
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'flow/graduation/taskInfo?applyId='+this.id,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
          if(model){
            thiz.updateFwi(model)
          }
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code","graduation_reason","cargo_handling"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getInfo();    
      this.loadDictions();  
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
.img{
  border: #ccc 1px solid;
  padding: 5px;
  width: 210px;
  border-radius: 5px;
}
</style>