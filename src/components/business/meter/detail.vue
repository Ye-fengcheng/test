<template >
  <div v-loading="loading" style="background-color: rgb(248, 248, 248);padding: 20px;margin:-20px -15px 0px -20px">    
    <el-form  :model="searchForm"  :inline="true" label-width="80px" >
      <el-form-item label="区域/省办">            
        <tup-arae-meter-select v-model="searchForm.provinceObject" :code="code" :codeType="codeType"></tup-arae-meter-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="resetData">恢复数据</el-button>
      </el-form-item>
    </el-form>
    <div class="demo-form-inline" style="padding-left:0px;padding-right:5px;">
      <el-row>
        <el-col :span="2">
          <br/><br/>
          <p class="title" style="text-align:center">员工情况</p>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="5">
            <el-col :span="6">
              <div style="weith:100%;background-color: #44c1f9;color:#fff;height:90px;padding-left:15px">
                <el-row>
                  <el-col :span="8">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" v-show="this.searchForm.type == 'province'">省办职能</p>
                    <p class="tableLeftText" v-show="this.searchForm.type != 'province'">区域职能</p>
                  </el-col>
                  <el-col :span="6">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">营销组长</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type == 'province'">PSD<br/>{{empInfo.marketingPsdReality}}</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type != 'province'"><span style="float:left">RSD<br/>{{empInfo.marketingRsdpsdReality}}</span><span style="float:right">RMS<br/>{{empInfo.marketingRmsReality}}</span></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">发展组长</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type == 'province'">PFD<br/>{{empInfo.developmentPfdReality}}</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type != 'province'">RFD<br/>{{empInfo.developmentRfdReality}}</p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">拓展组长</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type == 'province'">PCD<br/>{{empInfo.expansionPcdReality}}</p>
                    <p class="tableLeftText" style="line-height:15px;" v-show="this.searchForm.type != 'province'">RCD<br/>{{empInfo.expansionRcdReality}}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="weith:100%;background-color: #8dc447;color:#fff;height:90px;">
                <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">PM</p>
                  </el-col>
                  <el-col :span="20" style="margin-top:20px;">
                    <el-row>
                      <el-col :span="8">
                        <p class="tableLeftText">配置率:{{toPercent(empInfo.pmDistributionRate)}}</p>
                      </el-col>
                      <el-col :span="8">
                        <p class="tableLeftText">离职率:{{toPercent(empInfo.pmQuitRate)}}</p>
                      </el-col>
                      <el-col :span="8">
                        <p class="tableLeftText">离职人员:{{empInfo.pmQuitQuantity}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄:{{format(empInfo.pmWorkingYears)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄>3:{{format(empInfo.pmWorkingYearsQuantity1)}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄1-2:{{format(empInfo.pmWorkingYearsQuantity2)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄&lt;1:{{format(empInfo.pmWorkingYearsQuantity3)}}</p>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <!-- <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">PM</p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">配置率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.pmDistributionRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">岗龄</p>
                    <p class="tableLeftText">{{format(empInfo.pmWorkingYears)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.pmQuitRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职人员</p>
                    <p class="tableLeftText">{{empInfo.pmQuitQuantity}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                </el-row> -->
              </div>
            </el-col>
            <el-col :span="6">
              <div style="weith:100%;background-color: #0092b3;color:#fff;height:90px;">
                <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">DM</p>
                  </el-col>
                  <el-col :span="20" style="margin-top:20px;">
                    <el-row>
                      <el-col :span="8">
                        <p class="tableLeftText">配置率:{{toPercent(empInfo.dmDistributionRate)}}</p>
                      </el-col>
                      <el-col :span="8">
                        <p class="tableLeftText">离职率:{{toPercent(empInfo.dmQuitRate)}}</p>
                      </el-col>
                      <el-col :span="8">
                        <p class="tableLeftText">离职人员:{{empInfo.dmQuitQuantity}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">总数:{{format(empInfo.dmTotalCount)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄>3:{{format(empInfo.dmWorkingYearsQuantity1)}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄1-2:{{format(empInfo.dmWorkingYearsQuantity2)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄&lt;1:{{format(empInfo.dmWorkingYearsQuantity3)}}</p>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">DM</p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">总数</p>
                    <p class="tableLeftText">{{empInfo.dmTotalCount}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">配置率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.dmDistributionRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>              
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.dmQuitRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职人员</p>
                    <p class="tableLeftText">{{empInfo.dmQuitQuantity}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                </el-row> -->
              </div>
            </el-col>
            <el-col :span="6">
              <div style="weith:100%;background-color: #646466;color:#fff;height:90px;">
                <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">DFS</p>
                  </el-col>
                  <el-col :span="20" style="margin-top:20px;">
                    <el-row>
                      <el-col :span="8">
                        <p class="tableLeftText">配置率:{{toPercent(empInfo.dfsDistributionRate)}}</p>
                      </el-col>
                      <el-col :span="7">
                        <p class="tableLeftText" style="width:90px">离职率:{{toPercent(empInfo.dfsQuitRate)}}</p>
                      </el-col>
                      <el-col :span="9">
                        <p class="tableLeftText" style="width:120px">离职人员:{{empInfo.dfsQuitQuantity}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">总数:{{format(empInfo.dfsTotalCount)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄>3:{{format(empInfo.dfsWorkingYearsQuantity1)}}</p>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄1-2:{{format(empInfo.dfsWorkingYearsQuantity2)}}</p>
                      </el-col>
                      <el-col :span="12">
                        <p class="tableLeftText">岗龄&lt;1:{{format(empInfo.dfsWorkingYearsQuantity3)}}</p>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="4">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText" style="font-size:20px">DFS</p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">总数</p>
                    <p class="tableLeftText">{{empInfo.dfsTotalCount}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">配置率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.dfsDistributionRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>              
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职率</p>
                    <p class="tableLeftText">{{toPercent(empInfo.dfsQuitRate)}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                  <el-col :span="5">
                    <p class="tableLeftText">&nbsp;</p>
                    <p class="tableLeftText botBorder">离职人员</p>
                    <p class="tableLeftText">{{empInfo.dfsQuitQuantity}}</p>
                    <p class="tableLeftText"></p>
                  </el-col>
                </el-row> -->
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="demo-form-inline" style="min-width:1245px;padding-top:38px;">
      <div style="background-image:url(static/useJs/meter.png);height:625px;width:1212px;">
        <div class="newStore">
          <div style="margin-top:-38px;margin-left:-10px;width:90px;position: absolute;">
            <tupYMSelect v-model="newStoreYM" type="year" colorStyle="selectOrange"></tupYMSelect>
            <!-- <el-row :gutter="5">
              <el-col :span="10">
                <el-select size="mini" class="selectOrange" v-model="newStoreYear" filterable  clearable placeholder="年">
                  <el-option
                    v-for="item in years"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select size="mini" class="selectOrange" v-model="newStoreMonth" filterable  clearable placeholder="月">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row> -->
          </div>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <p class="newStoreText ">*QDB/DB数 </p>
                  <p class="newStoreText">{{qdb.qdbQuantity}}/{{qdb.shopDb}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="newStoreText ">*QDB/目标数</p>
                  <p class="newStoreText">{{qdb.qdbQuantity}}/{{qdb.qdbTargetQuantity}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="newStoreText">*净增QDB数</p>
                  <p class="newStoreText">{{qdb.qdbIncrease}}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="qdb1">
          <el-row :gutter="15">
            <el-col :span="24">
              <el-row :gutter="5">
                 <el-col :span="8">
                  <p class="newStoreText ">*OIO达标率:</p>
                  <p class="newStoreText">*店数/DB:</p>
                  <p class="newStoreText ">*单挂店:</p>
                  <p class="newStoreText">*占比:</p>
                </el-col>
                <el-col :span="4">
                  <p class="newStoreText ">{{toPercent(newStore.shopControlRates)}}</p>
                  <p class="newStoreText">{{format(newStore.shopQuantity)}}</p>
                  <p class="newStoreText ">{{format(newStore.shopSingle)}}</p>
                  <p class="newStoreText">{{toPercent(newStore.proportion)}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="newStoreText">*DB数:</p>
                  <p class="newStoreText ">CG数:</p>
                  <p class="newStoreText ">重点城市开店数:</p>
                  <p class="newStoreText"></p>
                </el-col>
                <el-col :span="4">
                  <p class="newStoreText">{{format(newStore.shopDb)}}</p>
                  <p class="newStoreText ">{{format(newStore.shopCg)}}</p>
                  <p class="newStoreText ">{{format(newStore.shopImportantCityQuantity)}} </p>                  
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="qdb2">
          <div style="margin-top:-36px;margin-left:-5px;width:80px;position: absolute;">
            <!-- <el-select size="mini" class="selectOrange"  v-model="qdb2Year" filterable  clearable placeholder="年">
               <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <tupYMSelect v-model="qdb2Year" type="year" colorStyle="selectOrange"></tupYMSelect>
          </div>
          <el-row :gutter="15">
            <el-col :span="24">
              <el-row :gutter="5">
                 <el-col :span="8">
                  <p class="newStoreText ">*首订金额(元):</p>
                  <p class="newStoreText">6月内平均月零售:</p>
                  <p class="newStoreText ">*一年内关店率:</p>                  
                </el-col>
                <el-col :span="3">
                  <p class="newStoreText ">{{format(newStore2.developmentFirstOrderAmount)}}</p>
                  <p class="newStoreText">{{format(newStore2.developmentAverageYield)}}</p>
                  <p class="newStoreText ">{{toPercent(newStore2.developmentCloseShopProportion)}} </p>
                </el-col>
                <el-col :span="2">
                  &nbsp;
                </el-col>
                <el-col :span="7">
                  <p class="newStoreText">*租金(60%位):</p>
                  <p class="newStoreText ">*面积:</p>
                  <p class="newStoreText">*店员底薪:</p>
                </el-col>
                <el-col :span="4">
                  <p class="newStoreText">{{format(newStore2.shopRent)}}</p>
                  <p class="newStoreText ">{{format(newStore2.shopAcreage)}} </p>
                  <p class="newStoreText">{{format(newStore2.shopClerkWages)}}</p>
                </el-col>
              </el-row>
            </el-col>
            <p class="newStoreText" style="margin-left:5px;">*店型 &nbsp;&nbsp; B1 :{{toPercent(newStore2.shopQuantityProportionB1)}} &nbsp;&nbsp; B2:{{toPercent(newStore2.shopQuantityProportionB2)}} &nbsp;&nbsp; B3:{{toPercent(newStore2.shopQuantityProportionB3)}} &nbsp;&nbsp; A:{{toPercent(newStore2.shopQuantityProportionA)}} </p>
          </el-row>
        </div>
        <div class="retail">
          <div style="margin-top:-40px;margin-left:-10px;width:80px;position: absolute;">
            <!-- <el-select size="mini" class="selectRed" v-model="retailYear" filterable  clearable placeholder="年">
               <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <tupYMSelect v-model="retailYear" type="year"></tupYMSelect>
          </div>
          <el-row :gutter="15">
            <el-col :span="12">
               <el-row>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">*月份</p>
                  <p class="tableLeftTextBO">1月</p>
                  <p class="tableLeftTextBO">2月</p>
                  <p class="tableLeftTextBO">3月</p>
                  <p class="tableLeftTextBO">Q1</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">订单</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateJan)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateFeb)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateMar)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateQ1)}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">零售</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateJan)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateFeb)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateMar)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateQ1)}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">*月份</p>
                  <p class="tableLeftTextBO">4月</p>
                  <p class="tableLeftTextBO">5月</p>
                  <p class="tableLeftTextBO">6月</p>
                  <p class="tableLeftTextBO">Q2</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">订单</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateApr)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateMay)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateJun)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateQ2)}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">零售</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateApr)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateMay)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateJun)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateQ2)}}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <br/>
          <el-row :gutter="15">
            <el-col :span="12">
               <el-row>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">*月份</p>
                  <p class="tableLeftTextBO">7月</p>
                  <p class="tableLeftTextBO">8月</p>
                  <p class="tableLeftTextBO">9月</p>
                  <p class="tableLeftTextBO">Q3</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">订单</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateJul)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateAug)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateSep)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateQ3)}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">零售</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateJul)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateAug)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateSep)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateQ3)}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">*月份</p>
                  <p class="tableLeftTextBO">10月</p>
                  <p class="tableLeftTextBO">11月</p>
                  <p class="tableLeftTextBO">12月</p>
                  <p class="tableLeftTextBO">Q4</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">订单</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateOct)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateNov)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateDec)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.orderGrowthRateQ4)}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="tableLeftTextBO gray">零售</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateOct)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateNov)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateDec)}}</p>
                  <p class="tableLeftTextBO">{{toPercent(retailInfo.retailSalesGrowthRateQ4)}}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="quarter">
          <div style="margin-top:-40px;margin-left:-8px;width:80px;position: absolute;">
            <tupYMSelect v-model="salesTargetYear" type="year"></tupYMSelect>
          </div>
          <el-row>
            <el-col :span="6">
              <p class="tableLeftTextB gray">*季度</p>
              <p class="tableLeftTextB">Q1</p>
              <p class="tableLeftTextB">Q2</p>
              <p class="tableLeftTextB">Q3</p>
              <p class="tableLeftTextB">Q4</p>
              <p class="tableLeftTextB">合计</p>
            </el-col>
            <el-col :span="6">
              <p class="tableLeftTextB gray">*完成率%</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.targetPercentageQ1)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.targetPercentageQ2)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.targetPercentageQ3)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.targetPercentageQ4)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.targetPercentage2018)}}</p>
            </el-col>
            <el-col :span="6">
              <p class="tableLeftTextB gray">差额(千元)</p>
              <p class="tableLeftTextB">{{format(salesTarget.targetBalanceQ1)}}</p>
              <p class="tableLeftTextB">{{format(salesTarget.targetBalanceQ2)}}</p>
              <p class="tableLeftTextB">{{format(salesTarget.targetBalanceQ3)}}</p>
              <p class="tableLeftTextB">{{format(salesTarget.targetBalanceQ4)}}</p>
              <p class="tableLeftTextB">{{format(salesTarget.targetBalance2018)}}</p>
            </el-col>
            <el-col :span="6">
              <p class="tableLeftTextB gray">达标率</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.quarterlyComplianceRate?salesTarget.quarterlyComplianceRate[0]:0)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.quarterlyComplianceRate?salesTarget.quarterlyComplianceRate[1]:0)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.quarterlyComplianceRate?salesTarget.quarterlyComplianceRate[2]:0)}}</p>
              <p class="tableLeftTextB">{{toPercent(salesTarget.quarterlyComplianceRate?salesTarget.quarterlyComplianceRate[3]:0)}}</p>
              <p class="tableLeftTextB"></p>
            </el-col>
          </el-row>
        </div>
        <div class="ito">
          <div style="margin-top:-44px;margin-left:232px;width:80px;position: absolute;">
            <!-- <el-select size="mini" class="selectRed" v-model="itoYear" filterable  clearable placeholder="年">
               <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <tupYMSelect v-model="itoYear" type="year"></tupYMSelect>
          </div>
          <p class="tableLeftTextB " style="text-align:left;margin-bottom:2px;">*ITO天数/不含陈列天数：{{format(ito.inventoryItoDays)}}/{{format(ito.inventoryNotIto)}}</p>
          <el-row>
            <el-col :span="6">
              <p class="tableLeftTextB gray" style="text-align:left;"></p>
              <p class="tableLeftTextB" style="text-align:left;">净水器</p>
              <p class="tableLeftTextB" style="text-align:left;">43件套</p>
              <p class="tableLeftTextB" style="text-align:left;">5.7升锅</p>
              <p class="tableLeftTextB" style="text-align:left;">三层炒锅</p>
            </el-col>
            <el-col :span="7">
              <p class="tableLeftTextB gray">*四大件进出比</p>
              <p class="tableLeftTextB">{{toPercent(ito.yearWaterPurifier1)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.yearSuit43)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.yearPan57)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.yearFryPan)}}</p>
            </el-col>
            <el-col :span="5">
              <p class="tableLeftTextB gray">普及率</p>
              <p class="tableLeftTextB">{{toPercent(ito.orderRateWaterPurifier)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.orderRateSuit43)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.orderRatePan57)}}</p>
              <p class="tableLeftTextB">{{toPercent(ito.orderRateFryPan)}}</p>
            </el-col>
            <el-col :span="6">
              <p class="tableLeftTextB gray">*店均进出比</p>
              <p class="tableLeftTextB">{{ito.shopOrderWaterPurifier}}/{{ito.shopSalesWaterPurifier}}</p>
              <p class="tableLeftTextB">{{ito.shopOrderSuit43}}/{{ito.shopSalesSuit43}}</p>
              <p class="tableLeftTextB">{{ito.shopOrderPan57}}/{{ito.shopSalesPan57}}</p>
              <p class="tableLeftTextB">{{ito.shopOrderFryPan}}/{{ito.shopSalesFryPan}}</p>
            </el-col>
          </el-row>
          
        </div>
        <div class="first">
          <div style="margin-top:-48px;margin-left:-10px;width:80px;position: absolute;">
            <!-- <el-select size="mini" class="selectRed" v-model="logisticsYear" filterable  clearable placeholder="年">
               <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <tupYMSelect v-model="logisticsYear" type="year"></tupYMSelect>
          </div>
          <el-row>
            <el-col :span="12">
              <p class="tableLeftTextB " style="text-align:left">首轮单迟发天数</p>
              <p class="tableLeftTextB " style="text-align:left">首轮单平均欠货率</p>
              <p class="tableLeftTextB " style="text-align:left">售后服务单占销售比</p>
              <p class="tableLeftTextB " style="text-align:left">售后服务津贴占销售比</p>
            </el-col>
            <el-col :span="6">
              <p class="tableLeftTextB">{{logistics.yearDelayDays}}</p>
              <p class="tableLeftTextB">{{toPercent(logistics.yearLackProductRate)}}</p>
              <p class="tableLeftTextB">{{toPercent(logistics.yearAfterSaleService)}}</p>
              <p class="tableLeftTextB">{{toPercent(logistics.yearAfterSaleServiceSubsidy)}}</p>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="avg">
          <el-row>
            <el-col :span="12">
              <p class="tableLeftTextB " style="text-align:left">店均进出比</p>
              <p class="redText " style="text-align:left">1.5 / 0.9</p>
            </el-col>
          </el-row>
        </div>
        <div class="universal">
          <el-row>
            <el-col :span="12">
              <p class="tableLeftTextB " style="text-align:left">普及率</p>
              <p class="redText " style="text-align:left">65%</p>
            </el-col>
          </el-row>
        </div> -->
        <div class="member">
          <div style="margin-top:-44px;margin-left:215px;width:100px;position: absolute;">
             <tupYMSelect v-model="fiveYM" type="both" colorStyle="selectBlue"></tupYMSelect>
            <!-- <el-row :gutter="5">
              <el-col :span="10">
                <el-select size="mini" class="selectBlue" v-model="memberYear" filterable  clearable placeholder="年">
                  <el-option
                    v-for="item in years"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select size="mini" class="selectBlue" v-model="memberMonth" filterable  clearable placeholder="月">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row> -->
          </div>
          <el-row>
            <el-col :span="12">
              <p class="menberText">总数：{{member.memberAmount ? format(member.memberAmount):'0' }} &nbsp;&nbsp;&nbsp;＊VIP数:{{member.memberVipQuantity ? format(member.memberVipQuantity):'0'}}  &nbsp;&nbsp;&nbsp;店均月招VIP：{{member.memberVipAverage ? format(member.memberVipAverage):'0'}} </p>
            </el-col>
          </el-row>
        </div>
        <div class="employer">
          <!-- <div style="z-index:1000;margin-top:0px;margin-left:188px;width:200px;position: absolute;">
            <el-row :gutter="5">
              <el-col :span="10">
                <el-select size="mini" v-model="salescleckYear" filterable  clearable placeholder="年">
                  <el-option
                    v-for="item in years"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select size="mini" v-model="salescleckMonth" filterable  clearable placeholder="月">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div> -->
          <el-row>
            <el-col :span="12">
              <p class="menberText">总数：{{salescleck.salesclerkAmount ? format(salescleck.salesclerkAmount) : '0' }}  &nbsp;&nbsp;&nbsp;*店平均:{{salescleck.salesclerkShopAverage ? format(salescleck.salesclerkShopAverage):'0' }}  &nbsp;&nbsp;&nbsp;月销售/店员（元）:{{salescleck.salesclerkSales ? format(salescleck.salesclerkSales):'0' }} </p>
            </el-col>
          </el-row>
        </div>
        <div class="promotion">
          <!-- <div style="margin-top:0px;margin-left:254px;width:80px;position: absolute;">
            <el-select size="mini" v-model="promotionYear" filterable  clearable placeholder="年">
               <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <el-row :gutter="15">
            <el-col :span="24">
              <el-row :gutter="5">
                 <el-col :span="7">
                  <p class="newStoreText ">*首轮％：</p>
                  <p class="newStoreText">*临时促销：</p>
                </el-col>
                <el-col :span="4">
                  <p class="newStoreText ">{{toPercent(promotion.firstOrderProportion)}}</p>
                  <p class="newStoreText">{{toPercent(promotion.temporary)}}</p>
                </el-col>
                <el-col :span="2">
                  &nbsp;
                </el-col>
                <el-col :span="7">
                  <p class="newStoreText">*区域促销:</p>
                  <p class="newStoreText ">*团购:</p>
                </el-col>
                <el-col :span="4">
                  <p class="newStoreText">{{toPercent(promotion.area,1)}}</p>
                  <p class="newStoreText ">{{toPercent(promotion.groupBuying,1)}}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="product">
          <el-row>
            <el-col :span="7">
              <p class="tableLeftTextP gray" style="text-align:left;font-size:10px">TOP5</p>
            </el-col>
            <el-col :span="3">
              <p class="tableLeftTextP gray" style="text-align:left;font-size:10px">占比</p>
            </el-col>
            <el-col :span="5" class="gray">
              <p class="tableLeftTextP gray" style="text-align:left;font-size:10px;width: 70px;">区域预测(k)</p>
            </el-col>
            <el-col :span="5" class="gray">
              <p class="tableLeftTextP gray" style="text-align:left;font-size:10px;width:70px;">实际订购(k)</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextP gray" style="text-align:left;font-size:10px">去年同期</p>
            </el-col>
          </el-row>
          <el-row v-for="item in products" :key="item.topNo">
            <el-col :span="7">
              <p class="tableLeftTextP " style="text-align:left">{{(item.topProduct).length > 6 ? (item.topProduct).substring(0,6)+'..' : (item.topProduct).substring(0,6)}}</p>
            </el-col>
            <el-col :span="3">
              <p class="tableLeftTextP " style="text-align:left">{{toPercent(item.salesProportion)}}</p>
            </el-col>
            <el-col :span="5">
              <p class="tableLeftTextP " style="text-align:left">{{format(item.forecastOrder/1000,1)}}</p>
            </el-col>
            <el-col :span="5">
              <p class="tableLeftTextP " style="text-align:left">{{format(item.realityOrder/1000,1)}}</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextP " style="text-align:left">{{toPercent(item.yearLastSalesProportion)}}</p>
            </el-col>
          </el-row>
        </div>
        <div class="platform">
          <el-row>
            <el-col :span="5">
              <p class="tableLeftTextB gray" style="text-align:left;font-size:10px">类别</p>
              <p class="tableLeftTextB " style="text-align:left">销售占比</p>
              <p class="tableLeftTextB " style="text-align:left">与去年对比</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextB gray" style=";font-size:10px">TUP</p>
              <p class="tableLeftTextB">{{toPercent(platform.pTup)}}</p>
              <p class="tableLeftTextB">{{toPercent(platform.yearGrowthTup)}}</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextB gray" style=";font-size:10px">净水器</p>
              <p class="tableLeftTextB">{{toPercent(platform.pWaterPurifier)}}</p>
              <p class="tableLeftTextB">{{toPercent(platform.yearGrowthWaterPurifier)}}</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextB gray" style=";font-size:10px">理家课堂</p>
              <p class="tableLeftTextB">{{toPercent(platform.pClass)}}</p>
              <p class="tableLeftTextB">{{toPercent(platform.yearGrowthClass)}}</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextB gray" style=";font-size:10px">私人订制</p>
              <p class="tableLeftTextB">{{toPercent(platform.pCustomize)}}</p>
              <p class="tableLeftTextB">{{toPercent(platform.yearGrowthCustomize)}}</p>
            </el-col>
            <el-col :span="3">
              <p class="tableLeftTextB gray" style=";font-size:10px">会员</p>
              <p class="tableLeftTextB">{{toPercent(platform.pMember)}}</p>
              <p class="tableLeftTextB">{{toPercent(platform.yearGrowthMember)}}</p>
            </el-col>
          </el-row>
          
        </div>
        <div class="averageYield">
          <p class="blueB">{{saleBase.yieldAverage ? format((saleBase.yieldAverage/1000),1):''}}</p>
          <p class="blueB" style="text-align:left;font-size:13px;width:100px;height:8px;margin-left:25px;margin-top:-10px;">比2017：{{saleBase.yieldYear2017 ? format((saleBase.yieldYear2017/1000),1):''}}</p>
          <p class="blueB" style="text-align:left;font-size:13px;width:110px;height:8px;margin-left:25px;">比2017%：{{toPercent(saleBase.yieldYearRate2017)}}</p>
        </div>
        <div class="averageYieldTable">
          <el-row>
            <el-col :span="7">
              <p class="tableLeftTextC "></p>
              <p class="tableLeftTextC " style="text-align:left;color:#036eb7">店铺占比</p>
              <p class="tableLeftTextC " style="text-align:left;color:#036eb7">销售占比</p>
            </el-col>
            <el-col :span="4" style="margin-right:10px;">
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">>6万</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldShopQuantityProportion3)}}</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldSellProportion3)}}</p>
            </el-col>
            <el-col :span="5" style="margin-right:10px;">
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">4-6万</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldShopQuantityProportion2)}}</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldSellProportion2)}}</p>
            </el-col>
            <el-col :span="4">
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">&lt;4万</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldShopQuantityProportion1)}}</p>
              <p class="tableLeftTextC" style="text-align:left;color:#036eb7">{{toPercent(saleBase.yieldSellProportion1)}}</p>
            </el-col>
          </el-row>
        </div>
        <div class="allTotal">
          <p class="orangeB">{{format(saleBase.quantityExclusiveShop)}}/{{format(saleBase.quantityExclusiveShop-saleBase.quantityUndeterminedShop)}}</p>
        </div>
        <div class="allTotalTable">
          <el-row>
            <el-col :span="7">
              <p class="tableLeftTextB " style="text-align:left;color:#f6880c;font-size:12px;">新开</p>
              <p class="tableLeftTextB " style="text-align:left;color:#f6880c;font-size:12px;">{{format(saleBase.quantityNewShop)}}</p>
            </el-col>
            <el-col :span="7" style="margin-right:10px;">
              <p class="tableLeftTextB" style="text-align:left;color:#f6880c;font-size:12px;">关店</p>
              <p class="tableLeftTextB" style="text-align:left;color:#f6880c;font-size:12px;">{{format(saleBase.quantityCloseShop)}}</p>
            </el-col>
            <el-col :span="7" style="margin-right:10px;">
              <p class="tableLeftTextB" style="text-align:left;color:#f6880c;font-size:12px;">待定</p>
              <p class="tableLeftTextB" style="text-align:left;color:#f6880c;font-size:12px;">{{format(saleBase.quantityUndeterminedShop)}}</p>
            </el-col>
          </el-row>
        </div>
        <div class="all">
          <p class="redB" style="width:200px">{{saleBase.baseAmount ? format(saleBase.baseAmount/1000000):''}}</p>
          <br/>
          <p class="redB" style="font-size:14px;width:250px;height:8px;margin-left:-30px;">比后3个月最高月订单目标:{{toPercent(saleBase.baseQuarterTarget)}}</p>
          <p class="redB" style="font-size:14px;width:250px;height:8px;margin-left:-30px;">比后6个月最高月订单目标:{{toPercent(saleBase.baseAfterSixMonthTarget)}}</p>
          <p class="redB" style="font-size:14px;width:200px;height:8px;">比去年同期:{{toPercent(saleBase.baseLastYear)}}</p>
        </div>
      </div>
    </div>

    <div class="demo-form-inline-bottom">
      <el-row >
        <el-col :span="3">
          <br/><br/><br/><br/><br/>
          <p class="textBottom">业务概览</p>
          <!-- <p class="textBottomEn">Operating Dashboard</p> -->
        </el-col>
        <el-col :span="21">
          <el-table
            :data="datas"
            style="width: 100%">
            <el-table-column
              prop="project"
              align="center"
              label="项目">
            </el-table-column>
            <el-table-column
              prop="ls"
              align="center"
              label="零售(千元)">
            </el-table-column>
            <el-table-column
              prop="jz"
              align="center"
              label="净值(千元)">
            </el-table-column>
            <el-table-column
              prop="oio"
              align="center"
              label="OIO">
            </el-table-column>
            <el-table-column
              prop="db"
              align="center"
              label="DB数">
            </el-table-column>
            <el-table-column
              prop="vip"
              align="center"
              label="VIP会员数">
            </el-table-column>
            <el-table-column
              prop="emp"
              align="center"
              label="员工数">
            </el-table-column>
            <el-table-column
              prop="mll"
              align="center"
              label="毛利率">
            </el-table-column>
            <el-table-column
              prop="dis"
              align="center"
              label="综合折扣">
            </el-table-column>
            <el-table-column
              prop="unit"
              align="center"
              label="单位费用贡献净额">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentYear:'',
        currentMonth: '',
        currentLongMonth:'',
        code:'',
        codeType:'',
        datas:[
        ],
        searchForm:{
          provinceObject:[],
          province:'',
          type:''
        },
        years:[],
        months:[
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          },
          {
            value: '3',
            label: '3'
          },
          {
            value: '4',
            label: '4'
          },
          {
            value: '5',
            label: '5'
          },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          },
          {
            value: '8',
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          }
        ],
        empInfo:{},//员工情况数据
        businessOverview:{},//业务概览
        retailInfo:{},//订单零售数据
        retailYear:'',
        salesTarget:{},//年度销售目标
        salesTargetYear:'',
        logistics:{},//物流
        logisticsYear:'',
        ito:{},
        itoYear:'',
        type:1,//会员，平台，店员，产品，促销查询类型 1是年，2是年月
        fiveYM:'',//会员，平台，店员，产品，促销的年月
        member:{},//会员
        memberYear:'',
        memberMonth:'',
        salescleck:{},//店员
        promotion:{},//促销
        products:[],//top5产品
        platform:{},//平台
        newStore:{},//新店成长
        newStore2:{},//新店成长2
        qdb:{},//QDB成长
        newStoreYM:'',
        newStoreYear:'',
        newStoreMonth:'',
        qdb2Year:'',
        saleBase:{},//销售基本盘
        saleBaseYear:'',
        loading:false
      }
    },
    watch:{
      fiveYM:function(val){
        val = val.toString();
        if(val.length == 4){
          this.memberYear = val;
          this.memberMonth = this.memberMonth+1;
          this.type =1;//年查询
        }
        if(val.length == 6){
          this.memberYear = val.substring(0,4);
          if(val.substring(4,5) == '0'){
            this.memberMonth = val.substring(5,6);
          }
          else{
            this.memberMonth = val.substring(4,6);
          }            
          this.type =2;//年月查询
        }
      },
      newStoreYM:function(val){
        val = val.toString();
        if(val.length == 4){
          this.newStoreYear = val
        }
        if(val.length == 6){
          this.newStoreYear = val.substring(0,4);
          this.newStoreMonth = val.substring(5,6);
        }
      },
      currentMonth:function(val){
        this.memberMonth = val;
      },
      currentYear:function(val){
        this.saleBaseYear = val;
        this.qdb2Year = val;
        this.memberYear = val;
        this.itoYear = val;
        this.logisticsYear = val;
        this.salesTargetYear = val;
        this.retailYear = val;
      },
      "searchForm.provinceObject":function(val){
        let thiz = this;
        let data = '';
        val.map(item=>{
          data = item.code;
          if(item.codeType){
            thiz.searchForm.type = item.codeType;
          }
          else{
            if(item.code=='00'){
              thiz.searchForm.type = 'country';
            }
            else if(item.pCitparentno){
              thiz.searchForm.type = 'province';
            }
            else{
              thiz.searchForm.type = 'region';
            }
          }
        })
        this.searchForm.province = data;
        this.resetData();
        this.loadData();
      },
      retailYear:function(val){
        this.getGrowthRate();
      },
      salesTargetYear:function(val){
        this.getSalesTarget();
      },
      logisticsYear:function(val){
        this.getLogistics();
      },
      itoYear:function(val){
        this.getInventory();
      },
      memberMonth:function(val){
        this.getMember();
        this.getSalesclerk();
        this.getPromotions();
        this.getProductList();
        this.getPlatform();
      },
      newStoreYear:function(val){
        this.getShopGrown();
        this.getQDBGrown();
      },
      qdb2Year:function(){
        this.getShopGrown2();
      }
    },
    methods: {
      format(num,len){
        let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
        let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g
        if(num){
          let txt = ''
          if(num < 0){
            txt = '-'+Math.abs(num).toFixed(len?len:0).toString().replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ',')) 
          }
          else{
            txt = num.toFixed(len?len:0).toString().replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ',')) 
          }
          return txt
        }
        else{
          return (0).toFixed(len?len:0)
        }
      },  
      toPercent(num,len){
        if(len)
        {
          len = len
        }
        else{
          len = 0
        }
        let reg = /^[0-9]+.?[0-9]*$/;
        if(!reg.test(Math.abs(num)) || num ==null)
          return '-';
        return (num*100).toFixed(len)+'%'
      },
      toPercentP(num,len){
        if(len)
        {
          len = len
        }
        else{
          len = 0
        }
        let reg = /^[0-9]+.?[0-9]*$/;
        if(!reg.test(Math.abs(num)) || num ==null)
          return '-';
        return (num*100).toFixed(len)+'PP'
      },
      resetData(){
        let thiz = this;
        let currentYear = this.currentYear;
        let currentMonth = this.currentMonth;
        this.retailYear = currentYear;
        this.salesTargetYear = currentYear;
        this.logisticsYear = currentYear;
        this.itoYear = currentYear;
        this.fiveYM = currentYear;
        this.newStoreYM = this.currentYear;
        this.qdb2Year = currentYear;
        this.loading = true;
        setTimeout(function(){
          thiz.loading = false;
        },1500);
      },
      initData(){
        this.years =[];
        let currentYear = (new Date()).getFullYear();
        for(let i=currentYear;i>=parseInt(currentYear-3);i--){
          this.years.push({
            value:i,
            lable:i
          })
        }
        if(!!this.$storage.getValue('provinceNo')){
          this.code = this.$storage.getValue('provinceNo');
          this.codeType = 'province';
          this.searchForm.type = 'province';
          this.searchForm.provinceObject = [{code:this.code,codeType:'province',name:this.$storage.getValue('province')}]
        }
        else{
          if(!!this.$storage.getValue('regionNo')){
            this.codeType = 'region';
            this.searchForm.type = 'region';
            this.code = this.$storage.getValue('regionNo');
            this.searchForm.provinceObject = [{code:this.code,codeType:'region',name:this.$storage.getValue('region')}]
          }
          else{
            this.codeType = 'country';
            this.searchForm.type = 'country';
            this.code = '00';
            this.searchForm.provinceObject = [{code:this.code,name:'全国',codeType:'country'}]
          }
        }
      },
      loadData(){
        this.getEmpInfo();
        this.getBusinessOverview();
        this.getGrowthRate();
        this.getSalesTarget();
        this.getLogistics();
        this.getInventory();
        this.getMember();
        this.getSalesclerk();
        this.getPromotions();
        this.getProductList();
        this.getPlatform();
        this.getShopGrown();
        this.getShopGrown2();
        this.getQDBGrown();
        this.getSaleBase();
      },
      //员工情况
      getEmpInfo(){
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getEmpInfo?areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.empInfo = !!res.body.model ? res.body.model:{};
        })
      },
      //订单零售
      getGrowthRate(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getGrowthRate?year='+this.retailYear+'&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.retailInfo = !!res.body.model ? res.body.model :{};
        })
      },
      //年度销售目标
      getSalesTarget(){
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getSalesTarget?year='+this.salesTargetYear+'&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.salesTarget = !!res.body.model ? res.body.model :{};
        })
      },
      //物流库存 POST /backend/dashBoard/getLogistics
      getLogistics(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getLogistics?year='+this.logisticsYear+'&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.logistics = !!res.body.model ? res.body.model :{};
        })
      },
      //ITO POST /backend/dashBoard/getInventory
      getInventory(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getInventory?year='+this.itoYear+'&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.ito = !!res.body.model ? res.body.model :{};
        })
      },
      //会员 POST /backend/dashBoard/getMember
      getMember(){
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        debugger
        thiz.$tupHttp(thiz,'dashBoard/getMember?year='+this.memberYear+'&month='+this.memberMonth+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type='+this.type,'POST').then(res=>{
          thiz.member = !!res.body.model ? res.body.model :{};
        })
      },
      //店员 POST /backend/dashBoard/getSalesclerk
      getSalesclerk(){
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getSalesclerk?year='+this.memberYear+'&month='+this.memberMonth+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type='+this.type,'POST').then(res=>{
          thiz.salescleck = !!res.body.model ? res.body.model :{};
        })
      },
      //订单零售POST /backend/dashBoard/getPromotions
      getPromotions(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getPromotions?year='+this.memberYear+'&month='+this.memberMonth+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type='+this.type,'POST').then(res=>{
          thiz.promotion = !!res.body.model ? res.body.model :{};
        })
      },
      //产品POST /backend/dashBoard/getProductList
      getProductList(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getProductList?year='+this.memberYear+'&month='+this.memberMonth+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type='+this.type,'POST').then(res=>{
          thiz.products = !!res.body.models ? res.body.models :[];
        })
      },
      //平台POST /backend/dashBoard/getPlatform
      getPlatform(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          areaCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getPlatform?year='+this.memberYear+'&month='+this.memberMonth+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type='+this.type,'POST').then(res=>{
          thiz.platform = !!res.body.model ? res.body.model :{};
        })
      },
      //新店成长 POST /backend/dashBoard/getShopGrown
      getShopGrown(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getShopGrown?year='+this.newStoreYear+'&month=&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type=1','POST').then(res=>{
          thiz.newStore = !!res.body.model ? res.body.model :{};
        })
      },
      //新店成长2 POST /backend/dashBoard/getShopGrown
      getShopGrown2(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getShopGrown?year='+this.qdb2Year+'&areaCode='+areaCode+'&provinceCode='+provinceCode+'&type=1','POST').then(res=>{
          thiz.newStore2 = !!res.body.model ? res.body.model :{};
        })
      },
      //QDB POST /backend/dashBoard/getQDBGrown
      getQDBGrown(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getQDBGrown?year='+this.newStoreYear+'&month=&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.qdb = !!res.body.model ? res.body.model :{};
        })
      },
      //QDB POST /backend/dashBoard/getSaleBase
      getSaleBase(){        
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getSaleBase?year='+this.saleBaseYear+'&areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.saleBase = !!res.body.model ? res.body.model :{};
        })
      },
      //业务概览
      getBusinessOverview(){
        let thiz = this;
        let areaCode = '',
            provinceCode = '';
        if(this.searchForm.type == 'region'){
          areaCode = this.searchForm.province;
        }
        else if(this.searchForm.type == 'province'){
          provinceCode = this.searchForm.province;
        }
        thiz.$tupHttp(thiz,'dashBoard/getBusinessOverview?areaCode='+areaCode+'&provinceCode='+provinceCode,'POST').then(res=>{
          thiz.businessOverview = res.body.model;
          thiz.datas = [
            {
              project:'实际',  
              ls:this.format(thiz.businessOverview.retailSalesReality),
              jz:this.format(thiz.businessOverview.netAmountReality),
              oio:this.format(thiz.businessOverview.openShopReality),
              db:this.format(thiz.businessOverview.distributorReality),
              vip:this.format(thiz.businessOverview.vipMemberReality),
              emp:this.format(thiz.businessOverview.employeeReality),
              mll:'-',
              dis:this.toPercent(thiz.businessOverview.comprehensiveReality,1),
              unit: thiz.businessOverview.unitReality ? (thiz.businessOverview.unitReality).toFixed(1):''
            },
            {
              project:'比计划', 
              ls:thiz.toPercent(thiz.businessOverview.retailSalesComparePlan), 
              jz:thiz.toPercent(thiz.businessOverview.netAmountComparePlan),
              oio:thiz.toPercent(thiz.businessOverview.openShopComparePlan),
              db:thiz.businessOverview.distributorComparePlan,
              vip:thiz.toPercent(thiz.businessOverview.vipMemberComparePlan),
              emp:thiz.toPercent(thiz.businessOverview.employeeComparePlan),
              mll:thiz.toPercentP(thiz.businessOverview.grossMarginComparePlan),
              dis:'-',
              unit:'-'
            },
            {
              project:'比去年',  
              ls:thiz.toPercent(thiz.businessOverview.retailSalesCompareLastYear),
              jz:thiz.toPercent(thiz.businessOverview.netAmountCompareLastYear),
              oio:thiz.format(thiz.businessOverview.openShopCompareLastYear),
              db:thiz.businessOverview.distributorCompareLastYear,
              vip:thiz.toPercent(thiz.businessOverview.vipMemberCompareLastYear),
              emp:thiz.toPercent(thiz.businessOverview.employeeCompareYear),
              mll:thiz.toPercentP(thiz.businessOverview.grossMarginCompareLastYear),
              dis:thiz.toPercentP(thiz.businessOverview.comprehensiveCompareLastYear),
              unit:thiz.toPercent(thiz.businessOverview.unitCompareLastYear)
            },
            {
              project:'比去年%',  
              ls:'-',
              jz:'-',
              oio:thiz.toPercent(thiz.businessOverview.openShopCompareLastYearRate),
              db:'-',
              vip:'-',
              emp:'-',
              mll:'-',
              dis:'-',
              unit:'-'
            }
          ]
        })
      },
      //获取最新的年月POST /backend/
      getYM(){
        let thiz = this;
        thiz.$tupHttp(thiz,'dashBoard/getDashBoardYearMonth','POST').then(res=>{
          thiz.currentYear = parseInt(res.body.extra.year);
          let mon = res.body.extra.month;
          thiz.currentLongMonth = res.body.extra.month;
          thiz.currentMonth = parseInt(mon.substring(0,1) == '0' ? mon.substring(1,2) : mon);
          thiz.newStoreYM = res.body.extra.year
          this.fiveYM = res.body.extra.year
        })
      }
    },
    mounted(){
      this.initData()
      this.getYM()
    }
  }
