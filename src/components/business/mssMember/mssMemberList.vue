<template>
  <div class="table mssMember-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 会员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mssMembercontainer">
      <div class="handle-box">
        <div class="handle-til clearfix">
          <span>数据筛选</span>
          <el-button type="primary" size="mini" icon="search" v-popover:popover1 class="publish-btn">高级检索</el-button>
        </div>
        <el-popover
            ref="popover1"
            placement="bottom-end"
            width="400"
            trigger="click">
        <el-row class="mb10">
            <el-col :span="11" :push="0"><el-row class="mb10">区域:</el-row>
                <el-row>
                    <el-select placeholder="选择区域" v-model="ruleForm.condition.regionCode" @change="choseArea" class="handle-select">
                        <el-option
                          v-for="item in area"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
            <el-col :span="11" :push="2"><el-row class="mb10">省办:</el-row>
                <el-row>
                    <el-select placeholder="选择省办" v-model="ruleForm.condition.provinceCode" class="handle-select">
                        <el-option
                          v-for="item in province"
                          :key="item.index"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="11" :push="0"><el-row class="mb10">分销商:</el-row>
            <el-row><el-input placeholder="请输入分销商编号" v-model="ruleForm.condition.distributorCode"></el-input></el-row>
          </el-col>
          <el-col :span="11" :push="2"><el-row class="mb10">所属专卖店状态:</el-row>
            <el-row>
              <el-select placeholder="所属专卖店状态" style="width:100%;" v-model="ruleForm.condition.storeStatus">
                <el-option key="" label="请选择" value=""></el-option>
                <el-option key="1" label="有效" value="1"></el-option>
                <el-option key="0" label="无效" value="0"></el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="11" :push="0"><el-row class="mb10">唯一码:</el-row>
            <el-row><el-input placeholder="请输入唯一码" v-model="ruleForm.condition.upgradeProductCode"></el-input></el-row>
          </el-col>
          <el-col :span="11" :push="2"><el-row class="mb10">注册渠道:</el-row>
            <el-row><el-input placeholder="请输入注册渠道" v-model="ruleForm.condition.source"></el-input></el-row>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="11" :push="0"><el-row class="mb10">会员性别:</el-row>
            <el-row>
              <el-select placeholder="会员性别" style="width:100%;" v-model="memberGender">
                <el-option key="" label="全部" value=""></el-option>
                <el-option key="0" label="男" value="false"></el-option>
                <el-option key="1" label="女" value="true"></el-option>
              </el-select>
            </el-row>
          </el-col>
          <el-col :span="11" :push="2"><el-row class="mb10">会员标签:</el-row>
            <el-row>
              <el-select placeholder="会员标签" style="width:100%;" multiple v-model="ruleForm.condition.tagIds">
                <el-option
                  v-for="item in labelArr"
                  :key="item.tagId"
                  :label="item.tagName"
                  :value="item.tagId">
                </el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="height-search">
          <el-col :span="24">
            <el-button size="mini" type="" @click="resetSearch">重置</el-button>
            <el-button size="mini" type="primary" @click="_getData(false, true)" :loading="tableLoading">开始检索</el-button>
          </el-col>
        </el-row>
        </el-popover>
        <el-form label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
            <el-col :span="8">
            <el-form-item label="专卖店类型">            
                <el-select placeholder="专卖店类型" size="mini" style="width:100%;" v-model="ruleForm.condition.storeType">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="入会" value="0"></el-option>
                    <el-option key="1" label="升级" value="1"></el-option>
                    <el-option key="2" label="所属" value="2"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="专卖店编号">
                <el-input v-model="ruleForm.condition.storeCode" size="mini" placeholder="专卖店编号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="会员">
                <el-input v-model="ruleForm.condition.memberMobileOrId" size="mini"  placeholder="会员编号/手机号"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8">    
            <el-form-item label="会员等级">
                <el-select placeholder="会员等级" size="mini" style="width:100%;" v-model="ruleForm.condition.groupId">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="普会" value="0"></el-option>
                    <el-option key="1" label="高会" value="1"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">    
            <el-form-item label="入会时间">
                <el-date-picker
                style="width:100%"
                v-model="signDate"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>     
            </el-col>  
            <el-col :span="8">    
            <el-form-item label="升级时间">
                <el-date-picker
                style="width:100%"
                v-model="upgradeDate"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>     
            </el-col>    
        </el-row>   
        <el-form-item>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetSearch">重置</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="tableLoading" size="mini" @click="_getData(true, true)">查询</el-button>
            <el-button size="mini" type="success" @click="downLoad" :loading="loading">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <div class="export-box">
          <el-row>
              <el-col :span="24" class="text-r">
                  <!-- <el-button size="mini" @click="remove(1)">批量补发优惠券</el-button> -->
                  <el-button type="success" size="mini" @click="noGiftVis = true">导出无礼品资格高会</el-button>
                  <el-upload
                      action=""
                      style="display:inline-block;margin-left:10px;"
                      :show-file-list="false"
                      :multiple="true"
                      :httpRequest="uploadfileMember"
                      class="psmUp">
                      <el-button icon="el-icon-upload2" size="mini" type="success">导入批量补发优惠券</el-button>
                  </el-upload>
                  <el-button size="mini" @click="$util.winOpen('static/useJs/doc/mssBatchCoupon.xlsx?'+$util.getRandom())" type="text">批量补发优惠券模板</el-button>
                  <el-dialog class="text-l"
                    :title="dialogTil"
                    :visible.sync="dialogVisible"
                    width="50%">
                    <!-- 批量补发优惠券 -->
                    <el-form ref="form" label-width="15%" size="small" v-if="dialogType==1">
                      <el-form-item label="选择文件：" required>
                        <el-upload
                            action=""
                            style="display:inline-block;margin-left:10px;"
                            :show-file-list="false"
                            :multiple="true"
                            :httpRequest="uploadfileMember"
                            class="psmUp">
                            <el-button icon="el-icon-upload2" size="mini" type="success">导入批量补发优惠券</el-button>
                        </el-upload>
                        <el-button size="mini" @click="$util.winOpen('static/useJs/doc/mssStoreTransfer.xlsx?'+$util.getRandom())" type="text">批量补发优惠券模板</el-button>
                      </el-form-item>
                    </el-form>
                    <!-- 设置标签 -->
                    <el-form ref="form" label-width="20%" size="small" v-if="dialogType==2">
                      <el-form-item label="发送对象：" required>
                        <p>{{jfMemberName}}&nbsp;|&nbsp;{{jfMemberPhone}}</p>
                      </el-form-item>
                      <el-checkbox-group v-model="checkList" class="mss-radio">
                        <el-checkbox v-for="label in labelArr" :label="label.tagName" :key="label.tagId"></el-checkbox>
                      </el-checkbox-group>
                    </el-form>
                    <!-- 补发积分 -->
                    <el-form ref="form" label-width="20%" size="small" v-if="dialogType==3">
                      <el-form-item label="发送对象：" required>
                        <p>{{jfMemberName}}&nbsp;|&nbsp;{{jfMemberPhone}}</p>
                      </el-form-item>
                      <el-form-item label="产品唯一码：" required>
                        <el-input type="number" v-model="jfCode" placeholder="请输入产品唯一码" style="width:90%;"></el-input>
                      </el-form-item>
                    </el-form>
                    <!-- 补发优惠券 -->
                    <el-form ref="form" label-width="15%" size="small" v-if="dialogType==4">
                      <el-form-item label="发送对象：" required>
                        <p>{{jfMemberName}}&nbsp;|&nbsp;{{jfMemberPhone}}</p>
                      </el-form-item>
                      <div class="mb10">
                          <el-input v-model="eventCode" size="mini" style="width:160px;" placeholder="优惠券事件编码"></el-input>
                          <el-button type="primary" size="mini" @click="_getCouponList(true)">查询</el-button>
                      </div>
                      <el-table :data="couponTableData" border v-loading="tableLoading" style="width: 100%" @row-click = "showRow">
                        <el-table-column label="选择" width="50" align="center">
                          <template slot-scope="scope">
                            <el-radio class="radio"  v-model="radio"  :label="scope.$index">&nbsp;</el-radio>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
                        <el-table-column align="center" prop="eventCode" label="优惠券事件编码"></el-table-column>
                        <el-table-column align="center" prop="eventName" label="优惠券事件名称"></el-table-column>
                      </el-table>
                      <div class="pagination">
                        <el-pagination background @current-change="handleCurrentChange2" layout="total, prev, pager, next, jumper" :page-size="10" :total="couponTotal">
                        </el-pagination>
                      </div>
                    </el-form>
                    <span slot="footer" class="dialog-footer" v-if="dialogType!==1">
                      <el-button @click="onClose()">取 消</el-button>
                      <el-button type="primary" @click="onSubmit()" :loading="loading">确 定</el-button>
                    </span>
                  </el-dialog>
              </el-col>
          </el-row>
      </div>
      <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberId" label="会员编号" width="80"></el-table-column>
        <el-table-column align="center" prop="memberName" label="会员姓名" width="80"></el-table-column>
        <el-table-column align="center" prop="memberGenders" label="性别" width="80"></el-table-column>
        <el-table-column align="center" prop="memberMobile" label="手机号码" width="110"></el-table-column>
        <el-table-column align="center" prop="groupIds" label="会员等级" width="100"></el-table-column>
        <el-table-column align="center" prop="redundantCurrentStoreCode" label="所属专卖店旧编" width="140"></el-table-column>
        <el-table-column align="center" prop="jdeCode" label="所属专卖店新编" width="140"></el-table-column>
        <el-table-column align="center" prop="redundantCurrentStoreName" label="所属专卖店名称" width="145"></el-table-column>
        <el-table-column align="center" prop="redundantRegisterStoreCode" label="入会专卖店旧编" width="145"></el-table-column>
        <el-table-column align="center" prop="redundantRegisterStoreName" label="入会专卖店名称" width="120"></el-table-column>
        <el-table-column align="center" prop="regTimes" label="入会时间" width="90"></el-table-column>
        <el-table-column align="center" prop="redundantUpgradeStoreCode" label="升级专卖店旧编" width="120"></el-table-column>
        <el-table-column align="center" prop="redundantUpgradeStoreName" label="升级专卖店名称" width="120"></el-table-column>
        <el-table-column align="center" prop="upgradeTimes" label="升级时间" width="120"></el-table-column>
        <el-table-column align="center" prop="upgradeProductCode" label="升级唯一码" width="120"></el-table-column>
        <el-table-column align="center" prop="source" label="注册渠道" width="120"></el-table-column>
        <el-table-column align="center" prop="openids" label="是否绑定微信" width="120"></el-table-column>
        <!-- <el-table-column align="center" prop="addTimes" label="是否有高会礼品" width="90"></el-table-column> -->
        <el-table-column align="center" prop="memberStatus" label="启用" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.memberStatus" active-text="" inactive-text="" 
            :active-value="true" :inactive-value="false"
            @change="switchChange(scope.row, scope.row.memberStatus)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="scope">
            <el-button size="mini" @click="toDetail(scope.row.memberId)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.memberId)">删除</el-button>
            <el-button size="mini" @click="remove(3, scope.row.memberId, scope.row.memberName, scope.row.memberMobile)">补发积分</el-button>
            <el-button size="mini" @click="remove(4, scope.row.memberId, scope.row.memberName, scope.row.memberMobile)">补发优惠券</el-button>
            <el-button size="mini" @click="remove(2, scope.row.memberId, scope.row.memberName, scope.row.memberMobile)">设置标签</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page="ruleForm.pagingQuery.pageIndex" layout="total, prev, pager, next, jumper" :page-size="10" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="text-l"
      title="无礼品资格高会导出"
      :visible.sync="noGiftVis"
      width="30%">
      <el-form ref="form" label-width="30%" size="small">
          <el-form-item label="升级时间：">
              <el-date-picker
                style="width:100%"
                v-model="noGiftDate"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="onClose()">取 消</el-button>
          <el-button type="primary" @click="handleExport()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="text-l"
      title="补发优惠券结果"
      :visible.sync="sendGiftVis"
      width="50%">
      <el-table :data="couponData" border style="width: 100%">
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="memberId" label="会员编号" width="80"></el-table-column>
        <el-table-column align="center" prop="benefitFrontName" label="补发优惠券名称"></el-table-column>
        <el-table-column align="center" prop="success" label="补发优惠券结果" width="120"></el-table-column>
        <el-table-column align="center" prop="message" label="失败原因" width=""></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'psmPersonList',
  data () {
    return {
      noGiftVis: false,
      sendGiftVis: false,
      couponData: [],
      noGiftDate: [],
      upgradeTimeEnd: '',
      upgradeTimeStart: '',
      checkList: [],
      area: [],
      province: [],
      loading: false,
      uploadUrl: '',
      dialogVisible: false,
      dialogTil: '',
      dialogType: 1,
      tableData: [],
      tableLoading: false,
      upgradeDate: [],
      signDate: [],
      labelArr: [],
      MemberId: '',
      jfMemberName: '',
      jfMemberPhone: '',
      jfCode: '',
      ruleForm: {
        condition: {
          distributorCode: '',
          groupId: '',
          memberGender: '',
          memberMobileOrId: '',
          openid: '',
          operator: '',
          provinceCode: '',
          regTimeEnd: '',
          regTimeStart: '',
          regionCode: '',
          source: '',
          storeCode: '',
          storeStatus: '',
          storeType: '',
          tagIds: [],
          upgradeProductCode: '',
          upgradeTimeEnd: '',
          upgradeTimeStart: ''
        },
        pagingQuery: {
          pageIndex: 0,
          pageSize: 10
        }
      },
      ruleLabel: {
        condition: {
          memberId: '',
          tagId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 9999
        }
      },
      memberGender: '',
      total: 0,
      eventCode: '',
      pageIndex: 1,
      couponTotal: 0,
      couponTableData: [],
      multipleSelection: [],
      radio: '',
      selected: {},
      ruleFormLabel: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 100
        }
      },
      member: {}
    }
  },
  methods: {
    switchChange (info, status) {
      console.log(info)
      let thiz = this
      thiz.member = info
      thiz.member.memberStatus = status
      // delete thiz.member.regTime
      // delete thiz.member.memberGender
      thiz.$tupHttp(thiz, 'mss/member/backendUpdate', 'POST', thiz.member).then(res => {
        thiz.$notify.success({
          title: '成功提示',
          message: '修改成功'
        })
      })
    },
    uploadfileMember (option) {
      this.$util.readExcel(option.file, this.treatDatasMember)
    },
    treatDatasMember (datas, file) {
      let arr = []
      for (let i = 1; i < datas.sheet0.length; i++) {
        arr.push({
          benefitId: datas.sheet0[i][2],
          eventCode: datas.sheet0[i][1],
          memberId: datas.sheet0[i][0],
          productId: datas.sheet0[i][3],
          productUniqueCode: datas.sheet0[i][4],
          supportedChannel: datas.sheet0[i][5]
        })
      }
      let thiz = this
      let date = arr
      thiz.$hsyHttp(thiz, 'benefit-service/member/event/insertList', 'POST', date).then(res => {
        thiz.$notify.success({
          title: '成功提示',
          message: '成功导入'
        })
      })
    },
    showRow (row) {
      this.radio = this.couponTableData.indexOf(row)
      this.selected = row
    },
    handleSelectionChange (val) {
      this.multipleSelection = val.filter(item => {
        return item.memberId
      }).map(item => {
        return item.memberId
      })
    },
    remove (type, id, name, phone) {
      let thiz = this
      thiz.dialogVisible = true
      thiz.dialogType = type
      thiz.jfMemberName = name
      thiz.jfMemberPhone = phone
      thiz.MemberId = id
      if (type === 1) {
        thiz.dialogTil = '批量补发优惠券'
        thiz._getCouponList()
      }
      if (type === 2) {
        thiz.dialogTil = '设置标签'
        thiz._getLabelDatas(thiz.MemberId)
      }
      if (type === 3) { thiz.dialogTil = '补发积分' }
      if (type === 4) {
        thiz.dialogTil = '补发优惠券'
        thiz._getCouponList()
      }
    },
    resetSearch () {
      this.ruleForm.condition.distributorCode = ''
      this.ruleForm.condition.groupId = ''
      this.ruleForm.condition.memberGender = ''
      this.ruleForm.condition.memberMobileOrId = ''
      this.ruleForm.condition.provinceCode = ''
      this.ruleForm.condition.regionCode = ''
      this.ruleForm.condition.source = ''
      this.ruleForm.condition.storeCode = ''
      this.ruleForm.condition.storeStatus = ''
      this.ruleForm.condition.storeType = ''
      this.ruleForm.condition.tagIds = []
      this.ruleForm.condition.upgradeProductCode = ''
      this.province = []
      this.signDate = []
      this.upgradeDate = []
    },
    toDetail (id) {
      this.$router.push({
        path: '/frame/mssMember/mssMemberDetail',
        query: {
          id: id
        }
      })
    },
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$tupHttp(thiz, 'mss/member/delete?memberId=' + id).then(res => {
          this.$message.success('删除成功')
          thiz._getData()
        })
      })
    },
    handleCurrentChange (val) {
      this.ruleForm.pagingQuery.pageIndex = val
      this._getData()
    },
    handleCurrentChange2 (val) {
      this.pageIndex = val
      this._getCouponList()
    },
    downLoad () {
      // if (this.ruleForm.condition.storeCode === '' && this.ruleForm.condition.memberMobileOrId === '' && this.signDate.length === 0 && this.upgradeDate.length === 0) {
      //   this.$message.error('请选择入会时间或者升级时间')
      //   return
      // } else if (this.ruleForm.condition.regTimeEnd - this.ruleForm.condition.regTimeStart > 60 * 60 * 24 * 180) {
      //   this.$message.error('入会时间最大范围为180天')
      //   return
      // } else if (this.ruleForm.condition.upgradeTimeEnd - this.ruleForm.condition.upgradeTimeStart > 60 * 60 * 24 * 180) {
      //   this.$message.error('升级时间最大范围为180天')
      //   return
      // }
      if (this.memberGender === 'false') {
        this.ruleForm.condition.memberGender = false
      }
      if (this.memberGender === 'true') {
        this.ruleForm.condition.memberGender = true
      }
      if (this.memberGender === '') {
        this.ruleForm.condition.memberGender = ''
      }
      let thiz = this
      thiz.loading = true
      let data = thiz.$util.deepClone(thiz.ruleForm)
      delete data.pagingQuery
      thiz.$tupHttp(thiz, 'mss/member/backendExport', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
      }, res => {
        thiz.loading = false
      })
    },
    handleExport () {
      let thiz = this
      if (thiz.noGiftDate.length <= 0) {
        thiz.$message.error('升级时间不能为空')
        return
      } else if (thiz.upgradeTimeEnd - thiz.upgradeTimeStart > 60 * 60 * 24 * 31) {
        thiz.$message.error('升级时间最大范围为31天')
        return
      }
      thiz.loading = true
      let data = {
        upgradeTimeEnd: thiz.upgradeTimeEnd,
        upgradeTimeStart: thiz.upgradeTimeStart
      }
      thiz.$tupHttp(thiz, 'mss/member/exportNoGift', 'POST', data).then(res => {
        thiz.loading = false
        thiz.$notify.success({
          title: '成功提示',
          message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
        })
        thiz.noGiftVis = false
      }, res => {
        thiz.loading = false
      })
    },
    // 获取标签记录数据
    _getLabelDatas (memberId) {
      let thiz = this
      this.ruleFormLabel.condition.memberId = memberId
      this.$tupHttp(this, 'mss/tag/list', 'POST', this.ruleFormLabel).then(res => {
        let tagIdList = []
        res.data.models.forEach(function (item1) {
          if (item1.tagTypeCode == 1) {
            tagIdList.push(item1.tagName)
          }
        })
        thiz.checkList = tagIdList
      })
    },
    // 获取优惠券数据
    _getCouponList (isCheck) {
      if (isCheck) { this.pageIndex = 1 }
      let eventString = ''
      this.tableLoading = true
      if (this.eventCode) {
        eventString = '&eventCode=' + this.eventCode
      } else {
        eventString = ''
      }
      this.$tupHttp(this, 'benefit/event/list?eventStatus=true&pageIndex=' + this.pageIndex + '&pageSize=10' + eventString).then(res => {
        this.tableLoading = false
        this.couponTableData = res.data.pageInfo.list
        this.couponTotal = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取列表数据
    _getData (search, isSearch) {
      if (this.ruleForm.condition.storeCode === '' && this.ruleForm.condition.memberMobileOrId === '' && this.signDate.length === 0 && this.upgradeDate.length === 0) {
        this.$message.error('请选择入会时间或者升级时间')
        return
      } else if (this.ruleForm.condition.regTimeEnd - this.ruleForm.condition.regTimeStart > 60 * 60 * 24 * 31) {
        this.$message.error('入会时间最大范围为31天')
        return
      } else if (this.ruleForm.condition.upgradeTimeEnd - this.ruleForm.condition.upgradeTimeStart > 60 * 60 * 24 * 31) {
        this.$message.error('升级时间最大范围为31天')
        return
      }
      if (search === true) {
        this.ruleForm.condition.tagIds = []
        this.ruleForm.condition.provinceCode = ''
        this.ruleForm.condition.regionCode = ''
        this.ruleForm.condition.distributorCode = ''
        this.ruleForm.condition.storeStatus = ''
        this.ruleForm.condition.source = ''
        this.ruleForm.condition.upgradeProductCode = ''
        this.ruleForm.condition.memberGender = ''
        this.province = []
      }
      if (this.memberGender === 'false') {
        this.ruleForm.condition.memberGender = false
      }
      if (this.memberGender === 'true') {
        this.ruleForm.condition.memberGender = true
      }
      if (this.memberGender === '') {
        this.ruleForm.condition.memberGender = ''
      }
      if (isSearch === true) {
        this.ruleForm.pagingQuery.pageIndex = 1
      }
      this.tableLoading = true
      this.$tupHttp(this, 'mss/member/backendSearch', 'POST', this.ruleForm).then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.forEach(function (item) {
          if (item.memberGender === true) {
            item.memberGenders = '女'
          }
          if (item.memberGender === false) {
            item.memberGenders = '男'
          }
          if (item.groupId === 0) {
            item.groupIds = '普通会员'
          }
          if (item.groupId === 1) {
            item.groupIds = '高级会员'
          }
          if (item.regTime) {
            item.regTimes = new Date(item.regTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
          if (item.upgradeTime) {
            item.upgradeTimes = new Date(item.upgradeTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.upgradeTimes = ''
          }
          if (item.openid) {
            item.openids = '是'
          } else {
            item.openids = '否'
          }
          if (item.addTime) {
            item.addTimes = new Date(item.addTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
        })
        this.tableData = res.data.pageInfo.list
        this.total = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取标签数据
    _getLabelData () {
      this.$tupHttp(this, 'mss/tag/list', 'POST', this.ruleLabel).then(res => {
        let thiz = this
        res.data.models.forEach(function (item) {
          if (item.tagTypeCode == 1) {
            thiz.labelArr.push(item)
          }
        })
      })
    },
    // 获取区域数据
    _getAreaData () {
      this.$hsyHttp(this, '/backend/area/regions', 'GET').then(res => {
        this.area = res.data.models
      })
    },
    // 获取省办数据
    _getProvinceData (regionCode) {
      this.$hsyHttp(this, '/backend/area/provinces/' + regionCode, 'GET').then(res => {
        this.province = res.data.models
      })
    },
    // 选区域
    choseArea (e) {
      this.ruleForm.condition.provinceCode = ''
      this._getProvinceData(e)
    },
    onSubmit () {
      let thiz = this
      let url = ''
      let data = {}
      if (thiz.dialogTil === '补发积分') {
        if (thiz.jfCode.trim() === '') {
          thiz.$message.error('产品唯一码不能为空')
          return
        }
        url = 'backend/benefit/event/integral/sendBenefit'
        data = {
          memberId: thiz.MemberId,
          productUniqueCode: thiz.jfCode
        }
      }
      if (thiz.dialogTil === '补发优惠券') {
        if (!thiz.selected.eventCode) {
          thiz.$message.error('请选择优惠券事件码')
          return
        }
        url = 'backend/benefit/event/coupon/sendBenefit'
        data = {
          memberId: thiz.MemberId,
          eventCode: thiz.selected.eventCode
        }
      }
      if (thiz.dialogTil === '批量补发优惠券') {
        if (!thiz.selected.eventCode) {
          thiz.$message.error('请选择优惠券事件码')
          return
        }
        url = 'backend/benefit-service/member/event/insertList'
        data = {
          memberId: thiz.MemberId,
          eventCode: thiz.selected.eventCode
        }
      }
      if (thiz.dialogTil === '设置标签') {
        let tagIdList = []
        thiz.checkList.forEach(function (item1) {
          thiz.labelArr.forEach(function (item2) {
            if (item1 === item2.tagName) {
              tagIdList.push(item2.tagId)
            }
          })
        })
        // if (tagIdList.length === 0) {
        //   thiz.$message.error('请选择标签')
        //   return
        // }
        url = 'mss-service/tag/set'
        data = {
          memberId: thiz.MemberId,
          ids: tagIdList
        }
      }
      thiz.loading = true
      thiz.$hsyHttp(this, url, 'POST', data).then(res => {
        if (thiz.dialogTil === '补发优惠券') {
          thiz.sendGiftVis = true
          res.data.models.forEach(function (item) {
            item.memberId = thiz.MemberId
            if (item.success) {
              item.success = '补发成功'
            } else {
              item.success = '补发失败'
            }
          })
          thiz.couponData = res.data.models
        } else {
          thiz.loading = false
          thiz.$notify.success({
            title: '成功提示',
            message: thiz.dialogTil + '成功'
          })
        }
        thiz.dialogVisible = false
        thiz._getData()
      }, res => {
        thiz.loading = false
      })
    },
    onClose () {
      this.dialogVisible = false
      this.noGiftVis = false
    }
  },
  created () {
    // let thiz = this
    // var newDate = Date.parse(new Date())
    // var prevDate = newDate - 60 * 60 * 24 * 30 * 1000
    // this.signDate = [prevDate, newDate]
    // setTimeout(function () {
      // thiz._getData()
    // }, 500)
    this._getAreaData()
    this._getLabelData()
  },
  watch: {
    'signDate': function (val) {
      if (!val) {
        this.ruleForm.condition.regTimeStart = ''
        this.ruleForm.condition.regTimeEnd = ''
      } else {
        this.ruleForm.condition.regTimeStart = val[0] / 1000
        this.ruleForm.condition.regTimeEnd = val[1] / 1000
      }
    },
    'upgradeDate': function (val) {
      if (!val) {
        this.ruleForm.condition.upgradeTimeStart = ''
        this.ruleForm.condition.upgradeTimeEnd = ''
      } else {
        this.ruleForm.condition.upgradeTimeStart = val[0] / 1000
        this.ruleForm.condition.upgradeTimeEnd = val[1] / 1000
      }
    },
    'noGiftDate': function (val) {
      if (!val) {
        this.upgradeTimeStart = ''
        this.upgradeTimeEnd = ''
      } else {
        this.upgradeTimeStart = val[0] / 1000
        this.upgradeTimeEnd = val[1] / 1000
      }
    },
    'dialogVisible': function (val) {
      if (!val) {
        this.jfCode = ''
        this.radio = ''
        this.selected = []
        this.checkList = []
      }
    },
    'noGiftVis': function (val) {
      if (!val) {
        this.upgradeTimeStart = ''
        this.upgradeTimeEnd = ''
        this.noGiftDate = []
      }
    }
  }
}
</script>

<style lang="scss">
.mb10{margin-bottom: 10px;}
.clearfix {overflow: auto;zoom: 1;}
.psmUp .el-upload__input{display:none!important;}
.red{color:red;}
.info-p{margin:0;padding:0;line-height:30px;}
.mss-radio{padding-left:8%;}
.text-l{text-align:left;}
.text-r{text-align:right;}
.el-upload--text {border: none;width:auto;height:auto;}
input[type=file] {display: none;}
.height-search{margin-top:10px;padding-top:10px;border-top:1px solid #eee;text-align:right;}
.mssMember-list {padding: 30px 0 30px 30px;}
.mssMember-list .handle-box {margin-bottom: 20px;border:1px solid #eee;padding:10px 20px;border-radius: 5px;}
.mssMember-list .handle-til {border-bottom: 1px solid #eee;padding-bottom: 5px;}
.mssMember-list .handle-til span:nth-child(1) {padding-top: 5px;display: inline-block;}
.mssMember-list .mssMembercontainer {padding-right: 10px;}
.mssMember-list .crumbs {margin-bottom: 20px;}
.mssMember-list .pagination {margin: 20px 0;text-align: right;display: block;}
.mssMember-list .title {color: #ff7000;cursor: pointer;}
.mssMember-list .title-header {color: #909399;}
.mssMember-list {
.handle-box {margin-bottom: 10px;
.publish-btn {float: right;}
}
.handle-input {width: 150px;}
.export-box{padding-top:10px;margin-bottom:10px;}
.del-dialog-cnt {font-size: 16px;text-align: center}
.title{color: #409EFF;cursor: pointer;}
.title-header {color: #909399;}
}
</style>
