<template>
<div class="menu-wrapper">
  <template v-if="!item.hidden && item.children">
    <template v-for="item in routes">
      <router-link v-if="item.children.filter(x => !x.hidden).length === 1 && !item.children[0].children && !item.alwaysShow"
        :to="`${item.path}/${item.children[0].path}`" :key="item.children[0].name">
        <el-menu-item :index="`${item.path}/${item.children[0].path}`" :class="{'submenu-title-noDropdown':!isNest}">
          <i :class="`fas ${item.children[0].meta.icon} svg-icon`"></i>
          <span v-if="item.children[0].meta && item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name || item.path" :key="item.name">
        <template slot="title">
          <i :class="`fas ${item.meta.icon} svg-icon`"></i>
          <span v-if="item.meta && item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-if="!child.hidden">
          <template v-for="child in item.children">
            <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
            <router-link v-else :to="`${item.path}/${child.path}`" :key="child.name">
              <el-menu-item :index="`${item.path}/${child.path}`">
                <i v-if="child.meta && child.meta.icon" :class="`fas ${child.meta.icon} svg-icon`"></i>
                <span v-if="child.meta && child.meta.title">{{child.meta.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </template>
      </el-submenu>
    </template>
  </template>
</div>
</template>

<script>

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
