import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Chat from '@/components/Chat'
import GMap from '@/components/home/GMap'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import Chat2 from '@/components/chat/Chat2'
import ViewProfile from '@/components/profile/ViewProfile'
import AddCard from '@/components/recepies/AddCard'
import EditCard from '@/components/recepies/EditCard'
import firebase from 'firebase'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:id/AddCard',
      name: 'AddCard',
      component: AddCard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:id/EditCard/:card_slug',
      name: 'EditCard',
      component: EditCard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'Chat2',
      component: Chat2,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },
    //chat component with beforeEnter
    {
      path: '/chat2',
      name: 'Chat',
      component: Chat,
      props: true,
      beforeEnter: (to, from, next) => {
        if (to.params.name){
          next()
        } else {
          next({ name: 'Welcome' })
        }
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if (user){
      //user signed in, process to route
      next()
    } else {
      //no user signed in, require to login
      next({ name: 'Login' })
    } 
  } else {
    next()
  }
})


export default router