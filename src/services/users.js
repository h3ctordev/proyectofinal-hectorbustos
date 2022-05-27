import axios from "axios";

const endpoint = `${process.env.VUE_APP_URL_MOCKAPI}/users`;

const users = {
  // query como objeto
  getAll: async (query) => {
    if (query) {
      const queryStr = Object.keys(query)
        .map((key) => key + "=" + query[key])
        .join("&");
      console.log("QueryString", queryStr);
      return await axios.get(`${endpoint}?${queryStr}`);
    }
    return await axios.get(endpoint);
  },
  getById: async (id) => {
    if (!id) throw TypeError("MISSING_ID_USER");
    return await axios.get(`${endpoint}/${id}`);
  },
  create: async (user) => {
    const { email, name, avatar, password, role } = user;
    if (!(email && name && avatar && password && role))
      throw TypeError("MISSING_PARAMS");

    return await axios.post(`${endpoint}`, user);
  },
  update: async (user) => {
    const { id, userUpdate } = user;
    if (!id) throw TypeError("MISSING_ID_USER");

    return await axios.put(`${endpoint}/${id}`, userUpdate);
  },
  delete: async (id) => {
    if (!id) throw TypeError("MISSING_ID_USER");
    return await axios.delete(`${endpoint}/${id}`);
  },
};

export default users;
