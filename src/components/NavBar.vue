<template>
  <b-navbar type="dark" variant="dark" fixed="top">
    <b-navbar-brand class="text-white" to="/"> AppPedidos </b-navbar-brand>
    <b-collapse is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="isLoggedIn">
          <template #button-content>
            <b-avatar class="mx-2" variant="success" :src="getAvatarImg" />
          </template>
          <b-dropdown-item to="/perfil">Perfil</b-dropdown-item>
          <b-dropdown-item @click="onSignout">Cerrar sesión</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-button
        v-if="!isLoggedIn"
        class="mx-2 py-3"
        variant="success"
        to="/access"
      >
        <b>
          <em> Acceso </em>
        </b>
      </b-button>
      <b-button class="py-3" variant="outline-success" @click="openCart">
        <b-icon icon="cart4"></b-icon> ({{ countItems }})
      </b-button>
    </b-collapse>
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
      user: this.getSessionStorage("user"),
    };
  },
  methods: {
    openCart() {
      this.$emit("open-cart");
    },
    onSignout() {
      this.user = null;
      this.removeItemSessionStorage("user");
      const order = this.getLocalStorage("order");
      this.setLocalStorage("order", { cart: order?.cart, userId: null });
      this.isLoggedIn;
    },
  },
  computed: {
    countItems() {
      return this.cart.reduce((sum, a) => (sum += a.qty), 0);
    },
    getTotal() {
      return this.cart.reduce((sum, a) => (sum += a.total), 0);
    },
    getAvatarImg() {
      return this.user.avatar || process.env.VUE_APP_DEFAULT_AVATAR;
    },
    isLoggedIn() {
      return !!this.user;
    },
  },
};
</script>
