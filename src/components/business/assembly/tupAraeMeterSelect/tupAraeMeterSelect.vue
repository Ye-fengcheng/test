<template>
  <div>    
    <el-popover
      placement="bottom"
      width="360">
      <div v-loading="treeLoading" style="height:250px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
        <el-tree
          :data="areas"
          @check-change='treeChange'
          :default-expand-all="true"
          ref="areaTree"
          node-key="code"
          :show-checkbox="showCheck"
          @node-click="nodeClick"
          :expand-on-click-node="false"
          :props="defaultProps">
          <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span >
              <el-button
                type="text"
                size="mini"
                @click="() => select(node, data)">
                选择
              </el-button>
            </span>
          </span> -->
        </el-tree>
      </div>
      <el-input ref="input" size="mini" slot="reference" suffix-icon="el-icon-arrow-down" v-model="title"  clearable placeholder="地区"></el-input>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'tupAraeMeterSelect',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    type:{
      type:String,
      default:'province'
    },
    code:{
      type:String,
      default:'00'
    },
    codeType:{
      type:String,
      default:'country'
    },
    showCheck:{
      type:Boolean,
      default:false
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
        this.$refs.input.$el.click();
        this.$emit('update',[])
      }
    },
    codeType:function(){
      this.init();
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
      if(this.showCheck){//复选模式下触发
        let keys = this.$refs.areaTree.getCheckedKeys();
        this.targetAreas=keys.indexOf('00')==-1 ? this.$refs.areaTree.getCheckedNodes(true) : [{code:'00',name:'全国'}];
      }
    },
    nodeClick(data,node,com){
      if(!this.showCheck){//复选模式下，不触发点击事件
        this.$emit('update',[data]);
        this.$refs.input.$el.click();
      }
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
        if(this.codeType =='country'){
          thiz.$baseData.area(thiz).then(res=>{
            thiz.areas = [
              {
                code:'00',
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
          thiz.treeLoading = false;
        }
      }
      else{
        if(this.codeType =='country'){
          thiz.$baseData.areaTree(thiz).then(res=>{
            thiz.areas = [
              {
                code:'00',
                name:'全国',
                childrens : res.body.models
              }
            ]
            thiz.treeLoading = false;
          },res=>{
            thiz.treeLoading = false;
          }) 
        }
        else if(this.codeType =='region'){
          thiz.$tupHttp(thiz,'area/provinces/'+this.code,'GET').then(res=>{
            thiz.treeLoading = false;   
            let data = thiz.$util.deepClone(thiz.targetAreas);    
            data[0].childrens  = res.body.models;
            thiz.areas = data;
          },res=>{
            thiz.treeLoading = false;
          })
        }
        else{
          thiz.treeLoading = false;
        }
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
.custom-tree-node {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

