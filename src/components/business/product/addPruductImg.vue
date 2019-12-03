<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/onSale'}">基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>批量导入产品图片</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-upload
      style="margin-left:10px;"
      :show-file-list="false"
      :multiple="true"
      :limit="50"
      :before-upload="beforeAvatarUpload"
      :httpRequest="upload">
      <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">批量上传图片</el-button>
    </el-upload>
    <div style="margin-left:10px;font-size:12px;color:#333">
    1.图片格式统一为jpg/png,图片名称为 产品编号.jpg/产品编号.png<br/>
    2.单个文件大小不能超过2M<br/>
    3.批量上传一次最多50张
    </div>
    <div>
      <div class="grid-content bg-purple">
        <el-table
          :data="productImgs"
          style="width: 99%;"
          :height="tableHeight"
          highlight-current-row>
          <el-table-column
            prop="pCode"
            width="200"
            label="产品编号">
          </el-table-column>
          <el-table-column
            prop="pCode"
            width="200"
            label="图片预览">
             <template slot-scope="scope">
              <div class="p-img">
                <img :src="scope.row.productImgs[0].pPicLocation" class="picImg"/>
              </div>
            </template>
          </el-table-column>   
          <el-table-column
            prop="status"
            width="120"
            :formatter="formatter"
            label="状态">
          </el-table-column>  
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-upload2" v-if="scope.row.status == 0" @click="reUpload(scope.row.option)" :loading="loading" size="mini">重新上传</el-button>
              <el-button icon="el-icon-delete"  @click="deleteImg(scope.$index, scope.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div> 
    </div>
    <div class="dialog-footer">
      <el-button @click="back">返回</el-button>
      <el-button @click="commit" :loading="loading" :disabled="productImgs.length > 50" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {       
        productImgs:[],
        loading:false
      }
    },
    watch:{
    },
    methods: {
      beforeAvatarUpload(file) {
        debugger
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$notify.error({
            title: '错误提示',
            message: '上传图片只能是 JPG ,PNG格式!'
          });
        }
        if (!isLt2M) {
          this.$notify.error({
            title: '错误提示',
            message: '上传图片大小不能超过 2MB!'
          });
        }
        return isJPG && isLt2M;
      },
      deleteImg(ind,row){
        this.productImgs.splice(ind,1);
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='status'){
          if(row[column.property] == 2){
            txt = '正在上传'
          }
          else if(row[column.property] == 1){
            txt = '上传成功'
          }
          else{
            txt = '上传失败'
          }  
        }
        return txt;
      },
      upload(option){   
        let thiz = this;
        let formData = new FormData();
        formData.append(option.filename, option.file);
        let fileName = option.file.name.split(".")[0]
        thiz.productImgs.push({
          pCode:fileName,
          status:2,//2代表正在上传
          option:option,
          productImgs:[{
            pFilename:fileName,
            pPicLocation: '',
            pSize: option.file.size
          }]
        })
        this.$tupHttp(this,'media/create?parentId=1&category=images&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
          thiz.updateImgs(fileName,1,res.body)
        },res=>{
          thiz.updateImgs(fileName,0,{})
        })
      },
      reUpload(option){   
        let thiz = this;
        thiz.loading = true;
        let formData = new FormData();
        formData.append(option.filename, option.file);
        let fileName = option.file.name.split(".")[0]
        this.$tupHttp(this,'media/create?parentId=1&category=images&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
          thiz.loading = false;
          thiz.updateImgs(fileName,1,res.body)
        },res=>{
          thiz.loading = false;
          thiz.updateImgs(fileName,0,{})
        })
      },
      updateImgs(pCode,status,data){
        this.productImgs.map(item=>{
          if(item.pCode == pCode){
            item.status = status;
            item.productImgs[0].pPicLocation = data.model.ossUrl
          }
        })
      },
      back(){
        let thiz = this;
        if(this.productImgs.length > 0){
          this.$confirm('是否放弃提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            thiz.$router.go(-1)
          }).catch(() => {    
             
          });
        }
        else{
          this.$router.go(-1)
        }
      },
      commit(){        
        let thiz = this;
        this.loading = true;
        let arr = []
        thiz.productImgs.map(item=>{
          if(item.status == 1){
            arr.push({
              productImgs : item.productImgs,
              pCode : item.pCode
            })
          }
        })
        thiz.$tupHttp(thiz,'product/importProductImages','POST',arr).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '提示',
            message: '批量插入成功'
          });
          thiz.productImgs = [];       
        },res=>{
          thiz.loading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
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
  background-color: #ff7700;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
.p-img {
  width: 166px;
  height: 166px;
  text-align: center;
  line-height: 166px;
}
.p-img img{
  vertical-align: middle;
  max-width: 100%;
  max-height: 100%;
}
</style>
