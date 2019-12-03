<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/db/dbProvinceExamine' }">专卖店状态变更省办审批</el-breadcrumb-item>
      <el-breadcrumb-item>省办审批</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-row>
    <el-col :span="24">
        <el-form :model="modelCommon" ref="modelCommonForm" label-width="180px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="区域审批状态:"  prop="reportStartDay">
                         <el-select v-model="modelCommon.areaStatus" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'同意'},{value:'2',label:'不同意'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="省办审批状态:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.provinceStatus" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'同意'},{value:'2',label:'不同意'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
           
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="客户ID:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店名称:"  prop="reportStartDay">
                        <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="申请状态:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.status" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'开业'},{value:'2',label:'结业'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="专卖店照片:"  prop="reportStartDay">
                        <a>照片1</a>&nbsp;
                        <a>照片2</a>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="店主性别:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.sex" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'男'},{value:'2',label:'女'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店主年龄:"  prop="reportStartDay">
                        <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="店址来源:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.source" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'店主找店'},{value:'2',label:'员工找店'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="租金:"  prop="reportStartDay">
                        <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="信息来源:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.infoSource" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'会员'},{value:'2',label:'店主'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="BOP讲解:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.BOP" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'分销商'},{value:'2',label:'专卖店'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="开店员工:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="员工身份:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.identity" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'FS'},{value:'2',label:'GS'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="店面形象:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.image" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'G1'},{value:'2',label:'F1'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="具体位置:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.position" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'临街铺面'},{value:'2',label:'小区'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="人员配置:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="专卖店外观:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.appearance" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'三面围墙'},{value:'2',label:'GS'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="月盈亏平衡:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="平均月销售:"  prop="reportStartDay">
                        <el-input v-model="modelCommon.avage"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="面积（平方米）:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店员月工资:"  prop="reportStartDay">
                        <el-input v-model="modelCommon.wages"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="关店原因:"  prop="reportStartDay">
                        <el-select v-model="modelCommon.reason" placeholder="请选择">
                            <el-option
                            v-for="item in [{value:'1',label:'亏损'},{value:'2',label:'铺面租金太高'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>                
                <el-col :span="12">
                    <el-form-item label="省办审批原因:"  prop="reportStartDay">
                        <el-input   placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="dialog-footer">
        <el-button @click="commit"  icon="el-icon-check"  :loading="loading" type="success">同意</el-button>
        <el-button @click="commit" icon="el-icon-close" :loading="loading" type="danger">不同意</el-button>
        </div>
    </el-col>
</el-row>
</div>
</template>

<script>
  export default {
    data() {
      return {
          activeName:'first',
          model:{
              input:'0.00'
          },
          modelCommon:{
              createTime:''
          }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 10px;
  text-align: center;
}

</style>