<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{$t("Login")}}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <!-- <my-v-form v-model='model' action='login'  :fields='fields'  @success='onSuccess'  submitButtonText="Login" ></my-v-form> -->
                <v-form action='login' >
                  <v-text-field required
                     name="username"
                     :rules="[rules.required]"
                      v-model="model.username"
                      append-icon="person"
                      label="username/email" type="text">
                      
                      </v-text-field>
                      <v-text-field
                        name="input-10-2"
                        label="Enter your password"
                        hint="At least 8 characters"
                        min="8"
                        :append-icon="e2 ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (e2 = !e2)"
                        v-model="model.password"
                        class="input-group--focused"
                        :type="e2 ? 'password' : 'text'"
                      ></v-text-field>
                  <v-checkbox
                   value="1"
                   label="remenber ME"
                   data-vv-name="checkbox"
                   type="checkbox"
                  ></v-checkbox>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                <v-btn @click="submit" color="primary">login<v-icon>　send</v-icon></v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {

  data () {
    return {
      model: {
        username: 'admin',
        password: '123456'
      },
      errors: {},
      fields: {
        username: { label: 'Username', 'required': true },
        password: { label: 'Password', type: 'password', 'required': true }
      },
      show: true,
      e1: false,
      e2: false,
      e3: false,
      e4: false,
      password: 'Password',
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    onSuccess (data) {
      this.$store.commit('setAuth', data)
      this.$http.defaults.headers.common['Authorization'] = this.$http.getToken()
      var $location = this.$route.query.redirect ? this.$route.query.redirect : '/'
      this.$router.push($location)
    },
    submit () {
      const success = (data) => {
        this.onSuccess(data)
      }
      this.$http.ajax(this.$http.post(`/login`, this.model), success)
    }
  },

  mounted () {
  }
}
</script>

<style scopd>
.toolbar{ box-shadow: none}
</style>