</script>
<style scoped>

.left{
  text-align: left
}
.quarter{
  position:absolute;
  margin-left: 380px;
  margin-top: 8px;
  width: 295px;
  height: 150px;
}
.retail{
  position:absolute;
  margin-left: 10px;
  margin-top: 70px;
  width: 330px;
  height: 150px;
}
.first{
  position:absolute;
  margin-left: 778px;
  margin-top: 20px;
  width: 250px;
  height: 60px;
}
.ito{
  position:absolute;
  margin-left: 842px;
  margin-top: 138px;
  width: 295px;
  height: 100px;
}
.avg{
  position:absolute;
  margin-left: 1010px;
  margin-top: 240px;
  width: 180px;
  height: 50px;
}
.universal{
  position:absolute;
  margin-left: 1130px;
  margin-top: 240px;
  width: 180px;
  height: 50px;
}
.member{
  position:absolute;
  margin-left: 895px;
  margin-top: 315px;
  width: 580px;
}
.newStore{
  position:absolute;
  margin-left: 10px;
  margin-top: 368px;
  width: 580px;
}
.qdb1{
  position:absolute;
  margin-left: 10px;
  margin-top: 430px;
  width: 280px;
}
.qdb2{
  position:absolute;
  margin-left: 5px;
  margin-top: 548px;
  width: 305px;
}
.employer{
  position:absolute;
  margin-left: 895px;
  margin-top: 425px;
  width: 680px;
}
.promotion{
  position:absolute;
  margin-left: 895px;
  margin-top: 572px;
  width: 300px;
}
.product{
  position:absolute;
  margin-left: 895px;
  margin-top: 462px;
  width: 305px;
}
.platform{
  position:absolute;
  margin-left: 895px;
  margin-top: 350px;
  width: 305px;
}
.averageYield{
  position:absolute;
  margin-left: 630px;
  margin-top: 500px;
  width: 180px;
}
.averageYieldTable{
  position:absolute;
  margin-left: 625px;
  margin-top: 580px;
  width: 185px;
}
.allTotal{
  position:absolute;
  margin-left: 372px;
  margin-top: 505px;
  width: 180px;
}
.allTotalTable{
  position:absolute;
  margin-left: 390px;
  margin-top: 588px;
  width: 180px;
}
.all{
  position:absolute;
  margin-left: 480px;
  margin-top: 325px;
  width: 220px;
}
.redText{
	height: 17px;
	font-family: ArialMT;
	font-size: 24px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 28px;
	letter-spacing: -1px;
	color: #ea0e6f;
}
.blueB{
  width: 170px;
  text-align: center;
  margin-top: 10px;
	height: 23px;
	font-family: HiraginoSansGB-W6;
	font-size: 23px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #036eb7;
}
.redB{
  text-align: center;
  width: 91px;
	height: 23px;
	font-family: HiraginoSansGB-W6;
	font-size: 50px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #e90d6e;
}
.orangeB{
  text-align: center;
  margin-top: 15px;
  width: 170px;
	height: 23px;
	font-family: HiraginoSansGB-W6;
	font-size: 23px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #f6880c;
}
.botBorder{
  border-bottom: 1px solid #ccc;
}
.tableLeftText{
  margin-right: 4px;
	height: 13px;
	font-family: HiraginoSansGB-W3;
	font-size: 10px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #ffffff;
}
.tableLeftTextP{
  text-align: center;
	height: 4px;
	font-family: ArialMT;
	font-size: 11px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #333;
}
.tableLeftTextB{
  text-align: center;
	height: 8px;
	font-family: ArialMT;
	font-size: 11px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #333;
}
.tableLeftTextC{
  text-align: center;
	height: 6px;
	font-family: ArialMT;
	font-size: 11px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #333;
}
.tableLeftTextBO{
  text-align: center;
	height: 4px;
	font-family: ArialMT;
	font-size: 11px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #333;
}
.menberText{
  text-align: left;
	height: 4px;
  width: 580px;
	font-size: 11px;
	font-weight: bold;
	color: #333;
}
.newStoreText{
  text-align: left;
	height: 8px;
	font-size: 11px;
	font-weight: bold;
	color: #333;
}
.demo-form-inline{
  margin-bottom: 20px;
  padding-top:20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 4px;
  background-color: #fff;
}
.demo-form-inline-bottom{
  margin-bottom: 20px;
  padding-top:0px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 4px;
  background-color: #fff;
}
.textBottom{
  text-align: center;
	height: 15px;
	font-family: HiraginoSansGB-W6;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #00647a;
}
.textBottomEn{
  width: 106px;
	height: 10px;
	font-family: HiraginoSansGB-W3;
	font-size: 10px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #00647a;
}
.title{
	height: 15px;
	font-family: HiraginoSansGB-W6;
	font-size: 16px;
  font-weight: bold;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #666666;
}
.operating-dashboard {
	width: 106px;
	height: 10px;
	font-family: HiraginoSansGB-W3;
	font-size: 10px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #cccccc;
}
.gray{
  background-color: #eee;
  height: 20px;
  line-height: 20px;
}
</style>


