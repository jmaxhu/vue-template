<template>
  <div class="pagination-container">
    <el-pagination
      background
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10,20,30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onSizeChange (pageSize) {
      this.$emit('size-change', pageSize)
    },
    onCurrentChange (pageIndex) {
      this.$emit('current-change', pageIndex)
    }
  }
}
</script>
