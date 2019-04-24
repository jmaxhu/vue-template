<template>
  <el-container style="min-height: 500px;" v-loading="loading">
    <el-aside width="200px" class="left-panel">
      <div class="title-panel">角色分组</div>
      <el-tree
        style="border-right: 1px solid #eee;"
        :expand-on-click-node="false"
        :props="defaultProps"
        :highlight-current="true"
        :default-expand-all="true"
        :data="roleGroups"
        @node-click="onNodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <el-tooltip :content="data.desc || data.name"><span>{{node.label}}</span></el-tooltip>
          </span>
          <span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button size="mini" type="text" @click.prevent.stop="onGroupAdd(data, node)">添加子分组</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="data.id > 0">
                  <el-button size="mini" type="text" @click.prevent.stop="onGroupEdit(data, node)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="data.id > 0">
                  <el-button size="mini" type="text" @click.prevent.stop="onGroupDelete(data, node)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-main style="padding: 10px;">
      <div class="filter-container">
        <el-input
          placeholder="搜索角色名称"
          v-model="query.searchName"
          @keyup.enter.native="onLoadData"
          class="filter-item"
          style="width: 150px;"
        ></el-input>
        <el-button type="info" v-waves @click="onLoadData" icon="el-icon-search" class="filter-item">搜索</el-button>
        <el-button type="primary" v-waves @click="onAdd" icon="el-icon-circle-plus-outline" class="filter-item">新增</el-button>
        <el-button v-waves icon="el-icon-back" class="filter-item" @click="$router.go(-1)">返回</el-button>
      </div>

      <el-table :data="roles" border fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <el-table-column align="center" label="分组" prop="groupName"></el-table-column>
        <el-table-column align="center" label="组织名称" prop="name"></el-table-column>
        <el-table-column align="center" label="组织描述" prop="desc"></el-table-column>
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

      <el-dialog :title="diagTitle" :visible.sync="diagShow" width="480px">
        <el-form ref="roleForm" :rules="rules" :model="currentRole" label-width="90px">
          <el-form-item label="角色名称" required prop="name">
            <el-input v-model="currentRole.name" placeholder="建议使用英文" style="width: 160px;"></el-input>
          </el-form-item>
          <el-form-item label="角色分组" required prop="roleGroupId">
            <select-tree :data="roleGroups" :treeProps="defaultProps" v-model="currentRole.roleGroupId"></select-tree>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="currentRole.desc" placeholder="角色描述信息"></el-input>
          </el-form-item>
          <el-form-item label="角色授权">
            <el-tree
              ref="permissionTree"
              style="max-height: 300px; overflow: auto;"
              node-key="key"
              :expand-on-click-node="false"
              :props="defaultProps"
              :show-checkbox="true"
              :check-on-click-node="true"
              :highlight-current="true"
              :default-expand-all="true"
              :data="permissionGroups"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="data.type !== 'permission'">
                  {{ node.label }}
                </span>
                <span v-else>
                  <i class="el-icon-setting" style="color: #409EFF;"></i>
                  <span style="color: #409EFF;" :title="data.desc || data.name">{{ node.label }} ({{ data.code }})</span>
                </span>
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diagShow = false">取消</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="groupDiagTitle" :visible="groupDiagShow" width="400px">
        <el-form ref="groupForm" :model="currentGroup" label-width="90px">
          <el-form-item label="上级分组" v-if="currentGroup.isNew">
            <div>{{ currentGroup.groupName }}</div>
          </el-form-item>
          <el-form-item label="分组名称" required prop="name" :rules="[{required: true, message: '分组名称必填'}]">
            <el-input v-model="currentGroup.name" placeholder="请输入分组名称" style="width: 160px;"></el-input>
          </el-form-item>
          <el-form-item label="分组描述">
            <el-input v-model="currentGroup.desc" placeholder="请输入分组名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="groupDiagShow = false">取消</el-button>
          <el-button type="primary" @click="onGroupSave">保存</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import accountTypes from '@/store/types/account'
import appTypes from '@/store/types/app'
import { Pager, SelectTree } from '@/components'

