'use strict'

export default {
  template: `
        <section class="bug-filter">
            <input class="input"
                   @input="setFilterBy" 
                   type="text" 
                   v-model="filterBy.txt"
                   placeholder="filter by text">
        </section>
    `,
  data() {
    return {
      filterBy: {
        txt: '',
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}
