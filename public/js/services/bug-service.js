export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

const API = 'api/bug/'

function query(filterBy) {
  return axios.get(API, { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
  return axios
    .get(API + bugId)
    .then(res => res.data)
    .catch(err => console.log(err))
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
    description: '',
  }
}

function remove(bugId) {
  return axios.delete(API + bugId).then(res => res.data)
}

function save(bug) {
  if (bug._id) return axios.put(API + bug._id, bug).then(res => res.data)

  return axios.post(API, bug).then(res => res.data)
}
