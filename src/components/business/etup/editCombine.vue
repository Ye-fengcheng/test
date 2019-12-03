<template>
  <div class="editCombine-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>组合优惠列表 -- 编辑组合</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="组合名称" required prop="goodsname">
          <el-input v-model="form.goodsname" placeholder="请输入组合名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="组合产品" required>
          <span style="color: #ff7000;font-size: 12px;margin-left: 5px;">组合生成后产品无法编辑，如需更换产品请新建组合</span>
        </el-form-item>
        <el-table
          :data="form.goodsItemList"
          style="width: 70%;margin-left: 55px;" border
          highlight-current-row>
          <el-table-column label="产品图片">
            <template slot-scope="scope">
              <img :src="ossUrl + scope.row.goodslogin" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="id" label="产品ID"></el-table-column> 
          <el-table-column prop="goodsname" label="产品名称"></el-table-column>
          <el-table-column prop="goodsyprice" label="产品原价"></el-table-column> 
          <el-table-column prop="goodsprice" label="产品单价"></el-table-column>
        </el-table>
        <el-form-item label="组合价格">
          <span>{{form.goodsprice}}元</span>
        </el-form-item>
        <el-form-item label="组合原价">
          <span>{{form.goodsyprice}}元</span>
        </el-form-item>
        <el-form-item label="活动期限" required prop="startDate">
          <el-date-picker type="datetimerange" placeholder="请选择活动时间" start-placeholder="开始时间" end-placeholder="结束时间"
            v-model="time" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" style="width:350px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="商品logo图" required prop="goodslogin">
          <el-upload :action="uploadUrl" :headers="headers" :file-list="goodsloginList"
          :on-success="onSuccess1" :on-remove="onRemove1" list-type="picture-card" :on-error='onError'
          :limit="1" :on-exceed="handleExceed1" :before-upload="beforeUpload" ref="uploadImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="组合列表图" required prop="goodslogininfo">
          <el-upload :action="uploadUrl" :headers="headers" :file-list="goodslogininfoList"
          :on-success="onSuccess2" :on-remove="onRemove2" list-type="picture-card" :on-error='onError'
          :limit="1" :on-exceed="handleExceed2" :before-upload="beforeUpload" ref="uploadImg2">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="组合轮播图" required prop="goodsimg">
          <el-upload :action="uploadUrl" :headers="headers" :show-file-list="false" v-loading="goodsimgLoading"
          element-loading-text="上传中，请稍后..."
          element-loading-background="rgba(255, 255, 255, 0.01)" :on-error='onError'
          :on-success="onSuccess3" list-type="picture-card" :before-upload="beforeUpload" ref="uploadImg3" v-show="goodsimg.length < 6">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-for="(item, index) in goodsimg" :key="index" class="goods-img-box" @mouseenter="toActive(index)"  @mouseleave="removeActive(index)">
            <video v-if="item.type" :src="ossUrl + item.url" class="goods-img-item"></video>
            <img v-if="!item.type" :src="ossUrl + item.url" class="goods-img-item" />
            <div class="del-box" v-show="isActive === index" @click="removeImg(index)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
          <p style="margin-bottom: 0; color: #ff7000; font-size: 12px;">组合轮播图片显示按照上传顺序为准，上传视频后面请紧跟一张封面图</p>
        </el-form-item>
        <el-form-item label="组合详情" prop="goodsdetail" v-loading="uploadLoading"
          element-loading-text="图片上传中，请稍后..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.01)">
          <quill-editor ref="editor" v-model="form.goodsdetail" :options="{placeholder: '请输入组合详情'}"></quill-editor>
          <el-upload style="display:none" :action="uploadUrl" :show-file-list="false" :before-upload='editorbeforeupload'
            :on-success='editorSuccess' :on-error='editorError'
            :headers="headers" ref="uniqueId" id="uniqueId">
          </el-upload >
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
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'editCombine',
  data () {
    return {
      form: {
        id: '',
        goodsname: '',
        goodsItemList: [],
        goodsprice: 0,
        goodsyprice: 0,
        startDate: '',
        endDate: '',
        goodslogin: '',
        goodslogininfo: '',
        goodsimg: '',
        goodsdetail: ''
      },
      goodsimg: [],
      uploadLoading: false,
      uploadUrl: process.env.SERVICE_IP + '/backend/product/goods/upload',
      ossUrl: 'http://oss.tupperware.com.cn/',
      time: [],
      loading: false,
      isActive: -1,
      goodsimgLoading: false,
      headers: {
        x_auth_token: window.localStorage.getItem('token'),
        x_request_platform: 'WEB',
        x_user_id: window.localStorage.getItem('pUid')
      },
      rules: {
        goodsname: [
          { required: true, message: '请输入组合名称' },
          { max: 16, message: '标题字数不超过16个字，含标点符号', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请输入活动期限', trigger: 'blur' }
        ],
        goodslogin: [
          { required: true, message: '请上传商品logo图', trigger: 'change' }
        ],
        goodslogininfo: [
          { required: true, message: '请上传组合列表图', trigger: 'change' }
        ],
        goodsimg: [
          { required: true, message: '请上传组合轮播图', trigger: 'change' }
        ],
        goodsdetail: [
          { required: true, message: '请输入组合详情', trigger: 'blur' }
        ]
      },
      goodsloginList: [],
      goodslogininfoList: []
      // goodsimgList: []
    }
  },
  watch: {
    time (newValue, oldValue) {
      this.form.startDate = new Date(newValue[0]).getTime()
      this.form.endDate = new Date(newValue[1]).getTime()
    }
  },
  methods: {
    toActive (index) {
      this.isActive = index
    },
    removeActive (index) {
      this.isActive = -1
    },
    removeImg (index) {
      this.goodsimg.splice(index, 1)
      this.form.goodsimg = this.goodsimg.map((item, index) => {
        return item.url
      }).join(',')
      this.$refs.form.validateField('goodsimg')
    },
    handleExceed1 (type) {
      this.$message.error('商品logo图只需要传一张！')
    },
    handleExceed2 (type) {
      this.$message.error('组合列表图只需要传一张！')
    },
    // handleExceed3 (type) {
    //   this.$message.error('组合轮播图不能超过六张！')
    // },
    beforeUpload (file) {
      // const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      // const isType = Array.indexOf(type, file.type) >= 0
      // const isSize = file.size / 1024 < 200
      // if (!isType) {
      //   this.$message.error('上传图片只能是jpg,png,gif格式!')
      // }
      // if (!isSize) {
      //   this.$message.error('上传图片大小不能超过200KB!')
      // }
      this.goodsimgLoading = true
      return true // isSize && isType
    },
    onSuccess1 (response) {
      this.form.goodslogin = response.model
      this.goodsimgLoading = false
      this.$refs.form.validateField('goodslogin')
    },
    onSuccess2 (response) {
      this.form.goodslogininfo = response.model
      this.goodsimgLoading = false
      this.$refs.form.validateField('goodslogininfo')
    },
    onSuccess3 (response) {
      // let goodsimg = this.form.goodsimg ? this.form.goodsimg.split(',') : []
      // goodsimg.push(response.model)
      // this.form.goodsimg = goodsimg.join(',')
      // this.$refs.form.validateField('goodsimg')
      let videoType = ".wmv|.mpeg|.mkv|.flv|.f4v|.m4v|.rmvb|.rm|.3gp|.dat|.ts|.mts|.vob|.mp4|.avi|.mov|.qlv|"
      let itemType = response.model.substring(response.model.lastIndexOf(".")).toLowerCase()
      let ifVideo = videoType.indexOf(itemType + "|") > -1 ? 1 : 0
      this.goodsimg.push({
        type: ifVideo,
        url: response.model
      })
      this.form.goodsimg = this.goodsimg.map((item, index) => {
        return item.url
      }).join(',')
      this.goodsimgLoading = false
      this.$refs.form.validateField('goodsimg')
    },
    onError () {
      this.goodsimgLoading = false
    },
    onRemove1 () {
      this.form.goodslogin = ''
    },
    onRemove2 () {
      this.form.goodslogininfo = ''
    },
    // onRemove3 (file, fileList) {
    //   let goodsimg = fileList.map((item, index) => {
    //     return item.response ? item.response.model : item.name
    //   })
    //   this.form.goodsimg = goodsimg.join(',')
    // },
    editorbeforeupload (file) {
      // const type = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      // const isType = Array.indexOf(type, file.type) >= 0
      // const isSize = file.size / 1024 / 1024 < 3
      // if (!isType) {
      //   this.$message.error('上传图片只能是jpg,png,gif格式!')
      // }
      // if (!isSize) {
      //   this.$message.error('上传图片大小不能超过3MB!')
      // }
      // return isSize && isType
      this.uploadLoading = true
      return true
    },
    editorSuccess (response, file, fileList) {
      if (response.success) {
        this.addImgRange = this.$refs.editor.quill.getSelection()
        this.$refs.editor.quill.insertEmbed(this.addImgRange !== null ? this.addImgRange.index : 0, 'image', this.ossUrl + response.model, Quill.sources.USER)
      }
      this.uploadLoading = false
    },
    editorError () {
      this.uploadLoading = false
    },
    cancel () {
      this.$router.push({
        path: '/frame/etup/combineList'
      })
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
        this.loading = true
          this.$tupHttp(this, 'product/goods/update', 'POST', this.form).then(res => {
            this.loading = false
            this.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.$router.push({
              path: '/frame/etup/combineList'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    _getDetail (id) {
      this.$tupHttp(this, 'product/goods/getInfoGoodsById?id=' + id, 'GET').then(res => {
        this.form = res.data.model
        this.form.startDate = new Date(this.form.startDate).format('yyyy-MM-dd hh:mm:ss')
        this.form.endDate = new Date(this.form.endDate).format('yyyy-MM-dd hh:mm:ss')
        this.time = [this.form.startDate, this.form.endDate]
        this.goodsloginList = [{
          url: this.ossUrl + this.form.goodslogin
        }]
        this.goodslogininfoList = [{
          url: this.ossUrl + this.form.goodslogininfo
        }]
        this.goodsimg = this.form.goodsimg.split(',').map(item => {
          let videoType = ".wmv|.mpeg|.mkv|.flv|.f4v|.m4v|.rmvb|.rm|.3gp|.dat|.ts|.mts|.vob|.mp4|.avi|.mov|.qlv|"
          let itemType = item.substring(item.lastIndexOf(".")).toLowerCase()
          let ifVideo = videoType.indexOf(itemType + "|") > -1 ? 1 : 0
          return {
            type: ifVideo,
            url: item
          }
        })
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
    this.$refs.editor.quill.getModule('toolbar').addHandler('image', imgHandler)
  },
  components: {
    quillEditor
  }
}
</script>

<style lang="scss">
.editCombine-wrapper {
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
