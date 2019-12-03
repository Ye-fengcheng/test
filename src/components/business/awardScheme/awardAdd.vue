<template>
  <div class="activity-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>{{form.id ? '编辑' : '新建'}}奖励</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" label-width="130px" size="small">
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="奖励名称" required>
              <el-select v-model="form.rewardType" size="mini" :disabled="form.id ? true : false" filterable placeholder="请选择" @change="change">
                <el-option label="新店成长之星" :value="1"></el-option>
                <el-option label="新星奖" :value="2"></el-option>
                <el-option label="季度星级奖" :value="3"></el-option>
                <el-option label="升星奖" :value="4"></el-option>
                <el-option label="样板店增长奖" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="奖励内容正文" class="special-item">
          <quill-editor ref="newEditor" v-model="form.content" :options="{placeholder: '奖励内容正文'}"></quill-editor>
          <el-upload style="display:none" :action="uploadUrl" :show-file-list="false" :before-upload='newEditorbeforeupload' :on-success='newEditorSuccess'
            :headers="headers" ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">提交</el-button>
          <el-button type="" @click="goBack">返回</el-button>
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
  data () {
    return {
      form: {
        id: '',
        rewardName: '新店成长之星',
        rewardType: 1,
        content: ''
      },
      rewardArr: ['新店成长之星', '新星奖', '季度星级奖', '升星奖', '样板店增长奖'],
      uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
      loading: false,
      headers: {
        x_auth_token: window.localStorage.getItem('token'),
        x_request_platform: 'WEB',
        x_user_id: window.localStorage.getItem('pUid')
      },
      errDialogVisible: false,
      errorTableData: [],
      roleData: [],
      dialogVisible: false,
      picVisible: false
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    change (val) {
      this.form.rewardName = this.rewardArr[val - 1]
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
      if (!thiz.form.content) {
        thiz.$message('请填写奖励内容正文')
        return
      }
      thiz.loading = true
      let url = thiz.form.id ? 'manage-app/rewardPlan/update' : 'manage-app/rewardPlan/insert'
      thiz.$hsyHttp(thiz, url, 'POST', thiz.form).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功',
          message: '保存成功'
        })
        thiz.$router.go(-1)
      }, res => {
        thiz.loading = false
      })
    },
    getDetail (id) {
      this.$hsyHttp(this, 'manage-app/rewardPlan/getRewardManageDetail', 'POST', {id: id}).then(res => {
        this.form = res.data.model
      })
    }
  },
  mounted () {
    var imgHandler = async function (state) {
      if (state) {
        var fileInput = document.querySelector('#uniqueId input') // 隐藏的file元素
        fileInput.click() // 触发事件
      }
    }
    this.$refs.newEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
    $('.el-upload__input').hide()
  },
  created () {
    let id = this.$route.query.id
    if (id) {
      this.form.id = id
      this.getDetail(id)
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style lang="scss">
.activity-add {
  padding: 30px;
  .el-form-item--small.el-form-item {
    margin-bottom: 18px !important;
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
  
  .special-item {
    width: 920px;
  }

  .ql-container {
    min-height: 250px;
  }
}
</style>