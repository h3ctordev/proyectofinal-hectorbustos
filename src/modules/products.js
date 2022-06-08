import services from "@/services";

export default {
  state: {
    list: [],
  },
  mutations: {
    SET_PRODUCTS_LIST: (state, data) => (state.list = [...data]),
    SET_PRODUCT_UPDATED: (state, product) =>
      state.map((p) => (p.id === product.id ? product : p)),
  },
  actions: {
    productsList: async ({ commit }, data) => {
      try {
        const res = await services.products.getAll(data);
        if (res.statusText !== "OK")
          throw { title: "Error", message: "Error en la consulta" };
        if (res.data.length === 0)
          throw { variant: "warning", message: "No hay productos " };
        commit("SET_PRODUCTS_LIST", [...res.data]);
        return [...res.data];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // eslint-disable-next-line
    createProduct: async (context, product) => {
      try {
        const res = await services.products.create(product);
        if (res.statusText !== "Created")
          throw {
            title: `Problemas al crear el producto`,
            message: `El producto no se agrego correctamente`,
            variant: "danger",
          };
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    updateProduct: async ({ commit }, product) => {
      try {
        const res = await services.products.update(product);
        commit("SET_PRODUCT_UPDATED", res.data);
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // eslint-disable-next-line
    removeProduct: async (context, id) => {
      try {
        const res = await services.products.delete(id);
        if (res.statusText !== "OK")
          throw {
            title: "Error",
            message: "Error al cargar los productos",
            variant: "danger",
          };
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  getters: {
    getProductList: (state) => [...state.list],
  },
  namespaced: true,
};
