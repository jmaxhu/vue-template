<template>
<el-breadcrumb class="app-breadcrumb" separator="/">
  <transition-group name="breadcrumb">
    <template v-if='item.meta && item.meta.title'>
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </template>
  </transition-group>
</el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'
import appTypes from '@/store/types/app'

export default {
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.$store.dispatch(appTypes.CLEAR_BREADCRUMB)
      this.getBreadcrumb()
    },
    otherBreadcrumb () {
      this.getBreadcrumb()
    }
  },
  computed: {
    ...mapGetters([
      'otherBreadcrumb'
    ])
  },
  methods: {
    getBreadcrumb () {
      let routers = []
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        routers.push({ path: '/dashboard/index', meta: { title: '首页' } })
      }
      if (this.otherBreadcrumb) {
        routers.push(this.otherBreadcrumb)
      }
      routers.push(matched[0])
      this.levelList = routers
    }
  }
}
</script>

<style lang="less" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
