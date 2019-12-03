<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>专卖店申请</el-breadcrumb-item>
      <el-breadcrumb-item>发起结业申请</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div>
      <el-form :model="model" ref="modelForm" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择结业专卖店：">
              <el-input-customer v-model="model" @onSelect="handleSelect" ></el-input-customer>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结业原因：">
              <el-select style="width:100%" v-model="reason" placeholder="请选择">
                <el-option
                  v-for="item in Dictions.graduation_reason"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关店后货物处理：">
              <el-select style="width:100%" v-model="cargoHandling" placeholder="请选择">
                <el-option
                  v-for="item in Dictions.cargo_handling"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>    
        <el-row>
          <el-col :span="12">    
            <el-form-item label="实际关店日期：" prop="date">
              <el-date-picker
                v-model="closeDate"
                :picker-options="pickerOptions1"
                range-separator="-"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>   
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专卖店编号：">
              {{model.pUid}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专卖店名称：">
              {{model.pOrganName2}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专卖店地址：">
              {{model.pAddress2}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域：">
              {{model.pCitregionoffice}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省办：">
              {{model.pCitprovincialoffice}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市级别：">
              {{model.pCitylevel}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专卖店状态：">
               {{formatter({pOutletStatus:model.pOutletStatus},{property:'pOutletStatus'})}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开业日期：">
              {{formatter({pOpenningDate:model.pOpenningDate},{property:'pOpenningDate'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首订日期：">
              {{formatter({pFirstorderDate:model.pFirstorderDate},{property:'pFirstorderDate'})}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结业日期：">
              {{formatter({pGraduationDate:model.pGraduationDate},{property:'pGraduationDate'})}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;margin:30px 0px 30px 50px;">
      <el-steps :space="200" :active="active" finish-status="success">
        <el-step title="创建成功"></el-step>
        <el-step title="省办"></el-step>
        <el-step title="区域"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <div style="width:100%; text-align:center">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button icon="el-icon-check" @click="commit" :loading="loading" type="success">提交申请</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions1:{
          disabledDate(time) {
            let today = new Date();
            let tod = today.getTime() - 1*1000*60*60*24;
            let day0 = new Date(tod)
            let t = today.getTime() + 29*1000*60*60*24;
            let day29 = new Date(t);
            return time.getTime() < day0.getTime() || 
            time.getTime() > day29.getTime();
          }
        },
        reason:'',
        cargoHandling:'',
        closeDate:'',
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
          outlet_status:[],
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
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'flow/graduation/submit','POST',{ clientId :this.model.pUid ,reason : this.reason ,closeDate :this.closeDate ,cargoHandling:this.cargoHandling }).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '提交成功'
          });
          thiz.model = {}
          thiz.reason = ''
          thiz.cargoHandling = ''
          thiz.closeDate = ''
        },res=>{
          thiz.loading = false;
        })
      },
      commit(){
        if(!this.model.pUid){
          this.$notify.error({
            title: '提示',
            message : '结业专卖店不能为空'
          });
          return;
        }
        if(!this.reason){
          this.$notify.error({
            title: '提示',
            message : '结业原因不能为空'
          });
          return;
        }
        if(!this.cargoHandling){
          this.$notify.error({
            title: '提示',
            message : '关店后货物处理不能为空'
          });
          return;
        }
        if(!this.closeDate){
          this.$notify.error({
            title: '提示',
            message : '实际关店日期不能为空'
          });
          return;
        }
        this.commitData()
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
        else if(column.property =='pFirstorderDate' || column.property =='pOpenningDate' || column.property =='pGraduationDate' || 
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
      loadDictions(){
        let thiz = this;
        let params = ["graduation_reason","outlet_status","cargo_handling"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
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