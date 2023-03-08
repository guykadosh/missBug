export default {
  props: ['user'],
  template: `
      <section class="nav-bar-container">
            <div class="nav-bar">
                <router-link :to="'/user/' + user._id"><i class="fa-solid fa-address-card"></i> Profile</router-link>
                <router-link to="'/bug/"><i class="fa-solid fa-bugs"></i> Bugs</router-link>
                <router-link v-if="user.isAdmin" to="'/admin"><i class="fa-solid fa-screwdriver-wrench"></i> Admin page</router-link>
                <a @click="$emit('loggedout')"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>

            </div>
      </section>
`,
  data() {
    return {}
  },
  created() {
    console.log(this.user)
  },
  methods: {},
  computed: {},
  unmounted() {},
}
