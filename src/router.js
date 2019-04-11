import Vue from 'vue'
import Router from 'vue-router'
import Albums from './views/Albums.vue'
import Home from './views/Home.vue'
import Images from './views/ImageDetails.vue'
import Tags from './views/Tags.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: { baseUrl: null }
    },
    {
      path: '/albums',
      name: 'albums',
      component: Albums,
      props: { baseUrl: null }
    },
    {
      path: '/albums/:albumId',
      name: 'sub-album',
      component: Albums,
      props: { baseUrl: null }
    },
    {
      path: '/images/:imageId',
      name: 'images',
      component: Images,
      props: { baseUrl: null }
    },
    {
      path: '/tags',
      name: 'tags',
      component: Tags,
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
