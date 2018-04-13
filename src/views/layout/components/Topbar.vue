<template>
  <div class="topbar">
    <div class="title">{{ title }}</div>
    <div class="right-menu">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <i class="fas fa-user-circle user-avatar"></i>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull/index.vue'
import userTypes from '@/store/types/user'

export default {
  components: {
    Screenfull
  },
  computed: {
    ...mapGetters([
      'title'
    ])
  },
  methods: {
    logout () {
      this.$store.dispatch(userTypes.LOGOUT).then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../styles/variables.less');

.topbar {
  background: linear-gradient(to right, @menuBg, @menuBg + #222);
  height: 50px;
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
  z-index: 999;
}

.title {
  display: inline-block;
  color: @textColor;
  font-size: 1.5em;
  line-height: 50px;
  margin-left: 10px;
  font-weight: bold;
}

.right-menu {
  float: right;
  height: 100%;
  &:focus{
    outline: none;
  }
  .right-menu-item {
    display: inline-block;
    margin: 0 8px;
  }
  .screenfull {
    height: 20px;
  }
  .international{
    vertical-align: top;
  }
  .theme-switch {
    vertical-align: 15px;
  }
  .avatar-container {
    height: 50px;
    margin-right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      margin-top: 8px;
      .user-avatar {
        width: 30px;
        height: 30px;
        vertical-align: -5px;
        color: @textColor;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -18px;
        top: 20px;
        font-size: 12px;
        color: @textColor;
      }
    }
  }
}
</style>
