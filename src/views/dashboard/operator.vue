<template>
  <div class="title">{{ title }}</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'title'
    ])
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  font-size: 28px;
  margin-top: 80px;
}
</style>
