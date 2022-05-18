<template>
  <b-navbar
    type="dark"
    variant="dark"
    class="d-flex justify-content-between px-4"
  >
    <b-navbar-brand class="text-white" href="/">AppPedidos</b-navbar-brand>

    <b-button class="ml-auto" variant="outline-success" @click="openCart">
      <b-icon icon="cart4"></b-icon> ({{ countItems }})
    </b-button>
    <b-modal v-model="open" title="Mi Carro">
      <p class="my-4">Hello from modal!</p>
    </b-modal>
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
    return {
      open: false,
    };
  },
  methods: {
    openCart() {
      this.open = true;
    },
  },
  computed: {
    countItems() {
      return this.cart.reduce((sum, a) => (sum += a.qty), 0);
    },
  },
};
</script>
<style lang="sass"></style>
