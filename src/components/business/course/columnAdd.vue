<template>
  <div class="column-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>{{comForm.id ? '编辑栏目' : '新建栏目'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="comForm" ref="comForm" :rules="rules" label-width="130px" class="form" size="mini">
      <el-form-item label="平台" prop="platform" required>          
        <el-select v-model="comForm.platform" size="mini" @change="selPlatform" filterable placeholder="请选择">
          <el-option label="慧管理" :value="1"></el-option>
          <el-option label="会生意" :value="2"></el-option>
          <el-option label="惠厨房" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目级别" prop="level" required>          
        <el-select v-model="comForm.level" size="mini" @change="selLevel" filterable placeholder="请选择">
          <el-option label="一级栏目" :value="1"></el-option>
          <el-option label="二级栏目" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="一级栏目" v-show="comForm.level === 2" required>            
        <el-select v-model="comForm.parentId" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in column1"
            :key="item.id"
            :label="item.nameOne"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="comForm.level === 1 ? '一级栏目名称' : '二级栏目名称'" prop="name">          
        <el-input v-model="comForm.name" placeholder="不超过10字" style="width:200px" maxlength=10></el-input>
      </el-form-item>
      <el-form-item :label="comForm.level === 1 ? '一级栏目入口图片' : '二级栏目入口图片'" prop="pic">
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
      <el-form-item label="栏目状态" prop="status" required>
        <el-radio v-model="comForm.status" :label="1">启用</el-radio>
        <el-radio v-model="comForm.status" :label="0">禁用</el-radio>            
      </el-form-item>
      <el-form-item label="栏目排序" prop="sort">
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
      <el-form-item label="栏目可见角色" prop="roleIdList">
        <el-select v-model="comForm.roleIdList" multiple placeholder="请选择" style="width:500px">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="form-footer">
        <el-button @click="commit" size="mini" :loading="loading" type="primary">保存</el-button>
        <el-button @click="$router.go(-1)" size="mini">取消</el-button>
      </div>
      <el-dialog title="图片" width="30%" top="5%" :close-on-click-modal="false" :visible.sync="picVisible">
        <img :src="comForm.pic" style="max-width: 100%;" />
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      var validateParentId = (rule, value, callback) => {
        console.log(value)
        if (this.comForm.level == 2 && value) {
          callback(new Error('请选择一级栏目'))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: process.env.SERVICE_IP + '/backend/oss/upload',
        column1: [],
        roleList: [],
        roleList1: [],
        headers: {
          x_auth_token: window.localStorage.getItem('token'),
          x_request_platform: 'WEB',
          x_user_id: window.localStorage.getItem('pUid')
        },
        comForm: {
          platform: 1,
          level: 1,
          parentId: '',
          name: '',
          pic: '',
          status: 1,
          sort: '',
          roleIdList: []
        },
        rules: {
          parentId: [
            { validator: validateParentId, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入栏目名称', trigger: 'blur' }
          ],
          pic: [
            { required: true, message: '请上传栏目入口图片', trigger: 'change' }
          ],
          sort: [
            { pattern:/^-?\d{1,9}$/, message: '长度在1到9个字符', trigger: 'blur' }
          ]
        },
        loading: false,
        picVisible: false
      }
    },
    watch:{
      'comForm.platform':function(platform){
        if(platform == 1){
          this.roleList = this.roleList1;
        }
        if(platform == 2){
          this.roleList = [{ id:1, name:'店主'},{ id:2, name:'店员'}]
        }
        else if(platform == 3){
          this.roleList = [{ id:0, name:'全部'}]
        }
      }
    },
    methods: {
      upload (option) {
        this.fileName = option.file.name
        this.$util.readExcel(option.file, this.treatDatas)
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
      selPlatform () {
        this.column1 = []
        this.comForm.parentId = ''        
        this.comForm.roleIdList = []
        if(this.comForm.platform == 1){
          this.roleList = this.roleList1;
        }
        else if(this.comForm.platform == 2){
          this.roleList = [{ id:1, name:'店主'},{ id:2, name:'店员'}]
        }
        else if(this.comForm.platform == 3){
          this.roleList = [{ id:0, name:'全部'}]
        }
        this.selLevel()
        
      },
      selLevel () {
        if (this.comForm.level === 2 && !this.column1.length) {
          this._getColumn1({
            platform: this.comForm.platform,
            level: 1
          })
        }
        if (this.comForm.level === 1) {
          this.parentId.parentId = ''
        }
      },
      selRole () {
        this.$tupHttp(this, 'employee/role/roleList', 'POST', {
          pagingQuery: {
            pageIndex: 1,
            pageSize: 1000
          },
          platform: this.comForm.platform === 1 ? 4 : this.comForm.platform
        }).then(res => {
          this.roleList1 = res.data.models
          this.roleList = res.data.models
        })
      },
      showPic () {
        this.picVisible = true
      },
      commit () {
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            console.log(this.comForm)
            this.loading = true
            let url = this.comForm.id ? 'manage-app/course/backend/column/update' : 'manage-app/course/backend/column/add'
            this.$hsyHttp(this, url, 'POST', this.comForm).then(res => {
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
      _getColumn1 (data) {
        this.$hsyHttp(this, 'manage-app/course/backend/column/listByCondition', 'POST', data).then(res => {
          this.column1 = res.data.models
        })
      },
      _getDetail (id) {
        this.$hsyHttp(this, 'manage-app/course/backend/column/get?id=' + id).then(res => {
          let comForm = res.data.model
          this.comForm = {
            id: comForm.id,
            platform: comForm.platform,
            level: comForm.level,
            parentId: comForm.parentId,
            name: comForm.level === 1 ? comForm.nameOne : comForm.nameTwo,
            pic: comForm.level === 1 ? comForm.picOne : comForm.picTwo,
            status: comForm.status,
            sort: comForm.sort,
            roleIdList: comForm.roleIdList && comForm.roleIdList[0] === 0 ? [] : comForm.roleIdList
          }
          if (this.comForm.level === 2) {
            this._getColumn1({
              platform: this.comForm.platform,
              level: 1
            })
          }
        })
      }
    },
    created () {
      this.selRole() 
      let thiz = this
      if (this.$route.query.id) {
        setTimeout(function(){
          thiz._getDetail(thiz.$route.query.id)
        })        
      }      
    }
  }
</script>
<style lang="scss">
.column-add {
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
