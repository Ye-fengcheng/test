<template>
  <div class="activity-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>{{form.id ? '编辑' : '新建'}}消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px" size="small">
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="推送平台" required>
              <el-select v-model="form.platforms" size="mini" filterable multiple placeholder="请选择">
                <el-option label="慧管理" :value="1"></el-option>
                <el-option label="会生意" :value="2"></el-option>
                <el-option label="惠厨房" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推送类型" required>
              <el-select v-model="form.type" size="mini" filterable placeholder="请选择">
                <el-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24" v-show="form.platforms.indexOf(1) > -1">
            <el-form-item label="慧管理推送名单" required>
              <el-select v-model="menu" size="mini" filterable placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="指定区域省办" value="area"></el-option>
                <el-option label="自定义" value="defined"></el-option>
              </el-select>
              <div style="display: inline-block;" v-show="menu === 'area'">
                <el-button size="mini" @click="areaDialogVisible = true" type="primary">设置地区</el-button>
                {{areaData.codes ? areaData.codes.join(','):''}}
              </div>
              <div style="display: inline-block;" v-show="menu === 'defined'">
                <el-upload
                  style="margin-left:10px;display:inline-block;"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :multiple="true"
                  :httpRequest="upload">
                  <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">导入推送名单</el-button>
                </el-upload>
                <el-button size="mini" @click="$util.winOpen('https://tup-templates.oss-cn-hangzhou.aliyuncs.com/推送名单模板.xlsx?'+$util.getRandom())" type="text">推送名单模板下载</el-button>
                <el-button size="mini" v-show="form.users" @click="showMenu" type="text">查看</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.platforms.indexOf(2) > -1">
            <el-form-item label="会生意推送名单" required>
              <el-select v-model="menu1" size="mini" filterable placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="指定区域省办" value="area"></el-option>
                <el-option label="自定义" value="defined"></el-option>
              </el-select>
              <div style="display: inline-block;" v-show="menu1 === 'area'">
                <el-button size="mini" @click="areaDialogVisible1 = true" type="primary">设置地区</el-button>
                {{areaData1.codes ? areaData1.codes.join(','):''}}
              </div>
              <div style="display: inline-block;" v-show="menu1 === 'defined'">
                <el-upload
                  style="margin-left:10px;display:inline-block;"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :multiple="true"
                  :httpRequest="upload1">
                  <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">导入推送名单</el-button>
                </el-upload>
                <el-button size="mini" @click="$util.winOpen('https://tup-templates.oss-cn-hangzhou.aliyuncs.com/推送名单模板.xlsx?'+$util.getRandom())" type="text">推送名单模板下载</el-button>
                <el-button size="mini" v-show="form.users" @click="showMenu" type="text">查看</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="推送标题" prop="title">
              <el-input v-model="form.title" size="mini" maxlength="10" style="width: 192px;" placeholder="请输入标题（不超过10字）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="推送图片" required>
              <el-select v-model="form.picType" size="mini" filterable placeholder="请选择">
                <el-option label="使用默认" :value="1"></el-option>
                <el-option label="自定义" :value="3"></el-option>
                <el-option label="无入口图片" :value="2"></el-option>
              </el-select>
              <el-upload v-show="form.picType === 3"
                style="margin-left:10px;display:inline-block;"
                :show-file-list="false"
                :action="uploadUrl" :headers="headers"
                :on-success="onSuccess"
                :before-upload="beforeUpload" ref="uploadImg">
                <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传图片</el-button>
                <span>(大小不超过200k)</span>
              </el-upload>
              <el-button size="mini" v-show="form.picType === 3 && form.picUrl" @click="showPic" type="text">查看</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="推送详情页" prop="pageType" required>
              <el-select v-model="form.pageType" size="mini" filterable placeholder="请选择">
                <el-option label="自定义详情页" :value="1"></el-option>
                <el-option label="无详情页" :value="2"></el-option>
                <el-option label="外部详情页" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.pageType === 3">
            <el-form-item label="外部详情页链接" prop="linkUrl">
              <el-input v-model="form.linkUrl" size="mini" placeholder="请输入外部详情页链接"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="推送时间" prop="pushTime" required>
              <el-date-picker :picker-options="pickerOptions" v-model="form.pushTime" style="width: 192px;" type="datetime" size="mini" placeholder="请选择推送时间" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推送副标题" prop="subtitle" required>
              <el-input v-model="form.subtitle" maxlength="50" size="mini" placeholder="请输入副标题（不超过50字）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息来源" prop="messageSource">
              <el-input v-model="form.messageSource" maxlength="10" size="mini" placeholder="不超过10字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5" v-show="form.pageType === 1">
          <el-col :span="18">
            <el-form-item label="附件(限制3个)">
              <el-upload
                :disabled="loading"
                :file-list="fileList"
                :multiple="true"
                :limit="3"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :httpRequest="uploadFile">
                <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">上传</el-button>(支持格式：pdf，jpg，xlsx，docx，pptx，txt；单个大小限制：50M)
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="自定义详情页内容" class="special-item" v-show="form.pageType === 1">
          <quill-editor ref="newEditor" v-model="form.pageDetails" :options="{placeholder: '请输入自定义详情页内容'}"></quill-editor>
          <el-upload style="display:none" :action="uploadUrl" :show-file-list="false" :before-upload='newEditorbeforeupload' :on-success='newEditorSuccess'
            :headers="headers" ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit('form')">提交</el-button>
          <el-button @click="dialogVisible2 = true;detail = form" type="primary" >预览</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="areaDialogVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="areaDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="areaDialogVisible1">
      <tup-arae-store-select ref="areaSelect" v-model="areaData1" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea1">确认</el-button>
        <el-button size="mini" @click="areaDialogVisible1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送名单出错数据" width="60%" top="5%" :visible.sync="errDialogVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="慧管理推送名单" name="zero">
          <el-table
            :data="errorTableData.errorManageUsersList"
            style="width: 100%;"
            height="450"
            highlight-current-row>
            <el-table-column
              prop="indexNum"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="errorUserId"
              label="编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误信息">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="会生意推送名单" name="first">
          <el-table
            :data="errorTableData.errorBusinessUsersList"
            style="width: 100%;"
            height="450"
            highlight-current-row>
            <el-table-column
              prop="indexNum"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="errorUserId"
              label="编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误信息">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="推送名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-table
        :data="roleData"
        style="width: 100%;"
        height="450"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送图片" width="30%" top="5%" :close-on-click-modal="false" :visible.sync="picVisible">
      <img :src="form.picUrl" style="max-width: 100%;" />
    </el-dialog>
    <el-dialog title="推送内容" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form1111" :model="detail" label-width="100px;" size="small" height="450">
        <el-form-item label="标题：">{{detail.title}}</el-form-item>
        <el-form-item label="副标题：">{{detail.subtitle}}</el-form-item>
        <el-form-item label="外部详情页链接：">{{detail.linkUrl}}</el-form-item>
        <el-form-item label="入口图片：">
          <img :src="detail.picUrl" style="width: 80px;"/>
        </el-form-item>
        <el-form-item label="内容：">
        </el-form-item>
        <div v-html="detail.pageDetails" class="jg-content-html"></div>
        <el-form-item label="附件：">
        </el-form-item>
        <div v-for="(item,ind) in fileList" :key="ind">
          <a :href="item.url" target="_blank">{{item.name}}</a>&nbsp;&nbsp;
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
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
      pickerOptions: {
        shortcuts: [{
          text: '1分钟后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 60 * 1000);
            picker.$emit('pick', date);
          }
        }, {
          text: '5分钟后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 60 * 1000 * 5);
            picker.$emit('pick', date);
          }
        }, {
          text: '半小时后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 60 * 1000 * 30);
            picker.$emit('pick', date);
          }
        }]
      },
      activeName:'zero',
      dialogVisible2:false,
      detail:{},
      form: {
        id: '',
        platforms: [1],        
        picType: 1,
        userType:'',
        userType1:'',
        type: '',
        users: '',
        title: '',
        picUrl: '',
        pageType: 1,
        subtitle: '',
        linkUrl: '',
        pushTime: '',
        pageDetails: '',
        attachment1:'',
        attachment2:'',
        attachment3:'',
        attachmentName1:'', 
        attachmentName2:'',
        attachmentName3:''
      },
      fileList:[],
      areaData:{
        isarea:'1',
        data:[],
        codes:[]
      },
      areaData1:{
        isarea:'1',
        data:[],
        codes:[]
      },
      typeDatas:[],
      menu: 'all',
      menu1: 'all',
      rules: {
        title: [
          { required: true, message: '请输入推送标题', trigger: 'blur' }
        ],
        pushTime: [
          { required: true, message: '请输入推送时间', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入推送副标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '推送类型必须选择', trigger: 'blur' }
        ]
      },
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
      areaDialogVisible: false,
      areaDialogVisible1: false,
      picVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList){
      this.fileList = fileList
    },
    checkFileType(extension){
      let category = '';
      switch(extension.toLowerCase()){
        case 'jpg':
          category ='images';
        break;
        case 'xls':
        case 'xlsx':
        case 'doc':
        case 'docx':
        case 'txt':
        case 'ppt':
        case 'pptx':
        case 'pdf':
          category ='docs';
        break;
        default : category ='none';
      }
      return category;
    },
    uploadFile(option){
      let thiz = this;
      let fileName = option.file.name;
      let category = this.checkFileType(fileName.substring(fileName.lastIndexOf('.')+1,fileName.length));
      if(category=='none'){
        this.$notify.error({
          title: '错误提示',
          message: '格式有误'
        });
        thiz.fileList.push({
          name: option.filename,
          url: '',
          size: ''
        });
        thiz.fileList.splice(thiz.fileList.length - 1,1);
        return;
      }
      this.loading = true;
      let formData = new FormData();
      formData.append(option.filename, option.file);
      this.$tupHttp(this,'media/create?parentId=1&category='+category+'&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
        let file = res.body.model
        thiz.fileList.push({
          name: file.fileName,
          url: file.ossUrl,
          size: file.fileSize
        });
        thiz.loading = false;
      },res=>{
        thiz.fileList.push({
          name: option.filename,
          url: '',
          size: ''
        });
        thiz.fileList.splice(thiz.fileList.length - 1,1);
        thiz.loading = false;
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$notify.error({
          title: '错误提示',
          message: '上传图片大小不能超过 50MB!'
        });
      }
      return isLt2M;
    },
    saveArea(){     
      let thiz = this;
      this.areaDialogVisible = false;
      if(this.areaData.data.length){
        this.areaData.codes = [];
        this.areaData.data.map(item=>{
          thiz.areaData.codes.push(item.code)
        })
      }
    },
    saveArea1(){     
      let thiz = this;
      this.areaDialogVisible1 = false;
      if(this.areaData1.data.length){
        this.areaData1.codes = [];
        this.areaData1.data.map(item=>{
          thiz.areaData1.codes.push(item.code)
        })
      }
    },
    showPic () {
      this.picVisible = true
    },
    showMenu () {
      this.roleData = this.form.users.split(',').map(item => {
        return {
          id: item
        }
      })
      this.dialogVisible = true
    },
    upload (option) {
      this.$util.readExcel(option.file, this.treatDatas)
    },
    treatDatas (datas){
      let arr = []
      for (let i =1; i < datas.sheet0.length; i++) {
        if (!!datas.sheet0[i][1]) {
          arr.push(datas.sheet0[i][1])
        }          
      }
      this.form.manageUsers = arr
      /* let thiz = this
      this.loading = true
      thiz.$tupHttp(thiz, 'manage/pushMessage/usersCheck?platform=1&users=' + arr, 'POST').then(res=>{
        thiz.loading = false
        if (res.body.valid) {
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          })
          thiz.form.manageUsers = arr.join(',')
        }else{
          thiz.errorTableData = res.body.extra.errorUserList.map(item => {
            return {
              id: item,
              message: 'ID不存在'
            }
          })
          thiz.errDialogVisible = true
        } 
      }, res => {
        thiz.loading = false
      })  */
    },
    upload1 (option) {
      this.$util.readExcel(option.file, this.treatDatas1)
    },
    treatDatas1 (datas){
      let arr = []
      for (let i =1; i < datas.sheet0.length; i++) {
        if (!!datas.sheet0[i][1]) {
          arr.push(datas.sheet0[i][1])
        }          
      }
      this.form.businessUsers = arr
      /* let thiz = this
      this.loading = true
      thiz.$tupHttp(thiz, 'manage/pushMessage/usersCheck?platform=' + thiz.form.platform + '&users=' + arr, 'POST').then(res=>{
        thiz.loading = false
        if (res.body.valid) {
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          })
          thiz.form.businessUsers = arr.join(',')
        }else{
          thiz.errorTableData = res.body.extra.errorUserList.map(item => {
            return {
              id: item,
              message: 'ID不存在'
            }
          })
          thiz.errDialogVisible = true
        } 
      }, res => {
        thiz.loading = false
      })  */
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
      return isSize && isType
    },
    onSuccess (response) {
      this.$notify.success({
        title: '成功提示',
        message: '图片上传成功'
      })
      this.form.picUrl = response.model
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
    validateLink (url) {
      if (!url) {
        this.$message('请填写外部详情页链接')
        return false
      }
      if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url)) {
        this.$message('外部详情页链接不正确')
        return false
      }
      return true
    },
    onSubmit (form) {
      let thiz = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (thiz.menu === 'defined' && !thiz.form.manageUsers.length) {
            thiz.$message('请上传慧管理推送名单')
            return
          }
          if (thiz.menu1 === 'defined' && !thiz.form.businessUsers.length) {
            thiz.$message('请上传会生意推送名单')
            return
          }
          if (thiz.form.picType === 3 && !thiz.form.picUrl) {
            thiz.$message('请上传图片')
            return
          }
          if (thiz.form.pageType === 1 && !thiz.form.pageDetails) {
            thiz.$message('请填写自定义详情页内容')
            return
          }
          if (thiz.form.pageType === 3 && !this.validateLink(thiz.form.linkUrl)) {
            return
          }
          if(thiz.menu === 'all'){
            thiz.form.userType = 'all'
            thiz.form.manageUsers = []
          }
          else if(thiz.menu === 'area'){
            thiz.form.userType = thiz.areaData.codes ? thiz.areaData.codes.join(','):''
            thiz.form.manageUsers = []
          }
          else{
            thiz.form.userType = 'defined'
          }
          if(thiz.menu1 === 'all'){
            thiz.form.userType1 = 'all'
            thiz.form.businessUsers = []
          }
          else if(thiz.menu1 === 'area'){
            thiz.form.userType1 = thiz.areaData1.codes ? thiz.areaData1.codes.join(','):''
            thiz.form.businessUsers = []
          }
          else{
            thiz.form.userType1 = 'defined'
          }
          if(thiz.fileList.length){
            for(let i =0;i<thiz.fileList.length;i++){
              thiz.form['attachment'+(i+1)] = thiz.fileList[i].url
              thiz.form['attachmentName'+(i+1)] = thiz.fileList[i].name
            }
          }
          thiz.form.picUrl = thiz.form.picType === 3 ? thiz.form.picUrl : ''
          thiz.form.pageDetails = thiz.form.pageType !== 1 ? '' : thiz.form.pageDetails
          thiz.form.linkUrl = thiz.form.pageType !== 3 ? '' : thiz.form.linkUrl
          thiz.loading = true
          let url = thiz.form.id ? 'manage/pushMessage/updatePushMessage' : 'manage/pushMessage/addPushMessage'
          thiz.$tupHttp(thiz, url, 'POST', thiz.form).then(res => {
            thiz.loading = false
            if (res.body.valid) {
              thiz.$notify.success({
                title: '成功',
                message: '保存成功'
              })
              thiz.$router.go(-1)
            }
            else{
              thiz.errorTableData = res.body.extra
              thiz.activeName = 'zero'
              thiz.errDialogVisible = true
            }
          }, res => {
            thiz.loading = false
          })
        }
      })
    },
    getType () {
      let thiz = this
      this.$tupHttp(thiz, 'manage/pushMessage/getValidPushMessageType', 'GET').then(res => {
        thiz.typeDatas = res.body.models
      })
    },
    getDetail (id) {
      this.$tupHttp(this, 'manage/pushMessage/getPushMessageById?pushMessageId=' + id, 'POST').then(res => {
        this.form = res.data.model
        if (this.form.users) {
          this.menu = 2
        }
      })
    },
  },
  mounted () {
    this.getType()
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