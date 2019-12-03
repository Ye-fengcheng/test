<template>
  <div class="activity-edit">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>编辑活动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="活动标题" required prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required prop="beginTime">
          <el-col>
            <el-date-picker type="daterange" placeholder="请选择活动时间" start-placeholder="开始时间"
            end-placeholder="结束时间" v-model="time" value-format="yyyy-MM-dd"
            :default-value="time" :editable="false" style="width:300px;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="报名截止时间" required prop="enrollEndTime">
          <el-col>
            <el-date-picker v-model="enrollEndTime" type="date" style="width:300px;" value-format="yyyy-MM-dd" placeholder="请选择报名截止时间" :editable="false"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="活动名额" required prop="quota">
          <el-input v-model="form.quota" placeholder="请输入活动名额" style="width:300px;" type="number"></el-input>
        </el-form-item>
        <el-form-item label="标题图片" required prop="imgUrl">
          <el-upload class="upload-wrapper" :action="uploadUrl"
          :headers="headers" :on-success="onSuccess" :on-remove="onRemove" :limit="1"
          :on-exceed="handleExceed" :before-upload="beforeUpload" :file-list="imgList">
            <i class="el-icon-upload"></i>选择上传文件
            <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif格式文件，文件不能超过200kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动描述" required class="special-item" prop="content">
          <quill-editor ref="newEditor" v-model="form.content" :options="{placeholder: '请输入活动描述'}"></quill-editor>
          <el-upload style="display:none" :action="uploadUrl" :show-file-list="false" :before-upload='newEditorbeforeupload' :on-success='newEditorSuccess'
            :headers="headers" ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item label="活动场次" class="special-item" prop="sessionList">
          <!--<el-tag :key="tag" v-for="tag in form.sessionList" closable size="medium" :disable-transitions="false" @close="handleClose(tag, 1)" class="tag-item">{{tag}}</el-tag>
          <el-date-picker v-model="newDate" type="date" placeholder="请添加活动场次" class="new-input" @change="handleInputDate" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>-->
          <el-date-picker ref="datesRef"
            type="dates" value-format="yyyy-MM-dd"
            v-model="form.sessionList"
            placeholder="请添加活动场次">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="自定义标题" prop="intentionTitle">
          <el-input v-model="form.intentionTitle" placeholder="请输入自定义标题" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="内容选择" class="special-item" prop="intention">
          <el-tag :key="tag" v-for="tag in intention" closable size="medium" :disable-transitions="false" @close="handleClose(tag, 2)" class="tag-item">{{tag}}</el-tag>
          <el-input class="new-input" v-model="newValue" placeholder="请添加内容选择" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="导入门店" required prop="excelUrl">
          <el-upload class="upload-wrapper" :action="uploadUrl"
          :headers="headers" :on-success="onSuccessFile" :on-remove="onRemoveFile" :limit="1"
          :on-exceed="handleExceedFile" :before-upload="beforeUploadFile" :file-list="excelList">
            <i class="el-icon-upload"></i>选择上传文件
          </el-upload>
        </el-form-item>
        <el-form-item label="发送二维码邮箱" required prop="email">
          <el-input v-model="form.email" placeholder="请输入发送二维码邮箱" type="email" style="width:500px;"></el-input>
          <span style="font-size: 12px; color: #909399;">（多个邮箱用英文逗号隔开）</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'activityEdit',
  data () {
    return {
      form: {
        id: '',
        title: '',
        beginTime: '',
        endTime: '',
        enrollEndTime: '',
        quota: '',
        imgUrl: '',
        content: '',
        sessionList: [],
        intentionTitle: '',
        intention: [],
        excelUrl: '',
        email: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入活动标题', trigger: 'blur' },
          { max: 20, message: '标题字数不超过20个字，含标点符号', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请输入活动时间', trigger: 'blur' }
        ],
        enrollEndTime: [
          { required: true, message: '请输入报名截止时间', trigger: 'blur' }
        ],
        quota: [
          { required: true, message: '请输入活动名额', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请上传标题图片', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入活动描述', trigger: 'blur' }
        ],
        intentionTitle: [
          { max: 8, message: '自定义标题不能大于8个字', trigger: 'blur' }
        ],
        // sessionList: [
        //   { required: true, message: '请输入活动场次', trigger: 'blur' }
        // ],
        // intention: [
        //   { required: true, message: '请输入内容选择', trigger: 'change' }
        // ],
        excelUrl: [
          { required: true, message: '请导入门店文件', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入二维码邮箱', trigger: 'blur' }
        ]
      },
      uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
      time: [],
      enrollEndTime: '',
      newDate: '',
      newValue: '',
      intention: [],
      imgList: [],
      excelList: [],
      loading: false,
      headers: {
        x_auth_token: window.localStorage.getItem('token'),
        x_request_platform: 'WEB',
        x_user_id: window.localStorage.getItem('pUid')
      }
    }
  },
  watch: {
    time (newValue, oldValue) {
      this.form.beginTime = new Date(newValue[0] + ' 00:00:00').getTime()
      this.form.endTime = new Date(newValue[1] + ' 23:59:59').getTime()
    },
    enrollEndTime (newValue, oldValue) {
      this.form.enrollEndTime = new Date(newValue + ' 23:59:59').getTime()
    }
  },
  methods: {
    handleExceed () {
      this.$message.error('标题图片只需要传一张！')
    },
    beforeUpload (file) {
      const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      const isType = Array.indexOf(type, file.type) >= 0
      const isSize = file.size / 1024 < 200
      if (!isType) {
        this.$message.error('上传图片只能是jpg,png,gif格式!')
      }
      if (!isSize) {
        this.$message.error('上传图片大小不能超过200KB!')
      }
      this.form.imgName = file.name
      return isSize && isType
    },
    onSuccess (response) {
      this.form.imgUrl = response.model
      this.$refs.form.validateField('imgUrl')
    },
    onRemove () {
      this.form.imgUrl = ''
    },
    handleExceedFile () {
      this.$message.error('门店文件只需要传一份！')
    },
    beforeUploadFile (file) {
      this.form.excelName = file.name
    },
    onSuccessFile (response) {
      this.form.excelUrl = response.model
      this.$refs.form.validateField('excelUrl')
    },
    onRemoveFile () {
      this.form.excelUrl = ''
    },
    handleClose (tag, type) {
      if (type === 1) {
        this.form.sessionList.splice(this.form.sessionList.indexOf(tag), 1)
      } else if (type === 2) {
        this.intention.splice(this.intention.indexOf(tag), 1)
        this.form.intention = this.intention.join(',')
      }
    },
    handleInputConfirm () {
      if (this.newValue) {
        this.intention.push(this.newValue)
        this.form.intention = this.intention.join(',')
        this.newValue = ''
      }
    },
    handleInputDate (val) {
      let ifRepeat = false
      for (let i in this.form.sessionList) {
        if (this.form.sessionList[i] === val) {
          ifRepeat = true
        }
      }
      if (!ifRepeat) {
        this.form.sessionList.push(val)
      } else {
        this.$message.error('不能添加重复活动场次~')
      }
      this.newDate = ''
    },
    newEditorbeforeupload (file) {
      const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      const isType = Array.indexOf(type, file.type) >= 0
      const isSize = file.size / 1024 / 1024 < 3
      if (!isType) {
        this.$message.error('上传图片只能是jpg,png,gif格式!')
      }
      if (!isSize) {
        this.$message.error('上传图片大小不能超过3MB!')
      }
      return isSize && isType
    },
    newEditorSuccess (response, file, fileList) {
      if (response.success) {
        this.addImgRange = this.$refs.newEditor.quill.getSelection()
        this.$refs.newEditor.quill.insertEmbed(this.addImgRange !== null ? this.addImgRange.index : 0, 'image', response.model, Quill.sources.USER)
      }
      this.imageLoading = false
    },
    onSubmit (form) {
      let thiz = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          thiz.loading = true
          thiz.form.intention = thiz.form.intention.length === 0 ? '' : thiz.form.intention // 如果没填
          thiz.$hsyHttp(this, 'backend/prom/update', 'POST', thiz.form).then(res => {
            thiz.loading = false
            thiz.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            thiz.$router.push({
              path: '/frame/activity/activityList'
            })
          }, res => {
            thiz.loading = false
          })
        }
      })
    },
    _getDetail (id) {
      this.$hsyHttp(this, 'backend/prom/get/' + id).then(res => {
        this.form = res.data.model
        this.form.beginTime = new Date(this.form.beginTime).format('yyyy-MM-dd')
        this.form.endTime = new Date(this.form.endTime).format('yyyy-MM-dd')
        this.time = [this.form.beginTime, this.form.endTime]
        this.enrollEndTime = new Date(this.form.enrollEndTime).format('yyyy-MM-dd')
        this.imgList = [{
          name: this.form.imgName,
          url: this.form.imgUrl
        }]
        this.form.sessionList = this.form.sessionList.map(item => {
          return new Date(item).format('yyyy-MM-dd')
        })
        this.intention = this.form.intention ? this.form.intention.split(',') : []
        this.excelList = [{
          name: this.form.excelName,
          url: this.form.excelUrl
        }]
      })
    }
  },
  created () {
    let id = Number(this.$route.query.id)
    this._getDetail(id)
  },
  mounted () {
    var imgHandler = async function (state) {
      if (state) {
        var fileInput = document.querySelector('#uniqueId input') // 隐藏的file元素
        fileInput.click() // 触发事件
      }
    }
    this.$refs.newEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
    this.$nextTick(() => { // @Bugfix 在有默认值的情况下，第一次打开页面，点击时间控件，控件是不会选中的
      this.$refs.datesRef.showPicker()
      this.$refs.datesRef.hidePicker()
    })
  },
  components: {
    quillEditor
  }
}
</script>

<style lang="scss">
.activity-edit {
  padding: 30px;
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .crumbs {
    margin-bottom: 20px;
  }
  .upload-wrapper {
    width: 500px;
    .el-upload--text {
      width: 220px;
      height: 30px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      color: #97a8be;
      font-size: 14px;
      text-align: center;
      .el-icon-upload {
        margin: 0;
        line-height: 25px;
        font-size: 20px;
        color: #97a8be;
      }
    }
  }

  .ql-container {
    min-height: 250px;
  }

  .el-form-item__content {
    .new-input {
      width: 160px;
      display: inline-block;
    }
  }

  .tag-item {
    margin-right: 5px;
  }

  .special-item {
    width: 920px;
  }
}
</style>