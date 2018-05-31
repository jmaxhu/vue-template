<template>
  <el-tag :type="type" :size="size">
    <slot></slot>
  </el-tag>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    type () {
      return this.status === 'Valid' ? '' : this.status === 'Invalid' ? 'danger' : 'info'
    }
  }
}
</script>
