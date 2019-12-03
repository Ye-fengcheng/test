<template>
  <div class="epmsFrame">    
    <!-- <div>{{model.pName}}</div>
     <div>{{model.contract ? model.contract.pAuthorizeNo:'311506295'}}</div> -->
    <div class="cNumber" style="height:100px;">&nbsp;{{model.contract ? model.contract.pAuthorizeNo:''}}</div>
    <div class="organName" style="height:364px;width:700px;">
      <div style="height:30px;width:196px;font-family: '隶书';font-size: 28px;text-align: center;border: 0px solid #000;">
        {{pOrganName2}}
      </div>
      <div style="height:18px">&nbsp;</div>
      <div style="height:30px;width:182px;font-family: '隶书';font-size: 28px;text-align: center;border: 0px solid #000;">
        {{model.contract ? model.contract.pOrganName:''}}
      </div>
    </div>
    <div class="data" style="height:464px;">&nbsp;{{year}}&nbsp;&nbsp;&nbsp;{{month}}&nbsp;&nbsp;&nbsp;{{day}}<br/>{{date}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientId:this.$route.params.id,
      model:{},
      pOrganName2:'',
      date:'',
      year:'',
      month:'',
      day:''
    };
  },
  watch: {
    date:function(val){
      if(val){
        debugger
        let arr = val.split('-')
        this.day = arr[2]
        this.month = arr[1] > 9 ? arr[1] : '0'+arr[1].substr(1,1)
        this.year = arr[0].substr(2,2)
      }
    }
  },
  methods: {
    getInfo(){
      let thiz = this;
      thiz.$tupHttp(thiz,'user/info/v1?clientId='+this.clientId,'GET').then(res=>{
        let model = res.body.model;  
        thiz.model = model; 
        if(model.pOrganName2.indexOf('专卖店') != -1){
          thiz.pOrganName2 = model.pOrganName2.substring(0,model.pOrganName2.indexOf('专卖店'))
        }
        if(model.contract){
          thiz.date = model.contract.pDbProtocolDateE ? new Date(model.contract.pDbProtocolDateE).format("yyyy-MM-dd"):''
        }
        setTimeout(function(){
          window.print()
        })
      }) 
    },
  },
  mounted(){
    this.getInfo();    
  }
};
</script>

<style scoped>
.cNumber{
  font-family:'Arial Black';
  font-size: 16px;
  font-weight: bold;
  padding: 112px 0 0 180px ;
}
.organName{
  font-family:'华文隶书';
  font-size: 24px;
  padding: 295px 0 0 320px !important;
}
.data{
  font-family:'Arial Black';
  font-size: 16px;
  font-weight: bold;
  padding: 468px 0 0 419px !important;
}
.epmsFrame {
  width:100%;
}
</style>