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
      <el-select clearable
        placeholder="用户状态"
        v-model="query.valid"
        @change="onLoadData"
        class="filter-item"
        style="width: 110px;"
      >
        <el-option label="启用" :value="true"></el-option>
        <el-option label="禁用" :value="false"></el-option>
      </el-select>
      <el-button type="info" v-waves @click="onLoadData" icon="el-icon-search" class="filter-item">搜索</el-button>
      <el-button type="primary" v-waves @click="onAdd" icon="el-icon-circle-plus-outline" class="filter-item">新增</el-button>
    </div>

    <el-table :data="users" v-loading="loading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
      <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
      <el-table-column align="center" label="姓名" prop="displayName"></el-table-column>
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
      <el-table-column align="center" label="状态" prop="validStatus" width="70">
        <template slot-scope="{row}">
          {{ row.validStatus === 'Valid' ? '启用' : '禁用' }}
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
              <el-input v-model="currentUser.userName" :readonly="currentUser.id > 0" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label required">姓名</el-col>
          <el-col :span="10">
            <el-form-item prop="displayName">
              <el-input v-model="currentUser.displayName"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-col :span="10">
            <el-form-item>
              <el-input type="password" :disabled="currentUser.id > 0" v-model="currentUser.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <div class="note">注：新增用户时默认密码为：123456 </div>
          </el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-col :span="10">
            <el-form-item>
              <el-radio-group v-model="currentUser.validStatus">
                <el-radio label="Valid">启用</el-radio>
                <el-radio label="Invalid">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label">角色</el-col>
          <el-col :span="10">
            <el-form-item>
              <select-tree
                v-model="currentUser.roleIds"
                :data="roles"
                :treeProps="{label: 'name', children: 'children'}"
                :multiple="true"
              >
              </select-tree>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diagShow = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userTypes from '@/store/types/user'
import accountTypes from '@/store/types/account'
import { Pager, SelectTree } from '@/components'

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
      query: {
        searchName: '',
        validStatus: '',
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      appGroup: {},
      activeTab: '',
      currentUser: {},
      users: [],
      roles: [],
      rules: {
        userName: [
          { required: true, message: '用户名必填' },
          { min: 4, message: '用户名不能小于4个字符' }
        ],
        displayName: [
          { required: true, message: '姓名必填' }
        ]
      }
    }
  },
  methods: {
    getDefaultUser () {
      return {
        id: 0,
        validStatus: 'Valid',
        password: '123456'
      }
    },
    getClientUser () {
      let arr = {}
      this.appClients.forEach(app => {
        arr[`c_${app.id}`] = {
          checked: false,
          name: app.name,
          displayName: '',
          validStatus: 'Valid',
          userName: '',
          password: ''
        }
      })
      return arr
    },
    loadRoles () {
      this.$store.dispatch(accountTypes.GET_ROLEGROUPS, { withRoles: true }).then(roles => {
        this.roles = roles
      })
    },
    onLoadData () {
      this.loading = true
      this.$store.dispatch(userTypes.GET_USERS, this.query).then(data => {
        this.total = data.total
        this.users = data.results
        this.loading = false
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
      this.currentUser = user
      this.diagShow = true
    },
    onDelete (row) {
      this.$confirm(`确定要删除用户 '${row.displayName}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(userTypes.DELETE_USER, row.id).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除用户成功.' })
          this.onLoadData()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onSave () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          let user = Object.assign({}, this.currentUser)
          this.$store.dispatch(userTypes.SAVE_USER, user).then(() => {
            this.loading = false
            this.diagShow = false
            this.$notify.success({ title: '成功', message: '保存用户成功.' })
            this.onLoadData()
          })
        }
      })
    }
  },
  created () {
    this.currentUser = this.getDefaultUser()
  },
  mounted () {
    this.onLoadData()
    this.loadRoles()
  }
}
</script>

<style lang="less" scoped>
.note {
  color: #aaa;
  margin-left: 50px;
}
</style>
