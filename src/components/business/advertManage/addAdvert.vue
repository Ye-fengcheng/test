<template>
  <div class="addCombine-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>广告管理 -- 添加广告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="广告名称：" required prop="title">
          <el-input v-model="form.title" placeholder="请输入广告名称" style="width:300px;"></el-input>
          <span class="advertSpan">广告名称只是作为辨别多个广告条目之用，并不显示在广告中</span>
        </el-form-item>
        <!-- <el-form-item label="广告位置：" required>
          <el-select placeholder="广告位置" size="mini" style="width:300px;">
            <el-option label="广告位" value="广告位"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="开始时间：" required prop="beginTimeMs">
          <el-date-picker v-model="form.beginTimeMs" type="datetime" default-time="00:00:00" style="width:300px;" value-format="timestamp" placeholder="请选择开始时间" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间：" required prop="endTimeMs">
          <el-date-picker v-model="form.endTimeMs" type="datetime" default-time="23:59:59" style="width:300px;" value-format="timestamp" placeholder="请选择结束时间" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="线上/下线：">
          <el-radio v-model="form.isEnable" label="1">线上</el-radio>
          <el-radio v-model="form.isEnable" label="0">下线</el-radio>
        </el-form-item>
        <el-form-item label="广告图片：" required prop="imgUrl">
          <el-upload :action="uploadUrl" :headers="headers" :file-list="imgDesc" :on-error='onError'
          :on-success="onSuccess1" :on-remove="onRemove1" list-type="picture-card"
          :limit="1" :on-exceed="handleExceed1" :before-upload="beforeUpload" ref="uploadImg">
            <i class="el-icon-plus"></i>
          </el-upload>
          <span class="advertSpan">只能上传jpg/png/gif格式图片，文件大小不能超过5M</span>
        </el-form-item>
        <el-form-item label="广告链接：">
          <el-input v-model="form.link" placeholder="请输入广告链接" style="width:300px;"></el-input>
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
        beginTimeMs: '',
        endTimeMs: '',
        id: 0,
        imgUrl: '',
        isEnable: '0',
        link: '',
        size: 0,
        title: ''
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
        title: [
          { required: true, message: '请输入广告名称' }
        ],
        beginTimeMs: [
          { required: true, message: '请选择开始时间' }
        ],
        endTimeMs: [
          { required: true, message: '请选择到期时间' }
        ],
        imgUrl: [
          { required: true, message: '请上传广告图', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleExceed1 (type) {
      this.$message.error('广告图只需要传一张！')
    },
    beforeUpload (file) {
      const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      const isType = Array.indexOf(type, file.type) >= 0
      const isSize = file.size / 1024 < 1024 * 5
      if (!isType) {
        this.$message.error('上传图片只能是jpg,png,gif格式!')
        return false
      }
      if (!isSize) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }
      this.form.size = file.size / 1024
      this.cardimgLoading = true
      return true // isSize && isType
    },
    onSuccess1 (response) {
      this.form.imgUrl = response.model
      this.cardimgLoading = false
      this.$refs.form.validateField('imgDesc')
    },
    onError () {
      this.cardimgLoading = false
    },
    onRemove1 () {
      this.form.goodslogin = ''
    },
    cancel () {
      this.$router.push({
        path: '/frame/advertManage/advertList'
      })
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          let httpUrl = ''
          if (this.$route.query.id) {
            httpUrl = 'mbr-content/v1/ad/update'
          } else {
            httpUrl = 'mbr-content/v1/ad/add'
          }
          this.$hsyHttp(this, httpUrl, 'POST', this.form).then(res => {
            this.loading = false
            this.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.$router.push({
              path: '/frame/advertManage/advertList'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    _getDetail (id) {
      this.$hsyHttp(this, 'mbr-content/v1/ad/info?id=' + id, 'GET').then(res => {
        this.form = res.data.model
        this.form.isEnable = this.form.isEnable.toString()
        this.imgDesc = [{
          url: this.form.imgUrl
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
  .advertSpan{
    font-size: 12px;
    color:#666
  }
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
