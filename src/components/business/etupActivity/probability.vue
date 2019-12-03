<template>
  <div class="probability">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>中奖概率设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="width: 100%">
      <div class="handle-box">
        <span>选择活动：</span>
        <el-select placeholder="活动名称" v-model="activityId" size="mini" style="width:150px;" @change="_getList">
          <el-option
            v-for="item in options"
            :key="item.activityCode"
            :label="item.activityName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="cardAdd">添加优惠券规则</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" highlight-current-row>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="activityCode" label="活动编码" width="80"></el-table-column>
        <el-table-column prop="etupEventCode" label="优惠券事件码" width="200">
          <template slot-scope="scope">
            <el-select placeholder="优惠券事件码" v-model="scope.row.etupEventCode" size="mini" v-if='scope.row.isNews' @change="cardChange" @focus="cardIndex(scope.$index)">
              <el-option
                v-for="item in cardList"
                :key="item.etupEventCode"
                :label="item.etupEventCode"
                :value="item.etupEventCode">
              </el-option>
            </el-select>
            <span v-else>{{scope.row.etupEventCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="prizeName" label="优惠券名称" width="200"></el-table-column>
        <el-table-column prop="groupFlagname" label="优惠券组标识" width="200"></el-table-column>
        <el-table-column prop="type" label="奖励类型" width="200">
          <template slot-scope="scope">
            <el-select placeholder="奖励类型" v-model="scope.row.type" size="mini" v-if='scope.row.isNews' @change="typeChange" @focus="cardIndex(scope.$index)">
              <el-option
                v-for="item in typeList"
                :key="item.typeid"
                :label="item.typename"
                :value="item.typeid">
              </el-option>
            </el-select>
            <span v-else>{{scope.row.typename}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总设数量" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.total" placeholder="总设数量" v-if='scope.row.isNews'></el-input>
              <span v-else>{{scope.row.total}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="num" label="剩余数量" width="100"></el-table-column>
        <el-table-column prop="probability" label="概率" width="80">
            <template slot-scope="scope">
              <el-input size="mini" placeholder="概率" v-model="scope.row.probability" v-if='scope.row.isNews && (scope.row.type==0 || scope.row.type=="随机券")'></el-input>
              <span v-else>{{(scope.row.type==0 || scope.row.type=="随机券")?scope.row.probability:''}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="prizeUrl" label="图片" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.logo" width="80">
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="small"  @click="handleSave(scope.$index)" v-if='scope.row.isNews'>保存</el-button>
            <el-button size="small"  @click="handleEdit(scope.$index)" v-else>编辑</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.row.id)" v-if='!scope.row.isNews'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activityCode: '',
      activityId: '',
      tableLoading: false,
      cardNum: '',
      options: [],
      cardList: [],
      ruleForm: {
        name: '',
        state: '',
        page: 1,
        size: 100
      },
      list: {
        activityCode: '',
        activityId: '',
        createDate: '',
        etupEventCode: '',
        id: 0,
        prizeName: '',
        groupFlag: 0,
        groupFlagname: '',
        prizeUrl: '',
        probability: '',
        total: '',
        updateDate: '',
        used: '',
        type: 0,
        isNews: true
      },
      tableData: [],
      save: '',
      typeList: [{typeid: 0, typename: '随机券'}, {typeid: 1, typename: '必得券'}],
      prize: {
        activityId: 0,
        etupEventCode: '',
        id: 0,
        prizeName: '',
        groupFlag: 0,
        groupFlagname: '',
        probability: 0,
        total: 0,
        type: 0
      }
    }
  },
  methods: {
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据！你确认删除该条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$hsyHttp(thiz, 'backend/dolls/prize/delete?id=' + id, 'POST').then(res => {
          this.$message.success('删除成功')
          thiz._getList(this.activityId)
        })
      })
    },
    handleSave (id) {
      if (this.tableData[id].total <= 0 || this.tableData[id].total === '') {
        this.$message.error('总设数量不能为空且应大于0')
        return false
      }
      if (this.tableData[id].type === 0 && (this.tableData[id].probability <= 0 || this.tableData[id].probability === '')) {
        this.$message.error('概率应大于0')
        return false
      }
      // if (this.tableData[id].type === 0 && (this.tableData[id].probability <= 0 || this.tableData[id].probability > 1 || this.tableData[id].probability === '')) {
      //   this.$message.error('概率应大于0小于等于1')
      //   return false
      // }
      // let probability = this.tableData.map(item => {
      //   let a = 0
      //   a = a + item.probability
      //   return a
      // })
      // let allP = 0
      // let pArr = probability.toString().split(',')
      // for (let item in pArr) {
      //   allP = parseFloat(parseFloat(allP) + parseFloat(pArr[item]))
      // }
      // if (allP <= 0 || allP > 1) {
      //   this.$message.error('总概率应大于0小于等于1')
      //   return false
      // }
      let saveUrl = ''
      let data = {}
      if (this.save === 'edit') {
        saveUrl = 'backend/dolls/prize/update'
        this.prize.activityId = this.tableData[id].activityId
        this.prize.etupEventCode = this.tableData[id].etupEventCode
        this.prize.id = this.tableData[id].id
        this.prize.prizeName = this.tableData[id].prizeName
        this.prize.groupFlag = this.tableData[id].groupFlag
        this.prize.groupFlagname = this.tableData[id].groupFlagname
        this.prize.probability = this.tableData[id].probability
        this.prize.total = this.tableData[id].total
        this.prize.type = this.tableData[id].type
        data = this.prize
      } else if (this.save === 'add') {
        saveUrl = 'backend/dolls/prize/save'
        data = this.tableData[id]
      }
      this.$hsyHttp(this, saveUrl, 'POST', data).then(res => {
        this.tableData[id].isNews = false
        this.$message.success('保存成功')
        this._getList(this.activityId)
      })
    },
    handleEdit (id) {
      this.tableData[id].isNews = true
      this.save = 'edit'
      // this.$hsyHttp(this, '/backend/dolls/prize/update', 'POST', this.tableData[id]).then(res => {
      //   this.$message.success('保存成功')
      //   this._getList(this.activityId)
      // })
    },
    _getData () {
      this.$hsyHttp(this, 'backend/dolls/activity/searchByNameAndState?page=' + this.ruleForm.page + '&size=' + this.ruleForm.size + '&name=' + this.ruleForm.name + '&state=' + this.ruleForm.state, 'GET').then(res => {
        this.options = res.data.pageInfo.list
      })
    },
    _getList (e) {
      let obj = {}
      obj = this.options.find(item => {
        return item.id === e
      })
      this.activityCode = obj.activityCode
      this.tableLoading = true
      this.$hsyHttp(this, 'backend/dolls/prize/searchByNameAndState?activityId=' + this.activityId, 'GET').then(res => {
        this.tableLoading = false
        res.data.models.map(item => {
          item.isNews = false
          item.num = item.total - item.used
          if (item.type === 0) {
            item.typename = '随机券'
          }
          if (item.type === 1) {
            item.typename = '必得券'
          }
          if (item.groupFlag === 0) {
            item.groupFlagname = '单张券'
          }
          if (item.groupFlag === 1) {
            item.groupFlagname = '优惠券组'
          }
        })
        this.tableData = res.data.models
      })
    },
    _getCardList () {
      this.$hsyHttp(this, 'backend/dolls/prize/selectCouponListCode?status=2', 'GET').then(res => {
        this.cardList = res.data.models
      })
    },
    cardAdd () {
      if (this.activityId) {
        this.list.activityCode = this.activityCode
        this.list.activityId = this.activityId
        let data = Object.assign({}, JSON.parse(JSON.stringify(this.list)))
        this.tableData.unshift(data)
        this.save = 'add'
      } else {
        this.$message.error('请选择活动')
        return
      }
    },
    cardIndex (num) {
      this.cardNum = num
    },
    cardChange (e) {
      let obj = {}
      obj = this.cardList.find(item => {
        return item.etupEventCode === e
      })
      this.tableData[this.cardNum].prizeName = obj.prizeName
      this.tableData[this.cardNum].groupFlag = obj.groupFlag
      if (obj.groupFlag === 0) {
        obj.groupFlagname = '单张券'
      }
      if (obj.groupFlag === 1) {
        obj.groupFlagname = '优惠券组'
      }
      this.tableData[this.cardNum].groupFlagname = obj.groupFlagname
      this.tableData[this.cardNum].prizeUrl = obj.prizeUrl
    },
    typeChange (e) {
      this.tableData[this.cardNum].type = e
    }
  },
  created () {
    this._getData()
    this._getCardList()
  }
}
</script>
<style lang="scss">
.probability {
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
}

</style>

