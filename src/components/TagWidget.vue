<!--
  The tag widget shows all tags available for either the image or all images within an album, depending on the type.
  Tags can be removed from the individual image or all images in the album. New tags can be added similarly.
  Emits:
   - on-tag-deleted: User decides to delete a tag.
-->

<template>
  <div>
    <div v-if="tags && tags.length > 0">
      <span v-for="tag in tags" :key="tag.id" class="image-tag tag-badge mr-1">
        <b-badge :to="'/tags/' + tag.id">
          {{ tag.name }}
        </b-badge>
        <b-badge variant="danger" v-if="(serverSettings && serverSettings.authEnabled === false) || token" @click="onDeleteClicked(tag)">
          <CloseCircleOutlineIcon class="cursor-pointer" title="Remove tag" />
        </b-badge>
      </span>
    </div>
    <b-button variant="primary" size="sm" @click="onAddClicked()" class="mt-3" v-if="(serverSettings && serverSettings.authEnabled === false) || token">Add tag</b-button>

    <div class="bg-white text-body">
      <AddTagModal :id="id"
                   :type="type"
                   ref="tagAddModal"
                   v-on:on-tag-added="$emit('on-tag-added')" />
      <DeleteTagModal :tag="tagToDelete"
                      :id="id"
                      :type="type"
                      ref="tagDeleteModal"
                      v-on:on-tag-deleted="$emit('on-tag-deleted')" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CloseCircleOutlineIcon from 'vue-material-design-icons/CloseCircleOutline.vue'
import AddTagModal from '../components/modals/AddTagModal.vue'
import DeleteTagModal from '../components/modals/DeleteTagModal.vue'

export default {
  data: function () {
    return {
      tagToDelete: null
    }
  },
  props: {
    tags: {
      type: Array,
      default: null
    },
    id: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'serverSettings',
      'token'
    ])
  },
  components: {
    AddTagModal,
    DeleteTagModal,
    CloseCircleOutlineIcon
  },
  methods: {
    onDeleteClicked: function (tag) {
      this.tagToDelete = tag
      this.$refs.tagDeleteModal.show()
    },
    onAddClicked: function () {
      this.$refs.tagAddModal.show()
    }
  }
}
</script>

<style>
.image-tag .badge {
  padding: 5px;
}
.image-tag .badge .material-design-icon {
  height: unset;
}
.image-tag .badge:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.image-tag .badge:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
