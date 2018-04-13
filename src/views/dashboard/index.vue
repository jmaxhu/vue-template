<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin.vue'
import operatorDashboard from './operator.vue'

export default {
  name: 'dashboard',
  components: { adminDashboard, operatorDashboard },
  data () {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created () {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'operatorDashboard'
    }
  }
}
</script>
