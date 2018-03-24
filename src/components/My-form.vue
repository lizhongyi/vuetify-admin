<template>
 <v-form v-model="valid" ref="form" lazy-validation>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg6 v-for="(fds, index) in fields" :key="fds[index]">
                <v-text-field :label="fds.label" 
                :error-messages="errorMessages[index]"
                required="required"
                :rules="rules[index] ? setRule(rules[index],index) : []"
                v-model="value[index]" >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
           <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip
              left
              v-if="formHasErrors"
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
          <v-btn color="blue darken-1"   flat @click.native="onSubmit">Save</v-btn>
         
        </v-card-actions>
        </v-form>
</template>

<script>
export default {
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    groupBy: {
      required: false,
      type: String,
      default: null
    },
    action: {
      required: false,
      type: String,
      default: null
    },
    submitButtonText: {
      required: false,
      type: String,
      default: 'Submit'
    },
    submitButtonIcon: {
      required: false,
      type: String,
      default: 'send'
    },
    method: {
      required: false,
      type: String,
      default: 'post'
    },
    value: {
      required: false,
      type: Object,
      default: () => { }
    },
    fields: {
      required: true,
      type: Object
    },

    rules: {
      required: false,
      type: Object,
      default: () => { }
    },
    messages: {
      required: false,
      type: Object,
      default: () => { }
    }

  },
  data () {
    return {
      model: this.value,
      hasError: false,
      errors: [],
      message: '',
      formHasErrors: null,
      valid: false,
      errorMessages: [],
      nimabi: {
        required: v => !!v,
        email: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        min: v => v && v.length >= 6,
        max: v => v && v.length <= 10,
        phone: v => /^[1][3,4,5,7,8][0-9]{9}$/.test(v)
      },
      rulesFun: {},
      item: {}
    }
  },

  computed: {
    group () {
      if (!this.groupBy) {
        return null
      }
      let parents = {}
      let children = {}
      for (let k in this.fields) {
        let field = this.fields[k]
        let ref = field[this.groupBy]
        let parentKey = field.id
        if (ref === null) { // is parent
          parents[parentKey] = field
        } else { // is child
          if (!children[ref]) {
            children[ref] = {}
          }
          children[ref][k] = field
        }
      }
      return {parents, children}
    },

    autoSubmit () {
      return !!this.action
    }
  },
  watch: {
    'value' (val) {
      this.model = val
      this.opt()
    },
    'model': 'updateFields'
  },
  methods: {

    getGroupedFields () { },
    getFieldError (fieldName) {
      for (let k in this.errors) {
        let error = this.errors[k]
        if (error.field === fieldName) {
          return error.message
        }
      }
    },
    updateFields () {

    },

    onSubmit () {
      if (this.$refs.form.validate()) {

      }
      const valid = global.validator.make(this.value, this.rules, this.messages)
      valid.extend('phone', function (v) {
        return !!v
      }, ':nshashasas')
      if (valid.passes()) {
        this.$emit('input', this.model)
        if (!this.autoSubmit) {
          this.$emit('submit')
          return false
        }
        this.$http[this.method](this.action, this.value).then((data) => {
          if (data.code === 0) {
            this.$emit('success', data)
          } else {
            this.$http.open({
              body: data.messages || data.message,
              color: 'error',
              timeout: 8000
            })
          }
          this.hasError = false
        }).catch(({ response }) => {
          let { status, data } = response
          this.hasError = true
          if (data.message) {
            this.errors = [data]
          }
          switch (status) {
            case 422:

              this.errors = data
              break
            default:
          }
          this.$emit('error', status, data)
        })
      } else {
        const errors = valid.getErrors()
        console.log(errors)
        this.hasError = true
        this.errors = errors
        this.$emit('error', errors)
        // this.$bus.showMessage('error', 'error')
      }
    },
    resetForm () {

    },
    setRule (rules, index) {
      let rule = []
      rules.split('|').map((item) => {
        if (item.split(':')[1]) {
          let newItem = item.split(':')[0]
          rule.push(this.rulesFun[index + '.' + newItem])
        } else {
          rule.push(this.rulesFun[index + '.' + item])
        }
      })
      console.log(rule)
      return rule
    },
    opt () {
      const self = this
      for (let itemx in this.rules) {
        let funs = this.rules[itemx].split('|')
        let minMax
        let min
        let max
        for (let i in funs) {
          minMax = funs[i].split(':')
          if (minMax[0] === 'min') {
            funs[i] = 'min'
            min = minMax[1]
            this.rulesFun[itemx + '.' + funs[i]] = function (val) {
              return (val && val.length) >= min || self.messages[itemx + '.' + funs[i]] + '不能少于' + min + '个字符'
            }
          } else if (minMax[0] === 'max') {
            funs[i] = 'max'
            max = minMax[1]
            this.rulesFun[itemx + '.' + funs[i]] = function (val) {
              return (val && val.length) <= max || self.messages[itemx + '.' + funs[i]] + '不能超过' + max + '个字符'
            }
          } else {
            this.rulesFun[itemx + '.' + funs[i]] = function (val) {
              console.log(minMax)
              return self.nimabi[funs[i]](val) || self.messages[itemx + '.' + funs[i]]
            }
          }
        }
      }
    }
  },
  mounted () {
    // this.$bus.showMessage('success', 'success')
  },
  created () {
    // global.validator.extend('unique', function (data, field, message, args, get) {
    //   return new Promise(function (resolve, reject) {
    //     // const fieldValue = get(data, field)
    //     return resolve('Unsupported in client.')
    //   })
    // }, this.$t('Field should be unique.'))
  }
}
</script>
