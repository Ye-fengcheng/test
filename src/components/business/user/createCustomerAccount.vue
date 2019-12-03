<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/user/customerAccount' }">客户账号</el-breadcrumb-item>
      <el-breadcrumb-item>添加客户账号</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="客户账户明细" name="first">
        <el-row>
            <el-col :span="24">
                <el-form :model="model" ref="modelForm" label-width="180px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="客户ID:"  prop="reportStartDay">
                                <el-input  :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户余额:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="余额占用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信贷金额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="A折扣差可用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="A折扣差占用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="B折扣差可用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="B折扣差占用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="优惠券可用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="优惠券占用额度:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="保证金:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="责任金:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="积分账号1:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="积分账号2:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="积分账号3:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="积分账号4:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="积分账号5:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="积分占用:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="优惠券:"  prop="reportStartDay">
                                <el-input v-model="model.input" :disabled="true" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="dialog-footer">
                <el-button @click="commit" :loading="loading" type="primary">提交</el-button>
                </div>
            </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="通用" name="second">
          <el-row>
            <el-col :span="24">
                <el-form :model="modelCommon" ref="modelCommonForm" label-width="180px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="分销商名称:"  prop="reportStartDay">
                                <el-input   placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分销商编码:"  prop="reportStartDay">
                                <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="创建时间:"  prop="reportStartDay">
                               <el-date-picker
                                v-model="modelCommon.createTime"
                                type="datetime"
                                placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信贷金占用额度:"  prop="reportStartDay">
                                <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="专卖店编码:"  prop="reportStartDay">
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
                            <el-form-item label="店状态:"  prop="reportStartDay">
                                <el-input   placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="A折扣差可用:"  prop="reportStartDay">
                                <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="B折扣差可用:"  prop="reportStartDay">
                                <el-input   placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="优惠券可用:"  prop="reportStartDay">
                                <el-input v-model="modelCommon.input"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="修改时间:"  prop="reportStartDay">
                               <el-date-picker
                                v-model="modelCommon.createTime"
                                type="datetime"
                                placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型:"  prop="reportStartDay">
                               <el-select v-model="value" placeholder="请选择">
                                    <el-option
                                    v-for="item in [{}]"
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
                            <el-form-item label="区域:"  prop="reportStartDay">
                               <el-select  placeholder="请选择">
                                    <el-option
                                    v-for="item in [{}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="区域:"  prop="reportStartDay">
                               <el-input   placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="省办:"  prop="reportStartDay">
                               <el-select  placeholder="请选择">
                                    <el-option
                                    v-for="item in [{}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="省办:"  prop="reportStartDay">
                               <el-input   placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="所有人:"  prop="reportStartDay">
                               <el-select  placeholder="请选择">
                                    <el-option
                                    v-for="item in [{}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户:"  prop="reportStartDay">
                               <el-select  placeholder="请选择">
                                    <el-option
                                    v-for="item in [{}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="dialog-footer">
                <el-button @click="commit" :loading="loading" type="primary">提交</el-button>
                </div>
            </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
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