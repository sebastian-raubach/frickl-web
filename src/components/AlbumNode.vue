<template>
  <div class="album">
    <hr/>
    <hr/>
    <router-link :to="'/albums/' + album.id" :title="album.name">
      <b-card class="album-card" no-body>
        <div class="card-img-wrap">
          <img :src="baseUrl + 'image/' + album.bannerImageId + '/img?small=true'" class="card-img"/>
        </div>
        <div class="card-img-overlay h-100 d-flex flex-column justify-content-end">
          <div>
            <h5>{{ album.name }}</h5>
          </div>
        </div>
      </b-card>
    </router-link>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  props: [ 'baseUrl', 'album' ]
}
</script>

<style>
  .album-card .card-img {
    width: 100%;
    object-fit: cover;
    height: 300px;
    transition: transform .2s ease-in-out;
  }
  .album-card h5 {
    margin: 0
  }
  .album-card .card-img-overlay {
    padding: 0!important;
  }
  .album-card .card-img-overlay > *:first-child {
    padding: 1.25rem;
    margin:0 !important;
    background-color: rgba(1,1,1,.5);
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .album-card .card-img-wrap {
    overflow: hidden;
    position: relative;
  }
  .album-card:hover .card-img {
    transform: scale(1.05);
  }
  .album > hr {
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    border-color:  rgba(0, 0, 0, 0.2)
  }
  .album > hr:first-child {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  .album > hr:nth-child(2) {
    margin-left: 0.65rem;
    margin-right: 0.65rem;
  }
</style>
