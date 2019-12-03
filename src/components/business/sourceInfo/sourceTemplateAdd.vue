<template>
  <div class="template-Add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>{{id ? '编辑模板' : '新增模板'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <span>模板名称：</span>
      <el-input size="mini" v-model.trim="templateName" style="width:150px;" placeholder="请输入模板名称"></el-input>
    </div>
    <div class="templateCon clearfix" v-loading="temloading">
      <div v-if="!id" class="templateBox">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
          <el-form-item label="H5标题" required prop="title">
            <el-input v-model.trim="form.title" placeholder="请输入H5标题" style="width:160px;"></el-input>
          </el-form-item>
          <el-form-item label="H5背景图" required prop="image">
            <el-upload :action="uploadUrl" :headers="headers" :show-file-list="false" :on-error='onError'
            :on-success="onSuccess1" list-type="picture-card" :before-upload="beforeUpload" ref="uploadImg">
              <img v-if="form.image" :src="form.image" class="avatar">
              <div v-else class="templateIcon">
              <i class="el-icon-circle-plus-outline"></i>
              <p class="uploadp">只能上传jpg/png/gif格式图片,文件大小不能超过1M</p>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:160px;" @click="onSubmitTem('form')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="templateBox2" :style="id ? 'height:380px;' : ''" v-for="(item,index) in list" :key="index" style="text-align:center;">
        <p>第{{index+1}}页</p>
        <el-form label-width="0px" size="small">
          <el-form-item label="">
            <p v-if="!item.edit" class="templateTil"><span>{{item.title}}</span>&nbsp;&nbsp;<i class="el-icon-edit" @click="item.edit=true"></i></p>
            <el-input v-else v-model.trim="item.title" placeholder="请输入H5标题" style="width:160px;" @blur="item.edit=false"></el-input>
          </el-form-item>
          <el-form-item label="" @click.native="getTemNum(index)">
            <el-upload :action="uploadUrl" :headers="headers" :show-file-list="false" :on-error='onError'
            :on-success="onSuccess" list-type="picture-card" :before-upload="beforeUpload" ref="uploadImg">
              <img v-if="item.image" :src="item.image" class="avatar">
              <div v-else class="templateIcon">
              <i class="el-icon-circle-plus-outline"></i>
              <p class="uploadp">只能上传jpg/png/gif格式图片,文件大小不能超过1M</p>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="!id">
            <el-button type="danger" style="width:160px;" @click="onRemoveTem(index)">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-button type="primary" size="small" :loading="loading" @click="onSubmit()">保存</el-button>
    <el-button type="" size="small" @click="toBack">取消</el-button>
  </div>
</template>

