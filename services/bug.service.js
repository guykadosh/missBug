const fs = require('fs')
const bugs = require('../data/bug.json')

const PAGE_SIZE = 4

module.exports = {
  query,
  save,
  remove,
  getById,
  hasBugs,
}

function query({ txt, pageIdx, userId }) {
  const regex = new RegExp(txt, 'i')
  let filteredBugs = bugs.filter(
    bug => regex.test(bug.title) || regex.test(bug.description)
  )

  if (userId) {
    filteredBugs = filteredBugs.filter(bug => bug.creator._id === userId)
  }

  const startIdx = pageIdx * PAGE_SIZE
  filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)

  return Promise.resolve(filteredBugs)
}

function save(bug, loggedinUser) {
  if (bug._id) {
    const idx = bugs.findIndex(currBug => currBug._id === bug._id)
    if (idx === -1) return Promise.reject('No such bug')

    if (bugs[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
      return Promise.reject('Not authorized update this car')
    }

    bugs[idx] = bug
  } else {
    bug._id = _makeId()
    bugs.push(bug)
  }

  return _saveBugsToFile().then(() => bug)
}

function getById(bugId) {
  const bug = bugs.find(bug => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
  const idx = bugs.findIndex(bug => bug._id === bugId)

  if (idx === -1) return Promise.reject('No such bug')

  if (bugs[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
    return Promise.reject('Not authorized update this car')
  }

  bugs.splice(idx, 1)
  return _saveBugsToFile()
}

function hasBugs(userId) {
  const hasBugs = bugs.some(bug => bug.creator._id === userId)

  if (hasBugs) return Promise.reject('Cannot remove user with bugs')

  return Promise.resolve()
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

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(bugs, null, 2)
    fs.writeFile('./data/bug.json', content, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}
