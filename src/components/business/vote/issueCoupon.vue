<template>
  <div class="issue-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>批量发奖</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="comForm" ref="comForm" :rules="rules" label-width="140px" class="form" size="mini">
      <el-form-item label="关联活动" prop="voteId">
        <el-select v-model="comForm.voteId" placeholder="关联活动" size="mini" style="width:180px;">
          <el-option v-for="item in activityData"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
        <span style="font-size: 12px; color: #909399;">只支持投票活动发券</span>
      </el-form-item>
      <el-form-item label="奖项名称" prop="prizeName">          
        <el-input v-model="comForm.prizeName" placeholder="" style="width:250px;"></el-input>
        <span style="font-size: 12px; color: #909399;">投票活动奖记录中显示</span>
      </el-form-item>
      <el-form-item label="优惠券规则码" prop="couponCode">          
        <el-input v-model="comForm.couponCode" placeholder="" style="width:250px;"></el-input>
        <span style="font-size: 12px; color: #909399;">只支持发etup优惠券</span>
      </el-form-item>
      <el-form-item label="发奖对象" prop="openIdList">
        <el-upload
          style="display:inline-block;"
          :action="uploadUrl"
          :show-file-list="false"
          :multiple="true"
          :httpRequest="upload">
          <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">选择文件</el-button>
        </el-upload>
        <span v-show="fileName && comForm.openIdList.length" style="color: #ff7000;margin-left: 10px;font-size: 12px;">{{fileName}}</span>
        <span style="font-size: 12px; color: #909399;">请注意去重，如表格中有重复id将会发放多张优惠券（每次最大发券数为1000条）</span>
      </el-form-item>
      <div class="form-footer">
        <el-button @click="commit('comForm')" size="mini" :loading="loading" :disabled="hasCouponJob" type="primary">发布</el-button>
        <el-button @click="$router.go(-1)" size="mini">返回</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
        activityData: [],
        comForm: {
          voteId: '',
          prizeName: '',
          couponCode: '',
          openIdList: []
        },
        loading: false,
        fileName: '',
        rules: {
          voteId: [
            { required: true, message: '请选择关联活动', trigger: 'change' }
          ],
          prizeName: [
            { required: true, message: '请输入奖项名称', trigger: 'blur' },
            { min: 5, max: 15, message: '奖项名称长度在5到15个字符之间', trigger: 'blur' }
          ],
          couponCode: [
            { required: true, message: '请输入优惠券规则码', trigger: 'blur' }
          ],
          openIdList: [
            { required: true, message: '请上传发奖对象文件', trigger: 'blur' }
          ]
        },
        hasCouponJob: false
      }
    },
    methods: {
      commit (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$hsyHttp(this, 'dolls-service/vote-manage/issueCoupon', 'POST', this.comForm).then(res => {
              this.$notify.success({
                title: '成功提示',
                message: '发布成功'
              })
              this.$router.go(-1)
            })
          }
        })
      },
      upload (option) {
        this.fileName = option.file.name
        this.$util.readExcel(option.file, this.treatDatas)
      },
      treatDatas (datas) {
        let arr = []
        for (let i = 1; i < datas.sheet0.length; i++) {
          if (datas.sheet0[i] && datas.sheet0[i][0]) {
            arr.push(datas.sheet0[i][0])
          }
        }
        if (arr && arr.length > 1000) {
          this.$notify.error({
            title: '错误提示',
            message: '每次最大发券数为1000条'
          })
          return
        }
        this.comForm.openIdList = arr
        this.$refs.comForm.validateField('openIdList')
        this.$notify.success({
          title: '成功提示',
          message: '上传成功'
        })
      },
      _getActivityData () {
        this.$hsyHttp(this, 'dolls-service/vote-manage/list', 'POST').then(res => {
          this.activityData = res.data.models
        })
      },
      _hasCouponJob () {
        this.$hsyHttp(this, 'dolls-service/vote-manage/hasCouponJob', 'POST').then(res => {
          this.hasCouponJob = res.data.model == 1 ? true : false
          if (this.hasCouponJob) {
            this.$notify.error({
              title: '错误提示',
              message: '上一次发券任务还没完成，请稍后再试'
            })
          }
        })
      }
    },
    created () {
      this._hasCouponJob()
      this._getActivityData()
    }
  }
</script>
<style lang="scss">
.issue-coupon {
  padding: 30px;
  .crumbs {
    margin-bottom: 20px;
  }
  .form {
    margin-top: 40px;
    .item-title {
      padding-bottom: 8px;
      border-bottom: 1px dashed #ccc;
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .form-footer {
      margin-top: 30px;
      padding-left: 260px;
    }
  }
  .el-upload__input {
    display: none;
  }
  .el-form-item--mini {
    margin-bottom: 18px !important;
  }
}
</style>
