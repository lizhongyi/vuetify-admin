<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="primary" @click="add()" slot="activator" class="mb-2">New Item</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ this.item.edit ? 'EDIT' : 'ADD' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4 v-for="(fds, index) in form.fields" :key="fds[0]">
                <v-text-field :label="fds.label" :required="fds.required" v-model="item[index]" ></v-text-field>
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
    <v-layout>
     <v-flex md4></v-flex>
     <v-flex md8>
     <v-form class="row jr" :inline='true' v-model='filters.model' v-if="filters.fields"  :fields='filters.fields' @submit='doSearch'  submitButtonText='Search'  submitButtonIcon='search'></v-form>
     </v-flex>
    </v-layout>
    <v-data-table
      :headers="columns"
      :items="items"
      class="elevation-1"
      :total-items="pagination.totalItems"
      :pagination.sync="pagination" 
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td :class="column.left? '': 'text-xs-left'" v-for="(column, index) in columns" :key="column.text" v-if="index < columns.length - 1 " v-html="getColumnData(props.item, column)"> </td>
        <!-- <td>
          <v-btn v-if="actions.edit" icon class="mx-0" @click.native.stop="showEdit(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn v-if="actions.delete" icon class="mx-0" @click="deleteItem(props.index)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td> -->
         <td v-if='actions !== false' width='160'>
         <template v-for=" (value, action) in actions">
           <v-btn v-if="['edit', 'delete'].indexOf(action) < 0" :key="action" class="router primary fab small" :to="{name: action, params: {resource,id:props.item.id}}">
             <v-icon> {{action.icon ? action.icon : action}} </v-icon>
           </v-btn>  

           <v-btn v-if="options.edit !== false" :key="action" dark primary fab small :to="{name: 'edit', params: {resource,id:props.item.id}}" >
              <v-icon>edit</v-icon>
           </v-btn>

        </template>  
         </td>     
      </template>
      <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
      </template>
    </v-data-table>
    <v-flex>
       <v-card>
         <v-pagination v-model='pagination.page' :length='totalPages'  circle></v-pagination>
       </v-card>
    </v-flex>
    
  </div>
</template>
<script>
  const getDefaultData = () => {
    return {
      form: {
        model: {},
        fields: {},
        rules: {},
        messages: {}
      },
      filters: {
        model: {},
        fields: null
      },
      loading: false,
      columns: [], // fetch grid setup params from server if `columns` is empty
      actions: {},
      options: {
        sort: 'id',
        create: false,
        update: true,
        delete: false
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'id',
        descending: true,
        totalItems: 0
      },
      isShowEdit: false,
      currentItem: false,
      items: [],
      dialog: false,
      item: {}
    }
  }
  export default {
    data: getDefaultData,
    computed: {
      formTitle () {
        console.log(this.item.edit)
        return this.item.edit ? 'Edit Item' : 'New Item'
      }
    },
    created () {
      this.initialize()
    },
    watch: {
      '$i18n.locale' (val) {
        this.fetchGrid()
      },
      'pagination.page' (val) {
        this.fetchData()
      },
      'pagination.sortBy' (val) {
        this.fetchData()
      },
      'pagination.descending' (val) {
        this.fetchData()
      },
      '$route.params': 'refresh'
      // '$route.query': 'updateRoute'
    },
    methods: {
      initialize () {
        this.fetchGrid().then(() => {})
        this.fetchData()
      },
      fetchData () {
        this.preFetch()
        this.$http.get(`users`, {params: this.$route.query}).then(({ data }) => {
          this.items = data.data
          this.fetchForm(this.items[0])
          this.pagination.totalItems = data.total
        })
      },
      fetchForm (item) {
        this.$http.get(`users/form`).then(({data}) => {
          this.form = data
        })
      },
      fetch () {
        if (this.columns.length <= 0) {
          // fetch grid params from server: e.g. /crud/users/grid
          this.fetchGrid()
        } else {
          // or define grid params manually
          this.fetchData()
        }
      },
      doSearch () {
        this.pagination.page = 1
        this.fetchData()
      },
      filter (val, search) {
        return true
        // this.search = search
        // this.fetchData()
      },
      getColumnData (row, field) {
        // process fields like `type.name`
        let [l1, l2] = field.value.split('.')
        let value = row[l1]
        let tag = null
        if (l2) {
          value = row[l1] ? row[l1][l2] : null
        }
        if (field.type === 'image') {
          tag = 'img'
        }
        if (tag) {
          value = `<${tag} src="${value}" class="crud-grid-thumb" controls />`
        }
        return value
      },
      fetchGrid () {
        return new Promise((resolve, reject) => {
          this.$http.get(`users/grid`).then(({ data }) => {
            for (let k in data.columns) {
              data.columns[k].text = this.$t(data.columns[k].text)
            }
            data.columns.push({text: '操作', value: '操作', sort: false})
            this.columns = data.columns || {}
            this.actions = data.actions || {}
            this.filters = data.filters || {}
            this.options = data.options || {}

            if (this.options && this.options.sort) {
              let sortData = this.options.sort.split('-')
              let desc = sortData.length > 1
              let sortField = sortData.pop()

              // if (sortField.indexOf('.') < 0) {
              //   sortField = sortField
              // }
              this.pagination.sort = sortField
              this.pagination.descending = desc
            }
            resolve()
          })
        })
      },
      preFetch () {
        let sort = this.pagination.sortBy
        if (this.pagination.descending) {
          sort = '-' + sort
        }
        this.$route.query.query = JSON.stringify(this.filters.model)
        this.$route.query.sort = sort
        this.$route.query.perPage = this.pagination.rowsPerPage
        this.$route.query.page = this.pagination.page
        alert(10)
      },
      updateRoute () {
        this.$route.query.keepLayout = true
        console.log('update route')
        this.$router.go({
          path: this.$route.path,
          params: this.$route.params,
          query: this.$route.query
        })
      },
      refresh () {
        Object.assign(this.$data, getDefaultData())
        this.fetchGrid().then(() => {})
        this.fetchData()
      },
      editItem (item) {
        this.currentItem = item
        this.fetchForm(item)
        this.dialog = true
        this.isShowEdit = true
      },
      deleteItem (index) {
        // alert user for delete
        this.items.splice(index, 1)
      },

      close () {
        this.item.edit = false
        this.dialog = false
      },
      save () {
        if (this.item.edit) {
          // edit item
          this.item.edit = false
        } else {
          this.items.push(this.item)
        }
        this.dialog = false
      },
      onSaveEdit (data) {
        if (data.id) {
          this.isShowEdit = false
          this.fetchData()
        }
      },
      showEdit (item) {
        this.item = item
        this.item.edit = true
        this.fetchForm(item)
        console.log(item)
        this.dialog = true
      },
      add () {
        this.item.edit = false
        this.item = {}
        for (let n in this.form.fields) {
          this.item[n] = ''
        }
      }
    }
  }
</script>