<template>
  <v-card>
    <v-toolbar dark density="comfortable" color="dark" class="px-2 mb-2">
      <v-text-field
        v-model="search"
        clearable
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        variant="solo"
        density="compact"
      />
    </v-toolbar>

    <v-list
      v-model:selected.sync="selectedUsers"
      select-strategy="leaf"
      return-object
    >
      <v-list-item
        v-for="user in filteredUsers"
        :key="`user-${user.id}`"
        :prepend-icon="userHasPermission(user.permissions, storeToken.allPermissions.find(ap => ap.name === 'IS_ADMIN').code) ? 'mdi-account-cog' : 'mdi-account'"
        :value="user"
      >
        <span>{{ user.username }}</span>

        <template v-slot:prepend="{ isSelected, select }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { apiPostUsers } from '@/plugins/api'
import { mapGetters } from 'vuex'
import { MAX_JAVA_INTEGER, userHasPermission } from '@/plugins/misc'

export default {
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      users: [],
      search: null,
      selectedUsers: []
    }
  },
  emits: ['user-selected'],
  computed: {
    ...mapGetters([
      'storeToken'
    ]),
    filteredUsers: function () {
      if (!this.search || this.search.trim().length < 1) {
        return this.users
      } else {
        const lower = this.search.toLowerCase()
        return this.users.filter(u => u.username.includes(lower))
      }
    }
  },
  watch: {
    selectedUsers: function (newValue) {
      this.$emit('user-selected', newValue)
    }
  },
  methods: {
    userHasPermission
  },
  mounted: function () {
    apiPostUsers({
      page: 0,
      limit: MAX_JAVA_INTEGER
    }, result => {
      this.users = result.data

      if (this.selected) {
        this.selectedUsers = this.users.filter(u => this.selected.some(ou => ou.id === u.id)) 
      }
    })
  }
}
</script>
