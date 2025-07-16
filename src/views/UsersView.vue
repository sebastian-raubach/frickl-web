<template>
  <v-container fluid>
    <h1 class="text-h4 mb-3">{{ $t('pageUsersTitle') }}</h1>
    <v-divider class="mb-3" />
    <div v-html="$t('pageUsersText')" class="mb-5" />

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
        <v-checkbox-btn disabled :model-value="hasPermission(permission, item.permissions)" />
      </template>
      <template v-slot:tfoot>
        <tr>
          <td>
            <v-text-field v-model="search" hide-details :placeholder="$t('formPlaceholderSearch')" class="ma-2" density="compact" />
          </td>
        </tr>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          @click="edit(item)"
        />

        <v-btn variant="text" icon @click="remove(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>

    <v-dialog v-model="dialog" :activator="activator" max-width="500">
      <v-confirm-edit
        ref="confirm"
        v-model="selectedUser"
        :ok-text="$t('buttonSave')"
        @cancel="dialog = false"
        @save="save"
      >
        <template v-slot:default="{ model: proxyModel, actions }">
          <v-card title="Modify Data">
            <v-card-text>
              <v-checkbox v-for="permission in allPermissions" :key="`permission-${permission.code}`" :model-value="hasPermission(permission, proxyModel.value.permissions)" hide-details :label="permission.name" @update:modelValue="togglePermission(proxyModel.value, permission)"/>
            </v-card-text>

            <template v-slot:actions>
              <v-spacer></v-spacer>
              <component :is="actions"></component>
            </template>
          </v-card>
        </template>
      </v-confirm-edit>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiPatchUser, apiPostUsers } from '@/plugins/api'
import { userHasPermission } from '@/plugins/misc'
import { toRaw } from 'vue'

export default {
  data: function () {
    return {
      users: [],
      perPage: 15,
      userCount: -1,
      loading: false,
      search: '',
      selectedUser: null,
      dialog: false
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
      }, {
        title: this.$t('tableColumnUserActions'),
        value: 'actions'
      }]
    }
  },
  watch: {
    search: function () {
      this.userCount = -1
    }
  },
  methods: {
    edit: function (user) {
      this.selectedUser = toRaw(user)

      this.dialog = true
    },
    save: function () {
      apiPatchUser(this.selectedUser.id, this.selectedUser, () => {
        this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
      })
      this.dialog = false
    },
    hasPermission: function (permission, value) {
      return userHasPermission(value, permission.code)
    },
    togglePermission: function (user, permission) {
      user.permissions = user.permissions ^ permission.code
    },
    update: function ({ page, itemsPerPage, sortBy }) {
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
