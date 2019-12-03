<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="促销规则名称">
            <el-input v-model="searchForm.title" size="mini"  placeholder="促销规则名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.operator" size="mini"  placeholder="操作人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="规则生效">
            <el-select v-model="searchForm.effective" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间" style="padding-top: 6px;"  size="mini"  prop="date">
            <el-date-picker
              v-model="searchForm.date"
              style="width:100%"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审批状态">
            <el-select v-model="searchForm.status" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="通过" :value="1"></el-option>
              <el-option label="待审批" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code 
              v-model="searchForm.pCode"
              size="mini">
            </el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="促销类型">
            <el-select v-model="searchForm.type" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="优惠" :value="0"></el-option>
              <el-option label="买赠" :value="1"></el-option>
              <el-option label="满单" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button icon="el-icon-search" type="primary" size="mini" @click="getGuide(true)">查询</el-button>
          <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-dropdown style="margin:0 5px 0 5px;"  @command="handleCommand">
            <el-button size="mini" type="primary">添加<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="kit">满赠/KIT—单品</el-dropdown-item> -->
              <el-dropdown-item command="discount">优惠</el-dropdown-item>
              <el-dropdown-item command="AC">买赠</el-dropdown-item>
              <el-dropdown-item command="order">满单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button icon="el-icon-delete" size="mini" @click="deleteGuide" :loading="loading" :disabled="multipleSelection.length==0"  type="danger">批量删除</el-button>
          <el-button icon="el-icon-tickets" size="mini" @click="copyGuide(true)" :loading="loading"  :disabled="multipleSelection.length==0"  type="primary">批量复制当前主题</el-button>
          
          <el-popover
            placement="bottom"
            width="360"
            v-model="visible">
              <el-form ref="comForm" :model="comForm" :rules="comRules" label-width="80px">
                <el-form-item label="促销主题" prop="promotionId">          
                  <el-autocomplete
                    placeholder="关键字"
                    style="width:100%"
                    :fetch-suggestions="queryProductAsync"
                    @select="handleSelect"
                    size="mini"
                    v-model="comForm.title">
                    <template slot-scope="{ item }">
                      <span >{{ item.title }}({{ item.id }})</span>
                    </template>
                  </el-autocomplete>
                </el-form-item> 
              </el-form>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="commit"  :loading="loading">确定</el-button>
            </div>
            <el-button slot="reference" icon="el-icon-tickets" size="mini" :disabled="multipleSelection.length==0"  type="primary">批量复制到其他主题</el-button>
          </el-popover>
          <el-button icon="el-icon-check" size="mini" @click="aduitGuide" :loading="loading"  :disabled="multipleSelection.length==0"  type="primary">批量审批</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="guideData"
      style="width: 100%;"
      v-loading="tableLoading"
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="targetAreaNames"
        width="200"
        label="区域/省办">
        <template slot-scope="scope">
          {{scope.row.targetAreaNames ? scope.row.targetAreaNames : (scope.row.targetClients ? '':'全国')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="targetClients"
        width="200"
        label="适用门店">
        <template slot-scope="scope">
          <el-button
            size="mini"          
            type="primary"
            v-show="scope.row.targetClients"
            @click="viewClients(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        width="200"
        label="规则名称">
      </el-table-column>
      <el-table-column
        prop="description"
        width="200"
        label="描述">
      </el-table-column>      
      <el-table-column
        prop="type"
        label="适用类型"
        sortable
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="lock"
        label="锁定人"
        sortable
        width="100">
      </el-table-column>          
      <el-table-column
        prop="status"
        width="100"
        :formatter="formatter"
        label="审批状态">
      </el-table-column>
      <el-table-column
        prop="startDate"
        width="150"
        label="规则生效时间">
      </el-table-column>
      <el-table-column
        prop="endDate"
        width="150"
        label="规则失效时间">
      </el-table-column>
      <el-table-column
        prop="operator"
        width="120"
        sortable
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        width="150"
        sortable
        label="操作时间">
      </el-table-column>
      <el-table-column label="操作" width="320" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"          
            type="primary"
            @click="viewItem(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"          
            type="primary"
            @click="editItem(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"          
            type="primary"
            @click="copyItem(scope.$index, scope.row)">复制</el-button>
            <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="unlock(scope.$index, scope.row)">解锁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100, 200]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="参加促销门店名单" @opened="handleOpened" width="60%" top="5%" :visible.sync="dialogVisible">
      <el-form  :model="clientForm" label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="专卖店编号">
              <el-input v-model="clientForm.code" size="mini" placeholder="专卖店编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专卖店名称">
              <el-input v-model="clientForm.name" size="mini" placeholder="专卖店名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadClient(true)">查询</el-button>
          <el-button icon="el-icon-refresh" type="primary" size="mini" @click="clientForm={name:'',code:''}">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="clientDatas"
        style="width: 100%;"
        height="350"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="code"
          width="120"
          label="专卖店编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="专卖店名称">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChangeClient"
          background
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="clientTotal">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-promotion-promotionGuide',
    data() {
      return {
        clientDatas:[],
        allClientDatas:[],
        searchClientDatas:[],
        visible:false,
        comForm:{
          promotionId:'',
          title:''
        },
        comRules:{
          promotionId: [
            { required: true, message: '请选择促销主题', trigger: 'change' }
          ]
        },
        pageSize:20,
        total:0,
        currentPage:1,
        clientTotal:0,
        clientForm:{
          name:'',
          code:''
        },
        searchForm:{
          effective:'',
          status:'',
          title:'',
          type:'',
          operator:'',
          startDate:'',
          endDate:'',
          pCode:'',
          provinceObject:[],
          provinces:[],
          date:'',
          promotionId: parseInt(this.$route.params.promotionId),
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        promotionId:this.$route.params.promotionId,
        promotionThemeType:this.$route.params.promotionThemeType,        
        loading:false,
        tableLoading:false,
        activeName:'first',
        guideData: [
        ],
        multipleSelection:[],
        dialogVisible:false
      }
    },
    watch:{
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinces = datas;
      },
      'activeName':function(val){
        if(val=='zero'){
          this.gotoUrl('/frame/promotion/promotionDetail/'+this.promotionId+'/'+this.promotionThemeType)
        }
      },
      $route:function(val){
        if(val.path.indexOf("/frame/promotion/promotionGuide") != -1){
          if(this.promotionId != val.params.promotionId){            
            this.resetForm(); 
            this.promotionId = val.params.promotionId
            this.promotionThemeType = val.params.promotionThemeType
            this.searchForm.promotionId = val.params.promotionId
          }          
          this.getGuide()
          this.getInfo()
          this.$util.onKeyCode(this,'loadData',[true])
        }
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startDate = '';
          this.searchForm.endDate = '';
        }
        else{
          this.searchForm.startDate = val[0];
          this.searchForm.endDate = val[1];
        }
      }
    },
    methods: {
      viewClients(row){
        let thiz = this;
        this.dialogVisible = true;
        this.allClientDatas = [];
        let codeArr = row.targetClients ? row.targetClients.split(','):[]
        let nameArr = row.targetClientNames ? row.targetClientNames.split(','):[]
        for(let i =0;i<codeArr.length;i++){
          this.allClientDatas.push({
            code:codeArr[i],
            name:nameArr[i]
          })
        }      
        this.searchClientDatas = this.allClientDatas        
        this.clientForm = {
          name:'',
          code:''
        }  
      },
      loadClient(isFirst){
        let arr = []
        let thiz = this;
        if(isFirst){
          this.currentPage = 1
        }
        let datas = this.$util.deepClone(thiz.allClientDatas);
        if(this.clientForm.name || this.clientForm.code){
          this.searchClientDatas = datas.filter(item =>{
            return item.code.indexOf(thiz.clientForm.code) != -1 && item.name.indexOf(thiz.clientForm.name) != -1
          })
        }
        else{
          this.searchClientDatas  = datas
        }
        for(let i=(this.currentPage-1)*this.pageSize; i <this.currentPage*this.pageSize; i++){
          if(this.searchClientDatas.length <= i){
            break;
          }
          arr.push({
            code:this.searchClientDatas[i].code,
            name:this.searchClientDatas[i].name
          })
        }
        this.clientDatas = arr
        this.clientTotal = this.searchClientDatas.length
      },
      handleOpened(){
        this.loadClient(true)
      },
      handleCurrentChangeClient(val){
        this.currentPage = val;
        this.loadClient()
      },
      queryProductAsync(queryString, cb) {
        if(queryString.length < 2){
          return;
        }
        let thiz = this;
        let searchParam = {
          title:queryString,
          pagingQuery:{
            pageIndex:1,
            pageSize:10
          }
        }
        thiz.$tupHttp(thiz,'promotion/list','POST',searchParam).then(res=>{
          let data = [];
          res.body.models.map(item=>{
            if(thiz.promotionId != item.id)
              data.push(item)
          })
          cb(data)
        })
      },
      handleSelect(row) {
        this.comForm.title = row.title;
        this.comForm.promotionId = row.id;
      },
      resetForm(){
        this.searchForm = {
          effective:'',
          status:'',
          title:'',
          operater:'',
          startDate:'',
          endDate:'',
          type:'',
          date:'',
          pCode:'',
          provinces:[],
          provinceObject:[],
          promotionId:parseInt(this.$route.params.promotionId),
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      handleCommand(command) {
        switch(command){
          case 'kit':
            this.gotoUrl('/frame/promotion/addOrderGuideKIT/'+this.promotionId+'/'+this.promotionThemeType)
          break;
          case 'discount':
            this.gotoUrl('/frame/promotion/addOrderGuideDiscount/'+this.promotionId+'/'+this.promotionThemeType)
          break;
          case 'AC':
            this.gotoUrl('/frame/promotion/addOrderGuideAC/'+this.promotionId+'/'+this.promotionThemeType)
          break;
          case 'order':
            this.gotoUrl('/frame/promotion/addOrderGuide/'+this.promotionId+'/'+this.promotionThemeType)
          break;
          case 'new':
            this.gotoUrl('/frame/promotion/addOrderGuideNew/'+this.promotionId+'/'+this.promotionThemeType)
          break;          
        }
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.getGuide();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          txt = this.$dictionarie.promotionGuideType[row[column.property]]
        }
        else if(column.property =='status'){
          txt = row[column.property] == 1 ? '通过' : '待审批'
        }
        return txt;
      },
      commit(){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.copyGuide(false);
          } else {
            return false;
          }
        });
      },
      copyGuide(isCurrent){
        let thiz = this;
        this.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        let promotionId = this.promotionId;
        if(!isCurrent){
          promotionId = this.comForm.promotionId;
        }
        this.$tupHttp(this,'promotion/item/copy','POST',{itemIds : data, to : promotionId}).then(res=>{
          thiz.loading = false;
          thiz.comForm = {
            promotionId : '',
            title : ''
          }
          thiz.visible = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '复制成功'
          });
          thiz.getGuide();
        },res=>{
          thiz.loading = false;
        })
      },
      copyItem(index, row){      
        let thiz = this;
        this.loading = true;

        this.$tupHttp(this,'promotion/item/copy','POST',{itemIds : [row.id], to : this.promotionId}).then(res=>{
          thiz.getGuide();
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        })
      },
      unlock(index, row){      
        let thiz = this;
        this.loading = true;
        this.$confirm('此操作将强制解锁记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'promotion/item/unlock/'+row.id,'GET').then(res=>{
            thiz.loading = false;
            thiz.getGuide();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
      },
      viewItem(index, row) {
        let url = '/frame/promotion/viewOrderGuideKIT/';
        switch(row.type){
          case 0:
            url = '/frame/promotion/viewOrderGuideDiscount/';
          break;
          case 1:
            url = '/frame/promotion/viewOrderGuideAC/';
          break;
          case 3:
            url = '/frame/promotion/viewOrderGuide/';
          break;
        }
        this.gotoUrl(url + this.promotionId +'/'+row.id + '/' + this.promotionThemeType)
      },
      editItem(index, row) {
        let url = '/frame/promotion/editOrderGuideKIT/';
        switch(row.type){
          case 0:
            url = '/frame/promotion/editOrderGuideDiscount/';
          break;
          case 1:
            url = '/frame/promotion/editOrderGuideAC/';
          break;
          case 2:
            url = '/frame/promotion/editOrderGuideKIT/';
          break;
          case 3:
            url = '/frame/promotion/editOrderGuide/';
          break;
          case 4:
            url = '/frame/promotion/editOrderGuideNew/';
          break;
        }
        this.gotoUrl(url + this.promotionId +'/'+row.id + '/' + this.promotionThemeType)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      aduitGuide(){
        let thiz = this;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        thiz.loading = true;
        thiz.$tupHttp(thiz,'promotion/item/audit','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '审批成功'
          });
          thiz.getGuide();
        },res=>{
          thiz.loading = false;
        }) 
      },
      deleteGuide(){
        let thiz = this;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'promotion/item/deletes','POST',data).then(res=>{
            thiz.loading = false;
            thiz.getGuide();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      getGuide(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'promotion/items','POST',thiz.searchForm).then(res=>{
          thiz.guideData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total : 0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        }) 
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'promotion/info?id='+this.promotionId,'GET').then(res=>{
          let model = res.body.model;  
          thiz.$store.commit('common/setPormotion',model);
        }) 
      }
    },
    mounted(){
      this.getGuide()
      this.getInfo()
      this.$util.onKeyCode(this,'getGuide',[true])
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
.targetClients{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
