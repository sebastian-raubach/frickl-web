<template>
  <v-container fluid>
    <h1 class="text-h4 mb-3">{{ $t('pageUsersTitle') }}</h1>
    <v-divider class="mb-3" />
    <div v-html="$t('pageUsersText')" />
    
    <v-data-table-server
      v-model:items-per-page="perPage"
      :headers="columns"
      :items-length="userCount === -1 ? 0 : userCount"
      :items="users"
      :loading="loading"
      :search="search"
      item-value="id"
      @update:options="update">
      <template v-for="permission in allPermissions" :key="`${permission.code}`" v-slot:[`item.${permission.name}`]="{ item }">
        <v-checkbox-btn :model-value="hasPermission(permission, item.permissions)" />
      </template>
      <template v-slot:tfoot>
        <tr>
          <td>
            <v-text-field v-model="search" hide-details :placeholder="$t('formPlaceholderSearch')" class="ma-2" density="compact" />
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiPostUsers } from '@/plugins/api'
import { userHasPermission } from '@/plugins/misc'

export default {
  data: function () {
    return {
      users: [],
      perPage: 15,
      userCount: -1,
      loading: false,
      search: ''
    }
  },
  computed: {
    ...mapGetters([
      'storeToken'
    ]),
    allPermissions: function () {
      if (this.storeToken && this.storeToken.allPermissions) {
        return this.storeToken.allPermissions
      } else {
        return []
      }
    },
    columns: function () {
      return [{
        title: this.$t('tableColumnUsersId'),
        key: 'id',
        sortable: true
      }, {
        title: this.$t('tableColumnUsersUsername'),
        key: 'username',
        sortable: true
      }, {
        title: this.$t('tableColumnUserViewType'),
        key: 'viewType',
        sortable: true
      }, {
        title: this.$t('tableColumnUserLastLogin'),
        key: 'lastLogin',
        sortable: true,
        value: item => item.lastLogin ? new Date(item.lastLogin).toLocaleString() : ''
      }, {
        title: this.$t('tableColumnUserPermissions'),
        key: 'permissions',
        sortable: false,
        children: this.allPermissions.map(p => {
          return {
            title: p.name,
            key: p.name,
            sortable: false
          }
        })
      }]
    }
  },
  watch: {
    search: function () {
      this.userCount = -1
    }
  },
  methods: {
    hasPermission: function (permission, value) {
      return userHasPermission(value, permission.code)
    },
    update: function ({ page, itemsPerPage, sortBy }) {
      console.log(sortBy)
      this.loading = true
      apiPostUsers({
        page: page - 1,
        limit: itemsPerPage,
        prevCount: this.userCount,
        orderBy: (sortBy && sortBy.length > 0) ? sortBy[0].key : null,
        searchTerm: this.search,
        ascending: (sortBy && sortBy.length > 0) ? sortBy[0].order !== 'desc' : true
      }).then(result => {
        this.loading = false
        if (result && result.data) {
          this.users = result.data.data
          this.userCount = result.data.count
        }
      })
    }
  },
  mounted: function () {
    this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
  }
}
</script>
