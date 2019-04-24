<template>
  <el-dialog v-loading="loading" :title="title" :visible="showEdit" @open="onOpen" @close="onClose">
    <el-form ref="editForm" :rules="rules" :model="row" label-width="90px">
      <el-form-item label="所属角色" required>
        <el-col :span="10">
          <el-form-item prop="permissionGroupId">
            <select-tree :data="permissionGroups" :treeProps="{label: 'name', children: 'children'}" v-model="row.permissionGroupId"></select-tree>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="权限编码" required>
        <el-col :span="10">
          <el-form-item prop="code">
            <el-input v-model="row.code" placeholder="自定义的权限项编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="form-label required">权限名称</el-col>
        <el-col :span="10">
          <el-form-item prop="name">
            <el-input v-model="row.name" placeholder="自定义的权限项名称"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="row.desc" placeholder="可输入权限项的详细描述"></el-input>
      </el-form-item>
      <el-form-item label="额外信息">
        <el-input v-model="row.meta" placeholder="额外的自定义信息，格式自定义，建议使用 JSON 格式"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import accountTypes from '@/store/types/account'
import { SelectTree } from '@/components'

export default {
  props: {
    showEdit: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      required: true
    },
    permissionGroups: {
      type: Array,
      required: true
    }
  },
  components: {
    SelectTree
  },
  data () {
    return {
      loading: false,
      title: '新增权限',
      row: {},
      rules: {
        permissionGroupId: [
          { required: true, message: '请选择权限分组', trigger: 'change' }
        ],
        name: [
          { required: true, message: '权限名称必填', trigger: 'change' }
        ],
        code: [
          { required: true, message: '权限编码必填', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onOpen () {
      this.row = Object.assign({}, this.currentData)
      if (this.row.meta) {
        this.row.meta = this.row.meta.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '')
      }
      if (this.row.id && this.row.id > 0) {
        this.title = '编辑权限'
      } else {
        this.title = '新增权限'
      }
    },
    onClose () {
      this.$emit('close')
    },
    onSave () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if (this.row.meta) {
            this.row.meta = JSON.stringify(this.row.meta)
          }
          this.loading = true
          this.$store.dispatch(accountTypes.SAVE_PERMISSION, this.row).then(res => {
            this.loading = false
            this.$notify.success({ title: '成功', message: '保存权限成功.' })
            this.$emit('close', true)
          }).catch(() => { this.loading = false })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.center {
  text-align: center;
}
</style>
