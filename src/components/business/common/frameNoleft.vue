<template>
  <div class="epmsFrame">
    <div style="text-align:center">
      <h2><img src="../../../assets/Logo.gif">&nbsp;特百惠专卖店周报上报</h2>
    </div>
    <div>
      <div style="padding: 20px 15px 0px 20px;overflow: hidden;margin-bottom:10px;">
        <router-view ref="main"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      uniqueOpened: true,
      defaultOpeneds: []
    };
  },
  watch: {
    "$store.state.common.isCollapse": function(val) {
      this.responseLayout(val);
    }
  },
  mounted() {
    this.responseLayout(this.$store.state.isCollapse);
    let thiz = this;
  },
  methods: {
    responseLayout(val) {
    },
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
.leftMenu {
  min-height: 100%;
  height: 600px;
}

.leftMenu ul {
  min-height: 100%;
}
</style>