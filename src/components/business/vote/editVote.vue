<template>
  <div class="edit-vote">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>编辑投票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="comForm" ref="comForm" :rules="rules" label-width="200px" class="form" size="mini">
      <div class="item-title">投票活动信息</div>
      <el-form-item label="投票活动编码" prop="code">          
        <el-input v-model="comForm.code" placeholder="" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="投票活动名称" prop="title">          
        <el-input v-model="comForm.title" placeholder="" style="width:400px" maxlength=20></el-input>
      </el-form-item>
      <el-form-item label="投票活动时间" prop="startDate">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
          style="width:400px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="投票活动状态" prop="isEnable">
        <el-radio v-model="comForm.isEnable" :label="1">上架</el-radio>
        <el-radio v-model="comForm.isEnable" :label="0">下架</el-radio>            
      </el-form-item>
      <div class="item-title">投票规则</div>
      <el-form-item label="每个ID可投次数" prop="eachIdChance">
        <el-input v-model="comForm.eachIdChance" type="number" placeholder="" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="每天每ID可投次数" prop="eachDayChance">   
        <el-input v-model="comForm.eachDayChance" type="number" placeholder="" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="是否限制每天为同一选手投票" prop="sameIdChange">
        <el-radio v-model="comForm.sameIdChange" :label="0">无限制</el-radio>
        <el-radio v-model="comForm.sameIdChange" :label="1">
          <el-input v-model="sameIdChange" :disabled="comForm.sameIdChange == 0"  type="number" placeholder="" style="width:80px"></el-input>&nbsp;次
        </el-radio>            
      </el-form-item>
      <div class="item-title">投票设置</div>
      <el-form-item label="投票是否需注册" prop="voteNeedReg">
        <el-radio v-model="comForm.voteNeedReg" :label="1">是</el-radio>
        <el-radio v-model="comForm.voteNeedReg" :label="0">无限制</el-radio>            
      </el-form-item>
      <el-form-item label="投票抽奖" prop="voteActivityId">
        <el-radio v-model="comForm.voteActivityId" :label="0">不使用</el-radio>
        <el-radio v-model="comForm.voteActivityId" :label="1">使用&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
        关联活动
        <el-select
          style="width:180px"
          v-model="voteActivityId"
          :disabled="comForm.voteActivityId == 0"
          filterable
          reserve-keyword>
          <el-option
            v-for="item in activityData"
            :key="item.id"
            :label="item.activityName"
            :value="item.id">
          </el-option>
        </el-select>  
      </el-form-item>
      <div class="item-title">参赛设置</div>
      <el-form-item label="参赛是否需注册" prop="matchNeedReg">
        <el-radio v-model="comForm.matchNeedReg" :label="1">是</el-radio>
        <el-radio v-model="comForm.matchNeedReg" :label="0">无限制</el-radio>            
      </el-form-item>
      <el-form-item label="参赛次数" prop="matchChance">
        <el-radio v-model="comForm.matchChance" :label="0">无限制</el-radio>
        <el-radio v-model="comForm.matchChance" :label="1">
          每ID&nbsp;
          <el-input v-model="matchChance" :disabled="comForm.matchChance == 0" type="number" placeholder="" style="width:80px"></el-input>&nbsp;次
        </el-radio>            
      </el-form-item>
      <el-form-item label="参赛抽奖" prop="matchActivityId">
        <el-radio v-model="comForm.matchActivityId" :label="0">不使用</el-radio>
        <el-radio v-model="comForm.matchActivityId" :label="1">使用&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
        关联活动
        <el-select
          style="width:180px"
          v-model="matchActivityId"
          :disabled="comForm.matchActivityId == 0"
          filterable
          reserve-keyword>
          <el-option
            v-for="item in activityData"
            :key="item.id"
            :label="item.activityName"
            :value="item.id">
          </el-option>
        </el-select>     
      </el-form-item>
      <el-form-item label="参赛说明" prop="matchDescLimit">
        <el-radio v-model="comForm.matchDescLimit" :label="0">不使用</el-radio>
        <el-radio v-model="comForm.matchDescLimit" :label="1">
          <el-select
            style="width:100px"
            v-model="matchDescLimit"
            :disabled="comForm.matchDescLimit == 0"
            filterable
            reserve-keyword>
            <el-option
              v-for="item in matchDesc"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>&nbsp;字符
        </el-radio>            
      </el-form-item>
      <el-form-item label="参赛图片" prop="matchImgLimit">
        <el-radio v-model="comForm.matchImgLimit" :label="0">不使用</el-radio>
        <el-radio v-model="comForm.matchImgLimit" :label="1">
          <el-select
            style="width:100px"
            v-model="matchImgLimit"
            :disabled="comForm.matchImgLimit == 0"
            filterable
            reserve-keyword>
            <el-option
              v-for="item in matchImg"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>&nbsp;张（不少于1张，不大于5张）
        </el-radio>            
      </el-form-item>
      <div class="form-footer">
        <el-button @click="commit" size="mini" :loading="loading" type="primary">保存</el-button>
        <el-button @click="$router.go(-1)" size="mini">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      var validateSameId = (rule, value, callback) => {
        if (this.comForm.sameIdChange == 1 && !this.sameIdChange) {
          callback(new Error('请输入限制每天为同一选手投票次数'))
        } else {
          callback()
        }
      }
      var validateVoteActivityId = (rule, value, callback) => {
        if (this.comForm.voteActivityId == 1 && !this.voteActivityId) {
          callback(new Error('请选择投票抽奖关联活动'))
        } else {
          callback()
        }
      }
      var validateMatchChance = (rule, value, callback) => {
        if (this.comForm.matchChance == 1 && !this.matchChance) {
          callback(new Error('请输入参赛次数'))
        } else {
          callback()
        }
      }
      var validateMatchActivityId = (rule, value, callback) => {
        if (this.comForm.matchActivityId == 1 && !this.matchActivityId) {
          callback(new Error('请选择参赛抽奖关联活动'))
        } else {
          callback()
        }
      }
      var validateMatchDescLimit = (rule, value, callback) => {
        if (this.comForm.matchDescLimit == 1 && !this.matchDescLimit) {
          callback(new Error('请选择参赛说明字符数'))
        } else {
          callback()
        }
      }
      var validateMatchImgLimit = (rule, value, callback) => {
        if (this.comForm.matchImgLimit == 1 && !this.matchImgLimit) {
          callback(new Error('请选择参赛图片张数'))
        } else {
          callback()
        }
      }
      return {
        comForm: {},
        rules: {
          code: [
            { required: true, message: '请输入投票活动编码', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入投票活动名称', trigger: 'blur' },
            { max: 20, message: '奖项名称长度不能大于20个字符', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '请输入投票活动时间', trigger: 'change' }
          ],
          isEnable: [
            { required: true, message: '请选择投票活动状态', trigger: 'change' }
          ],
          eachIdChance: [
            { required: true, message: '请输入每个ID可投次数', trigger: 'blur' }
          ],
          eachDayChance: [
            { required: true, message: '请输入每天每ID可投次数', trigger: 'blur' }
          ],
          sameIdChange: [
            { required: true, message: '请选择是否限制每天为同一选手投票', trigger: 'blur' },
            { validator: validateSameId, trigger: 'blur' }
          ],
          voteNeedReg: [
            { required: true, message: '请选择投票是否需注册', trigger: 'change' }
          ],
          voteActivityId: [
            { required: true, message: '请选择是否使用投票抽奖', trigger: 'blur' },
            { validator: validateVoteActivityId, trigger: 'blur' }
          ],
          matchNeedReg: [
            { required: true, message: '请选择参赛是否需注册', trigger: 'change' }
          ],
          matchChance: [
            { required: true, message: '请选择参赛次数', trigger: 'blur' },
            { validator: validateMatchChance, trigger: 'blur' }
          ],
          matchActivityId: [
            { required: true, message: '请选择参赛抽奖', trigger: 'blur' },
            { validator: validateMatchActivityId, trigger: 'blur' }
          ],
          matchDescLimit: [
            { required: true, message: '请选择参赛说明', trigger: 'blur' },
            { validator: validateMatchDescLimit, trigger: 'blur' }
          ],
          matchImgLimit: [
            { required: true, message: '请选择参赛图片', trigger: 'blur' },
            { validator: validateMatchImgLimit, trigger: 'blur' }
          ]
        },
        date: [],
        matchDesc: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        matchImg: [1, 2, 3, 4, 5],
        activityData: [],
        sameIdChange: '',
        voteActivityId: '',
        matchChance: '',
        matchActivityId: '',
        matchDescLimit: '',
        matchImgLimit: '',
        loading: false
      }
    },
    watch: {
      date (newValue) {
        this.comForm.startDate = newValue ? new Date(newValue[0]).valueOf() : ''
        this.comForm.endDate = newValue ? new Date(newValue[1]).valueOf() : ''
      }
    },
    methods: {
      commit () {
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            let comForm = this.$util.deepClone(this.comForm)
            comForm.sameIdChange = comForm.sameIdChange == 1 ? this.sameIdChange : comForm.sameIdChange
            comForm.voteActivityId = comForm.voteActivityId == 1 ? this.voteActivityId : comForm.voteActivityId
            comForm.matchChance = comForm.matchChance == 1 ? this.matchChance : comForm.matchChance
            comForm.matchActivityId = comForm.matchActivityId == 1 ? this.matchActivityId : comForm.matchActivityId
            comForm.matchDescLimit = comForm.matchDescLimit == 1 ? this.matchDescLimit : comForm.matchDescLimit
            comForm.matchImgLimit = comForm.matchImgLimit == 1 ? this.matchImgLimit : comForm.matchImgLimit
            if (comForm.matchDescLimit == 0 && comForm.matchImgLimit == 0) {
              this.$message.error('参赛说明和参赛图片不能同时选择不使用')
              return
            }
            this.$confirm('活动上架后修改设置会导致数据错乱，请谨慎操作', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.loading = true
              this.$hsyHttp(this, 'dolls-service/vote-manage/update', 'POST', comForm).then(res => {
                this.loading = false
                this.$notify.success({
                  title: '成功提示',
                  message: '保存成功'
                })
                this.$router.go(-1)
              }, () => {
                this.loading = false
              })
            })
          }
        })
      },
      _getActivity () {
        this.$hsyHttp(this, 'backend/dolls/activity/searchByNameAndState').then(res => {
          this.activityData = res.data.pageInfo.list
        })
      },
      _getDetail (id) {
        this.$hsyHttp(this, 'dolls-service/vote-manage/info?id=' + id).then(res => {
          this.comForm = res.data.model
          this.date = [new Date(this.comForm.startDate), new Date(this.comForm.endDate)]
          this.sameIdChange = this.comForm.sameIdChange == 0 ? '' : this.comForm.sameIdChange
          this.voteActivityId = this.comForm.voteActivityId == 0 ? '' : this.comForm.voteActivityId
          this.matchChance = this.comForm.matchChance == 0 ? '' : this.comForm.matchChance
          this.matchActivityId = this.comForm.matchActivityId == 0 ? '' : this.comForm.matchActivityId
          this.matchDescLimit = this.comForm.matchDescLimit == 0 ? '' : this.comForm.matchDescLimit
          this.matchImgLimit = this.comForm.matchImgLimit == 0 ? '' : this.comForm.matchImgLimit

          this.comForm.sameIdChange = this.comForm.sameIdChange == 0 ? 0 : 1
          this.comForm.voteActivityId = this.comForm.voteActivityId == 0 ? 0 : 1
          this.comForm.matchChance = this.comForm.matchChance == 0 ? 0 : 1
          this.comForm.matchActivityId = this.comForm.matchActivityId == 0 ? 0 : 1
          this.comForm.matchDescLimit = this.comForm.matchDescLimit == 0 ? 0 : 1
          this.comForm.matchImgLimit = this.comForm.matchImgLimit == 0 ? 0 : 1
        })
      }
    },
    created () {
      this._getActivity()
      this._getDetail(this.$route.query.id)
    }
  }
</script>
<style lang="scss">
.edit-vote {
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
}
</style>
