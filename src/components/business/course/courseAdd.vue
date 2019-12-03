<template>
  <div class="course-add">
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>{{comForm.id ? '编辑课件' : '新建课件'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-form :model="comForm" ref="comForm" :rules="rules" label-width="110px" class="form" size="mini">
      <el-form-item label="平台" required>          
        <el-select v-model="comForm.platform" size="mini" :disabled="comForm.id ? true : false" @change="selPlatform" filterable placeholder="请选择">
          <el-option label="慧管理" :value="1"></el-option>
          <el-option label="会生意" :value="2"></el-option>
          <el-option label="惠厨房" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台范围" prop="platformType" required>
        <el-radio v-model="comForm.platformType" :label="0">全部</el-radio>            
      </el-form-item>
      <el-form-item label="所属栏目" prop="columnId" required>          
        <el-select v-model="comForm.columnId" size="mini" filterable placeholder="请选择" style="width: 300px;">
          <el-option
            v-for="item in column"
            :key="item.id"
            :label="item.nameOne"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可见名单" required prop="visibleType">
        <el-select v-model="comForm.visibleType" size="mini" @blur="blurTreate" filterable placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="自定义" :value="1"></el-option>
          <el-option label="指定区域省办" :value="2"></el-option>
        </el-select>
        <div style="display: inline-block;" v-show="comForm.visibleType === 1">
          <el-upload
            style="margin-left:10px;display:inline-block;"
            :action="uploadUrl"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">导入可见名单</el-button>
          </el-upload>
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/可见名单模板.xlsx?'+$util.getRandom())" type="text">导入模板下载</el-button>
          <el-button size="mini" v-show="comForm.visibleIdList.length" @click="showMenu" type="text">查看</el-button>
        </div>
        <div style="display: inline-block;" v-show="comForm.visibleType === 2">
          <el-button size="mini" @click="showAreaDialog" type="primary">设置地区</el-button>
          {{comForm.visibleIdList ? comForm.visibleIdList.join(','):''}}
        </div>
      </el-form-item>
      <el-form-item label="课件标题" prop="title">          
        <el-input v-model="comForm.title" placeholder="不超过30字" style="width:420px" maxlength=30></el-input>
      </el-form-item>
      <el-form-item label="课件副标题" prop="subTitle">
        <el-input v-model="comForm.subTitle" placeholder="不超过15字" style="width:260px" maxlength=15></el-input>
      </el-form-item>
      <el-form-item label="课件入口图片" prop="pic">
        <el-upload style="display:inline-block;"
          :show-file-list="false"
          :action="uploadUrl" :headers="headers"
          :on-success="onSuccess"
          :before-upload="beforeUpload" ref="uploadImg">
          <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传图片</el-button>
          <span>(大小不超过200k)</span>
        </el-upload>
        <el-button size="mini" v-show="comForm.pic" @click="showPic" type="text">查看</el-button>
      </el-form-item>
      <el-form-item label="课件状态" prop="status" required>
        <el-radio v-model="comForm.status" :label="1">启用</el-radio>
        <el-radio v-model="comForm.status" :label="0">禁用</el-radio>            
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="comForm.sort" type="number" placeholder="" style="width:120px"></el-input>
         <el-popover
          placement="right"
          title="排序说明"
          width="400"
          trigger="hover">
          如不填写排序值，则默认排序值为0，前端显示按照创建/编辑时间排序，离当前时间越近显示越靠前；<br/>如输入排序值，则前端按照输入的排序值进行排序，数字越大显示越靠前。
          <el-button icon="el-icon-warning" slot="reference" style="border: none;"></el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="课件显示时间" prop="displayTime">
        <el-date-picker
          v-model="comForm.displayTime"
          placeholder="课件显示时间"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="附件(限制3个)">
        <el-upload
          :disabled="loading"
          :file-list="comForm.attachments"
          :multiple="true"
          :limit="3"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :httpRequest="uploadFile">
          <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">上传</el-button>(支持格式：pdf，jpg，xlsx，docx，pptx，txt；单个大小限制：50M)
        </el-upload>
      </el-form-item>
      <el-form-item label="课件正文" prop="content">
        <tinymce ref="richText" v-model="comForm.content" @on-upload-complete="onEditorUploadComplete"></tinymce>
      </el-form-item>
      <div class="form-footer">
        <el-button @click="commit(0)" size="mini" :loading="loading" type="primary">保存</el-button>
        <!-- <el-button @click="commit(1)" v-if="!comForm.id" size="mini" :loading="loading" type="primary" >保存并推送消息</el-button> -->
        <el-button @click="dialogVisible2 = true" size="mini" type="primary">预览</el-button>
        <el-button @click="$router.go(-1)" size="mini">取消</el-button>
      </div>
      <el-dialog title="图片" width="30%" top="5%" :close-on-click-modal="false" :visible.sync="picVisible">
        <img :src="comForm.pic" style="max-width: 100%;" />
      </el-dialog>
      <el-dialog title="导入出错数据" width="60%" top="5%" :visible.sync="errDialogVisible">
        <el-table
          :data="errorTableData"
          style="width: 100%;"
          height="450"
          highlight-current-row>
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="id"
            label="编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="message"
            label="错误信息"
            width="150">
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="可见名单" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible">
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
    </el-form>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="areaDialogVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="areaDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送内容" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible2">
      <el-form ref="form" :model="comForm" label-width="100px;" size="small" height="450">
        <el-form-item label="标题：">{{comForm.title}}</el-form-item>
        <el-form-item label="副标题：">{{comForm.subTitle}}</el-form-item>
        <el-form-item label="入口图片：">
          <img :src="comForm.pic" style="width: 80px;"/>
        </el-form-item>
        <el-form-item label="内容：">
        </el-form-item>
        <div v-html="comForm.content" class="jg-content-html"></div>
        <el-form-item label="附件：">
        </el-form-item>
        <div v-if="comForm.attachments" v-for="(item,index) in comForm.attachments" :key="index"><a :href="item.url" target="_blank">{{item.name}}</a></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tinymce from '@/components/other/Tinymce'
  // window.tinymce.baseURL = '/static/tinymce' // 需要调用tinymce的组件中得加入这，不然会报错
  if (location.host.indexOf('localhost') >= 0) { // 本地环境
　　window.tinymce.baseURL = '/static/tinymce'
  } else {
    window.tinymce.baseURL = '/backend/static/tinymce'
  }
  export default {
    data () {
      var validateVisibleType = (rule, value, callback) => {
        if (this.comForm.visibleType == 1 && !this.comForm.visibleIdList.length) {
          callback(new Error('请设置可见名单'))
        }
        else if (this.comForm.visibleType == 2 && !this.comForm.visibleIdList.length) {
          callback(new Error('请设置区域省办'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible2: false,
        uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
        column: [],
        roleList: [],
        headers: {
          x_auth_token: window.localStorage.getItem('token'),
          x_request_platform: 'WEB',
          x_user_id: window.localStorage.getItem('pUid')
        },
        comForm: {
          attachments:[],
          platform: 1,
          columnId: '',
          visibleType: 0,
          displayTime: '',
          visibleIdList: [],
          platformType: 0,
          title: '',
          subTitle: '',
          pic: '',
          status: 1,
          sort: '',
          content: ''
        },
        areaData:{
          isarea:'1',
          data:[]
        },
        rules: {
          columnId: [
            { required: true, message: '请选择所属栏目', trigger: 'change' }
          ],
          visibleType: [
            { validator: validateVisibleType, trigger: 'blur'}
          ],
          title: [
            { required: true, message: '请输入课件标题', trigger: 'blur' }
          ],
          subTitle: [
            { required: true, message: '请输入课件副标题', trigger: 'blur' }
          ],
          pic: [
            { required: true, message: '请上传课件入口图片', trigger: 'change' }
          ],
          sort: [
            { pattern:/^-?\d{1,9}$/, message: '长度在1到9个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入课件正文', trigger: 'blur' }
          ]
        },
        loading: false,
        picVisible: false,
        errDialogVisible: false,
        errorTableData: [],
        roleData: [],
        dialogVisible: false,
        areaDialogVisible: false
      }
    },
    methods: {
      blurTreate(){
        this.comForm.visibleIdList = []
      },
      showAreaDialog() {
        this.areaDialogVisible = true;
        let thiz = this;
        if(this.comForm.visibleIdList){
            let arr1 = []
            this.comForm.visibleIdList.map(item =>{
              arr1.push({code:item})
            })
            setTimeout(function(){
              thiz.areaData = {
                data: arr1,
                isarea:'1',
              }
            }) 
          }
      },
      saveArea(){     
        let thiz = this;
        this.areaDialogVisible = false;
        if(this.areaData.data.length){
          thiz.comForm.visibleIdList = [];
          this.areaData.data.map(item=>{
            thiz.comForm.visibleIdList.push(item.code)
          })
        }
        else{
          thiz.comForm.visibleIdList = [];
        }
      },
      handleRemove(file, fileList){
        this.comForm.attachments = fileList
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
          thiz.comForm.attachments.push({
            name: option.filename,
            url: '',
            size: ''
          });
          thiz.comForm.attachments.splice(thiz.comForm.attachments.length - 1,1);
          return;
        }
        this.loading = true;
        let formData = new FormData();
        formData.append(option.filename, option.file);
        this.$tupHttp(this,'media/create?parentId=1&category='+category+'&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
          let file = res.body.model
          thiz.comForm.attachments.push({
            name: file.fileName,
            url: file.ossUrl,
            size: file.fileSize
          });
          thiz.loading = false;
        },res=>{
          thiz.comForm.attachments.push({
            name: option.filename,
            url: '',
            size: ''
          });
          thiz.comForm.attachments.splice(thiz.comForm.attachments.length - 1,1);
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
      onEditorUploadComplete (data) {
        if (data.success) {
          this.$message.success('上传成功')
        } else {
          this.$message.error(data.message)
        }
      },
      upload (option) {
        this.fileName = option.file.name
        this.$util.readExcel(option.file, this.treatDatas)
      },
      treatDatas (datas){
        let arr = []
        for (let i =1; i < datas.sheet0.length; i++) {
          if (!!datas.sheet0[i][1]) {
            arr.push(datas.sheet0[i][1])
          }          
        }
        let thiz = this
        this.loading = true
        thiz.$tupHttp(thiz, 'manage/pushMessage/usersCheck?platform=' + thiz.comForm.platform + '&users=' + arr, 'POST').then(res=>{
          thiz.loading = false
          if (res.body.valid) {
            thiz.$notify.success({
              title: '成功提示',
              message: '操作成功'
            })
            thiz.comForm.visibleIdList = arr
            this.$refs.comForm.validateField('visibleType')
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
        }) 
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
        this.comForm.pic = response.model
        this.$refs.comForm.validateField('pic')
      },
      showMenu () {
        this.roleData = this.comForm.visibleIdList.map(item => {
          return {
            id: item
          }
        })
        this.dialogVisible = true
      },
      selPlatform () {
        this.column = []
        this.comForm.columnId = ''
        this.comForm.visibleIdList = []
        this._getColumn()
      },
      showPic () {
        this.picVisible = true
      },
      commit (isJgPush) {
        this.comForm.isJgPush = isJgPush;
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            console.log(this.comForm)
            let comForm = this.$util.deepClone(this.comForm)
            comForm.visibleIdList = comForm.visibleType == 0 ? [] : comForm.visibleIdList
            let url = this.comForm.id ? 'manage-app/course/backend/ware/update' : 'manage-app/course/backend/ware/add'
            this.loading = true
            this.$hsyHttp(this, url , 'POST', comForm).then(res => {
              this.loading = false
              this.$notify.success({
                title: '成功提示',
                message: '保存成功'
              })
              this.$router.go(-1)
            }, () => {
              this.loading = false
            })
          }
        })
      },
      _getColumn () {
        this.$hsyHttp(this, 'manage-app/course/backend/column/listByCondition', 'POST', {
          platform: this.comForm.platform,
          parentId: '',
          level: 2
        }).then(res => {
          this.column = res.data.models
        })
      },
      _getDetail (id) {
        let thiz = this
        this.$hsyHttp(this, 'manage-app/course/backend/ware/get?id=' + id).then(res => {
          let comForm = res.data.model
          this.comForm = {
            id: comForm.id,
            platform: comForm.platform,
            columnId: comForm.columnId,
            visibleType: comForm.visibleType,
            visibleIdList: comForm.visibleIdList,
            title: comForm.title,
            subTitle: comForm.subTitle,
            pic: comForm.pic,
            status: comForm.status,
            sort: comForm.sort,
            displayTime: comForm.displayTime ? new Date(comForm.displayTime):'',
            attachments: comForm.attachments ? comForm.attachments:[],
            platformType: comForm.platformType,
            content: comForm.content,
            provinces: comForm.provinces 
          }
          this._getColumn()          
          this.$refs.richText.setContent(comForm.content)
        })
      }
    },
    created () {
      if (this.$route.query.id) {
        this._getDetail(this.$route.query.id)
      }
      this._getColumn()
    },
    components: {
      tinymce
    }
  }
</script>
<style lang="scss">
.course-add {
  padding: 30px;
  .crumbs {
    margin-bottom: 20px;
  }
  .form {
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .el-form-item--mini {
    margin-bottom: 18px !important;
  }
  .el-upload__input {
    display: none;
  }
}
</style>
