<template>
  <div>
  <!-- list -->
    <data-table></data-table>
  </div>
</template>
<script>
import DataTable from '@/components/data-table'
export default {
  name: 'user',
  components: {
    DataTable
  },
  data () {
      return {
          list: []
      }
  }
}
</script>