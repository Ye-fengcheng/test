<template>
  <div class="activity">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>查看活动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container class="container" v-show="form.title">
      <el-aside width="220px" class="aside">
        <img :src="form.imgUrl" class="image"/>
        <p>当前活动报名人数：</p>
        <p>{{form.enrollNum}}人</p>
        <p>活动周期：</p>
        <p>{{form.beginTime}} ~ {{form.endTime}}</p>
        <p>报名截止日期：</p>
        <p>{{form.enrollEndTime}}</p>
        <p v-if="form.sessionList">活动场次：</p>
        <p v-if="form.sessionList">{{form.sessionList}}</p>
        <p v-if="form.intentionTitle">自定义标题：</p>
        <p v-if="form.intentionTitle">{{form.intentionTitle}}</p>
        <p v-if="form.intention">内容选择：</p>
        <p v-if="form.intention">{{form.intention}}</p>
      </el-aside>
      <el-main class="main">
        <h4 class="title">{{form.title}}</h4>
        <p class="time">发布时间：{{form.createTime}}</p>
        <div class="ql-editor" v-html="form.content"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'activity',
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
        intention: [],
        excelUrl: '',
        email: ''
      }
    }
  },
  methods: {
    _getDetail (id) {
      this.$hsyHttp(this, 'backend/prom/get/' + id).then(res => {
        this.form = res.data.model
        this.form.createTime = new Date(this.form.createTime).format('yyyy-MM-dd hh:mm:ss')
        this.form.beginTime = new Date(this.form.beginTime).format('yyyy-MM-dd')
        this.form.endTime = new Date(this.form.endTime).format('yyyy-MM-dd')
        this.form.enrollEndTime = new Date(this.form.enrollEndTime).format('yyyy-MM-dd')
        this.form.sessionList = this.form.sessionList.map(item => {
          return new Date(item).format('yyyy-MM-dd')
        }).join('/')
        this.form.intention = this.form.intention.replace(/,/g, '/')
      })
    }
  },
  created () {
    let id = Number(this.$route.query.id)
    this._getDetail(id)
  }
}
</script>

<style lang="scss">
.activity {
  padding: 30px;
  color: #606266;
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .crumbs {
    margin-bottom: 20px;
  }

  .aside {
    margin-top: 24px;
    border-right: 1px solid #e1e1e1;
    .image {
      width: 180px;
    }
    p {
      line-height: 30px;
    }
  }
  .main {
    margin-left: 10px;
    overflow: hidden;
    .title {
      text-align: center;
      color: #333;
      font-weight: bold;
      font-size: 24px;
      line-height: 45px;
    }
    .time {
      color: #606266;
      text-align: center;
      margin-bottom: 15px;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>