import Vue from "vue";
import Vuex from "vuex";

import users from "@/modules/users";
import products from "@/modules/products";
import orders from "@/modules/orders";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    products,
    orders,
  },
});
