<template>
    <div class="mssMemberDetail">
      <div class="crumbs clearfix">
        <el-breadcrumb separator="/" class="tilfl">
            <el-breadcrumb-item>
            <i class="el-icon-tickets"></i> 会员详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="fr">
            <el-button icon="el-icon-refresh" size="mini" @click="viewRelod(0)">刷新</el-button>
            <el-button icon="el-icon-arrow-left" size="mini" @click="viewRelod(-1)">返回</el-button>
        </div>
      </div>
      <div class="memberInfo">
        <el-row>
              <el-col :span="6" class="memberInfoShow">
                <p class="memberType">{{member.groupId == 1 ? '高级会员' : '普通会员'}}</p>
                <p><span class="f18">{{member.memberName}}</span>{{member.memberGenders ? ' | '+member.memberGenders : ''}}{{member.memberBirthdays ? ' | '+member.memberBirthdays : ''}}</p>
                <p class="f16">{{member.regionName}}区丨{{member.provinceName}}省办</p>
                <p>地址：{{member.memberAddress ? member.memberAddress : '暂无'}}</p>
                <p><span v-if="!modifyPhone">{{member.memberMobile}}</span><el-input style="width:60%;" v-else v-model="member.memberMobile" size="mini" placeholder="手机号码"></el-input>&nbsp;&nbsp;
                <el-button type="primary" size="mini" :loading="modifyPhoneLoading" @click="modifyPhones">{{modifyPhone ? '保存' : '修改'}}</el-button></p>
              </el-col>
              <el-col :span="9">
                <el-row>
                    <el-col :span="9" class="memberInfo-l">分销商</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.distributorCode}}{{member.distributorName ? ' | '+member.distributorName : ''}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="memberInfo-l">入会时间</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.regTimes}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="memberInfo-l">升级时间</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.upgradeTimes}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="memberInfo-l">入会专卖店</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.redundantRegisterStoreCode}}丨{{member.redundantRegisterStoreName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="memberInfo-l">是否有高会礼品资格</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.addTime ? '是丨' : '否'}}{{member.addTimes}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="memberInfo-l">是否关注公众号</el-col>
                    <el-col :span="15" class="memberInfo-r">{{member.subscribe}}</el-col>
                </el-row>
              </el-col>
              <el-col :span="9">
                <el-row>
                    <el-col :span="8" class="memberInfo-l">所属专卖店</el-col>
                    <el-col :span="16" class="memberInfo-r">{{member.redundantCurrentStoreCode}}丨{{member.redundantCurrentStoreName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="memberInfo-l">升级唯一码</el-col>
                    <el-col :span="16" class="memberInfo-r">{{member.upgradeProductCode}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="memberInfo-l">升级专卖店</el-col>
                    <el-col :span="16" class="memberInfo-r">{{member.redundantUpgradeStoreCode}}{{member.redundantUpgradeStoreName ? ' | '+member.redundantUpgradeStoreName : ''}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="memberInfo-l">绑定微信</el-col>
                    <el-col :span="16" class="memberInfo-r"><span class="openid" v-if="!modifyOpenid">{{member.openid}}</span><el-input style="width:80%;" v-else v-model="member.openid" size="mini" placeholder="微信"></el-input>
                <el-button type="primary" size="mini" :loading="modifyOpenidLoading" @click="modifyOpenids">{{modifyOpenid ? '保存' : '修改'}}</el-button></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="memberInfo-l">是否领取礼品</el-col>
                    <el-col :span="16" class="memberInfo-r">{{member.giftOrder == 0 ? '未领取' : '已领取'}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="memberInfo-l">关注微信时间</el-col>
                    <el-col :span="16" class="memberInfo-r">{{member.subscribeTimes}}</el-col>
                </el-row>
              </el-col>
        </el-row>
      </div>
      <!-- 收货地址 -->
      <div class="memberAddress">
        <p class="memberTil">收货地址</p>
        <el-table :data="tableDataAddress" border v-loading="tableLoading" highlight-current-row>
            <el-table-column prop="recname" label="姓名" width="100"></el-table-column>
            <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
            <el-table-column prop="address" label="收货详细地址"></el-table-column>
            <!-- <el-table-column prop="enble" label="邮政编码"></el-table-column> -->
            <el-table-column prop="enble" label="默认地址" width="100"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeAddress"
            background
            :current-page="ruleFormAddress.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalAddress">
            </el-pagination>
        </div>
      </div>
      <!-- 购买记录 -->
      <div class="memberAddress">
        <p class="memberTil">购买记录</p>
        <el-table :data="tableDataBuy" border v-loading="tableLoading" style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="memberCode" label="会员编码" width="80" class-name="title" label-class-name="title-header"></el-table-column>
          <el-table-column align="center" prop="memberName" label="姓名" width="80"></el-table-column>
          <el-table-column align="center" prop="uniqueCode" label="产品唯一码" width="120"></el-table-column>
          <el-table-column align="center" prop="productCode" label="产品编码" width="100"></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" width="100"></el-table-column>
          <el-table-column align="center" prop="couponId" label="使用优惠券ID" width="120"></el-table-column>
          <el-table-column align="center" prop="price" label="单价" width="140"></el-table-column>
          <el-table-column align="center" prop="quantity" label="数量" width="145"></el-table-column>
          <el-table-column align="center" prop="amount" label="优惠金额" width="145"></el-table-column>
          <el-table-column align="center" prop="storeCode" label="使用专卖店编号" width="120"></el-table-column>
          <el-table-column align="center" prop="storeName" label="使用专卖店名称" width="120"></el-table-column>
          <el-table-column align="center" prop="buyDate" label="购买日期" width="90"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeBuy"
            background
            :current-page="ruleFormBuy.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalBuy">
            </el-pagination>
        </div>
      </div>
      <!-- 优惠券记录 -->
      <div class="memberAddress">
        <p class="memberTil">优惠券记录</p>
        <el-table :data="tableDataCoupon" border v-loading="tableLoading" highlight-current-row>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="benefitCouponId" label="优惠券ID" width="100"></el-table-column>
            <el-table-column prop="benefitCouponSn" label="优惠券编码" width="100"></el-table-column>
            <el-table-column prop="benefitFrontName" label="规则名称" width="100"></el-table-column>
            <el-table-column prop="benefitCode" label="规则代码" width="100"></el-table-column>
            <el-table-column prop="benefitDesc" label="规则描述" width="100"></el-table-column>
            <el-table-column prop="obtainTime" label="领取日期" width="90"></el-table-column>
            <el-table-column prop="usedTime" label="使用日期" width="90"></el-table-column>
            <el-table-column prop="redundantUsedStoreCode" label="使用专卖店编号" width="120"></el-table-column>
            <el-table-column prop="redundantUsedStoreName" label="使用专卖店名称" width="120"></el-table-column>
            <el-table-column prop="availableStartTime" label="有效开始日期" width="150"></el-table-column>
            <el-table-column prop="availableEndTime" label="有效结束日期" width="150"></el-table-column>
            <el-table-column prop="benefitCouponStatus" label="使用状态" width="100"></el-table-column>
            <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeCoupon"
            background
            :current-page="ruleFormCoupon.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalCoupon">
            </el-pagination>
        </div>
      </div>
      <!-- 惠金币记录 -->
      <div class="memberAddress">
        <p class="memberTil">惠金币记录</p>
        <el-table :data="tableDataIntegral" border v-loading="tableLoading" highlight-current-row>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="id" label="惠金币ID" width=""></el-table-column>
            <el-table-column prop="integralAccountName" label="积分账户" width=""></el-table-column>
            <!-- <el-table-column prop="benefit_front_name" label="规则代码" width="100"></el-table-column>
            <el-table-column prop="benefit_desc" label="规则描述" width="100"></el-table-column> -->
            <el-table-column prop="productUniqueCode" label="产品唯一码" width=""></el-table-column>
            <el-table-column prop="integralChangeAmount" label="领取积分" width=""></el-table-column>
            <el-table-column prop="integralChangeDate" label="领取时间" width=""></el-table-column>
            <!-- <el-table-column prop="redundantUsedStoreCode" label="使用专卖店编号" width="120"></el-table-column>
            <el-table-column prop="redundantUsedStoreName" label="使用专卖店名称"></el-table-column> -->
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeIntegral"
            background
            :current-page="ruleFormIntegral.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalIntegral">
            </el-pagination>
        </div>
      </div>
      <!-- 标签记录 -->
      <div class="memberAddress">
        <p class="memberTil">标签记录</p>
        <el-table :data="tableDataLabel" border v-loading="tableLoading" highlight-current-row>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="tagId" label="标签ID"></el-table-column>
            <el-table-column prop="tagName" label="标签名称"></el-table-column>
            <el-table-column prop="tagType" label="标签类型"></el-table-column>
            <el-table-column prop="createDate" label="打标签日期"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeLabel"
            background
            :current-page="ruleFormLabel.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalLabel">
            </el-pagination>
        </div>
      </div>
      <!-- 转移记录 -->
      <div class="memberAddress">
        <p class="memberTil">转移记录</p>
        <el-table :data="tableDataTransfer" border v-loading="tableLoading" highlight-current-row>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="fromStoreName" label="转移前专卖店"></el-table-column>
            <el-table-column prop="toStoreName" label="转移后专卖店"></el-table-column>
            <el-table-column prop="storeType" label="专卖店类型" width="160"></el-table-column>
            <el-table-column prop="approvalTime" label="审核时间"></el-table-column>
            <el-table-column prop="approvalEmployee" label="审核人"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeTransfer"
            background
            :current-page="ruleFormTransfer.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalTransfer">
            </el-pagination>
        </div>
      </div>
      <!-- 修改记录 -->
      <div class="memberAddress">
        <p class="memberTil">修改记录</p>
        <el-table :data="tableDataModify" border v-loading="tableLoading" highlight-current-row>
            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="memberCode" label="会员编码" width="80"></el-table-column>
            <el-table-column align="center" prop="memberName" label="姓名" width="80"></el-table-column>
            <el-table-column align="center" prop="memberMobile" label="会员手机号" width="110"></el-table-column>
            <el-table-column align="center" prop="changeDate" label="修改日期" width="90"></el-table-column>
            <el-table-column align="center" prop="opTypeValue" label="操作类型" width="100"></el-table-column>
            <el-table-column align="center" prop="currentStoreCode" label="所属专卖店编号" width="140"></el-table-column>
            <el-table-column align="center" prop="currentStoreName" label="所属专卖店名称" width="140"></el-table-column>
            <el-table-column align="center" prop="registerStoreCode" label="入会专卖店编号" width="145"></el-table-column>
            <el-table-column align="center" prop="registerStoreName" label="入会专卖店名称" width="145"></el-table-column>
            <el-table-column align="center" prop="upgradeStoreCode" label="升级专卖店新编" width="120"></el-table-column>
            <el-table-column align="center" prop="upgradeStoreName" label="升级专卖店名称" width="120"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChangeModify"
            background
            :current-page="ruleFormModify.pagingQuery.pageIndex"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalModify">
            </el-pagination>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      ruleForm: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableLoading: false,
      tableDataBuy: [],
      ruleFormBuy: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalBuy: 0,
      tableDataLabel: [],
      ruleFormLabel: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalLabel: 0,
      tableDataModify: [],
      ruleFormModify: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalModify: 0,
      tableDataCoupon: [],
      ruleFormCoupon: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalCoupon: 0,
      memberId: '',
      member: {},
      modifyPhone: false,
      modifyOpenid: false,
      modifyPhoneLoading: false,
      modifyOpenidLoading: false,
      tableDataIntegral: [],
      ruleFormIntegral: {
        condition: {
          memberId: ''
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalIntegral: 0,
      tableDataTransfer: [],
      ruleFormTransfer: {
        condition: {
          memberId: '',
          transferStatus: 2
        },
        pagingQuery: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      totalTransfer: 0,
      tableDataAddress: [],
      ruleFormAddress: {
        pageIndex: 1,
        pageSize: 10
      },
      totalAddress: 0
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.ruleForm.page = val
    },
    handleCurrentChangeBuy (val) {
      this.ruleFormBuy.pagingQuery.pageIndex = val
    },
    handleCurrentChangeLabel (val) {
      this.ruleFormLabel.pagingQuery.pageIndex = val
    },
    handleCurrentChangeModify (val) {
      this.ruleFormModify.pagingQuery.pageIndex = val
    },
    handleCurrentChangeCoupon (val) {
      this.ruleFormCoupon.pagingQuery.pageIndex = val
    },
    handleCurrentChangeIntegral (val) {
      this.ruleFormIntegral.pagingQuery.pageIndex = val
    },
    handleCurrentChangeTransfer (val) {
      this.ruleFormTransfer.pagingQuery.pageIndex = val
    },
    handleCurrentChangeAddress (val) {
      this.ruleFormAddress.pagingQuery.pageIndex = val
    },
    getMemberInfo () {
      this.$tupHttp(this, 'mss/member/detail?memberId=' + this.memberId).then(res => {
        if (res.data.model == null) {
          return false
        } else {
          if (res.data.model.openid) {
            this._getAddressData(res.data.model.openid)
          }
          if (res.data.model.memberGender === true) {
            res.data.model.memberGenders = '女'
          }
          if (res.data.model.memberGender === false) {
            res.data.model.memberGenders = '男'
          }
          if (res.data.model.subscribe) {
            res.data.model.subscribe = '是'
          } else {
            res.data.model.subscribe = '否'
          }
          if (res.data.model.subscribeTime) {
            res.data.model.subscribeTimes = new Date(res.data.model.subscribeTime).format('yyyy-MM-dd hh:mm:ss')
          } else {
            res.data.model.subscribeTimes = ''
          }
          if (res.data.model.memberBirthday) {
            res.data.model.memberBirthdays = new Date(res.data.model.memberBirthday).format('yyyy-MM-dd')
          } else {
            res.data.model.memberBirthdays = ''
          }
          if (res.data.model.regTime) {
            res.data.model.regTimes = new Date(res.data.model.regTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            res.data.model.regTimes = ''
          }
          if (res.data.model.upgradeTime) {
            res.data.model.upgradeTimes = new Date(res.data.model.upgradeTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            res.data.model.upgradeTimes = ''
          }
          if (res.data.model.addTime) {
            res.data.model.addTimes = new Date(res.data.model.addTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            res.data.model.addTimes = ''
          }
          this.member = res.data.model
        }
      })
    },
    viewRelod (num) {
      if (num === 0) {
        this.getMemberInfo()
        this._getBuyData()
        this._getLabelData()
        this._getModifyData()
        this._getCouponData()
        this._getIntegralData()
        this._getTransferData()
      } else {
        this.$router.go(num)
      }
    },
    modifyPhones () {
      if (this.modifyPhone) {
        let thiz = this
        // if (thiz.member.memberMobile.length !== 11) {
        //   thiz.$message.error('请输入正确的手机号码')
        //   return
        // }
        thiz.modifyPhoneLoading = true
        thiz.$tupHttp(thiz, 'mss/member/backendUpdate', 'POST', thiz.member).then(res => {
          thiz.modifyPhoneLoading = false
          this.modifyPhone = false
          thiz.$notify.success({
            title: '成功提示',
            message: '修改成功'
          })
          this.getMemberInfo()
        }, res => {
          thiz.modifyPhoneLoading = false
        })
      } else {
        this.modifyPhone = true
      }
    },
    modifyOpenids () {
      if (this.modifyOpenid) {
        let thiz = this
        thiz.modifyOpenidLoading = true
        thiz.$tupHttp(thiz, 'mss/member/backendUpdate', 'POST', thiz.member).then(res => {
          thiz.modifyOpenidLoading = false
          this.modifyOpenid = false
          thiz.$notify.success({
            title: '成功提示',
            message: '修改成功'
          })
          this.getMemberInfo()
        }, res => {
          thiz.modifyOpenidLoading = false
        })
      } else {
        this.modifyOpenid = true
      }
    },
    // 获取购买记录数据
    _getBuyData () {
      this.ruleFormBuy.condition.memberId = this.memberId
      this.tableLoading = true
      this.$tupHttp(this, 'mss/purchase-record/list', 'POST', this.ruleFormBuy).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          if (item.couponId === 0) {
            item.couponId = ''
          }
        })
        this.tableDataBuy = res.data.models
        this.totalBuy = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取标签记录数据
    _getLabelData () {
      this.ruleFormLabel.condition.memberId = this.memberId
      this.tableLoading = true
      this.$tupHttp(this, 'mss/tag/list', 'POST', this.ruleFormLabel).then(res => {
        this.tableLoading = false
        this.tableDataLabel = res.data.models
        this.totalLabel = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      })
    },
    // 获取修改记录数据
    _getModifyData () {
      this.ruleFormModify.condition.memberId = this.memberId
      this.tableLoading = true
      this.$tupHttp(this, 'mss/change-record/list', 'POST', this.ruleFormModify).then(res => {
        this.tableLoading = false
        this.tableDataModify = res.data.models
        this.totalModify = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取优惠券记录数据
    _getCouponData () {
      this.ruleFormCoupon.condition.memberId = this.memberId
      this.tableLoading = true
      this.$hsyHttp(this, 'mss-service/benefit/Coupon/list', 'POST', this.ruleFormCoupon).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          if (item.obtainTime) {
            item.obtainTime = new Date(item.obtainTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
          if (item.usedTime) {
            item.usedTime = new Date(item.usedTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.usedTime = ''
          }
          if (item.availableStartTime) {
            item.availableStartTime = new Date(item.availableStartTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
          if (item.availableEndTime) {
            item.availableEndTime = new Date(item.availableEndTime * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
          if (item.benefitCouponStatus === 0) {
            item.benefitCouponStatus = '未使用'
          }
          if (item.benefitCouponStatus === 1) {
            item.benefitCouponStatus = '已使用'
          }
        })
        this.tableDataCoupon = res.data.models
        this.totalCoupon = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 删除优惠券
    handleDelete (id) {
      const thiz = this
      this.$confirm('删除后将无法复原数据，你确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        thiz.$tupHttp(thiz, 'benefit/coupon/detail/delete?id=' + id, 'DELETE').then(res => {
          this.$message.success('删除成功')
          thiz._getCouponData()
        })
      })
    },
    // 获取惠金币记录数据
    _getIntegralData () {
      this.ruleFormIntegral.condition.memberId = this.memberId
      this.tableLoading = true
      this.$tupHttp(this, 'benefit/integralAccountChange/getByMemberId?memberId=' + this.memberId + '&pageSize=' + this.ruleFormIntegral.pagingQuery.pageSize + '&pageIndex=' + this.ruleFormIntegral.pagingQuery.pageIndex, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.forEach(function (item) {
          if (item.integralChangeDate) {
            item.integralChangeDate = new Date(item.integralChangeDate * 1000).format('yyyy-MM-dd hh:mm:ss')
          }
        })
        this.tableDataIntegral = res.data.pageInfo.list
        this.totalIntegral = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取转移记录数据
    _getTransferData () {
      this.ruleFormTransfer.condition.memberId = this.memberId
      this.tableLoading = true
      this.$hsyHttp(this, 'mss-service/transfer/list', 'POST', this.ruleFormTransfer).then(res => {
        this.tableLoading = false
        res.data.models.forEach(function (item) {
          let storeType = ''
          if (item.isBeStore === 1) {
            storeType = storeType + '所属专卖店  '
          }
          if (item.isRegStore === 1) {
            storeType = storeType + '入会专卖店  '
          }
          if (item.isUpdateStore === 1) {
            storeType = storeType + '升级专卖店  '
          }
          item.storeType = storeType
        })
        this.tableDataTransfer = res.data.models
        this.totalTransfer = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    },
    // 获取收货地址
    _getAddressData (openid) {
      this.tableLoading = true
      this.$hsyHttp(this, 'etup-user/address/findByOpenid?openId=' + openid + '&pageSize=' + this.ruleFormAddress.pageSize + '&pageIndex=' + this.ruleFormAddress.pageIndex, 'GET').then(res => {
        this.tableLoading = false
        res.data.pageInfo.list.forEach(function (item) {
          item.address = item.provinceName + item.cityName + item.districtName + item.address
          if (item.enble) {
            item.enble = '否'
          } else {
            item.enble = '是'
          }
        })
        this.tableDataAddress = res.data.pageInfo.list
        this.totalAddress = res.data.pageInfo.total ? res.data.pageInfo.total : 0
      }, res => {
        this.tableLoading = false
      })
    }
  },
  created () {
    this.memberId = this.$route.query.id
    this.getMemberInfo()
    this._getBuyData()
    this._getLabelData()
    this._getModifyData()
    this._getCouponData()
    this._getIntegralData()
    this._getTransferData()
  }
}
</script>
<style lang="scss">
.mssMemberDetail{
    padding: 30px 0 30px 30px;
    .disflex{display: flex;}
    .f16{font-size:16px;}
    .f18{font-size:18px;}
    .clearfix {overflow: auto;zoom: 1;}
    .crumbs {margin-bottom: 20px;}
    .tilfl{float: left;padding-top:10px;}
    .fr{float: right;}
    .memberInfo{border:1px solid #ddd;border-bottom:none;}
    .memberInfo .el-row{display:table;border-collapse:collapse;width:100%}
    .memberInfoShow{background: #f9f9f9;text-align:center;display:table-cell;height:216px;border-bottom:1px solid #ddd;padding-top:20px;}
    .memberInfo-l{height:36px;background: #f9f9f9;border-left:1px solid #ddd;border-right:1px solid #ddd;border-bottom:1px solid #ddd;padding-right: 5px;overflow: hidden;display: flex;align-items: center;justify-content:flex-end}
    .memberInfo-r{height:36px;border-bottom:1px solid #ddd;padding-left: 5px;overflow: hidden;display: flex;align-items: center;justify-content:flex-start}
    .memberInfo-l:nth-child(6){border-bottom:none;}
    .memberType{width: 70px;background: red;color:#fff;border-radius:10px;line-height:20px;margin-left:150px;font-size: 12px}
    .pagination {margin: 20px 0;text-align: right;display: block;}
    .memberTil{padding-top:20px}
    .openid{width:300px;overflow: hidden;}
}
</style>
