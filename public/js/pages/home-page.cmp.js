import { showSuccessMsg, eventBus } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

export default {
  template: `
    <section class="home app-main main-layout flex">
        <!-- <section v-if="user" class="user-info">
            <pre>
                {{user}}
            </pre>
            <button @click="logout">Logout</button>
        </section> -->
        <section class="login" >
        <h2>Login</h2>
        <form  @submit.prevent="login" class="form">
            <input type="text" v-model="credentials.username" placeholder="Username" />
            <input type="password" v-model="credentials.password" placeholder="Password" />
            <button class="btn-login">
              <span>Login</span>
              <svg viewBox="0 0 13 10" height="10px" width="15px">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </button>
        </form>
        <hr />
        <h2>Signup</h2>
        <form  @submit.prevent="signup" class="form">
            <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
            <input type="text" v-model="signupInfo.username" placeholder="Username" />
            <input type="password" v-model="signupInfo.password" placeholder="Password" />
            <button class="btn-login">
              <span>Signup</span>
              <svg viewBox="0 0 13 10" height="10px" width="15px">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </button>
        </form>
        </section>   
        <div class="right">
          <h1>Welcome to MissBug</h1>
          <img src="img/home-page.svg" alt="">     
        </div>
    </section>
    `,
  data() {
    return {
      user: null,
      credentials: {
        username: '',
        password: '',
      },
      signupInfo: {
        fullname: '',
        username: '',
        password: '',
      },
    }
  },
  created() {
    this.user = userService.getLoggedInUser()
    if (this.user) this.emitLogin()
  },

  methods: {
    login() {
      userService
        .login(this.credentials)
        .then(user => {
          this.user = user
          showSuccessMsg(`Welcome ${user.fullname}`)
          this.emitLogin()
        })
        .catch(err => {
          console.log('Cannot login', err)
        })
    },
    signup() {
      userService
        .signup(this.signupInfo)
        .then(user => {
          this.user = user
        })
        .catch(err => {
          console.log('Cannot signup', err)
          this.signupInfo = {
            fullname: '',
            username: '',
            password: '',
          }

          this.emitLogin()
        })
    },
    logout() {
      userService
        .logout()
        .then(() => {
          this.user = null
        })
        .catch(err => {
          console.log('Cannot logout', err)
        })
    },
    emitLogin() {
      this.$router.push('/bug')
      eventBus.emit('loggedIn', this.user)
    },
  },
}
