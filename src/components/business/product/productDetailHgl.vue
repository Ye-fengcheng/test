<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/product/productClassification' }">产品分类数据维护</el-breadcrumb-item>
      <el-breadcrumb-item>{{itemNo}}产品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>      
    <div class="itemsTitle"></div>
    <div>
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="220px">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Item_No">
              <B>{{model.itemNo}}</B>
            </el-form-item>
          </el-col>
          <el-col :span="12">       
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Chinese_Name" prop="chineseName">
              <el-input v-model="model.chineseName" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product_Description" prop="productDescription">
              <el-input v-model="model.productDescription" placeholder=""></el-input>
            </el-form-item>        
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="TOP_N" prop="topN">
              <el-input v-model="model.topN" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="Platform" prop="platform">
              <el-input v-model="model.platform" placeholder=""></el-input>
            </el-form-item>           
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Category"  prop="category">
              <el-input v-model="model.category" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="master_sales"  prop="masterSales">
              <el-input v-model="model.masterSales" placeholder=""></el-input>
            </el-form-item>         
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Prod_Line" prop="prodLine">
              <el-input v-model="model.prodLine" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="China_Sub_Category" prop="chinaSubCategory">
              <el-input v-model="model.chinaSubCategory" placeholder=""></el-input>
            </el-form-item>          
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Sales_Type" prop="salesType">
              <el-input v-model="model.salesType" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="GP_management" prop="gpManagement">
              <el-input v-model="model.gpManagement" placeholder=""></el-input>
            </el-form-item>        
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Global_Category" prop="globalCategory">
              <el-input v-model="model.globalCategory" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="Pyramid" prop="pyramid">
              <el-input v-model="model.pyramid" placeholder=""></el-input>
            </el-form-item>         
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="Global_Prod_Line" prop="globalProdLine">
              <el-input v-model="model.globalProdLine" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="Global_Sub_Category" prop="globalSubCategory">
              <el-input v-model="model.globalSubCategory" placeholder=""></el-input>
            </el-form-item>      
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <!-- <el-col :span="12">
           <el-form-item label="区域促销">
              <el-radio v-model="model.regionalPromotion" label="Y">是</el-radio>
              <el-radio v-model="model.regionalPromotion" label="N">否</el-radio>
              <el-radio v-model="model.regionalPromotion" label="">无</el-radio>
            </el-form-item> 
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="会员套装">
              <el-radio v-model="model.memberSuit" label="Y">是</el-radio>
              <el-radio v-model="model.memberSuit" label="N">否</el-radio>
              <el-radio v-model="model.memberSuit" label="">无</el-radio>
            </el-form-item>            
          </el-col>
        </el-row>
        <!-- <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="团购">
              <el-radio v-model="model.groupPurchase" label="Y">是</el-radio>
              <el-radio v-model="model.groupPurchase" label="N">否</el-radio>
              <el-radio v-model="model.groupPurchase" label="">无</el-radio>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时促销">
              <el-radio v-model="model.temporaryPromotion" label="Y">是</el-radio>
              <el-radio v-model="model.temporaryPromotion" label="N">否</el-radio>
              <el-radio v-model="model.temporaryPromotion" label="">无</el-radio>
            </el-form-item> 
          </el-col>
        </el-row> -->
        <el-row :gutter="5">
          <el-col :span="12">
           <el-form-item label="TOP_N系数" prop="topNCoefficient">
              <el-input v-model="model.topNCoefficient" placeholder=""></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格零售区间">
              <el-select v-model="model.retailPriceRange" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in Dictions.retail_price_range"
                  :key="parseInt(item.dictValue)"
                  :label="item.dictName"
                  :value="parseInt(item.dictValue)">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">保存</el-button>
    </div>
    <br/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        itemNo:this.$route.params.itemNo,
        rowId:this.$route.params.rowId,
        loading:false,
        pics:[          
        ],
        Dictions:{
          retail_price_range : []
        },
        model:{},
        modelRules:{
          chineseName: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          productDescription: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          topN: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          platform: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          category: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          masterSales: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          prodLine: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          chinaSubCategory: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          salesType: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          gpManagement: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          globalCategory: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          pyramid: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          globalProdLine: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ],
          globalSubCategory: [
            { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch:{
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.model);
        thiz.$tupHttp(thiz,'mktProdClassification/updateProductDetail','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(){
        this.$refs.modelForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'/mktProdClassification/getProductDetail','POST',{rowId:this.rowId}).then(res=>{
          let model = res.body.model;
          thiz.model = model;          
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["retail_price_range"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
      this.loadData();
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 16px;
  color: rgb(223, 8, 8);
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.dialog-footer{
  margin-top: 10px;
  text-align: right;
}
.grid-content{
  border: 0px solid #eee;
  padding: 5px;
  border-radius: 5px;
}
.transition-box {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>


