import Vue from "vue";
import Vuex from "vuex";

import users from "@/modules/orders";
import products from "@/modules/products";
import orders from "@/modules/users";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    products,
    orders,
  },
});
