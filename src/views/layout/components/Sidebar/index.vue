<template>
<scroll-bar>
  <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#f6f7fb">
    <sidebar-item :routes="permission_routers"></sidebar-item>
  </el-menu>
</scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollBar from '@/components/ScrollBar/index.vue'
import SidebarItem from './SidebarItem.vue'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
