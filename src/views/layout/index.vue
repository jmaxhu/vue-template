<template>
<div class="app-wrapper">
  <topbar></topbar>
  <top-menu></top-menu>
  <div class="main-container-home">
    <app-main></app-main>
  </div>
  <footer-bar></footer-bar>
</div>
</template>

<script>
import { AppMain, Topbar, TopMenu, FooterBar } from './components'

export default {
  name: 'layout',
  components: {
    AppMain,
    Topbar,
    TopMenu,
    FooterBar
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
