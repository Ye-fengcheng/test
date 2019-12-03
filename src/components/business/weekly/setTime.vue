<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>周报/月报</el-breadcrumb-item>
      <el-breadcrumb-item>填写时间设置</el-breadcrumb-item>
    </el-breadcrumb>
    <hr/>
    <el-row>
      <el-col :span="24">
        <el-form :model="model" ref="modelForm" label-width="180px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间："  prop="reportStartDay">
                <el-select v-model="model.reportStartDay" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始小时：" prop="reportStartHour">
                <el-input-number  v-model="model.reportStartHour" :min="0" :max="23"  placeholder=""></el-input-number><span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="结束时间："  prop="reportEndDay">
                <el-select v-model="model.reportEndDay" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束小时：" prop="reportEndHour">
                <el-input-number  v-model="model.reportEndHour" :min="0" :max="23"  placeholder=""></el-input-number><span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="获取周报时间:" prop="diffDay">
                <el-input-number  v-model="model.diffDay" :min="0" :max="23"  placeholder=""></el-input-number><span></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="commit" :loading="loading" type="primary">提交</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:false,
        options: [
          {
            value: '2',
            label: '星期一'
          },
          {
            value: '3',
            label: '星期二'
          },
          {
            value: '4',
            label: '星期三'
          },
          {
            value: '5',
            label: '星期四'
          },
          {
            value: '6',
            label: '星期五'
          },
          {
            value: '7',
            label: '星期六'
          },
          {
            value: '1',
            label: '星期天'
          },
        ],
        model:{
          createBy: null,
          createTime: null,
          diffDay : 1,
          pk: null,
          reportEndDay : "2",
          reportEndHour : 18,
          reportStartDay : "5",
          reportStartHour : 9,
          updateBy : null,
          updateTime : null
        }
      }
    },
    methods: {
      commit(){
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'saveSettingInfo','POST',thiz.model).then(res=>{
          thiz.loading = false;
          if(res.body.success){
            thiz.$notify.success({
              title: '提示',
              message: '操作成功'
            });
            thiz.model = res.body.model;  
          }
          else{
            thiz.$notify.error({
              title: '错误提示',
              message: res.body.message
            });
          }
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'loadSettingInfo','GET').then(res=>{
          thiz.loading = false;
          if(res.body.success){
            if(!!res.body.model) {
              thiz.model = res.body.model;
            }
          }
        },res=>{
          thiz.loading = false;
        })
      }
    },
    mounted(){
      this.loadData()
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
