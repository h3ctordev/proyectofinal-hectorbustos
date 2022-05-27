<template>
  <b-navbar type="dark" variant="dark" fixed="top">
    <b-navbar-brand class="text-white" to="/"> AppPedidos </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-button class="mx-2" variant="success" to="/access">
        Login/Registro
      </b-button>
      <b-button class="ml-auto" variant="outline-success" @click="openCart">
        <b-icon icon="cart4"></b-icon> ({{ countItems }})
      </b-button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    cart: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    openCart() {
      this.$emit("open-cart");
    },
  },
  computed: {
    countItems() {
      return this.cart.reduce((sum, a) => (sum += a.qty), 0);
    },
    getTotal() {
      return this.cart.reduce((sum, a) => (sum += a.total), 0);
    },
  },
};
</script>
