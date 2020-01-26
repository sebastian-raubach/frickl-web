import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/images',
      name: 'images',
      component: () => import(/* webpackChunkName: "images" */ './views/Images.vue')
    },
    {
      path: '/albums',
      name: 'albums',
      component: () => import(/* webpackChunkName: "albums" */ './views/Albums.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import(/* webpackChunkName: "calendar" */ './views/Calendar.vue')
    },
    {
      path: '/albums/:albumId',
      name: 'sub-album',
      component: () => import(/* webpackChunkName: "sub-album" */ './views/Albums.vue')
    },
    {
      path: '/images/:imageId',
      name: 'images',
      component: () => import(/* webpackChunkName: "imageDetails" */ './views/ImageDetails.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import(/* webpackChunkName: "favorite" */ './views/Favorites.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import(/* webpackChunkName: "stats" */ './views/Stats.vue')
    },
    {
      path: '/maps',
      name: 'maps',
      component: () => import(/* webpackChunkName: "maps" */ './views/Maps.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "tags" */ './views/Tags.vue')
    },
    {
      path: '/tags/:tagId',
      name: 'tag-details',
      component: () => import(/* webpackChunkName: "tagDetails" */ './views/Tags.vue')
    },
    {
      path: '/search/:searchTerm',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
