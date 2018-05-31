<template>
  <div class="footer-container">
    <p>版本所有 © {{(new Date).getFullYear()}} 浙江水利水电勘测设计院</p>
  </div>
</template>

<style lang="less" scoped>
.footer-container {
  text-align: center;
  color: #404b5a;
  background-color: #0b131e;
  width: 100%;
  height: 55px;
  position: relative;
  z-index: 1;
  p {
    line-height: 50px;
  }
}
</style>