export default {
  name: 'RoleIndex',
  components: {
    Pager,
    SelectTree
  },
  data () {
    return {
      loading: false,
      diagShow: false,
      diagTitle: '新增组织',
      groupDiagShow: false,
      groupDiagTitle: '新增分组',
      query: {
        searchName: '',
        roleGroupId: '',
        pageIndex: 1,
        pageSize: 20
      },
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      total: 0,
      currentRole: {},
      currentGroup: {},
      roles: [],
      allRoles: [],
      roleGroups: [],
      permissionGroups: [],
      rules: {
        name: [
          { required: true, message: '角色名称必填' }
        ],
        roleGroupId: [
          { required: true, message: '角色分组必须设置' }
        ]
      }
    }
  },
  methods: {
    onLoadData () {
      this.loading = true
      this.$store.dispatch(
        accountTypes.GET_ROLES, { roleGroupId: this.query.roleGroupId, searchName: this.query.searchName })
        .then(data => {
          this.total = data.length
          this.allRoles = data
          this.roles = data.slice(0, this.query.pageSize)
          this.loading = false
        })
    },
    loadPermissionGroups () {
      this.$store.dispatch(accountTypes.GET_PERMISSIONGROUPS, { withPermission: true }).then(groups => {
        this.permissionGroups = groups
      })
    },
    loadRoleGroups () {
      this.$store.dispatch(accountTypes.GET_ROLEGROUPS, {}).then(groups => {
        this.roleGroups = groups
      })
    },
    onNodeClick (data) {
      this.query.roleGroupId = data.id
      this.onLoadData()
    },
    onCurrentChange (pageIndex) {
      this.query.pageIndex = pageIndex
      this.roles = this.allRoles.slice((this.query.pageIndex - 1) * this.query.pageSize, this.query.pageIndex * this.query.pageSize)
    },
    onSizeChange (pageSize) {
      this.query.pageIndex = 1
      this.query.pagesize = pageSize
      this.roles = this.allRoles.slice((this.query.pageIndex - 1) * this.query.pageSize, this.query.pageIndex * this.query.pageSize)
    },
    onAdd () {
      if (this.permissionGroups.length === 0) {
        this.loadPermissionGroups()
      }
      this.diagTitle = '新增角色'
      this.currentRole = { roleGroupId: this.query.roleGroupId }
      this.diagShow = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
        this.$refs.permissionTree.setCheckedKeys([])
      })
    },
    onEdit (row) {
      if (this.permissionGroups.length === 0) {
        this.loadPermissionGroups()
      }
      this.diagTitle = '编辑角色'
      this.currentRole = row
      this.diagShow = true
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(this.currentRole.permissionIds)
      })
    },
    onDelete (row) {
      this.$confirm(`确定要删除角色 '${row.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(accountTypes.DELETE_ROLE, { id: row.id }).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除角色成功.' })
          this.onLoadData()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onSave () {
      var permissionIds = this.$refs.permissionTree.getCheckedNodes(true)
        .filter(x => x.type === 'permission')
        .map(x => x.id)
      if (permissionIds.length === 0) {
        this.$notify.error({ title: '提示', message: '请选择角色相关的授权项。' })
        return
      }
      this.currentRole.permissionIds = permissionIds
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(accountTypes.SAVE_ROLE, this.currentRole).then(() => {
            this.loading = false
            this.diagShow = false
            this.$notify.success({ title: '成功', message: '保存角色成功.' })
            this.query.roleGroupId = this.currentRole.roleGroupId
            this.onLoadData()
          }).catch(() => { this.loading = false })
        }
      })
    },
    onGroupAdd (data) {
      this.groupDiagTitle = '新增分组'
      this.currentGroup = { isNew: true, parentId: 0, groupName: '无' }
      if (data) {
        this.currentGroup.parentId = data.id
        this.currentGroup.groupName = data.name
      }
      this.groupDiagShow = true
      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    onGroupEdit (data, node) {
      this.groupDiagTitle = '编辑分组'
      this.currentGroup = Object.assign({ isNew: false }, data)
      this.groupDiagShow = true
    },
    onGroupDelete (data, node) {
      this.$confirm(`确定要删除角色分组 '${data.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(accountTypes.DELETE_ROLEGROUP, { id: data.id }).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除角色分组成功.' })
          this.loadRoleGroups()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onGroupSave () {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(accountTypes.SAVE_ROLEGROUP, this.currentGroup).then(() => {
            this.loading = false
            this.groupDiagShow = false
            this.$notify.success({ title: '成功', message: '保存角色分组成功。' })
            this.loadRoleGroups()
          }).catch(() => { this.loading = false })
        }
      })
    }
  },
  created () {
    this.loadRoleGroups()
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
