<template>
  <div class="menu-container">
    <el-menu
      :default-active="active"
      mode="horizontal"
      class="top-menu"
      >
      <el-menu-item index="info">
        <router-link to="/info/index">基本信息</router-link>
      </el-menu-item>
    </el-menu>
    <img class="menu-logo" src="@/assets/logo.png" />
  </div>
</template>

<script>
export default {
  computed: {
    active () {
      return this.$route.name
    }
  }
}
</script>

<style lang="less" scoped>
.menu-container {
  position: relative;
  margin-top: 60px;
  .top-menu {
    display: block;
    .el-menu-item {
      font-weight: bold;
      >a {
        line-height: 50px;
        display: block;
      }
    }
  }
  .menu-logo{
    position: absolute;
    right: 10px;
    top: 6px;
    width: 40px;
  }
  .el-menu--horizontal {
    border-bottom: 1px solid #bdd7f5;
    >.el-menu-item {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
