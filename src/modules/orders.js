import services from "@/services";

export default {
  state: {},
  mutations: {},
  actions: {
    orderCreate: async (context, order) => {
      const { statusText, data } = await services.orders.create(order);
      if (statusText !== "Created")
        throw {
          title: "Aviso",
          message: "Error al ejecutar la compra",
          variant: "warning",
        };
      return data;
    },
  },
  getters: {},
  namespaced: true,
};
