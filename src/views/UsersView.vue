<template>
  <v-container fluid>
    <h1 class="text-h4 mb-3">{{ $t('pageUsersTitle') }}</h1>
    <v-divider class="mb-3" />
    <div v-html="$t('pageUsersText')" class="mb-5" />

    <v-sheet border>
      <v-data-table-server
        v-model:items-per-page="perPage"
        :headers="columns"
        :items-length="userCount === -1 ? 0 : userCount"
        :items="users"
        :loading="loading"
        :search="search"
        :hide-default-footer="userCount <= perPage"
        item-value="id"
        @update:options="update">

        <template #top>
          <v-toolbar flat class="justify-space-between">
            <v-toolbar-title class="flex-unset">
              <v-icon color="medium-emphasis" icon="mdi-account-multiple" start></v-icon>
              {{ $t('pageUsersTableHeader') }}
            </v-toolbar-title>

            <v-text-field v-model="search" class="table-search my-2" hide-details :placeholder="$t('formPlaceholderSearch')" density="compact" />

            <v-btn
              class="me-2"
              prepend-icon="mdi-account-plus"
              rounded="lg"
              :text="$t('buttonAddUser')"
              variant="tonal"
              @click="add"
            ></v-btn>
          </v-toolbar>
        </template>

        <template v-for="permission in allPermissions" :key="`${permission.code}`" v-slot:[`item.${permission.name}`]="{ item }">
          <v-checkbox-btn disabled :model-value="hasPermission(permission, item.permissions)" />
        </template>

        <template #item.viewType="{ item }">
          {{ viewTypeTexts[item.viewType] }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            class="me-2"
            icon="mdi-pencil"
            @click="edit(item.id)"
            :disabled="item.canBeEdited === false"
          />

          <v-btn
            class="me-2"
            icon="mdi-delete"
            @click="remove(item.id)"
            :disabled="item.canBeEdited === false"
          />
        </template>
      </v-data-table-server>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEdit ? $t('modalTitleUserEdit') : $t('modalTitleUserAdd')">
        <template #text>
          <v-row v-if="!isEdit">
            <v-col cols="12">
              <v-text-field v-model="record.username" :error="formState.username === false" hide-details :label="$t('formLabelUserName')" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="record.password"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passwordVisible ? 'text' : 'password'"
                :error="formState.password === false"
                hide-details
                :label="$t('formLabelUserPassword')"
                @click:append-inner="passwordVisible = !passwordVisible"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="record.viewType"
                :items="viewTypeOptions"
                :label="$t('formLabelUserViewType')"
              />
            </v-col>
          </v-row>

          <v-checkbox v-for="permission in allPermissions" :key="`permission-${permission.code}`" :model-value="hasPermission(permission, record.permissions)" hide-details :label="permission.name" @update:modelValue="togglePermission(record, permission)"/>
        </template>

        <v-card-actions class="bg-surface-light">
          <v-btn :text="$t('buttonCancel')" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn :text="$t('buttonSave')" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialog :message="$t('modalTextConfirmDeleteUser')" @yes="deleteUser" @no="$refs.confirmDialog.hide()" ref="confirmDialog" />
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import { mapGetters } from 'vuex'
import { apiDeleteUser, apiPatchUser, apiPostUsers, apiPutUsers } from '@/plugins/api'
import { userHasPermission } from '@/plugins/misc'

export default {
  components: {
    ConfirmDialog
  },
  data: function () {
    return {
      users: [],
      perPage: 15,
      userCount: -1,
      loading: false,
      search: '',
      defaultUser: {
        username: '',
        password: '',
        permissions: 0,
        viewType: 'ALBUM_PERMISSION'
      },
      formState: {
        username: null,
        password: null
      },
      record: null,
      dialog: false,
      isEdit: false,
      passwordVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'storeToken'
    ]),
    viewTypeTexts: function () {
      return {
        VIEW_ALL: this.$t('formSelectUserViewTypeAll'),
        ALBUM_PERMISSION: this.$t('formSelectUserViewTypeAlbumPermission')
      }
    },
    viewTypeOptions: function () {
      if (this.viewTypeTexts) {
        return Object.keys(this.viewTypeTexts).map(k => {
          return {
            value: k,
            title: this.viewTypeTexts[k]
          }
        })
      } else {
        return []
      }
    },
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
    add: function () {
      this.formState = {
        username: null,
        password: null
      }
      this.passwordVisible = false
      this.record = JSON.parse(JSON.stringify(this.defaultUser))
      this.isEdit = false
      this.dialog = true
    },
    edit: function (userId) {
      this.record = JSON.parse(JSON.stringify(this.users.find(u => u.id === userId)))
      this.isEdit = true
      this.dialog = true
    },
    save: function () {
      if (this.isEdit) {
        apiPatchUser(this.record.id, this.record, () => {
          this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
        }, {
          codes: [403],
          callback: () => {
            console.log('trying to add admin')
          }
        })
      } else {
        if (!this.record.username || this.record.username.trim().length < 1) {
          this.formState.username = false
        }
        if (!this.record.password || this.record.password.trim().length < 1) {
          this.formState.password = false
        }
        if (Object.values(this.formState).some(v => v === false)) {
          return
        }

        apiPutUsers(this.record, () => {
          this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
        })
      }
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
        ascending: +((sortBy && sortBy.length > 0) ? sortBy[0].order !== 'desc' : true)
      }).then(result => {
        this.loading = false
        if (result && result.data) {
          this.users = result.data.data
          this.userCount = result.data.count
        }
      })
    },
    remove: function (userId) {
      this.record = {
        id: userId
      }

      this.$refs.confirmDialog.show()
    },
    deleteUser: function () {
      apiDeleteUser(this.record.id, () => {
        this.$refs.confirmDialog.hide()
        this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
      })
    }
  },
  mounted: function () {
    this.update({ page: 1, itemsPerPage: this.perPage, sortBy: null })
  }
}
</script>

<style scoped>
.table-search {
  flex: unset;
  width: max(300px, 25%);
  margin-left: auto;
  margin-right: auto;
}
.flex-unset {
  flex: unset;
}
</style>
