<template>
  <div v-if="pagination.totalCount >= 0">
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             class="mb-0"
             :items="getData"
             :fields="fields"
             ref="table">
      <template v-slot:cell(albumName)="data">
        <router-link :to="{ name: 'sub-album', params: { albumId: data.item.albumId } }">{{ data.item.albumName }}</router-link>
      </template>
      <template v-slot:cell(tokenToken)="data">
        <b-input readonly :value="getUrl(data.item)" />
      </template>
      <template v-slot:cell(delete)="data">
        <b-button variant="danger" @click="onDelete(data.item)"><DeleteIcon /></b-button>
      </template>
    </b-table>
    <b-pagination v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total-rows="pagination.totalCount"
                  v-show="pagination.totalCount > pagination.perPage" />
  </div>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'

export default {
  data: function () {
    return {
      fields: [{
        key: 'albumName',
        label: 'Album name'
      }, {
        key: 'albumDescription',
        label: 'Album description'
      }, {
        key: 'tokenToken',
        label: 'Token URL'
      }, {
        key: 'tokenExpiresOn',
        label: 'Expires on',
        formatter: this.$options.filters.toDate
      }, {
        key: 'delete',
        label: ''
      }],
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalCount: -1
      }
    }
  },
  components: {
    DeleteIcon
  },
  methods: {
    getUrl: function (token) {
      const l = window.location
      return `${l.protocol}://${l.host}${l.pathname}#/albums/${token.albumId}/?accesstoken=${token.tokenToken}`
    },
    onDelete: function (token) {
      this.$bvModal.msgBoxConfirm('It will no longer be possible to access the folders associated with this token.', {
        title: 'Delete access token?',
        okTitle: 'Yes',
        okVariant: 'success',
        cancelTitle: 'No',
        cancelVariant: 'secondary'
      })
        .then(value => {
          if (value) {
            this.apiDeleteAccessToken(token, result => {
              this.$refs.table.refresh()
            })
          }
        })
    },
    getData: function () {
      return new Promise((resolve) => {
        this.apiGetAccessTokens(this.pagination.currentPage - 1, this.pagination.perPage, result => {
          resolve(result)
        })
      })
    }
  },
  mounted: function () {
    this.apiGetAccessTokenCount(result => {
      this.pagination.totalCount = result
    })
  }
}
</script>

<style>

</style>
