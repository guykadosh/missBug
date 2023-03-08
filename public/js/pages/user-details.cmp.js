import { bugService } from '../services/bug-service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import bugList from '../cmps/bug-list.cmp.js'

export default {
  template: `
      <section v-if="user" class="user-details main-layout">
          <p>Hello, {{user.fullname}}</p>
          <p>username: {{ user.username }}</p>
          <div v-if="userBugs">
            <bug-list :bugs="userBugs" @removeBug="removeBug" />
            <button @click="setPage(-1)">Prev</button>
            <button @click="setPage(1)">Next</button>
          </div>
          <router-link to="/bug">Back</router-link>
      </section>

      `,
  components: {
    bugList,
  },
  data() {
    return {
      user: null,
      userBugs: null,
      filterBy: {
        userId: '',
        txt: '',
        pageIdx: 0,
      },
    }
  },
  created() {
    const { userId } = this.$route.params
    console.log(userId)
    userService.getById(userId).then(user => {
      this.user = user
      this.filterBy.userId = this.user._id
      this.loadBugs()
    })
    // this.user = userService.getLoggedInUser()
  },
  methods: {
    loadBugs() {
      bugService
        .query(this.filterBy)
        .then(bugs => (this.userBugs = bugs))
        .catch(err => showErrorMsg('Could not get bugs'))
    },
    setPage(diff) {
      this.filterBy.pageIdx += diff
      if (this.filterBy.pageIdx < 0) this.filterBy.pageIdx = 0
      if (this.filterBy.pageIdx > this.userBugs.length - 1) {
        this.filterBy.pageIdx = 0
      }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
  },
  computed: {},
  unmounted() {},
}
