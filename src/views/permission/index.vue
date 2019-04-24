<template>
  <el-container style="min-height: 500px;" v-loading="loading">
    <el-aside width="200px" class="left-panel">
       <div class="title-panel">权限分组</div>
      <el-tree
        style="border-right: 1px solid #eee;"
        :data="permissionGroups"
        :expand-on-click-node="false"
        :props="defaultProps"
        :default-expand-all="true"
        :highlight-current="true"
        @node-click="onNodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <el-tooltip :content="data.desc || data.name"><span class="menu-label">{{node.label}}</span></el-tooltip>
          </span>
          <span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{comm:'add',data:data,node:node}">添加子分组</el-dropdown-item>
                <el-dropdown-item v-if="data.id > 0" :command="{comm:'edit',data:data,node:node}">编辑</el-dropdown-item >
                <el-dropdown-item v-if="data.id > 0" :command="{comm:'del',data:data,node:node}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-main>
      <div class="filter-container">
        <el-input
          placeholder="搜索权限名称"
          v-model="query.searchName"
          @keyup.enter.native="onLoadData"
          class="filter-item"
          style="width: 150px;"
        ></el-input>
        <el-button type="info" v-waves @click="onLoadData" icon="el-icon-search" class="filter-item">搜索</el-button>
        <el-button type="primary" v-waves icon="el-icon-circle-plus-outline" @click="onAdd" class="filter-item">新增权限</el-button>
      </div>

      <el-table :data="permissions" border fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <el-table-column align="center" label="分组名称" prop="permissionGroupName"></el-table-column>
        <el-table-column align="center" label="权限编码" prop="code"></el-table-column>
        <el-table-column align="center" label="权限名称" prop="name"></el-table-column>
        <el-table-column align="center" label="权限描述" prop="desc"></el-table-column>
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pager
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
        :pageIndex="query.pageIndex"
        :pageSize="query.pageSize"
        :total="total"
      ></pager>

      <el-dialog :title="diagTitle" :visible.sync="diagShow" width="380px">
        <el-form ref="groupForm" :rules="rules" :model="currentGroup" label-width="90px">
          <el-form-item label="分组名称" required prop="name">
            <el-input v-model="currentGroup.name" placeholder="输入权限分组名称" style="width: 160px;"></el-input>
          </el-form-item>
          <el-form-item label="上级分组">
            <select-tree
              v-model="currentGroup.parentId"
              placeholder="默认为顶层分组"
              :treeProps="defaultProps"
              :data="permissionGroups"
              ></select-tree>
          </el-form-item>
          <el-form-item label="分组描述" prop="desc">
            <el-input v-model="currentGroup.desc" placeholder="输入权限分组描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diagShow = false">取消</el-button>
          <el-button type="primary" @click="onGroupSave">保存</el-button>
        </div>
      </el-dialog>

      <edit-form :showEdit="showEdit" :current-data="currentPermission" :permissionGroups="permissionGroups" @close="onEditClose"></edit-form>
    </el-main>
  </el-container>
</template>

<script>
import accountTypes from '@/store/types/account'
import appTypes from '@/store/types/app'
import { Pager, SelectTree } from '@/components'
import EditForm from './edit.vue'

export default {
  name: 'PermissionIndex',
  components: {
    Pager,
    SelectTree,
    EditForm
  },
  data () {
    return {
      loading: false,
      showEdit: false,
      diagShow: false,
      diagTitle: '新增分组',
      query: {
        searchName: '',
        permissionGroupId: 0,
        pageIndex: 1,
        pageSize: 20
      },
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      total: 0,
      currentGroup: {},
      currentPermission: {},
      permissions: [],
      permissionGroups: [],
      rules: {
        name: [
          { required: true, message: '权限分组名称必填' }
        ]
      }
    }
  },
  methods: {
    onLoadData () {
      this.loading = true
      this.$store.dispatch(accountTypes.GET_PERMISSIONS, this.query).then(data => {
        this.total = data.total
        this.permissions = data.results
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    handleCommand (command) {
      if (command.comm === 'add') {
        this.onGroupAdd(command.data)
      }
      if (command.comm === 'edit') {
        this.onGroupEdit(command.data, command.node)
      }
      if (command.comm === 'del') {
        this.onGroupDelete(command.data, command.node)
      }
    },
    loadPermissionGroups () {
      this.$store.dispatch(accountTypes.GET_PERMISSIONGROUPS, {}).then(groups => {
        this.permissionGroups = groups
      })
    },
    onCurrentChange (pageIndex) {
      this.query.pageIndex = pageIndex
      this.onLoadData()
    },
    onSizeChange (pageSize) {
      this.query.pageIndex = 1
      this.query.pagesize = pageSize
      this.onLoadData()
    },
    onAdd () {
      this.currentPermission = { permissionGroupId: this.query.permissionGroupId }
      this.showEdit = true
    },
    onEdit (row) {
      this.currentPermission = row
      this.showEdit = true
    },
    onDelete (row) {
      this.$confirm(`确定要删除授权项 '${row.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(accountTypes.DELETE_PERMISSION, { id: row.id }).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除授权项成功.' })
          this.onLoadData()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onEditClose (reload = false) {
      this.showEdit = false
      reload && this.onLoadData()
    },
    onGroupAdd (data) {
      this.diagTitle = '新增分组'
      this.currentGroup = { isNew: true, parentId: 0, groupName: '无' }
      if (data) {
        this.currentGroup.parentId = data.id
        this.currentGroup.groupName = data.name
      }
      this.diagShow = true
      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    onGroupEdit (data) {
      this.diagTitle = '编辑分组'
      this.currentGroup = Object.assign({ isNew: false }, data)
      this.diagShow = true
    },
    onGroupDelete (data) {
      this.$confirm(`确定要删除权限分组 '${data.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(accountTypes.DELETE_PERMISSIONGROUP, { id: data.id }).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除权限分组成功.' })
          this.loadPermissionGroups()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onGroupSave () {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(accountTypes.SAVE_PERMISSIONGROUP, this.currentGroup).then(() => {
            this.loading = false
            this.diagShow = false
            this.$notify.success({ title: '成功', message: '保存权限分组成功.' })
            this.loadPermissionGroups()
          })
        }
      })
    },
    onNodeClick (item) {
      this.query.permissionGroupId = item.id
      this.onLoadData()
    }
  },
  created () {
    this.loadPermissionGroups()
    this.onLoadData()
  },
  mounted () {
    this.$store.dispatch(appTypes.SET_BREADCRUMB, {
      type: 'app',
      route: {
        path: '/app/index',
        meta: { title: '应用管理' }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.left-panel {
  background-color: #eef1f6;
}
.menu-label{
  width:100px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
}
.title-panel {
  line-height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #ddd;
  text-align: center;
  padding: 5px;
}

.custom-tree-node {
  z-index: 999;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
