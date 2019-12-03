<template>
  <div class="sourceBatchAdd">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>编辑批次：{{sns}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="" v-loading="temloading">
      <div class="sourceBatch">
        <div class="sourceBatchShow">
          <img :src="temImg">
          <div class="sourceBatchWord">
            <p v-show="detailList.eventTime" class="sourceDate">日期：<span>{{detailList.eventTime}}</span></p>
            <p v-show="detailList.address" class="sourceAddress"><i class="el-icon-location"></i><span>{{detailList.address}}</span></p>
            <p v-show="detailList.events" v-for="(item, index) in detailList.events.split('\n')" :key="index">{{item}}</p>
          </div>
        </div>
        <div class="sourceBatchInfo">
          <el-steps :active="active" finish-status="success">
            <el-step v-for="(item, index) in list" :key="index" :title="'第'+ item.sort +'页'" :description="item.title"></el-step>
          </el-steps>
          <div class="sourceBatchInput">
            <el-form>
              <el-form-item label="日期：">
                <el-date-picker type="date" v-model="detailList.eventTime" size="small" style="width:50%;" value-format="yyyy/MM/dd" placeholder="请选择日期" :editable="false"></el-date-picker>
              </el-form-item>
              <el-form-item label="地点：">
                <el-input size="small" v-model="detailList.address" placeholder="请输入地点" style="width:50%;"></el-input>
              </el-form-item>
              <el-form-item label="事件：">
                <el-input type="textarea" v-model="detailList.events" :rows="2" size="small" placeholder="请输入事件" style="width:50%;"></el-input>
                <p style="padding-left:60px">请输入页面显示文字内容，enter可换行显示</p>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="primary" size="small" v-show="active!=0" @click="toPev">上一页</el-button>
          <el-button v-if="list.length-1 <= active" type="primary" size="small" :loading="loading" @click="toSaveBatch">保存</el-button>
          <el-button v-else type="primary" size="small" @click="toNext">下一页</el-button>
          <el-button type="" size="small" @click="toBack">取消</el-button>
        </div>
      </div>
      <!-- <div v-else class="sourceBatchCon">
        <el-form>
          <el-form-item label="批次号：" required>
            <el-input v-model="sns" type="textarea" :rows="5" size="small" placeholder="请输入批次号" style="width:50%;"></el-input>
            <p class="pl80">如多个批次请用英文“,”号分隔</p>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" v-show="active!=0" @click="toPev">上一页</el-button>
        <el-button type="primary" size="small" :loading="loading" @click="toSaveBatch">保存</el-button>
        <el-button type="" size="small" @click="toBack">取消</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'sourceBatchAdd',
  data () {
    return {
      active: 0,
      temImg: '',
      tableData: [],
      tableLoading: false,
      ruleForm: {
        condition: {
          title: '',
          status: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      total: 0,
      temloading: false,
      loading: false,
      list: [],
      detailList: {
        address: '',
        eventTime: '',
        events: '',
        templateItemId: 0
      },
      sns: '',
      sourceTemplateId: 0,
      detailDTOList: []
    }
  },
  methods: {
    toPev () {
      this.detailDTOList[this.active] = this.$util.deepClone(this.detailList)
      this.detailDTOList[this.active].templateItemId = this.list[this.active].templateItemId
      console.log(this.detailDTOList)
      if (this.active-- < 0) this.active = 0
      this.temImg = this.list[this.active].image
      this.detailList = this.$util.deepClone(this.detailDTOList[this.active])
    },
    toNext () {
      this.detailDTOList[this.active] = this.$util.deepClone(this.detailList)
      this.detailDTOList[this.active].templateItemId = this.list[this.active].templateItemId
      this.detailList = {
        address: '',
        eventTime: '',
        events: '',
        templateItemId: ''
      }
      console.log(this.detailDTOList)
      this.active++
      if (this.active < this.list.length) {
        this.temImg = this.list[this.active].image
      }
      if (this.active < this.detailDTOList.length) {
        this.detailList = this.$util.deepClone(this.detailDTOList[this.active])
      }
    },
    toSaveBatch () {
      this.detailDTOList[this.active] = this.$util.deepClone(this.detailList)
      this.detailDTOList[this.active].templateItemId = this.list[this.active].templateItemId
      if (this.sns.trim() === '') {
        this.$message.error('批次号不能为空')
        return false
      }
      this.detailDTOList.forEach(item => {
        // delete item.productSourceInfoId
        // delete item.id
        // delete item.image
        // delete item.sort
        // delete item.title
      })
      let batchData = {
        sns: this.sns,
        sourceTemplateId: this.sourceTemplateId,
        detailDTOList: this.detailDTOList
      }
      this.loading = true
      this.$hsyHttp(this, 'benefit-service/product/source/info/update', 'POST', batchData).then(res => {
        this.loading = false
        this.$notify.success({
          title: '成功',
          message: '保存成功'
        })
        this.$router.push({
          path: '/frame/sourceInfo/sourceBatch'
        })
      }).catch(() => {
        this.loading = false
      })
    },
    toSaveNew () {
      this.$router.push({
        path: '/frame/activity/activityAdd'
      })
    },
    toBack () {
      const thiz = this
      this.$confirm('取消后所填写资料不作保存，是否确定取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$router.push({
          path: '/frame/sourceInfo/sourceBatch'
        })
      })
    },
    _getDetail (id) {
      this.temloading = true
      this.$hsyHttp(this, 'benefit-service/product/source/info/detail?id=' + id, 'GET').then(res => {
        this.temloading = false
        this.list = res.data.models
        this.detailDTOList = res.data.models
        this.detailList = res.data.models[0]
        this.temImg = this.list[0].image
      }).catch(() => {
        this.temloading = false
      })
    }
  },
  created () {
    if (this.$route.query.id) {
      this.id = Number(this.$route.query.id)
      this.sns = this.$route.query.sn
      this.sourceTemplateId = this.$route.query.templateId
      this._getDetail(this.id)
    }
  }
}
</script>

<style lang="scss">
.sourceBatchAdd {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
    .publish-btn {
      float: right;
    }
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

  .pagination {
    margin: 20px 0;
    text-align: right;
    display: block;
  }
  .title{
    color: #ff7000;
    cursor: pointer;
  }

  .title-header {
    color: #909399;
  }
  .sourceBatchShow{
    position: relative;
    width: 300px;
    padding: 0;
    margin:0;
    float: left;
    .sourceBatchWord{
      position: absolute;
      left:0;top: 300px;
      padding:0 0 18px 24px;
    }
    p{
      color:#fff;
      font-size: 12px;
      margin: 0;
      padding: 0;
      line-height:18px;
    }
    .sourceDate{
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 130px;
      span{border-bottom: 1px solid #fff;}
    }
    .sourceAddress{
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    img{
      width: 100%;
    }
  }
  .sourceBatchInfo{
    float: left;
    width:calc(97% - 300px);
    padding-left:3%;
  }
  .sourceBatchInput{
    padding: 30px 0;
  }
  .pl80{padding-left: 80px;}
  .el-step__title{font-size: 14px;}
  .el-step__head.is-success{color: #ff7000;border-color:#ff7000}
  .el-step__title.is-success{color: #ff7000}
  .el-step__description.is-success{color: #ff7000}
}
</style>
