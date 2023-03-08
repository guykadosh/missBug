export default {
  props: ['bug'],
  template: `<article className="bug-preview" class="card">
                <span><i class="fa-solid fa-bug"></i></span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <p>Creator: <router-link :to="'/user/' + bug.creator._id">{{ bug.creator.username }}</router-link>
                  </p>
                <div class="actions flex space-between">
                  <router-link class="btn" :to="'/bug/' + bug._id">Details</router-link>
                  <router-link class="btn" :to="'/bug/edit/' + bug._id"> Edit</router-link>
                  <button class="btn" @click="onRemove(bug._id)">X</button>
                </div>
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
  },
}
