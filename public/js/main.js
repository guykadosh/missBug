import { router } from './router/index.js'
import appHeader from './cmps/app-header.cmp.js'
import userMsg from './cmps/user-msg.cmp.js'
import navBar from './cmps/nav-bar.cmp.js'
import { eventBus } from './services/event-bus.service.js'

const options = {
  template: `
    <app-header />
    <user-msg />
    <router-view/>
    `,
  router,
  components: {
    appHeader,
    userMsg,
    navBar,
  },
  data() {
    return {
      user: null,
    }
  },
  created() {
    eventBus.on('loggedIn', this.setUser)
  },
  methods: {
    setUser(user) {
      this.user = user
      console.log(user)
    },
  },
}

const app = Vue.createApp(options)
app.use(router)
app.mount('#app')
