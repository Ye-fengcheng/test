<template>
  <div class="maintain">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>活动维护</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <el-input v-model="ruleForm.name" size="mini" style="width:150px;" placeholder="活动名称"></el-input>
        <el-select v-model="ruleForm.state" placeholder="活动状态" size="mini" style="width:150px;">
          <el-option key="" label="全部" value=""></el-option>
          <el-option key="1" label="进行中" value="1"></el-option>
          <el-option key="0" label="已结束" value="0"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="handleAdd()" type="primary" class="publish-btn">添加活动</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="activityCode" label="活动编码" width="80"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="200" class-name="title" label-class-name="title-header"></el-table-column>
        <el-table-column prop="initChance" label="初始抽奖次数" width="200"></el-table-column>
        <el-table-column prop="maxChance" label="最大抽奖次数" width="200"></el-table-column>
        <el-table-column prop="startDate" label="开始时间" width="130"></el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="130"></el-table-column>
        <el-table-column label="上架/下架" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.saleState" active-text="" inactive-text="" 
            :active-value=1 :inactive-value=0 :disabled="scope.row.status === '已结束'"
            @change="switchChange(scope.row.id, scope.row.saleState)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="initChance" label="参与人数" width="80"></el-table-column> -->
        <!-- <el-table-column prop="stateText" label="状态" width="120"></el-table-column> -->
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="small"  @click="handleUpdate(scope.row.id,scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
            <!-- <el-button size="small" @click="download(scope.row.id)">分享设置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="ruleForm.page"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog class="text-l"
        title="活动信息"
        :visible.sync="dialogVisible"
        width="50%">
        <el-form ref="form" label-width="30%" size="small">
            <el-form-item label="活动编码：" required>
            <el-input placeholder="请输入活动编码" style="width:90%;" v-model="update.activityCode"></el-input>
            </el-form-item>
            <el-form-item label="活动标题：" required>
            <el-input placeholder="请输入活动标题" style="width:90%;" v-model="update.activityName"></el-input>
            </el-form-item>
            <el-form-item label="初始抽奖次数：" required>
            <el-input placeholder="请输入初始抽奖次数" style="width:90%;" v-model="update.initChance"></el-input>
            </el-form-item>
            <el-form-item label="最大抽奖次数：" required>
            <el-input placeholder="请输入最大抽奖次数" style="width:90%;" v-model="update.maxChance"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：" required>
            <el-date-picker type="date" style="width:90%;" value-format="yyyy-MM-dd 00:00:00" placeholder="请选择开始时间" :editable="false" v-model="update.startDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" required>
            <el-date-picker type="date" style="width:90%;" value-format="yyyy-MM-dd 23:59:59" placeholder="请选择结束时间" :editable="false" v-model="update.endDate"></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onClose()">取 消</el-button>
            <el-button type="primary" @click="handleSave()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activityList',
  data () {
    return {
      tableData: [],
      tableLoading: false,
      ruleForm: {
        name: '',
        state: '',
        page: 1,
        size: 10
      },
      update: {},
      updates: {
        id: '',
        activityCode: '',
        activityName: '',
        startDate: '',
        endDate: '',
        initChance: 0,
        maxChance: 0,
        saleState: 1,
        state: 1
      },
      total: 0,
      dialogVisible: false,
      save: ''
    }
  },
  methods: {
    search () {
      this._getData()
    },
    toPublish () {
      this.$router.push({
        path: '/frame/activity/activityAdd'
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.page = val
      this._getData()
    },
    switchChange (id, saleState) { // saleState为修改后的状态
      this.$hsyHttp(this, 'dolls-service/activity/updateSale?activityId=' + id + '&saleState=' + saleState, 'GET').then(res => {
        this.$message.success('操作成功')
      })
      // if (saleState === 1) { // 上架
      //   this.$hsyHttp(this, 'dolls-service/activity/updateSale?activityId=' + id + '&saleState=1', 'GET').then(res => {
      //   })
      // } else if (saleState === 0) { // 下架
      //   this.$hsyHttp(this, 'dolls-service/activity/updateSale?activityId=' + id + '&saleState=0', 'GET').then(res => {
      //   })
      // }
    },
    download (id) {
      this.$hsyHttp(this, 'backend/prom/export/' + id).then(res => {
        window.open(res.data.model)
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，已生效活动链接也相应失效！你确认删除该条活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'backend/dolls/activity/delete?id=' + id, 'POST').then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    handleAdd () {
      this.save = 'add'
      this.dialogVisible = true
      this.update = JSON.parse(JSON.stringify(this.updates))
    },
    handleUpdate (id, data) {
      this.save = 'edit'
      this.dialogVisible = true
      this.update = JSON.parse(JSON.stringify(data))
    },
    handleSave () {
      if (this.update.activityCode === '') {
        this.$message.error('活动编码不能为空')
        return
      }
      if (this.update.activityName === '') {
        this.$message.error('活动标题不能为空')
        return
      }
      if (this.update.initChance === '') {
        this.$message.error('初始参加活动次数不能为空')
        return
      }
      if (this.update.maxChance === '') {
        this.$message.error('最大活动次数不能为空')
        return
      }
      if (this.update.startDate === '') {
        this.$message.error('开始时间不能为空')
        return
      }
      if (this.update.endDate === '') {
        this.$message.error('结束时间不能为空')
        return
      }
      if (Date.parse(this.update.startDate) > Date.parse(this.update.endDate)) {
        this.$message.error('开始时间应小于结束时间')
        return
      }
      let saveUrl = ''
      if (this.save === 'add') {
        saveUrl = 'backend/dolls/activity/save'
      } else if (this.save === 'edit') {
        saveUrl = 'backend/dolls/activity/update'
      }
      this.update.startDate = new Date(this.update.startDate)
      this.update.endDate = new Date(this.update.endDate)
      this.$hsyHttp(this, saveUrl, 'POST', this.update).then(res => {
        this.dialogVisible = false
        this.$message.success('保存成功')
        this._getData()
      })
    },
    _getData () {
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/dolls/activity/searchByNameAndState?page=' + this.ruleForm.page + '&size=' + this.ruleForm.size + '&name=' + this.ruleForm.name + '&state=' + this.ruleForm.state, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.map(item => {
          item.startDate = new Date(item.startDate).format('yyyy-MM-dd')
          item.endDate = new Date(item.endDate).format('yyyy-MM-dd')
          if (item.state === 1) {
            item.stateText = '进行中'
          } else {
            item.stateText = '已结束'
          }
        })
        this.tableData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    onClose () {
      this.dialogVisible = false
      this.update = JSON.parse(JSON.stringify(this.updates))
    }
  },
  created () {
    // this._getData()
  }
}
</script>

<style lang="scss">
.maintain {
  padding: 30px;
  .handle-box{
    margin-bottom: 20px;
    .publish-btn {
      float: right;
    }
  }
  .container {
    padding: 0px;
    background: #fff;
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
}
</style>

