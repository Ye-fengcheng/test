<template>
<div>
  <div>
    <el-upload
      style="float:left"
      :show-file-list="false"
      :multiple="true"
      :httpRequest="upload">
      <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">上传</el-button>
    </el-upload>
    &nbsp;
    <el-popover
      placement="top"
      width="260"
      v-model="visible">
        <el-form ref="comForm" :model="comForm" :rules="comRules" label-width="0px">
          <el-form-item label="" prop="title">          
            <el-input v-model="comForm.title"  placeholder="文件夹名称"></el-input>
          </el-form-item> 
        </el-form>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="commit" :loading="loading">确定</el-button>
      </div>
      <el-button slot="reference"  icon="el-icon-plus" size="mini" type="success">新建文件夹</el-button>
    </el-popover>
    
  </div>
  <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      :height="tableHeight"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名"
        sortable
        width="350">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.file">{{scope.row.fileName}}</span>
            <a style="cursor:pointer" v-else @click="gotoUrl('/frame/multiMedia/index/'+scope.row.id)"><i class="el-icon-message"></i>{{scope.row.fileName}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileSize"
        label="大小"
        sortable
        width="100">
        <template slot-scope="scope">
          {{scope.row.fileSize == -1 ? '文件夹':scope.row.fileSize}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.file"
            size="mini"
            @click="download(scope.$index, scope.row.ossUrl)">下载</el-button>
          <el-button
            size="mini"        
            @click="rename(scope.$index, scope.row)">重命名</el-button>
          <el-button
            size="mini" 
            v-if="scope.row.file"     
            @click="copy(scope.$index, scope.row)">复制链接</el-button>
          <el-button
            size="mini"          
            type="primary"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
  </el-table>
  <div style="text-align: right;margin-top:15px;">
    <el-pagination
      @current-change="handleCurrentChange"
      background
      :current-page="pagingQuery.pageIndex"
      :page-size="20"
      layout="total,  prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  <el-dialog title="重命名" width="30%" top="5%" :visible.sync="dialogVisible">
    <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-width="0px">
      <el-form-item label="" prop="title">          
        <el-input v-model="fileForm.title"  placeholder="名称"></el-input>
      </el-form-item> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" :loading="loading" @click="saveRename">确认</el-button>
      <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data() {
      return {
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        comForm:{
          title:''
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        fileForm:{
          title:''
        },
        fileRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        visible:false,
        total:0,
        id:this.$route.params.id,
        currentPage:1,
        tableLoading:false,
        loading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        tableData: [
        ],
        pagingQuery:{pageIndex: 1,pageSize: 20}
      }
    },
    watch:{
      '$route': function(){
        this.id = this.$route.params.id;
        this.loadFiles();
      }
    },
    methods: {
      download(ind,ossUrl){
        window.open(ossUrl)
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      }, 
      commitData(){        
        let thiz = this;
        this.loading = true;
        this.$tupHttp(this,'media/create?parentId='+this.id+'&fileName='+this.comForm.title+'&isFile=false','POST',{}).then(res=>{
          thiz.loadFiles();
          thiz.loading = false;
          thiz.visible = false;
        },res=>{
          thiz.loading = false;
          thiz.visible = false;
        })
      },
      commit(){        
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      checkFileType(extension){
        let category = '';
        switch(extension.toLowerCase()){
          case 'jpg':
          case 'png':
          case 'jpeg':
          case 'gif':
            category ='images';
          break;
          case 'xls':
          case 'xlsx':
          case 'doc':
          case 'docx':
          case 'txt':
          case 'ppt':
          case 'pptx':
            category ='docs';
          break;
          case 'mp4':
          case 'avi':
          case 'wmv':
            category ='videos';
          break;
          default : category ='none';
        }
        return category;
      },
      upload(option){
        let thiz = this;
        let fileName = option.file.name;
        let category = this.checkFileType(fileName.substring(fileName.lastIndexOf('.')+1,fileName.length));
        if(category=='none'){
          this.$notify.error({
            title: '错误提示',
            message: '格式有误'
          });
          return;
        }
        this.loading = true;
        let formData = new FormData();
        formData.append(option.filename, option.file);
        this.$tupHttp(this,'media/create?parentId='+this.id+'&category='+category+'&isFile=true'+'&fileName='+option.file.name,'POST',formData).then(res=>{
          thiz.loadFiles();
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pagingQuery.pageIndex = val;
        this.loadFiles();
      },
      formatter(row, column) {
        return row.publicTime;
      },
      commitRename(){        
        let thiz = this;
        this.loading = true;
        this.$tupHttp(this,'media/rename?fileId='+this.tableData[this.itemIndex].id+'&fileName='+this.fileForm.title,'POST',null).then(res=>{
          thiz.loadFiles();
          thiz.loading = false;
          thiz.dialogVisible = false;
        },res=>{
          thiz.loading = false;
        })
      },
      saveRename(){
        this.$refs.fileForm.validate((valid) => {
          if (valid) {
            this.commitRename();
          } else {
            return false;
          }
        });
      },
      rename(index, row) {
        this.fileForm.title = row.fileName;
        this.itemIndex = index;
        this.dialogVisible = true;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      copy(index, row){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', row.ossUrl);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
        document.body.removeChild(input);
      },
      handleDelete(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'media/delete/'+row.id,'POST',null).then(res=>{
            thiz.loadFiles();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });
        
      },
      loadFiles(){
        let thiz = this;
        thiz.tableLoading = true;
        this.$tupHttp(this,'media/list/'+this.id,'POST',this.pagingQuery).then(res=>{
          thiz.tableData = res.body.models
          thiz.total = res.body.pageInfo.total;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadFiles()
    }
  }
</script>
