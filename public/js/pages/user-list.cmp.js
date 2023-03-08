import { showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

export default {
  template: `
    <section v-if="users" class="user-list main-layout">
        <h2>Hello Admin</h2>
        <p>Users: </p>
        <ul class="cards grid">
          <li class="card" v-for="user in users">
            <p>fullname: {{ user.fullname }}</p>
            <p>username: {{ user.username }}</p>
            <button class="btn" @click="remove(user._id)">X</button>
          </li>
        </ul>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      users: null,
    }
  },
  created() {
    userService.query().then(users => (this.users = users))
  },
  methods: {
    remove(userId) {
      userService.remove(userId).then(() => showSuccessMsg('user removed'))
    },
  },
  computed: {},
  unmounted() {},
}
