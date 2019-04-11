<template>
  <router-link :to="'/images/' + image.id">
    <b-card no-body class="image-card">
      <div class="card-img-wrap">
        <img :src="baseUrl + 'image/' + image.id + '/img?small=true'" class="card-img"/>
      </div>
      <div class="card-img-overlay h-100 d-flex flex-column justify-content-end">
      </div>
    </b-card>
  </router-link>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  props: [ 'baseUrl', 'image' ]
}
</script>

<style>
  .image-card .card-img {
    width: 100%;
    object-fit: cover;
    transition: transform .2s ease-in-out;
  }
  .image-card .card-img-overlay {
    padding: 0!important;
  }
  .image-card .card-img-overlay *:first-child {
    padding: 1.25rem;
    margin:0 !important;
    background-color: rgba(1,1,1,.5);
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .image-card .card-img-wrap {
    overflow: hidden;
    position: relative;
  }
  .image-card .card:hover .card-img {
    transform: scale(1.05);
  }
</style>
