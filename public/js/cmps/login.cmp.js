import { userService } from '../services/user.service.js'

export default {
  template: `
    <section class="user">
      <form v-if="!username" @submit="login">
        <label for="user-login">
          Log-in
        </label>
        <input 
            type="text" 
            id="user-login"
            v-model="input">
          <button>Login</button>
      </form>
      <div v-else>
        <p>Hello {{ username }}</p>  
        <button  @click="logout">Logout</button>
      </div>
    </section>
`,
  data() {
    return {
      username: null,
      input: '',
    }
  },
  created() {
    const { username } = userService.getLoggedInUser()
    this.username = username
    if (this.username) userService.login(this.username)
  },
  methods: {
    login() {
      userService.login(this.input).then(() => (this.username = this.input))
    },
    logout() {
      userService.logout().then(() => (this.username = null))
    },
  },
  computed: {},
  unmounted() {},
}
