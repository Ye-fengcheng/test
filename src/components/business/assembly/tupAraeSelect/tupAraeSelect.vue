<template>
  <div>    
    <el-popover
      placement="bottom"
      width="360">
      <div v-loading="treeLoading" style="height:250px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
        <el-tree
          @check-change='treeChange'
          :data="areas"
          :default-expand-all="true"
          ref="areaTree"
          show-checkbox
          node-key="code"
          :props="defaultProps">
        </el-tree>
      </div>
      <el-input size="mini" ref="input" slot="reference" v-model="title" clearable  placeholder="区域/省办"></el-input>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'tupAraeSelect',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    type:{
      type:String,
      default:'province'
    },
    needstore:{
      type:Boolean,
      default:true
    },
    value:{
      type: Array,
      default: []//结构:{code:'',name:''}
    }
  },
  data(){
    return {
      title:'',
      targetAreas:this.value,
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      areas:[],
      treeLoading:false,
      action:''
    }
  },
  watch:{
    value:function(val){
      this.targetAreas = val;      
      this.cheeckNode();
    },
    title:function(val){
      if(!val){
        this.targetAreas = [];
        this.cheeckNode();
        window.document.body.click();
        this.$emit('update',[])
      }
    },
    targetAreas:function(val){
      this.$emit('update',val);
      let titles = [];
      val.map(item=>{
        titles.push(item.name)
      })
      this.title = titles.join(',')
    }
  },
  methods: {  
    getValues(){
      return this.comForm;
    },
    cheeckNode(){
      let datas = this.targetAreas;
      let data = [];
      datas.map(item=>{
        data.push(item.code)
      })
      this.$refs.areaTree.setCheckedKeys(data);
    },
    treeChange(node,isSelect,hasChild){
      let keys = this.$refs.areaTree.getCheckedKeys();
      this.targetAreas=keys.indexOf('999')==-1 ? this.$refs.areaTree.getCheckedNodes(true) : [{code:'999',name:'全国'}];
    },
    init(){
      let thiz = this;
      let titles = [];
      this.targetAreas.map(item=>{
        titles.push(item.name)
      })
      this.title = titles.join(',')
      thiz.treeLoading = true;
      if(this.type=='area'){
        thiz.$baseData.area(thiz).then(res=>{
          thiz.areas = [
            {
              code:'999',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }
      else if(this.type=='all'){
        //片区模式
        thiz.$baseData.areaAllTree(thiz).then(res=>{
          thiz.areas = [
            {
              code:'999',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }
      else{
        thiz.$baseData.areaTree(thiz).then(res=>{
          thiz.areas = [
            {
              code:'999',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }      
    }
  },
  mounted () {
    this.init();
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

