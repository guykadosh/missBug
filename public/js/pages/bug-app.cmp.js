import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user.service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'
import navBar from '../cmps/nav-bar.cmp.js'
export default {
  template: `
    <section class="bug-ap main-layout">
        <nav-bar v-if="user" :user="user" @loggedout="logout"/>
        <div class="subheader flex justify-center">
          <bug-filter @setFilterBy="setFilter"></bug-filter> 
          <router-link class="btn" to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <div class="flex align-center space-between">
          <button class="btn" @click="setPage(-1)">Prev</button>
          <button class="btn" @click="setPage(1)">Next</button>
        </div>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        txt: '',
        pageIdx: 0,
      },
      user: null,
    }
  },
  created() {
    this.loadBugs()
    this.user = userService.getLoggedInUser()
    if (!this.user) this.$router.push('/')
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(bugs => (this.bugs = bugs))
    },
    setFilter({ txt }) {
      this.filterBy.txt = txt
      console.log(this.filterBy)
      this.loadBugs()
    },
    setPage(diff) {
      this.filterBy.pageIdx += diff
      if (this.filterBy.pageIdx < 0) this.filterBy.pageIdx = 0
      if (this.filterBy.pageIdx > this.bugs.length - 1) {
        this.filterBy.pageIdx = 0
      }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
    logout() {
      userService
        .logout()
        .then(() => {
          this.user = null
          this.$router.push('/')
        })
        .catch(err => {
          console.log('Cannot logout', err)
        })
    },
  },
  computed: {},
  components: {
    bugList,
    bugFilter,
    navBar,
  },
}
