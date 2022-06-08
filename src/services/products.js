import axios from "axios";

const endpoint = `${process.env.VUE_APP_URL_MOCKAPI}/products`;

export default {
  getAll: async (query) => {
    if (query) {
      const queryStr = Object.keys(query)
        .map((key) => key + "=" + query[key])
        .join("&");
      return await axios.get(`${endpoint}?${queryStr}`);
    }
    return await axios.get(endpoint);
  },
  getById: async (id) => {
    if (!id) throw TypeError("MISSING_ID_PRODUCT");
    return await axios.get(`${endpoint}/${id}`);
  },
  create: async (product) => {
    const { img, name, price, description, available } = product;
    if (!(img && name && price && description && available))
      throw TypeError("MISSING_PARAMS");

    return await axios.post(`${endpoint}`, product);
  },
  update: async (product) => {
    const { id, ...productUpdate } = product;
    if (!id) throw TypeError("MISSING_ID_PRODUCT");
    return await axios.put(`${endpoint}/${id}`, productUpdate);
  },
  delete: async (id) => {
    if (!id) throw TypeError("MISSING_ID_PRODUCT");
    return await axios.delete(`${endpoint}/${id}`);
  },
};
