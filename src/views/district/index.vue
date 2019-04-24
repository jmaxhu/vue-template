<template>
  <el-container style="min-height: 500px;" v-loading="loading">
    <el-aside width="300px" class="left-panel">
       <div class="title-panel">行政区划</div>
      <el-tree
        ref="districtTree"
        style="border-right: 1px solid #eee;"
        :props="defaultProps"
        lazy
        :load="onLoadData"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="onNodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{node.label}}</span>
          <span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button size="mini" type="text" @click.prevent.stop="onAdd(data, node)">添加下级</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-main>
      <el-form v-show="showForm" ref="districtForm" :rules="rules" :model="currentDistrict" label-width="110px">
        <el-form-item label="上级">
          <el-tag>{{currentDistrict.parentName}}</el-tag>
        </el-form-item>
        <el-form-item label="名称" required>
          <el-col :span="10">
            <el-form-item prop="name">
              <el-input v-model="currentDistrict.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label">简称</el-col>
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="currentDistrict.shortName" style="width: 120px"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="行政编码" required>
          <el-col :span="10">
            <el-form-item prop="code">
              <el-input v-model="currentDistrict.code" style="width: 160px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label required">区划类型</el-col>
          <el-col :span="10">
            <el-form-item prop="districtType">
              <el-select v-model="currentDistrict.districtType"
                placeholder="选择行政区划类型"
                >
                <el-option v-for="t in districtEnumTypes" :label="t.name" :value="t.value" :key="t.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="经度">
          <el-col :span="10">
            <el-form-item prop="longitude">
              <el-input-number v-model="currentDistrict.longitude" :min="100" :max="135"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="form-label">纬度</el-col>
          <el-col :span="4">
            <el-form-item prop="latitude">
              <el-input-number v-model="currentDistrict.latitude" :min="10" :max="55"></el-input-number>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="地区边界">
          <el-input v-model="currentDistrict.boundary"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="currentDistrict.address"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" :rows="4" v-model="currentDistrict.introduction"></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button type="primary" @click="onSave">保存</el-button>
          <el-button type="danger" @click="onDelete">删除</el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import districtTypes from '@/store/types/district'
import { DistrictType } from '@/utils/enums'

export default {
  name: 'DistrictIndex',
  data () {
    return {
      loading: false,
      districts: [],
      showForm: false,
      query: {
        parentId: 0
      },
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: x => !x.hasChild
      },
      currentDistrict: {},
      districtEnumTypes: DistrictType,
      rules: {
        code: [
          { required: true, message: '行政编码不能为空。' }
        ],
        name: [
          { required: true, message: '名称不能为空。' }
        ],
        districtType: [
          { required: true, message: '行政区划类型不能为空。' }
        ]
      }
    }
  },
  methods: {
    onLoadData (node, resolve) {
      let parentId = (node.data && node.data.id) || 0
      this.loading = true
      this.$store.dispatch(districtTypes.GET_DISTRICTS, { parentId }).then(data => {
        resolve(data)
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    doLoadTreeNodes (parentId) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch(districtTypes.GET_DISTRICTS, { parentId }).then(nodes => {
          resolve(nodes)
        }).catch(err => reject(err))
      })
    },
    loadNodes (node, resolve) {
      let parentId = node.level === 0 ? 0 : node.data.id
      this.doLoadTreeNodes(parentId).then(nodes => resolve(nodes))
    },
    /**
     * 重新加载整棵树（暂时使用的方法，最好是只加载有变动的节点）
     * TODO: 优化
     */
    reloadTreeData () {
      let tree = this.$refs.districtTree
      tree.store.setData([])
      this.loadNodes(tree.store.root, (nodes) => {
        tree.store.root.doCreateChildren(nodes)
      })
    },
    onNodeClick (item, _, nodeComp) {
      let parentName = '无'
      if (nodeComp.$parent.node && nodeComp.$parent.node.data) {
        parentName = nodeComp.$parent.node.data.name
      }
      this.$refs['districtForm'].resetFields()
      this.showForm = true
      item.parentName = parentName
      this.currentDistrict = Object.assign({}, item)
    },
    onAdd (data) {
      this.$refs['districtForm'].resetFields()
      this.currentDistrict = { parentName: data.name, parentId: data.id }
      this.showForm = true
    },
    onSave () {
      this.$refs['districtForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(districtTypes.SAVE_DISTRICT, this.currentDistrict).then(res => {
            this.loading = false
            this.$notify.success({ title: '成功', message: '保存行政区划成功.' })
            this.showForm = false
            this.reloadTreeData()
          }).catch(() => { this.loading = false })
        }
      })
    },
    onDelete () {
      this.$confirm(`确定要删除行政区划 '${this.currentDistrict.name}' 吗?`, '确认').then(() => {
        this.loading = true
        this.$store.dispatch(districtTypes.DELETE_DISTRICT, { id: this.currentDistrict.id }).then(() => {
          this.loading = false
          this.$notify.success({ title: '成功', message: '删除行政区划成功.' })
          this.reloadTreeData()
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    }
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
