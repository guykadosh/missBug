const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('puki-is-the-best-919121123')

const users = require('../data/user.json')

module.exports = {
  query,
  checkLogin,
  signup,
  remove,
  getById,
  getLoginToken,
  validateToken,
}

function query() {
  return Promise.resolve(users)
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

function checkLogin({ username, password }) {
  let user = users.find(
    user => user.username === username && user.password === password
  )
  if (user) {
    user = { ...user }
    delete user.password
  }
  return Promise.resolve(user)
}

function signup({ fullname, username, password }) {
  let user = {
    _id: _makeId(),
    fullname,
    username,
    password,
  }

  users.push(user)

  return _saveUsersToFile().then(() => {
    user = { ...user }
    delete user.password
    return user
  })
}

function remove(userId) {
  console.log(userId)
  const idx = users.findIndex(user => user._id === userId)

  users.splice(idx, 1)

  return _saveUsersToFile()
}

function getById(userId) {
  const user = users.find(user => user._id === userId)
  return Promise.resolve(user)
}

function _makeId(length = 5) {
  let txt = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(users, null, 2)
    fs.writeFile('./data/user.json', content, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}
