<template>
  <div class="tags" v-if="showTags">
    <ul style="padding-left:0px">
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
        <router-link :to="item.path"  :title="item.title" class="tags-li-title">
          {{item.title}}
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tagsList: []
    }
  },
  methods: {
    isActive (path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTags (index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        this.$router.push('/frame/welcome')
      }
    },
    // 关闭全部标签
    closeAll () {
      this.tagsList = []
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther () {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
      this.tagsList = curItem
    },
    // 设置标签
    setTags (route) {
      const isExist = this.tagsList.some((item, index) => {
        return item.path === route.fullPath // 路由路径相同的
      })
      if(!isExist && route.fullPath != '/frame/welcome'){
        if(this.tagsList.length == 10){
          this.tagsList.splice(0,1)
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.name
        })
      }
      /* const bus = new Vue()*/
      this.$emit('tags', this.tagsList) 
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  computed: {
    showTags () {
      return this.tagsList.length > 0
    }
  },
  watch: {
    $route (newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  mounted () {
    this.setTags(this.$route)
  }
}
</script>


<style>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  font-size: 12px;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  height: 30px;
  line-height: 25px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all .3s ease-in;
  -moz-transition: all .3s ease-in;
  transition: all .3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #ff7000;
  border-radius: 3px;
  border-bottom: none;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #ff7000;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
  z-index: 10;
}
</style>
