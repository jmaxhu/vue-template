<template>
  <el-dropdown :style="{width}" trigger="click" placement="bottom-start">
    <el-input
      :value="text"
      :placeholder="placeholder"
      :readonly="true"
      :clearable="true"
      :suffix-icon="iconClass"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
    ></el-input>
    <el-dropdown-menu slot="dropdown">
      <el-tree
        ref="tree"
        :style="{width}"
        :data="data"
        :node-key="valueKey"
        :show-checkbox="multiple"
        :props="treeProps"
        :default-expand-all="expandAll"
        :expand-on-click-node="false"
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="checkedKeys"
        @node-click="onNodeClick"
        @check="onCheck"
      ></el-tree>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    treeProps: {
      type: Object,
      default: function () { return { label: 'label', children: 'children' } }
    },
    /**
     * 是否只有点击叶子节点才有效
     */
    onlyLeaf: {
      type: Boolean,
      default: true
    },
    /**
     * 树节点是否全部展开
     */
    expandAll: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    /**
     * 是否允许多选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 控件宽度
     */
    width: {
      type: String,
      default: '180px'
    },
    /**
     * 绑定的值
     */
    value: [String, Number, Boolean, Array],
    /**
     * 代表某个节点的key
     */
    valueKey: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      iconClass: 'el-icon-arrow-down',
      text: '',
      checkedKeys: this.getKeys()
    }
  },
  computed: {
    labelKey () {
      return this.treeProps['label']
    }
  },
  watch: {
    value (newValue) {
      this.setCheckedKeys(this.getKeys(newValue))
    },
    checkedKeys (newKeys) {
      this.setCheckedKeys(newKeys)
    }
  },
  methods: {
    getKeys (value) {
      value = value || this.value
      if (value === null || typeof (value) === 'undefined') return []

      return Array.isArray(value) ? value : [value]
    },
    setCheckedKeys (keys) {
      this.$nextTick(() => {
        if (this.multiple) {
          this.$refs.tree.setCheckedKeys(keys)
          this.$nextTick(() => {
            let checkedNodes = this.$refs.tree.getCheckedNodes(true)
            this.text = checkedNodes.map(x => x[this.treeProps['label']]).join(',')
          })
        } else {
          let node = this.$refs.tree.getNode(this.value)
          if (node) {
            this.text = node.data[this.treeProps['label']]
          }
        }
      })
    },
    onNodeClick (item, node) {
      // 多选时，节点选择事件忽略
      if (this.multiple) return
      if (this.onlyLeaf && !node.isLeaf) return

      this.text = item[this.treeProps['label']]
      this.$emit('input', item[this.valueKey])
    },
    onCheck (item, checkState) {
      let nodes = checkState.checkedNodes.filter(x => !x.children)
      this.text = nodes.map(x => x[this.treeProps['label']]).join(',')
      this.$emit('input', nodes.map(x => x[this.valueKey]))
    },
    onFocus () {
      this.iconClass = 'el-icon-arrow-up'
    },
    onBlur () {
      this.iconClass = 'el-icon-arrow-down'
    },
    onClear () {
      this.text = ''
      this.$refs.tree.setCheckedNodes([])
      this.$emit('input', '')
    }
  },
  mounted () {
    this.checkedKeys = this.getKeys()
    this.setCheckedKeys(this.checkedKeys)
  }
}
</script>
