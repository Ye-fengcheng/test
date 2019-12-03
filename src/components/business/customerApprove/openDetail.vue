<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>专卖店申请</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: url}">开业申请</el-breadcrumb-item>
      <el-breadcrumb-item>开业申请详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="专卖店信息" name="zero">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="专卖店地址：">
                  {{model.client.pAddress2}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="渠道类型：">
                  {{model.client.pCitchanneltype}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人：">
                  {{model.client.pAddress4}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话：">
                  {{model.client.pBmMobile}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="店主性别：">
                  {{formatter({'fwi.ownerSex':model.fwi.ownerSex},{property:'fwi.ownerSex'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店主年龄：">
                  {{model.fwi.shopkeeperage}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务员：">
                  {{model.fwi.saleMan}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否有理家顾问：">
                  {{model.fwi.homeConsultantNum >0  ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC1姓名：">
                  {{homeConsultants.length > 0 ? homeConsultants[0].name : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC1电话："> 
                  {{homeConsultants.length > 0 ? homeConsultants[0].phone : ''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="HCC2姓名：">
                  {{homeConsultants.length > 1 ? homeConsultants[1].name : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC2电话：">
                  {{homeConsultants.length > 1 ? homeConsultants[1].phone : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC3姓名："> 
                  {{homeConsultants.length > 2 ? homeConsultants[2].name : ''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="HCC3电话：">
                  {{homeConsultants.length > 2 ? homeConsultants[2].phone : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC4姓名：">
                  {{homeConsultants.length > 3 ? homeConsultants[3].name : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HCC4电话："> 
                  {{homeConsultants.length > 3 ? homeConsultants[3].phone : ''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="人员配置：">
                  {{model.fwi.salesCount}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开店员工：">
                  {{model.fwi.setupEmp}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="员工身份："> 
                  {{model.fwi.empDegree}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否有驻店员工：">
                  {{model.fwi.hasStationEmp ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="BOP讲解：">
                  {{formatter({'fwi.bopExplain':model.fwi.bopExplain},{property:'fwi.bopExplain'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店员工资：">
                  {{model.fwi.clerkmonthlysalary}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="专卖店面积：">
                  {{model.fwi.outletArea}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平均月销售：">
                  {{model.fwi.monthSalesAvg}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月租金：">
                  {{model.fwi.rentCost}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="地址来源：">
                  {{formatter({'fwi.addressSource':model.fwi.addressSource},{property:'fwi.addressSource'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信息来源：">
                  {{formatter({'fwi.msgSource':model.fwi.msgSource},{property:'fwi.msgSource'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月盈亏平衡：">
                  {{model.fwi.profitAndLoss}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="门店位置：">
                  {{formatter({'fwi.location':model.fwi.location},{property:'fwi.location'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门店外观：">
                  {{formatter({'fwi.outletShow':model.fwi.outletShow},{property:'fwi.outletShow'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店面形象：">
                  {{formatter({'fwi.visualizeGrade':model.fwi.visualizeGrade},{property:'fwi.visualizeGrade'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="开业日期：">
                  {{formatter({'client.pOpenningDate':model.client.pOpenningDate},{property:'client.pOpenningDate'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="首订日期：">
                  {{formatter({'client.pFirstorderDate':model.client.pFirstorderDate},{property:'client.pFirstorderDate'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结业日期：">
                  {{formatter({'client.pGraduationDate':model.client.pGraduationDate},{property:'client.pGraduationDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同信息" name="first">
        <el-form  :model="fwiForm" label-width="150px" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="专卖店合同编号：">
                {{model.contract ? model.contract.pDbProtocolNo:''}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同乙方客户名称：">
                {{model.contract ? model.contract.pOrganName:''}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证号："> 
                {{model.contract ? model.contract.pCardNo1:''}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同专卖店地址：">
                {{model.contract ? model.contract.pDbProtocolAddr:''}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="专卖店合同开始日期：">
                {{model.contract ? formatter({'contract.pDbProtocolDateS':model.contract.pDbProtocolDateS },{property:'contract.pDbProtocolDateS'}) : ''}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专卖店合同结束日期：">
                {{model.contract ? formatter({'contract.pDbProtocolDateE':model.contract.pDbProtocolDateE},{property:'contract.pDbProtocolDateE'}) : ''}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>            
            <el-col :span="8">
              <el-form-item label="合同封面照片：">
                <div class="img" v-if="model.contract && model.contract.pFrontPhoto">
                  <img :src="model.contract.pFrontPhoto" @click="showPic(model.contract.pFrontPhoto)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同首页照片：">
                <div class="img" v-if="model.contract && model.contract.pCoverPhoto">
                  <img :src="model.contract.pCoverPhoto" @click="showPic(model.contract.pCoverPhoto)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同签名页照片：">
                <div class="img" v-if="model.contract && model.contract.pSignPhoto">
                  <img :src="model.contract.pSignPhoto" @click="showPic(model.contract.pSignPhoto)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> 
      </el-tab-pane>
      <el-tab-pane label="专卖店照片" name="second">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="店铺正面图片：">
                  <div class="img" v-if="model.fwi && model.fwi.photo">
                    <img :src="model.fwi.photo" @click="showPic(model.fwi.photo)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺内部图片：">
                  <div class="img" v-if="model.fwi && model.fwi.photo2">
                    <img :src="model.fwi.photo2" @click="showPic(model.fwi.photo2)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="店铺左侧图片：">
                  <div class="img" v-if="model.fwi && model.fwi.photo3">
                    <img :src="model.fwi.photo3" @click="showPic(model.fwi.photo3)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺右侧图片：">
                  <div class="img" v-if="model.fwi && model.fwi.photo4">
                    <img :src="model.fwi.photo4" @click="showPic(model.fwi.photo4)" style="width:200px;">
                  </div>
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
        <el-step title="DFS/DM"></el-step>
        <el-step title="省办"></el-step>
        <el-step title="区域"></el-step>
        <el-step title="渠道部"></el-step>
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
        <el-form-item label="下级审批人" prop="userIds">
          <el-input-employees  v-model="passForm.userIds"></el-input-employees>
        </el-form-item>

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
        url:'/frame/customerApprove/customerOpenApprove',
        type:this.$route.params.type,
        noPassdialogVisible:false,
        passdialogVisible:false,
        active:0,
        pass:true,
        fwiForm:{},
        passForm:{
          pass:true,
          remark:'',
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
          ],
          userIds: [
            { required: true, message: '必填', trigger: 'change' }
          ],
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
          return_reason:[]
        },
        loading:false,
        activeName:'zero',
        treeLoading:false,
        homeConsultants:[]
      }
    },
    watch:{
    },
    methods: {
      getStepName(ind){
        let txt = ''
        switch(ind){
          case 0:
            txt = 'DFS/DM'
          break
          case 1:
            txt = '省办'
          break
          case 2:
            txt = '区域'
          break
          case 3:
            txt = '渠道部'
          break
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
          this.active = row.auditStatus + 1 == 5 ? 6 : row.auditStatus + 1;
        }
        else{
          this.active = Math.abs(row.auditStatus);
        }
        if(row.fwi.homeConsultants){
          this.homeConsultants = JSON.parse(row.fwi.homeConsultants)
        }
      },
      commitData(pass){
        let thiz = this;
        this.loading = true;
        let remark = pass ? this.passForm.remark : this.noPassForm.remark;
        let userIds = pass ? this.passForm.userIds : '';
        thiz.$tupHttp(thiz,'flow/openning/audit?applyId='+this.id+'&userIds='+userIds+'&pass='+pass+'&remark='+remark,'GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '操作成功'
          });
          thiz.gotoUrl('/frame/customerApprove/customerOpenApprove')
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
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'flow/openning/taskInfo?applyId='+this.id,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
          if(model){
            thiz.updateFwi(model)
          }
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      if(this.type == 'all'){
        this.url = '/frame/customerApprove/allCustomerOpenApprove'
      }
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