<template>
  <el-container class="all" style="background-image:url(../../../static/useJs/bg.png);">
    <el-header style="height:200px"></el-header>
    <el-main>
      <el-row>
        <el-col :span="7">&nbsp;</el-col>
        <el-col :span="10" style="text-align:center">  
          <div style="margin:auto;text-align:center">               
            <div class="radius">
              <img src="../../../assets/bi.png">
            </div>
            <div class="radius">
              <img src="../../../assets/crm.png">
            </div>
            <div class="radius">
              <router-link to="/login"><img src="../../../assets/sale.png"></router-link>
            </div>
          </div>                  
        </el-col>
        <el-col :span="7">&nbsp;</el-col>
      </el-row>            
    </el-main>
    <el-footer></el-footer>
  </el-container>   
</template>
<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
    }
  }
</script>
<style scoped>
  .block {
      border: 1px solid #ebebeb;
      padding: 20px;
      border-radius: 3px;
      transition: .2s;
      margin:0 auto;
  }
  .all{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%
  }
  .radius{
    border-radius: 50px;
    float: left;
    background: #fff;
    margin-right: 20px;
    cursor: pointer;
  }
  .radius :hover{
    background: #ff7000;
    border-radius: 50px;
  }
</style>
