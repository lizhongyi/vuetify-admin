<template>
  <div>
    <v-snackbar
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      :multi-line="snackbar.mode === 'multi-line'"
      :vertical="snackbar.mode === 'vertical'"
      :top="snackbar.y === 'top'"
      :bottom="snackbar.y === 'bottom'"
      :right="snackbar.x === 'right'"
      :left="snackbar.x === 'left'"
      v-model="snackbar.show"
    >
      <v-icon v-if="snackbar.color === 'error'" >error</v-icon>
      　{{ snackbar.body }}
      <v-btn dark flat @click.native="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {

  },
  computed: {
    ...mapState(['snackbar', 'menu', 'pageTitle', 'user'])
  },
  created () {
    console.log(this.user)
  }
}
</script>

<style>
.dialog {
  transition: 0.1s ease-in-out!important;
}
</style>
