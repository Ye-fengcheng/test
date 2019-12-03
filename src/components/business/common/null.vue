<template>   
  <div>
    <keep-alive :include="arr">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script> 
export default {
  data() {
    return {
      arr : ['keepAlive-product-onSale' , 'keepAlive-promotion-index' , 'keepAlive-promotion-promotionGuide',
      'keepAlive-order-orderManage','keepAlive-order-orderForCs',
      'keepAlive-order-orderForFinance','keepAlive-order-returnOrderAndGoods',
      'keepAlive-order-customerServiceApply','keepAlive-order-customerServiceApproveB',
      'keepAlive-order-customerServiceApproveC','keepAlive-order-customerServiceApproveL',
      'keepAlive-order-backendOrder-specialOrderList','keepAlive-order-backendOrder-sfProductOrderList',
      'keepAlive-order-backendOrder-sjProductOrderList','keepAlive-order-backendOrder-sbProductOrderList',
      'keepAlive-order-backendOrder-ssProductOrderList','keepAlive-order-backendOrder-srProductOrderList',
      'keepAlive-order-backendOrder-tzpOrderList','keepAlive-order-backendOrder-tzmOrderList',
      'keepAlive-order-backendOrder-orderForCs','keepAlive-terminal-customer',
      'keepAlive-terminal-customerDB','keepAlive-account-underLine','keepAlive-terminal-customerChangeInfo'
      ,'keepAlive-customerApprove-customerOpeningApprove', 'keepAlive-course-courseManage', 'keepAlive-course-columnManage',
      'keepAlive-customerApprove-allCustomerOpeningApprove','keepAlive-customerApprove-allCustomerCloseApprove',
      'keepAlive-customerApprove-allCustomerOpenApprove','keepAlive-purchare-boxingList','keepAlive-purchare-pickingList']
    };
  }
}
</script>