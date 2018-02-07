<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Dessert name" v-model="item.name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Calories" v-model="item.calories"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Fat (g)" v-model="item.fat"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Carbs (g)" v-model="item.carbs"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Protein (g)" v-model="item.protein"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-form class="row jr" :inline="true" v-model="filters.model" :fields="filters.fields" 
        @submit="doSearch" submitButtonText="Search" submitButtonIcon="search"></v-form>
    </v-card>
    <v-data-table
      v-bind:headers="columns"
      v-model="data.data"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td :class="column.left? '': 'text-xs-right'" v-for="column in columns" :key="column">
          {{getColumnData(props.item, column.value)}}
        </
        <td v-if="actions" width="180">
          <v-btn v-if="button && button.icon" v-for="(button, key) in actions" :key="key" router floating small dark :to="{name: 'action', params: {resource, id:props.item.id, action: key}}" :primary="button.type == 'primary' || button.type == ''" :success="button.type == 'success'">
            <v-icon>{{button.icon}}</v-icon>
          </v-btn>
  
          <v-btn v-if="actions === true || actions.edit === true" router primary floating small dark :to="{name: 'edit', params: {resource,id:props.item.id}}">
            <v-icon>edit</v-icon>
          </v-btn>
  
          <v-btn v-if="actions === true || actions.delete === true" @click.native="remove(props.item)" error floating small dark>
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" >Reset</v-btn>
      </template>
    </v-data-table>
    <v-card-row class="jc">
        <v-pagination v-model="data.currentPage" :length="data.lastPage" circle class="ma-3"></v-pagination>
      </v-card-row>
    </v-card>
  </div>
</template>

<script>

export default {

  props: {
    resource: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      filters: {
        model: {},
        fields: {}
      },
      columns: [],
      actions: {},
      data: {
        currentPage: 1,
        lastPage: 1,
        data: []
      }
    }
  },
  watch: {
    'data.currentPage': 'fetchData',
    '$route': 'fetch'
  },
  methods: {
    doSearch () {
      this.$route.query.query = JSON.stringify(this.filters.model)
      // this.search = search
      this.fetchData()
    },
    filter (val, search) {
      return true
      // this.search = search
      // this.fetchData()
    },
    fetch () {
      this.fetchGrid()
      // this.fetchData()
    },
    getColumnData (row, field) {
      // process fields like `type.name`
      let [l1, l2] = field.split('.')
      if (l2) {
        return row[l1] ? row[l1][l2] : null
      } else {
        return row[l1]
      }
    },
    fetchGrid () {
      this.$http.get(`${this.resource}/grid`, { params: { page: this.data.currentPage, ...this.$route.query } }).then(({ data }) => {
        this.columns = data.columns
        this.actions = data.actions
        this.filters = data.filters
        this.fetchData()
      })
    },
    fetchData () {
      this.$http.get(`${this.resource}`, { params: { page: this.data.currentPage, ...this.$route.query } }).then(({ data }) => {
        this.data = data
      })
    },
    remove (item) {
      this.$alert('ok')
      console.log(`delete ${item.id}`)
    },
    next () {
      console.log('next')
      this.data.currentPage++
    }
  },

  created () {
    this.fetch()
  }
}
</script>
