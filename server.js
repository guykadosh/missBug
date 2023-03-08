const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const app = express()

const port = process.env.PORT || 3030

// Express App Configuration:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/**', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// LIST
app.get('/api/bug', (req, res) => {
  const filterBy = req.query

  bugService
    .query(filterBy)
    .then(bugs => res.send(bugs))
    .catch(err => res.status(500).send('Cannot get bugs'))
})

// USER
app.get('/api/user', (req, res) => {
  userService
    .query()
    .then(users => res.send(users))
    .catch(err => res.status(500).send('Cannot get bugs'))
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService
    .getById(userId)
    .then(user => res.send(user))
    .catch(err => res.status(500).send('Cannot get user'))
})

app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  bugService
    .hasBugs(userId)
    .then(() => {
      userService
        .remove(userId)
        .then(() => res.send('Removed!'))
        .catch(err => res.status(401).send(err))
    })
    .catch(err => res.status(401).send(err))
})

app.post('/api/login', (req, res) => {
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  }

  userService.checkLogin(credentials).then(user => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      res.status(401).send('Invalid credentials')
    }
  })
})

app.post('/api/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
  const signupInfo = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
  }

  userService.signup(signupInfo).then(user => {
    const loginToken = userService.getLoginToken(user)
    res.cookie('loginToken', loginToken)
    res.send(user)
  })
})

// CREATE
app.post('/api/bug', (req, res) => {
  const { loginToken } = req.cookies
  const loggedinUser = userService.validateToken(loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const { title, description, severity } = req.body
  const creator = loggedinUser

  const bug = {
    title,
    description,
    severity,
    createdAt: new Date(),
    creator,
  }

  bugService
    .save(bug)
    .then(savedBug => res.send(savedBug))
    .catch(err => res.status(500).send('Cannot save bug'))
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const { loginToken } = req.cookies
  const loggedinUser = userService.validateToken(loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot update bug')

  const { _id, title, description, severity, createdAt, creator } = req.body

  const bug = {
    _id,
    title,
    description,
    severity,
    createdAt,
    creator,
  }

  bugService
    .save(bug, loggedinUser)
    .then(savedBug => res.send(savedBug))
    .catch(err => res.status(500).send('Cannot save bug'))
})

// READ
app.get('/api/bug/:bugId', (req, res) => {
  const { loginToken } = req.cookies
  const user = userService.validateToken(loginToken)
  console.log('User is:', user)
  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const { bugId } = req.params

  // const visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')
  // if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
  // if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
  // res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7 * 1000 })

  bugService
    .getById(bugId)
    .then(bug => res.send(bug))
    .catch(err => res.status(500).send('Cannot get bug'))
})

app.delete('/api/bug/:bugId', (req, res) => {
  const { loginToken } = req.cookies
  const loggedinUser = userService.validateToken(loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot update bug')

  const { bugId } = req.params

  bugService
    .remove(bugId, loggedinUser)
    .then(() => res.send('Removed!'))
    .catch(err => res.status(401).send(err))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
