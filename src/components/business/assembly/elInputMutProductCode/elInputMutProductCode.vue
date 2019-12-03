<template>
  <div>
    <el-select
      style="width:100%"
      v-model="pCodeList"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请输入产品编号"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        v-for="item in productList"
        :key="item.pCode"
        :label="item.pCode+'('+item.pName+')'"
        :value="item.pCode">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'elInputMutProductCode',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    value:{
      type: String,
      default: ''
    }
  },
  data(){
    return {
      productList:[],
      pCodeList:[]
    }
  },
  watch:{
    value:function(val){
      this.productCode = val;
    },
    pCodeList:function(val){
      this.$emit('add',val);
    }
  },
  methods: {    
    remoteMethod(query){        
      if(query.length < 4){
        this.productList = []
        return;
      }
      let thiz = this;
      let searchParam = {
        condition:{
          pCode: query,
          pName: "",
          catalogCode:""
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:10
        }
      }
      thiz.$baseData.productList(thiz,searchParam).then(res=>{
        thiz.productList  = res.body.models;
      })
    },
  },
  mounted () {
    
  },
  computed: {
  }
}
</script>

<style scoped>
.leftTree{
    overflow-x: hidden;
    overflow-y: scroll;
    height: 400px;
}
</style>

