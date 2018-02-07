// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from '@transplace/vuetify'
import store from './store'
import '../node_modules/@transplace/vuetify/src/stylus/main.styl'
import helper from './utils/helper'
import './utils/http'
import i18n from './i18n'
import Dropzone from 'vue2-dropzone'
import VueQuillEditor from 'vue-quill-editor'
import validator from 'Validator'
import config from './config'
import VForm from './components/Form.vue'
import VGrid from './components/Grid.vue'
import VField from './components/Field.vue'
import VueTimeago from 'vue-timeago'
global.validator = validator
global.helper = helper
global.store = store

Vue.use(Vuetify)
console.log(i18n)
Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: config.locale,
  locales: {
    'en': require('vue-timeago/locales/en-US.json'),
    [config.locale]: require(`vue-timeago/locales/${config.locale}.json`)
  }
})

Vue.use(VueQuillEditor)
Vue.component('dropzone', Dropzone)

// import validator from 'indicative'

// import Modal from './components/Modal'
// Vue.use(Modal)

Vue.component('v-form', VForm)
Vue.component('v-grid', VGrid)
Vue.component('v-field', VField)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
