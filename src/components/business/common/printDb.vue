<template>
  <div class="epmsFrame">    
    <!-- <div>{{model.pName}}</div>
     <div>{{model.contract ? model.contract.pAuthorizeNo:'311506295'}}</div> -->
    <div class="cNumber" style="height:100px;">{{model.contract ? model.contract.pAuthorizeNo:''}}</div>
    <div class="organName" style="height:364px;">
      <div style="margin-left: -135px;height:30px;width:500px;text-align: center;font-family: '隶书';font-size: 28px;border: 0px solid #000;">
        {{model.contract ? model.contract.pOrganName:''}}
      </div>
      <div style="height:75px">&nbsp;</div>
      <div style="height:30px;width:100px;text-align: center;font-family: '隶书';font-size: 28px;border: 0px solid #000;margin-left:20px">
        {{model.pCityno}}
      </div>
    </div>
    <div class="data" style="height:464px;">&nbsp;{{year}}&nbsp;&nbsp;&nbsp;{{month}}&nbsp;&nbsp;{{day}}<br/>{{date}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientId:this.$route.params.id,
      model:{},
      date:'',
      year:'',
      month:'',
      day:''
    };
  },
  watch: {
    date:function(val){
      if(val){
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
  padding: 325px 0 0 285px !important;
}
.data{
  font-family:'Arial Black';
  font-size: 16px;
  font-weight: bold;
  padding: 466px 0 0 419px !important;
}
.epmsFrame {
  width:100%;
}
</style>