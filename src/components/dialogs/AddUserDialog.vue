<template>
  <v-dialog width="500" v-model="dialog">
    <v-card :title="$t('cardTitleAddUser')">
      <v-card-text>
        <p class="mb-3">{{ $t('cardTextAddUser') }}</p>

        <UserList :selected="preselectedUsers" @user-selected="userSelected" v-if="preselectedUsers" />
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="hide">
          {{ $t('buttonCancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="addUser">
          {{ $t('buttonSave') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserList from '@/components/lists/UserList.vue'
import { apiGetAlbumUsers, apiPostAlbumUsers } from '@/plugins/api'
export default {
  components: {
    UserList
  },
  props: {
    parentAlbumId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      selectedUsers: [],
      preselectedUsers: null
    }
  },
  emits: ['user-added'],
  methods: {
    userSelected: function (selectedUsers) {
      this.selectedUsers = selectedUsers
    },
    addUser: function () {
      apiPostAlbumUsers(this.parentAlbumId, this.selectedUsers.map(su => su.id), () => {
        this.$emit('user-added')
        this.hide()
      })
    },
    show: function () {
      this.dialog = true

      apiGetAlbumUsers(this.parentAlbumId, result => {
        this.preselectedUsers = result
      })
    },
    hide: function () {
      this.dialog = false
    }
  }
}
</script>
