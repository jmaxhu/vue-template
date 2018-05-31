<template>
<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
  <topbar></topbar>
  <sidebar class="sidebar-container"></sidebar>
  <div class="main-container">
    <navbar></navbar>
    <app-main></app-main>
  </div>
</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Topbar } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Topbar
  },
  computed: {
    sidebar () {
      return this.$store.getters.sidebar
    }
  }
}
</script>

<style lang='less' scoped>
.app-wrapper {
  .clearfix {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
  }
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
