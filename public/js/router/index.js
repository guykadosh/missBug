import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import homePage from '../pages/home-page.cmp.js'
import userDetails from '../pages/user-details.cmp.js'
import userList from '../pages/user-list.cmp.js'

const routes = [
  { path: '/', component: homePage },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
  { path: '/user/:userId', component: userDetails },
  { path: '/admin', component: userList },
]

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})
