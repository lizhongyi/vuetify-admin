<template>
  <my-form></my-form>
</template>
<script>
const getDefaultData = () => {
  return {
    item: {}
  }
}
export default {
  data: getDefaultData,
  name: 'curdForm',
  created () {
    // this.initialize()
  },
  methods: {
    close () {
      alert(1)
      this.$emit('close')
    }
  }
}
</script>