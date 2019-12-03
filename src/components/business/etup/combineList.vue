<template>
  <div class="combineList-wrapper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>组合优惠列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contain-er">
      <div class="handle-box">
        <el-input v-model="goodsName" size="mini" style="width:150px;" placeholder="组合名称模糊搜索"></el-input>
        <el-button type="primary" size="mini" @click="search" :loading="tableLoading">查询</el-button>
        <el-button size="mini" @click="toAdd" type="primary" class="publish-btn">新建组合</el-button>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%"
      highlight-current-row>
        7<el-table-column prop="id" label="组合编码" width="80"></el-table-column>
        <el-table-column prop="goodsname" label="组合名称" width="200"></el-table-column>
        <el-table-column label="商品logo图" width="100">
          <template slot-scope="scope">
            <img :src="'http://oss.tupperware.com.cn/' + scope.row.goodslogin" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="goodsprice" label="组合价格"></el-table-column>
        <el-table-column prop="startDate" label="活动开始时间" width="150"></el-table-column>
        <el-table-column prop="endDate" label="活动结束时间" width="150"></el-table-column>
        <el-table-column label="上架/下架">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isShelf" active-text="" inactive-text="" 
            :active-value=false :inactive-value=true
            @change="switchChange(scope.row.id, scope.row.isShelf)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="small" @click="editDate(scope.row)" v-if="!scope.row.isShelf">修改组合活动时间</el-button>
            <el-button size="small" @click="edit(scope.row.id)" v-if="scope.row.isShelf">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="page"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog title="修改组合活动时间" :visible.sync="visible" width="50%" top="15%">
        <el-form :rules="rules" ref="form" :model="form">
          <el-form-item label="活动期限" prop="endTime">
            {{startDate}} - 
            <el-date-picker v-model="form.endTime" type="datetime" size="mini" style="width:190px;" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请输入活动结束时间"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="editSubmit('form')">确认</el-button>
          <el-button size="mini" @click="visible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activityList',
  data () {
    return {
      goodsName: '',
      tableData: [],
      tableLoading: false,
      page: 1,
      size: 10,
      total: 0,
      visible: false,
      startDate: '',
      id: '',
      form: {
        endTime: ''
      },
      rules: {
        endTime: [
          { required: true, message: '请输入活动结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    search () {
      this._getData()
    },
    toAdd () {
      this.$router.push({
        path: '/frame/etup/addCombine'
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this._getData()
    },
    switchChange (id, isShelf) {
      this.$tupHttp(this, 'product/goods/update', 'POST', {
        id: id,
        isShelf: isShelf ? 1 : 0
      }).then(res => {
      })
    },
    editDate (row) {
      this.visible = true
      this.startDate = row.startDate
      this.form.endTime = row.endDate
      this.id = row.id
    },
    edit (id) {
      this.$router.push({
        path: '/frame/etup/editCombine',
        query: {
          id: id
        }
      })
    },
    editSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let startDate = new Date(this.startDate).getTime()
          let endDate = new Date(this.form.endTime).getTime()
          if (startDate >= endDate) {
            this.$notify.error({
              title: '错误提示',
              message: '结束时间不能小于开始时间'
            })
            return
          }
          this.$tupHttp(this, 'product/goods/update', 'POST', {
            id: this.id,
            endDate: endDate
          }).then(res => {
            this.$notify.success({
              title: '成功',
              message: '保存成功'
            })
            this.visible = false
            this._getData()
          })
        }
      })
    },
    _getData () {
      this.tableLoading = true
      this.$tupHttp(this, 'product/goods/selectList?groupFlag=1&isSelf=-1&goodsName=' + this.goodsName + '&page=' + this.page + '&size=' + this.size, 'GET').then(res => {
        this.tableLoading = false
        this.tableData = res.data.pageInfo.list.map(item => {
          item.startDate = new Date(item.startDate).format("yyyy-MM-dd hh:mm:ss")
          item.endDate = new Date(item.endDate).format("yyyy-MM-dd hh:mm:ss")
          return item
        })
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    }
  },
  created () {
    // this._getData()
  }
}
</script>

<style lang="scss">
.combineList-wrapper {
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
}
</style>
