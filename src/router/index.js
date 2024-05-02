import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ImageStream from '@/views/ImageStream.vue'
import ImageDetails from '@/views/ImageDetails.vue'
import Favorites from '@/views/Favorites.vue'
import AboutView from '@/views/AboutView.vue'
import ImageMap from '@/views/ImageMap.vue'
import Tags from '@/views/Tags.vue'
import Statistics from '@/views/StatisticsView.vue'
import AlbumView from '@/views/AlbumView.vue'
import UsersView from '@/views/UsersView.vue'
import Page403 from '@/components/error/Page403.vue'
import store from '@/store'

function requireAdmin(to, from, next) {
  const userPermissions = store.getters.storeUserPermissions

  if (userPermissions && userPermissions['IS_ADMIN']) {
    next()
  } else {
    next({ name: '403' })
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/403',
    name: '403',
    component: Page403
  },
  {
    path: '/image-stream',
    name: 'image-stream',
    component: ImageStream
  },
  {
    path: '/album',
    name: 'albums',
    component: AlbumView
  },
  {
    path: '/album/:parentAlbumId',
    name: 'albums-for-parent',
    component: AlbumView
  },
  {
    path: '/image/:imageId',
    name: 'image-details',
    component: ImageDetails
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites
  },
  {
    path: '/map',
    name: 'map',
    component: ImageMap
  },
  {
    path: '/tag',
    name: 'tags',
    component: Tags
  },
  {
    path: '/tag/:tagId',
    name: 'tag-specific',
    component: Tags
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics
  },
  {
    path: '/user',
    name: 'users',
    component: UsersView,
    beforeEnter: requireAdmin
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
