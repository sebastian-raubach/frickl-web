import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
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
      path: '/xago/:year',
      name: 'xago',
      component: () => import(/* webpackChunkName: "xago" */ './views/XAgo.vue')
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
      name: 'image-details',
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
    },
    {
      path: '/accesstokens',
      name: 'accessTokens',
      component: () => import(/* webpackChunkName: "accessToken" */'./views/AccessTokens.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.query && to.query.accesstoken) {
    store.dispatch('ON_ACCESS_TOKEN_CHANGED', to.query.accesstoken)

    const query = Object.assign({}, to.query)
    delete query.accesstoken

    next({ path: to.path, query: query, params: to.params })
  } else {
    next()
  }
})

export default router
