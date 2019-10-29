const state = {
  doSave: false
}

const getters = {
  doSave: state => state.doSave
}

const actions = {
  passSave ({commit, state}, payload) {
    commit('setDoSave', payload)
  }
}

const mutations = {
  setDoSave (state, payload) {
    console.log(payload)
    state.doSave = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
