<template>
  <div class="addCombine-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>组合优惠列表 -- 新建组合</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="组合名称" required prop="goodsname">
          <el-input v-model="form.goodsname" placeholder="请输入组合名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="组合产品" required prop="goodsItemDTOS">
          <el-button type="primary" size="mini" @click="showProduct">添加产品</el-button>
          <span style="color: #ff7000;font-size: 12px;margin-left: 5px;">完成添加后请输入组合中各产品单价，系统会自动计算组合价格</span>
        </el-form-item>
        <el-table v-show="multipleSelected.length"
          :data="multipleSelected"
          style="width: 70%;margin-left: 55px;" border
          highlight-current-row>
          <el-table-column label="产品图片">
            <template slot-scope="scope">
              <img :src="ossUrl + scope.row.goodslogininfo" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="id" label="产品ID"></el-table-column> 
          <el-table-column prop="goodsname" label="产品名称"></el-table-column>
          <el-table-column prop="goodsyprice" label="产品原价"></el-table-column> 
          <el-table-column
            prop="productPrice"
            width="110"
            label="产品单价">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.productPrice" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete"  @click="delProduct(scope.$index, scope.row)" size="mini"></el-button>
            </template>
          </el-table-column>
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
          <el-upload :action="uploadUrl" :headers="headers" :on-error='onError'
          :on-success="onSuccess1" :on-remove="onRemove1" list-type="picture-card"
          :limit="1" :on-exceed="handleExceed1" :before-upload="beforeUpload" ref="uploadImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="组合列表图" required prop="goodslogininfo">
          <el-upload :action="uploadUrl" :headers="headers" :on-error='onError'
          :on-success="onSuccess2" :on-remove="onRemove2" list-type="picture-card"
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
      <el-dialog title="添加产品" :visible.sync="visible" width="60%">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input size="mini" clearable v-model="goodsName" style="width:150px;" placeholder="产品名称模糊搜索"></el-input>
            <el-button type="primary" size="mini" @click="searchProduct">查询</el-button>
            <el-button type="success" size="mini" :disabled="!multipleSelection.length" @click="adds">批量添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="productData"
          row-key="id"
          ref="productTable"
          @row-dblclick="rowDblClick"
          @selection-change="handleSelectionChange"
          style="width: 100%;height:300px;overflow-y:scroll">
          <el-table-column type="selection" width="55" :reserve-selection="false"></el-table-column>
          <el-table-column label="产品图片">
            <template slot-scope="scope">
              <img :src="'http://oss.tupperware.com.cn/' + scope.row.goodslogininfo" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="id" label="产品ID"></el-table-column> 
          <el-table-column prop="goodsname" label="产品名称"></el-table-column>
          <el-table-column prop="goodsyprice" label="产品原价"></el-table-column> 
        </el-table>
        <div style="text-align: right; margin-top:15px;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            background
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-dialog>
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
  name: 'addCombine',
  data () {
    var validateCombine = (rule, value, callback) => {
      if (this.form.goodsItemDTOS.length < 2) {
        callback(new Error('每个组合产品必须≥2，≤5个'))
      } else {
        let ifPass = true
        this.form.goodsItemDTOS.forEach((item, index) => {
          if (!item.goodsprice) {
            ifPass = false
            callback(new Error('请输入组合中各产品单价'))
          } else if (item.goodsprice <= 0.01) {
            ifPass = false
            callback(new Error('组合中各产品单价需>0.01'))
          }
        })
        if (ifPass) {
          callback()
        }
      }
    }
    return {
      form: {
        goodsname: '',
        goodsItemDTOS: [],
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
      visible: false,
      productData: [],
      goodsName: '',
      page: 1,
      size: 20,
      total: 0,
      multipleSelection: [],
      multipleSelected: [],
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
        goodsItemDTOS: [
          { validator: validateCombine, trigger: 'blur' }
        ],
        // multipleSelected: [
        //   { required: true, message: '请添加组合产品', trigger: 'change' }
        // ],
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
      }
    }
  },
  watch: {
    time (newValue, oldValue) {
      this.form.startDate = new Date(newValue[0]).getTime()
      this.form.endDate = new Date(newValue[1]).getTime()
    },
    'multipleSelected': {
      handler (newValue, oldValue) {
        this.form.goodsprice = 0
        newValue.forEach((item, index) => {
          if (item.productPrice) {
            this.form.goodsprice = (item.productPrice * 100 + this.form.goodsprice * 100) / 100
          }
        })
      },
      deep: true
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
    //     return item.response.model
    //   })
    //   this.form.goodsimg = goodsimg.join(',')
    // },
    searchProduct () {
      this.page = 1
      this._getProduct()
    },
    rowDblClick () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.page = val
      this._getProduct()
    },
    adds () {
      if (this.multipleSelection.length > 5) {
        this.$notify.error({
          title: '错误提示',
          message: '每个组合产品必须≥2，≤5个'
        })
        return
      }
      // this.multipleSelected = this.multipleSelection
      this.multipleSelection.forEach((item, index) => {
        this.multipleSelected.push(JSON.parse(JSON.stringify(this.multipleSelection[index])))
      })
      this.form.goodsyprice = 0
      this.multipleSelected.forEach((item, index) => {
        this.form.goodsyprice += item.goodsyprice
      })
      this.visible = false
    },
    delProduct (index, row) {
      this.multipleSelected.splice(index, 1)
      this.$refs.productTable.toggleRowSelection(row, false)
      this.form.goodsyprice = 0
      this.multipleSelected.forEach((item, index) => {
        this.form.goodsyprice += item.goodsyprice
      })
    },
    showProduct () {
      this.visible = true
      setTimeout(() => {
        let arr = this.multipleSelected.map(item => {
          return item.id
        })
        this.multipleSelection.forEach((item, index) => {
          if (arr.indexOf(item.id) < 0) { // 表格的与选择的做对比，去除未存在表格中的
            this.$refs.productTable.toggleRowSelection(item, false)
          }
        })
        this._getProduct()
      }, 10)
    },
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
        this.$refs.editor.quill.insertEmbed(this.addImgRange !== null ? this.addImgRange.index : 0, 'image', this.ossUrl + response.model + '?x-oss-process=style/quality50', Quill.sources.USER)
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
      this.form.goodsItemDTOS = this.multipleSelected.map((item, index) => {
        return {
          goodsItemId: item.id,
          goodsprice: item.productPrice
        }
      })
      this.$refs[form].validate((valid) => {
        if (valid) {
        this.loading = true
          this.$tupHttp(this, 'product/goods/save', 'POST', this.form).then(res => {
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
    _getProduct () {
      this.$tupHttp(this, 'product/goods/selectList?groupFlag=0&isSelf=0&goodsName=' + this.goodsName + '&page=' + this.page + '&size=' + this.size, 'GET').then(res => {
        this.productData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total
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
    this.$refs.editor.quill.getModule('toolbar').addHandler('image', imgHandler)
  },
  components: {
    quillEditor
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
