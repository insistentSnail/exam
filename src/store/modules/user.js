
const user = {
  namespaced: true,
  state: {
    userForm: {}
  },
  mutations: {
    setUserForm(state, form) {
      state.userForm = form;
      // console.log('保存下来的用户', state.userForm);
    }
  },
  actions: {

  }
}

export default user
