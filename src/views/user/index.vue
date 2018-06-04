<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="搜索用户姓名"
        v-model="query.searchName"
        @keyup.enter.native="onLoadData"
        class="filter-item"
        style="width: 150px;"
      ></el-input>
      <select-tree
        class="filter-item"
        placeholder="请选择组织"
        :data="orgTree"
        value-key="id"
        v-model="query.organizationId"
      >
      </select-tree>
      <el-select clearable
        placeholder="搜索角色"
        v-model="query.role"
        @change="onLoadData"
        class="filter-item"
        style="width:120px;"
      >
        <el-option label="系统管理员" value="admin"></el-option>
        <el-option label="数据操作员" value="operator"></el-option>
        <el-option label="数据观察员" value="watcher"></el-option>
      </el-select>
      <el-select clearable
        placeholder="用户状态"
        v-model="query.valid"
        @change="onLoadData"
        class="filter-item"
        style="width: 100px;"
      >
        <el-option label="启用" :value="true"></el-option>
        <el-option label="禁用" :value="false"></el-option>
      </el-select>
      <el-button type="info" v-waves @click="onLoadData" icon="el-icon-search" class="filter-item">搜索</el-button>
      <el-button type="primary" v-waves @click="onAdd" icon="el-icon-circle-plus-outline" class="filter-item">新增</el-button>
    </div>

    <el-table :data="users" v-loading="loading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
      <el-table-column align="center" label="用户名" prop="userName" width="120"></el-table-column>
      <el-table-column align="center" label="姓名" prop="displayName" width="100"></el-table-column>
      <el-table-column label="组织" prop="org">
        <template slot-scope="scope">
          {{ scope.row.org && scope.row.org.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdDate" width="120" align="center">
         <template slot-scope="scope">
          {{ scope.row.createdDate | parseJsonDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="最近登录" prop="lastLoginAttempt" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastLoginAttempt | parseJsonDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="useStatus" width="70">
        <template slot-scope="scope">
          {{ scope.row.useStatus === 'Valid' ? '启用' : '禁用' }}
        </template>
      </el-table-column>
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

    <el-dialog :title="diagTitle" :visible.sync="diagShow">
      <el-form ref="userForm" :rules="rules" :model="currentUser" label-width="90px">
        <el-form-item label="用户名" required>
          <el-col :span="10">
            <el-form-item prop="userName">
              <el-input v-model="currentUser.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label required">姓名</el-col>
          <el-col :span="10">
            <el-form-item prop="displayName">
              <el-input v-model="currentUser.displayName"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="组织">
          <el-col :span="10">
            <el-form-item>
              <select-tree
                placeholder="请选择组织"
                :data="orgTree"
                value-key="id"
                v-model="currentUser.organizationId"
              >
              </select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label required">角色</el-col>
          <el-col :span="10">
            <el-form-item prop="role">
              <el-select v-model="currentUser.role" placeholder="选择角色">
                <el-option v-for="role in allRoles" :key="role.value" :label="role.name" :value="role.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-col :span="10">
            <el-form-item>
              <el-radio-group v-model="currentUser.useStatus">
                <el-radio label="Valid">启用</el-radio>
                <el-radio label="Invalid">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="note">注：新增用户时默认密码为：123456 </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diagShow = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import orgTypes from '@/store/types/org'
import userTypes from '@/store/types/user'
import { Pager, SelectTree } from '@/components'
import { Roles } from '@/utils/enums'

export default {
  name: 'UserIndex',
  components: {
    Pager,
    SelectTree
  },
  data () {
    return {
      loading: false,
      diagShow: false,
      diagTitle: '新增用户',
      allRoles: Roles,
      query: {
        searchName: '',
        organizationId: '',
        role: '',
        valid: true,
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      currentUser: this.getDefaultUser(),
      users: [],
      rules: {
        userName: [
          { required: true, message: '用户必填' }
        ],
        displayName: [
          { required: true, message: '姓名必填' }
        ],
        role: [
          { required: true, message: '角色必填' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'orgTree'
    ])
  },
  methods: {
    getDefaultUser () {
      return { useStatus: 1, dataCatalogIds: [], password: '123456', organizationId: '' }
    },
    onLoadData () {
      this.loading = true
      this.$store.dispatch(userTypes.GET_USERS, this.query).then(data => {
        this.total = data.total
        this.users = data.results
        this.loading = false
      })
    },
    loadOrgTree () {
      this.$store.dispatch(orgTypes.GET_ORG_TREE)
    },
    onCurrentChange (pageIndex) {
      this.query.pageIndex = pageIndex
      this.doLoadData()
    },
    onSizeChange (pageSize) {
      this.query.pageIndex = 1
      this.query.pagesize = pageSize
      this.doLoadData()
    },
    onAdd () {
      this.diagTitle = '新增用户'
      this.currentUser = this.getDefaultUser()
      this.diagShow = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    onEdit (row) {
      this.diagTitle = '编辑用户'
      let user = Object.assign({}, row)
      user.organizationId = (row.org && row.org.id) || ''
      user.dataCatalogIds = row.dataCatalogs && row.dataCatalogs.map(x => x.id)
      this.currentUser = user
      this.diagShow = true
    },
    onDelete (row) {
      this.$confirm(`确定要删除用户 '${row.displayName}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(userTypes.DELETE_USER, row.id).then(() => {
          this.loading = false
          this.$notify.success({title: '成功', message: '删除用户成功.'})
          this.onLoadData()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onSave () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(userTypes.SAVE_USER, this.currentUser).then(() => {
            this.loading = false
            this.diagShow = false
            this.$notify.success({title: '成功', message: '保存用户成功.'})
            this.onLoadData()
          })
        }
      })
    }
  },
  created () {
    this.loadOrgTree()
    this.onLoadData()
  }
}
</script>

<style lang="less" scoped>
.note {
  color: #aaa;
  margin-left: 30px;
}
</style>
