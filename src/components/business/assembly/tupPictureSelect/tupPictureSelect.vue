<template>
  <div>
    <!-- <el-button icon="el-icon-search" type="primary" size="mini" @click="picDialogVisible=true">选择图片</el-button>
    <p></p> -->
    <el-upload
      :httpRequest="upload"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'tupPictureSelect',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    multiple:{
      type:Boolean,
      default:false
    },
    value:{
      type: Array,
      default: []
    },
    limit:{
      type: Number,
      default: 1
    }
  },
  data(){
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList:this.value
    }
  },
  watch:{
    value:function(val){
      this.fileList = val;
    }
  },
  methods: {   
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 8;
      if (!isJPG) {
        this.$notify.error({
          title: '错误提示',
          message: '上传图片只能是 JPG ,PNG格式!'
        });
      }
      if (!isLt2M) {
        this.$notify.error({
          title: '错误提示',
          message: '上传图片大小不能超过 8MB!'
        });
      }
      return isJPG && isLt2M;
    }, 
    handleRemove(file, fileList) {
      this.$emit('update',fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    updateFile(file){
      if(this.fileList.length == this.limit){
        this.fileList.splice(0,1)
      }
      this.fileList.push({
        name: file.fileName,
        url: file.ossUrl,
        size: file.fileSize
      });
      this.$emit('update',this.fileList);
    },
    upload(option){     
      let thiz = this;
      this.loading = true;
      let formData = new FormData();
      formData.append(option.filename, option.file);
      this.$tupHttp(this,'media/create?parentId=1&category=images&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
        thiz.updateFile(res.body.model);
      },res=>{
        debugger
        thiz.fileList.push({
          name: option.filename,
          url: '',
          size: ''
        });
        thiz.fileList.splice(thiz.fileList.length - 1,1);
      })
    }
  },
  mounted () {
    $('.el-upload__input').hide();
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

