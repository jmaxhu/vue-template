<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="搜索组织名称"
        v-model="query.searchName"
        @keyup.enter.native="onLoadData"
        class="filter-item"
        style="width: 150px;"
      ></el-input>
      <el-select clearable
        placeholder="选择父组织"
        v-model="query.parentId"
        @change="onLoadData"
        class="filter-item"
        style="width: 120px;"
      >
        <el-option v-for="org in rootOrgs" :key="org.id" :label="org.name" :value="org.id"></el-option>
      </el-select>
      <el-button type="primary" v-waves @click="onLoadData" icon="el-icon-search" class="filter-item">搜索</el-button>
      <el-button type="primary" v-waves @click="onAdd" icon="el-icon-circle-plus-outline" class="filter-item">新增</el-button>
    </div>

    <el-table :data="orgs" v-loading="loading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
      <el-table-column align="center" label="上级">
        <template slot-scope="scope">
          {{ scope.row.parentName || '[无]'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组织名称" prop="name"></el-table-column>
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
      <el-form ref="orgForm" :rules="rules" :model="currentOrg" label-width="90px">
        <el-form-item label="组织名称" required prop="name">
          <el-input v-model="currentOrg.name"></el-input>
        </el-form-item>
        <el-form-item label="上级组织">
          <el-select clearable v-model="currentOrg.parentId" placeholder="选择上级组织">
            <el-option label="无" :value="0"></el-option>
            <el-option v-for="org in rootOrgs" :key="org.id" :label="org.name" :value="org.id">
            </el-option>
          </el-select>
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
import orgTypes from '@/store/types/org'
import Pager from '@/components/Pager'

export default {
  name: 'OrgIndex',
  components: {
    Pager
  },
  data () {
    return {
      loading: false,
      diagShow: false,
      diagTitle: '新增组织',
      query: {
        searchName: '',
        parentId: '',
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      currentOrg: { parentId: 0 },
      orgs: [],
      rootOrgs: [],
      rules: {
        name: [
          { required: true, message: '组织名称必填' }
        ]
      }
    }
  },
  methods: {
    onLoadData () {
      this.loading = true
      this.$store.dispatch(orgTypes.GET_ORGS, this.query).then(data => {
        this.total = data.total
        this.orgs = data.results
        this.loading = false
      })
    },
    loadRootOrg () {
      this.$store.dispatch(orgTypes.GET_ROOT_ORGS).then(orgs => {
        this.rootOrgs = orgs
      })
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
      this.diagTitle = '新增组织'
      this.currentOrg = { parentId: 0 }
      this.diagShow = true
      this.$nextTick(() => {
        this.$refs['orgForm'].clearValidate()
      })
    },
    onEdit (row) {
      this.diagTitle = '编辑组织'
      this.currentOrg = row
      this.diagShow = true
    },
    onDelete (row) {
      this.$confirm(`确定要删除组织 '${row.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(orgTypes.DELETE_ORG, row.id).then(() => {
          this.loading = false
          this.$notify.success({title: '成功', message: '删除组织成功.'})
          this.onLoadData()
          this.loadRootOrg()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    },
    onSave () {
      this.$refs['orgForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(orgTypes.SAVE_ORG, this.currentOrg).then(() => {
            this.loading = false
            this.diagShow = false
            this.$notify.success({title: '成功', message: '保存组织成功.'})
            this.onLoadData()
            this.loadRootOrg()
          })
        }
      })
    }
  },
  created () {
    this.loadRootOrg()
    this.onLoadData()
  }
}
</script>