<script>
export default {
  name: 'templateAdd',
  data () {
    return {
      id: '',
      templateName: '',
      templateItemDTOS: [],
      temloading: false,
      form: {
        id: '',
        image: '',
        title: '',
        edit: false
      },
      listIndex: 0,
      list: [],
      uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
      ossUrl: 'http://oss.tupperware.com.cn/',
      loading: false,
      cardimgLoading: false,
      headers: {
        x_auth_token: window.localStorage.getItem('token'),
        x_request_platform: 'WEB',
        x_user_id: window.localStorage.getItem('pUid')
      },
      rules: {
        title: [{ required: true, message: '请输入标题' }],
        image: [
          { required: true, message: '请上传背景图', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getTemNum (num) {
      this.listIndex = num
    },
    onRemoveTem (num) {
      console.log(this.list[num])
      this.list.splice(num, 1)
      console.log(this.list)
    },
    toBack () {
      const thiz = this
      this.$confirm('取消后所填写资料不作保存，是否确定取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$router.push({
          path: '/frame/sourceInfo/sourceTemplate'
        })
      })
    },
    beforeUpload (file) {
      const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      const isType = Array.indexOf(type, file.type) >= 0
      const isSize = file.size / 1024 < 1024
      if (!isType) {
        this.$message.error('上传图片只能是jpg,png,gif格式!')
        return false
      }
      if (!isSize) {
        this.$message.error('上传图片大小不能超过1M!')
        return false
      }
      this.cardimgLoading = true
      return true // isSize && isType
    },
    onSuccess1 (response) {
      this.form.image = response.model
      this.cardimgLoading = false
      this.$refs.form.validateField('image')
    },
    onSuccess (response) {
      this.list[this.listIndex].image = response.model
    },
    onError () {
      this.cardimgLoading = false
    },
    onSubmitTem (form) {
      if (this.form.title.trim() === '') {
        this.$message.error('请输入H5标题')
        return false
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.list.push(this.$util.deepClone(this.form))
          this.form = {
            id: '',
            image: '',
            title: ' ',
            edit: false
          }
        }
      })
    },
    onSubmit () {
      if (this.templateName === '') {
        this.$message.error('请输入模板名称')
        return false
      }
      if (this.list.length === 0) {
        this.$message.error('请先上传模板文件')
        return false
      } else {
        this.templateItemDTOS = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].title.trim() === '' || this.list[i].image === '') {
            this.$message.error('请将第' + (i + 1) + '页模板文件上传完整')
            break
          } else {
            let tem = {
              id: '',
              image: this.list[i].image,
              sort: (i + 1),
              title: this.list[i].title
            }
            this.templateItemDTOS.push(tem)
          }
        }
      }
      if (this.templateItemDTOS.length < this.list.length) { return false }
      let temDate = {
        id: this.id,
        templateName: this.templateName,
        templateItemDTOS: this.templateItemDTOS
      }
      this.loading = true
      let httpUrl = ''
      if (this.id) {
        httpUrl = 'benefit-service/product/source/template/update'
      } else {
        httpUrl = 'benefit-service/product/source/template/add'
      }
      this.$hsyHttp(this, httpUrl, 'POST', temDate).then(res => {
        this.loading = false
        this.$notify.success({
          title: '成功',
          message: '保存成功'
        })
        this.$router.push({
          path: '/frame/sourceInfo/sourceTemplate'
        })
      }).catch(() => {
        this.loading = false
      })
    },
    _getDetail (id) {
      this.temloading = true
      this.$hsyHttp(this, 'benefit-service/product/source/template/detail?id=' + id, 'GET').then(res => {
        this.temloading = false
        this.list = res.data.models.map(item => {
          item.edit = false
          return item
        })
      }).catch(() => {
        this.temloading = false
      })
    }
  },
  created () {
    if (this.$route.query.id) {
      this.id = Number(this.$route.query.id)
      this.templateName = this.$route.query.name
      this._getDetail(this.id)
    }
  }
}
</script>

<style lang="scss">
.template-Add {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
  }
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .crumbs {
    margin-bottom: 20px;
  }
  .el-upload__input {
    display: none;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 18px !important;
  }
  .ql-container {
    min-height: 250px;
  }
  .el-upload--picture-card{
    width:160px;
    height:283px;
    line-height: 28px
  }
  .avatar{width:100%;height: 100%;}
  .templateBox{width:280px;float: left;height:440px;margin-bottom:20px;border:1px solid #efefef;padding-top:26px;}
  .uploadp{margin:0;padding: 0;line-height: 18px;font-size: 12px;}
  .templateBox2{width:240px;float: left;padding:0px 20px;border:1px solid #efefef;margin-left:40px;margin-bottom:20px;height:440px;}
  .templateIcon{padding:90px 5px;}
  .el-upload--picture-card:hover i{color: #ff7000}
  .templateCon{border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;padding-top:20px;margin-bottom: 20px;min-height:380px;}
  .templateTil{margin:0;padding: 0;}
}
.clearfix:before, .clearfix:after {
    display: table;
    line-height: 0;
    content: '';
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom:1;
}
</style>
