<template>
   <v-select
          :items="items"
          v-model="e1"
          label="Select"
          bottom
        ></v-select>
</template>

<script>
export default {
  data () {
    return {
      e1: null,
      items: [
          { text: 'State 1' },
          { text: 'State 2' },
          { text: 'State 3' },
          { text: 'State 4' },
          { text: 'State 5' },
          { text: 'State 6' },
          { text: 'State 7' }
      ]
    }
  },

  mounted () {
  }
}
</script>
