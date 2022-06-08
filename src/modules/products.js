import services from "@/services";

export default {
  state: {
    list: [],
  },
  mutations: {
    SET_PRODUCTS_LIST(state, data) {
      state.list = [...data];
    },
  },
  actions: {
    productsList: async ({ commit }, data) => {
      try {
        const res = await services.products.getAll(data);
        console.log(res);
        commit("SET_PRODUCTS_LIST", [...res.data]);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  getters: {},
  namespaced: true,
};
