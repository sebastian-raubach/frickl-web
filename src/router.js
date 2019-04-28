import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/albums',
      name: 'albums',
      component: () => import(/* webpackChunkName: "about" */ './views/Albums.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import(/* webpackChunkName: "about" */ './views/Calendar.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/albums/:albumId',
      name: 'sub-album',
      component: () => import(/* webpackChunkName: "about" */ './views/Albums.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/images/:imageId',
      name: 'images',
      component: () => import(/* webpackChunkName: "about" */ './views/ImageDetails.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import(/* webpackChunkName: "about" */ './views/Favorites.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import(/* webpackChunkName: "about" */ './views/Stats.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "about" */ './views/Tags.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/tags/:tagId',
      name: 'tags',
      component: () => import(/* webpackChunkName: "about" */ './views/Tags.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      props: { baseUrl: null }
    }
  ]
})
