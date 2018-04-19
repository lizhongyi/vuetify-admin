<template>
        <v-form v-model="valid" ref="form" lazy-validation>
        <v-card-title>
          <span class="headline">{{ resource }} / {{ formTitle }} {{$store.formData}}</span>
        </v-card-title>
        <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 v-for="(fds, index) in form.fields" :key="fds[index]">
                 <v-select v-if="['select', 'select2'].includes(fds.type)"  :items="fds.options" v-model="item[index]">
                </v-select>
                <template v-else-if="'radios' === fds.type">
                  <v-layout row wrap>
                     <v-radio-group v-model="item[index]">
                        <v-radio mandatory
                          v-for="option in fds.choices"
                          :key="option.text"
                          :value='option.value'
                          :label='option.text'
                        ></v-radio>
                      </v-radio-group>
                  </v-layout>
                </template>
                <template v-else-if="'checkboxes' === fds.type" >
                  <v-layout  row wrap>
                    <v-checkbox 
                      v-for="option in fds.choices"
                      :key="option.text"
                      :value='option.value'
                      :label='option.text'
                      v-model='item[index]'
                    ></v-checkbox>
                  </v-layout>
                </template>
                 <template v-else-if="['date', 'datetime', 'time'].indexOf(fds.type) > -1">
                  <v-menu>
                    <v-text-field slot='activator' v-model="item[index]" :label="$t(fds.label)"></v-text-field>
                    <v-date-picker v-model="item[index]"  no-title scrollable actions></v-date-picker>
                  </v-menu>
                </template> 
                <template v-else>
                <v-text-field :label="fds.label" 
                :error-messages="errorMessages[index]"
                required="required"
                :disabled="isEdit() ? fds.disabled : false"
                :rules="form.rules[index] ? setRule(form.rules[index],index) : []"
                v-model="item[index]" >
                </v-text-field>
                </template>
              </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
           <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip
              left
            >
              <v-btn
                icon
                @click="resetForm"
                slot="activator"
                class="my-0"
              >
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Refresh form</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn color="blue darken-1"   flat @click.native="save">Save</v-btn>
        </v-card-actions>
        </v-form>
  </div>
</template>
<script>
const getDefaultData = () => {
  return {
    rules: {
    },
    nimabi: {
      required: v => !!v,
      email: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
      min: v => v && v.length >= 6,
      max: v => v && v.length <= 10,
      phone: v => /^[1][3,4,5,7,8][0-9]{9}$/.test(v)
    },
    formHasErrors: false,
    valid: true,
    errorMessages: [],
    form: {
      model: {},
      fields: {},
      rules: {},
      messages: {},
      open: null
    },
    addFields: {},
    item: {}
  }
}
export default {
  props: ['dialog', 'items', 'action'],
  name: 'publicForm',
  data: getDefaultData,
  computed: {
    formTitle () {
      if (this.isEdit()) {
        return 'Edit Item'
      } else {
        return 'New Item'
      }
    },
    resource () {
      return this.$route.params.resource
    }
  },
  created () {
    if (this.action === 'edit' || this.$route.params.id) {
      this.fetchForm(this.$route.params.id ? this.$route.params.id : this.items.id)
    } else {
      this.fetchForm()
    }
  },
  methods: {
    fetchForm (item) {
      if (this.$store.state.formData && this.$store.state.formData[this.resource] && !this.isEdit()) {
        this.setForm(this.$store.state.formData[this.resource])
        return false
      }
      // 如果是新增就不要请求远程了
      this.$http.get(`${this.resource}/form`, {
        params: { id: item }
      }).then((data) => {
        this.setForm(data)
        // 加入本地缓存
        let formData = {}
        formData[this.resource] = data
        this.$store.commit('setForm', formData)
      })
    },
    save () {
      let method, params
      if (!this.isEdit()) {
        method = 'post'
        params = ''
      } else {
        method = 'patch'
        params = `/${this.item.id}`
      }
      if (this.$refs.form.validate()) {

      }
      const valid = global.validator.make(this.item, this.form.rules, this.form.messages)
      valid.extend('phone', function (v) {
        return !!v
      }, ':nshashasas')
      if (!valid.passes()) {
        // const errors = valid.getErrors()
        // this.errorMessages = errors
        return
      }
      // for (let index in this.item) {
      //   if (Object.prototype.toString.call(this.item[index]) === '[object Array]') {
      //     this.item[index] = this.item[index].toString()
      //   }
      // }
      const success = (data) => {
        this.$router.push(`/crud/${this.resource}`)
      }
      this.$http.ajax(this.$http[method](`${this.resource}${params}`, this.item), success)
    },
    onSaveEdit (data) {
      if (data.id) {
        this.isShowEdit = false
        this.fetchData()
      }
    },
    close () {
      if (this.dialog) {
        this.$emit('close')
      } else {
        this.$router.push(`/crud/${this.resource}`)
      }
    },
    setRule (rules, index) {
      let rule = []
      rules.split('|').map((item) => {
        if (item.split(':')[1]) {
          let newItem = item.split(':')[0]
          rule.push(this.rules[index + '.' + newItem])
        } else {
          rule.push(this.rules[index + '.' + item])
        }
      })
      console.log(rule)
      return rule
    },
    resetForm () {
      this.$refs.form.reset()
      for (let index in this.form.fields) {
        if (this.form.fields[index].type === 'checkboxes') {
          this.item[index] = []
        }
      }
    },
    isEdit () {
      if (this.$route.name === 'edit' || this.action === 'edit') {
        return true
      } else {
        return false
      }
    },
    setForm (data) {
      var self = this
      this.form = data
      this.item = this.form.model
      for (let index in this.form.fields) {
        if (this.isEdit()) {
          if (this.form.fields[index].type === 'checkboxes') {
            this.item[index] = this.item[index] ? this.form.model[index].split(',') : []
            console.log(this.item[index])
          }
        } else {
          if (this.form.fields[index].type === 'checkboxes') {
            this.item[index] = []
          } else {
            this.item[index] = null
          }
        }
      }
      for (let itemx in this.form.rules) {
        let funs = this.form.rules[itemx].split('|')
        let minMax
        let min
        let max
        for (let i in funs) {
          minMax = funs[i].split(':')
          if (minMax[0] === 'min') {
            funs[i] = 'min'
            min = minMax[1]
            this.rules[itemx + '.' + funs[i]] = function (val) {
              return (val && val.length) >= min || self.form.messages[itemx + '.' + funs[i]] + '不能少于' + min + '个字符'
            }
          } else if (minMax[0] === 'max') {
            funs[i] = 'max'
            max = minMax[1]
            this.rules[itemx + '.' + funs[i]] = function (val) {
              return (val && val.length) <= max || self.form.messages[itemx + '.' + funs[i]] + '不能超过' + max + '个字符'
            }
          } else {
            this.rules[itemx + '.' + funs[i]] = function (val) {
              console.log(minMax)
              return self.nimabi[funs[i]](val) || self.form.messages[itemx + '.' + funs[i]]
            }
          }
        }
      }
    }
  }
}
</script>