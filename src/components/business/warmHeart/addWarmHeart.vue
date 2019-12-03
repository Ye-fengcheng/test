<template>
  <div class="addCombine-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>暖心说卡片维护 -- 新增卡片</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="卡片名称" required prop="remark">
          <el-input v-model="form.remark" placeholder="请输入卡片名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="卡片横图" required prop="imgDesc">
          <el-upload :action="uploadUrl" :headers="headers" :file-list="imgDesc" :on-error='onError'
          :on-success="onSuccess1" :on-remove="onRemove1" list-type="picture-card"
          :limit="1" :on-exceed="handleExceed1" :before-upload="beforeUpload" ref="uploadImg">
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png/gif格式图片，文件大小不能超过1M</span>
        </el-form-item>
        <el-form-item label="二维码底图" required prop="thumbnail">
          <el-upload :action="uploadUrl" :headers="headers" :file-list="thumbnail" :on-error='onError'
          :on-success="onSuccess2" :on-remove="onRemove2" list-type="picture-card"
          :limit="1" :on-exceed="handleExceed2" :before-upload="beforeUpload" ref="uploadImg2">
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png/gif格式图片，文件大小不能超过1M</span>
        </el-form-item>
        <el-form-item label="排序" required prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" type="number" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addWarmHeart',
  data () {
    return {
      form: {
        id: '',
        imgDesc: '',
        remark: '',
        sort: '',
        thumbnail: ''
      },
      imgDesc: [],
      thumbnail: [],
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
        remark: [{ required: true, message: '请输入卡片名称' }],
        imgDesc: [
          { required: true, message: '请上传卡片横图', trigger: 'change' }
        ],
        thumbnail: [
          { required: true, message: '请上传分享缩略图', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '输入排序', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleExceed1 (type) {
      this.$message.error('卡片横图只需要传一张！')
    },
    handleExceed2 (type) {
      this.$message.error('分享缩略图只需要传一张！')
    },
    // handleExceed3 (type) {
    //   this.$message.error('组合轮播图不能超过六张！')
    // },
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
      this.form.imgDesc = response.model
      this.cardimgLoading = false
      this.$refs.form.validateField('imgDesc')
    },
    onSuccess2 (response) {
      this.form.thumbnail = response.model
      this.cardimgLoading = false
      this.$refs.form.validateField('thumbnail')
    },
    onError () {
      this.cardimgLoading = false
    },
    onRemove1 () {
      this.form.goodslogin = ''
    },
    onRemove2 () {
      this.form.goodslogininfo = ''
    },
    cancel () {
      this.$router.push({
        path: '/frame/warmHeart/warmHeartList'
      })
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          let httpUrl = ''
          if (this.$route.query.id) {
            httpUrl = 'etup-product-service/card/update'
          } else {
            httpUrl = 'etup-product-service/card/add'
          }
          this.$hsyHttp(this, httpUrl, 'POST', this.form).then(res => {
            this.loading = false
            this.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.$router.push({
              path: '/frame/warmHeart/warmHeartList'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    _getDetail (id) {
      this.$hsyHttp(this, 'etup-product-service/card/info?id=' + id, 'GET').then(res => {
        this.form = res.data.model
        this.imgDesc = [{
          url: this.form.imgDesc
        }]
        this.thumbnail = [{
          url: this.form.thumbnail
        }]
      })
    }
  },
  created () {
    if (this.$route.query.id) {
      let id = Number(this.$route.query.id)
      this._getDetail(id)
    }
  }
}
</script>

<style lang="scss">
.addCombine-wrapper {
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
  .goods-img-box {
    display: inline-block;
    margin: 15px 15px 0 0;
    position: relative;
    .del-box {
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      border-radius: 6px;
    }
    i {
      font-size: 20px;
      color: #fff;
      margin-top: 60px;
    }
    .goods-img-item {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      cursor: pointer;
      line-height: 146px;
      vertical-align: top;
    }
  }
}
</style>
