<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/onSale' }">基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>添加Kit产品</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>      
    <div class="itemsTitle"></div>
    <div>
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="220px">
        <el-form-item  label="产品编号：" prop="pCode">          
         <el-input v-model="model.pCode"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="产品名称（中文）：" prop="pName">          
          <el-input v-model="model.pName"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="产品名称（英文）：">          
          <el-input v-model="model.pEnglishName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="产品上下架日期" prop="pSaleDate">
          <el-date-picker
            v-model="model.pSaleDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>        
        <el-form-item style="margin-bottom:0px" label="产品有效期：" >    
          <el-date-picker
            v-model="model.pExpriceDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>      
          
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="价格有效期：" prop="priceExpriceDate">        
          <el-date-picker
            v-model="model.priceExpriceDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="价格：" prop="price">     
          <el-input-number  v-model="model.price" placeholder=""></el-input-number>
        </el-form-item>    
        <el-form-item label="BO数量">
          <el-input-number disabled v-model="model.productAttr.pBoquantity" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="安全库存">
          <el-input-number v-model="model.productAttr.pSecuritystock" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <div class="itemsTitle">子产品维护</div> 
        <el-row :gutter="5">
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addSubProduct(1)" >添加子产品</el-button>
            <br/><br/>
            <el-table
              :data="model.kitProducts"
              style="width: 99%;"
              border
              height="200"
              highlight-current-row>
              <el-table-column
                prop="pCode"
                label="产品编号"
                width="250">
                <template slot-scope="scope">
                  <el-input-product-code 
                    v-model="scope.row.pCode"
                    @onSelect="handleSelect"
                    :param="scope"
                    size="mini"></el-input-product-code>
                </template>
              </el-table-column>
              <el-table-column
                prop="pName"
                label="产品名称"
                width="250">
              </el-table-column>
              <!-- <el-table-column
                prop="pStatus"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  {{scope.row.pStatus == 1 ? '上架':(scope.row.pStatus == 2 ? '下架':'')}}
                </template>
              </el-table-column>   -->            
              <el-table-column
                prop="qty"
                label="数量"
                width="120">
                <template slot-scope="scope">
                  <el-input-number 
                    v-model="scope.row.qty"
                    :min="1" 
                    size="mini"
                    label="描述文字"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button icon="el-icon-delete"  @click="deleteProduct(scope.$index, scope.row)" size="mini"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>      
        <div class="itemsTitle">JDE产品描述</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否打折" prop="isDiscount">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.isDiscount">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国际条码">
              <el-input v-model="model.pCit3rditemnumber"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="小单位" prop="productAttr.orderSmallUnit">
              <el-select v-model="model.productAttr.orderSmallUnit" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_unit"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否允许欠交">
               <el-switch
                :active-value="true"
                :inactive-value="false"
                v-model="model.pCitboallowed">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="装箱量">
              <el-input-number v-model="model.pCitconversion" placeholder=""></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品属性">
              <el-input v-model="model.pCitglcategory"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品销售类型</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Brand">
              <el-select v-model="model.productAttr.brand" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.brand_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否主推">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="销售平台">
              <el-select v-model="model.productAttr.pFaremode" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.sales_platform"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Category">
              <el-input v-model="model.productAttr.category" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品其它属性</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否TPS">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isTps">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有包装盒">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isBox">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Core line">
              <el-input v-model="model.productAttr.coreLine" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分值">
              <el-input v-model="model.productAttr.integerPoint" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否印刷">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPrint">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可退换货">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.canReturns">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否授权">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isAuth">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保质期">
              <el-input v-model="model.productAttr.pProdguaranteeperiod" placeholder="保质期"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否PC产品">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPc">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上市时间">
              <el-date-picker
                v-model="model.productAttr.pProdrolloutdate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Product Pyramid ">
              <el-select v-model="model.productAttr.pProdpyramid" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.product_pyramid_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订货单位">
              <el-select v-model="model.productAttr.orderUnit" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_unit"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Product GP Management">
              <el-select v-model="model.productAttr.pProdgpmanagement" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.product_gp_management_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新产品标识">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isNewproduct">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Mission Million Products">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.pMssnmlnprod">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否换货">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isReturn">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Sales Type">
              <el-select v-model="model.productAttr.pProdsalestype" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.sales_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否积分">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isInteger">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否区域促销">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isAreaPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否临时促销">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isTemporaryPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品图片</div>
        <tup-picture-select v-model="pics"></tup-picture-select>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">创建</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pCode:this.$route.params.pCode,
        loading:false,
        pics:[          
        ],
        Dictions:{
          brand_type:[],
          sales_platform:[],
          sales_type:[],
          order_unit:[],
          product_gp_management_type:[],
          product_pyramid_type:[]
        },//本页面使用的所有字典
        model:{
          price:1,
          pSaleDate:'',
          pExpriceDate:'',
          priceExpriceDate:'',
          isDiscount:0,
          productAttr:{            
            orderSmallUnit:'',
          },
          kitProducts:[]
        },
        modelRules:{
          pCode: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          pName: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          pSaleDate: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          priceExpriceDate: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          price: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          isDiscount: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          'productAttr.orderSmallUnit': [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        comForm:{
          kitCode:this.$route.params.pCode,
          pCode:'',
          qty:1
        },
        visible:false,
        comRules:{
          pCode: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        subProducts:[]
      }
    },
    watch:{
      'comForm.pCode':function(val){
        this.visible = true;
      },
      'model.pSaleDate':function(val){
        if(!val){
          this.model.productAttr.pOnSaleDate = '';
          this.model.productAttr.pOffSaleDate = '';
        }
        else{
          this.model.productAttr.pOnSaleDate = val[0];
          this.model.productAttr.pOffSaleDate = val[1];
        }
      },
      'model.pExpriceDate':function(val){
        if(!val){
          this.model.productAttr.pOnlinedate = '';
          this.model.productAttr.pOfflinedate = '';
        }
        else{
          this.model.productAttr.pOnlinedate = val[0];
          this.model.productAttr.pOfflinedate = val[1];
        }
      },
      'model.priceExpriceDate':function(val){
        if(!val){
          this.model.priceStartTime = '';
          this.model.priceEndTime = '';
        }
        else{
          this.model.priceStartTime = val[0];
          this.model.priceEndTime = val[1];
        }
      }
    },
    methods: {
      addSubProduct(num){
        if(!num){
          num = 1;
        }
        for(let i=0;i<num;i++){
          this.model.kitProducts.push({
            kitCode:0,
            pCode:'',
            pName:'',
            qty:0
          });
        }      
      },
      deleteProduct(ind,row){
        this.model.kitProducts.splice(ind,1);
      },
      handleSelect(product,scope){     
        scope.row.pCode = product.pCode
        scope.row.pName = product.pName
        scope.row.pStatus = product.pStatus
        this.addSubProduct()
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.model);
        if(this.pics.length>0){
          let pic = this.pics[0];
          if(!pic.id){
            data.productImgs=[{
              pPicLocation:pic.url,
              pSize:pic.size,
              pFilename:pic.name
            }]
          }
        }
        thiz.$tupHttp(thiz,'product/product/addSingleKitProduct','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.model = {
            price:1,
            pSaleDate:'',
            pExpriceDate:'',
            priceExpriceDate:'',
            isDiscount:0,
            productAttr:{              
              orderSmallUnit:'',
            },
            kitProducts:[]
          }
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(){
        debugger
        this.$refs.modelForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      loadDictions(){
        let thiz = this;
        let params = ["brand_type","sales_platform","product_pyramid_type","product_gp_management_type","sales_type","order_unit"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions()
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


