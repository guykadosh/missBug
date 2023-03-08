import login from './login.cmp.js'

export default {
  template: `
        <header class="flex space-between align-center">
            <div class="flex align-center">
              <!-- <div class="logo">
                <img src="img/logo.png" alt="">
              </div> -->
              <h1>Miss Bug</h1>    
            </div>
            <div class="nav-bar">

            </div>
        </header>
    `,
  components: {
    login,
  },
}
