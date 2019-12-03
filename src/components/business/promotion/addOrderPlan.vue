<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/promotion/orderPlan' }">下单计划</el-breadcrumb-item>
      <el-breadcrumb-item>添加</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="comForm" :rules="comRules" ref="comForm" label-width="160px">
      <el-form-item label="名称" prop="title">          
        <el-input v-model="comForm.title"  placeholder=""></el-input>
      </el-form-item> 
      <el-form-item label="描述" prop="description">          
        <el-input v-model="comForm.description"  placeholder="" type="textarea" :rows="2"></el-input>
      </el-form-item> 
      <el-form-item label="时间">
        <el-date-picker
          v-model="comForm.date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-switch v-model="comForm.status"></el-switch>
      </el-form-item>
      <el-table :data="areas" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.childrens" style="width: 100%">
              <el-table-column
                label=""
                width="50">
              </el-table-column>
              <el-table-column
                label=""
                width="50"
                prop="code">
              </el-table-column>
              <el-table-column
                label="省办"
                width="300"
                prop="name">
              </el-table-column>
              <el-table-column label="" >
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    align="right"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['09:00:00', '23:59:59']">
                  </el-date-picker>
                </template>
              </el-table-column>        
            </el-table>
            <br/>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          width="50"
          prop="code">
        </el-table-column>
        <el-table-column
          label="区域"
          width="300"
          prop="name">
        </el-table-column>
        <el-table-column label="设置时间" >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['09:00:00', '23:59:59']">
            </el-date-picker>
            <a @click="copyTime(scope.$index, scope.row)">同步所属省份</a>
          </template>
        </el-table-column>        
      </el-table>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        comForm:{
          date:[],
          status:true,
          description:'',
          title:''
        },
        loading:false,
        areas: [],
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
      }
    },
    watch:{
    },
    methods: {
      copyTime(ind,row){
        debugger
        row.childrens.map(item=>{
          item.datetimerange = row.datetimerange
        })
        this.areas[ind] = row;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },
      commitData(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        data.areas = thiz.areas;
        thiz.$tupHttp(thiz,'promotion111/addItem','POST',data).then(res=>{
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      commit(){        
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      init(){
        let thiz = this;
        thiz.$baseData.areaTree(thiz).then(res=>{
          let areas = [];
          if(res.body.models){
            let models = res.body.models;
            models.map(item=>{
              let childrens = [];
              if(item.childrens){                
                item.childrens.map(node=>{
                  childrens.push({
                    name:node.name,
                    code:node.code,
                    datetimerange:[]
                  })
                })
              }
              areas.push({
                name:item.name,
                code:item.code,
                datetimerange:[],
                childrens:childrens
              })
            })
          }
          thiz.areas = areas;
        },res=>{
          
        }) 
      }
    },
    mounted(){
      this.init()
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  width: 100%;
  margin-top: 10px;
  text-align: right;
}
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
</style>
