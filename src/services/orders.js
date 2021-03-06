import axios from "axios";

const endpoint = `${process.env.VUE_APP_URL_MOCKAPI}/users`;

export default {
  getAll: async (userId) => {
    return await axios.get(`${endpoint}/${userId}/orders`);
  },
  getById: async ({ userId, orderId }) => {
    if (!userId && !orderId) throw TypeError("MISSING_ID_PRODUCT");
    return await axios.get(`${endpoint}/${userId}/orders/${orderId}`);
  },
  create: async (order) => {
    const { cart, userId, total } = order;
    if (!(cart && userId && total)) throw TypeError("MISSING_PARAMS");

    return await axios.post(`${endpoint}/${userId}/orders`, order);
  },
  update: async (userId, order) => {
    const { id, ...orderUpdate } = order;
    if (!id) throw TypeError("MISSING_ID_ORDER");
    if (!userId) throw TypeError("MISSING_ID_USER");

    return await axios.put(`${endpoint}/${userId}/orders/${id}`, orderUpdate);
  },
  delete: async (id) => {
    if (!id) throw TypeError("MISSING_ID_PRODUCT");
    return await axios.delete(`${endpoint}/${id}`);
  },
};
