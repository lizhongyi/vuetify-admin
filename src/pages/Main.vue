<template lang="pug">
  v-app(:dark='dark')
    v-navigation-drawer(persistent='', :mini-variant='miniVariant', :clipped='clipped', v-model='drawer', enable-resize-watcher='', fixed='', app='')
      v-list
        template(v-for='item in menu')
          v-list-group(:prepend-icon='item.icon', no-action='', :key='item.title', v-if='item.items')
            v-list-tile(slot='activator')
              v-list-tile-content
                v-list-tile-title {{ item.title }}
            v-list-tile(v-for='subItem in item.items', :key='subItem.href',:to='subItem.href', v-bind:router='!subItem.target', ripple, v-bind:disabled='subItem.disabled', v-bind:target='subItem.target')
              v-list-tile-content
                v-list-tile-title {{ subItem.title }}
              v-list-tile-action
                v-icon {{ subItem.icon }}
          v-list-tile(v-if='!item.items', :key='item.title',:to='item.href', router, ripple, v-bind:disabled='item.disabled', :title="item.title")
            v-list-tile-action
              v-icon(v-text='item.icon')
            v-list-tile-content
              v-list-tile-title(to='/') {{ item.title }}
    v-toolbar(app='', :clipped-left='clipped')
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
      v-btn(icon='', @click.stop='miniVariant = !miniVariant')
        v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
      v-btn(icon='', @click.stop='clipped = !clipped')
        v-icon web
      v-btn(icon='', @click.stop='fixed = !fixed')
        v-icon remove
      v-btn(icon='', @click.stop='dark = !dark')
        v-icon(v-if='dark') brightness_4
        v-icon(v-if='!dark') brightness_5
      v-spacer
      v-menu(offset-y='', left='')
        v-btn(slot='activator', depressed='')
          v-icon face
        v-list
          v-list-tile(@click='')
            v-list-tile-title 语言
      v-btn(icon='')
        v-icon notifications
      
      v-menu(offset-y='', left='')
        v-btn(slot='activator', depressed='')
          v-icon face
        v-list
          v-list-tile(@click='')
            v-list-tile-title 
           
    v-content(style='margin:1rem')
      router-view
    v-footer(:inset='fixed', app='')
      span © {{ new Date().getFullYear() }}
</template>


<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      dark: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  name: 'App',
  computed: {
    ...mapState(['message', 'menu', 'pageTitle'])
  },
  methods: {
    changeLocale (to) {
      global.helper.ls.set('locale', to)
      this.$i18n.locale = to
    },
    fetchMenu () {
      // fetch menu from server
      this.$http.get('menu').then(({data}) => this.$store.commit('setMenu', data))
    }
  },
  created () {
    console.log(this.pageTitle)
    this.fetchMenu()
  }
}
</script>

<style scoped>
.list--group__header--active{
  color: red
}
</style>

