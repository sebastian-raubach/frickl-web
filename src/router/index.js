import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ImageStream from '@/views/ImageStream.vue'
import ImageDetails from '@/views/ImageDetails.vue'
import Favorites from '@/views/Favorites.vue'
import AboutView from '@/views/AboutView.vue'
import ImageMap from '@/views/ImageMap.vue'
import Tags from '@/views/Tags.vue'
import AlbumView from '@/views/AlbumView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
