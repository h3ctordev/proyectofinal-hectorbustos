<template>
  <div id="app">
    <nav-bar @open-cart="open = true" :cart="cart" />
    <div class="p-5">
      <div v-if="isLoading" class="p-5">
        <div class="d-flex align-items-center">
          <strong>Cargando productos...</strong>
          <b-spinner class="ml-auto"></b-spinner>
        </div>
      </div>
      <div v-else class="d-flex flex-wrap justify-content-center p-5 my-5">
        <b-alert :show="alert.show" :variant="alert.variant">
          {{ alert.message }}
        </b-alert>
        <div v-for="item in products" :key="item.id">
          <product-card class="m-2" :product="item" @add-cart="onAddCart" />
        </div>
      </div>
    </div>
    <b-modal
      id="cart-modal"
      v-model="open"
      size="lg"
      title="Mi Carro"
      scrollable
      centered
      hide-footer
    >
      <cart-table :cart="cart" @complete="onCompleteBuyout" />
    </b-modal>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";
import CartTable from "@/components/CartTable";
import axios from "axios";
// // mock productos
// import mockProducts from "@/db/products.json";

export default {
  name: "HomeView",
  components: {
    ProductCard,
    NavBar,
    CartTable,
  },
  data() {
    return {
      products: [],
      cart: [],
      dismissCountDown: 0,
      dismissSecs: 10,
      open: false,
      isLoading: false,
      alert: {
        show: false,
        message: "",
        variant: null,
      },
    };
  },
  async mounted() {
    await this.getProducts();
  },
  methods: {
    onAddCart(value) {
      this.products = this.products.map((p) =>
        p.id === value.id ? { ...p, available: p.available - value.qty } : p
      );
      if (this.cart.find((p) => p.id === value.id))
        this.cart = this.cart.map((p) =>
          p.id === value.id
            ? {
                ...p,
                qty: p.qty + value.qty,
                total: p.qty + value.qty * value.price,
              }
            : { ...p }
        );
      else this.cart.push({ ...value, total: value.qty * value.price });
    },
    onCompleteBuyout(total) {
      const content = `Su compra por el monto de $${total} se completo con exito`;
      this.cart = [];
      this.$bvToast.toast(content, {
        title: "Compra Exitosa",
        variant: "success",
        autoHideDelay: 2000,
        appendToast: true,
        solid: true,
      });
    },
    async getProducts() {
      try {
        this.isLoading = true;
        console.log(process.env);
        const res = await axios.get(
          `${process.env.VUE_APP_URL_MOCKAPI}/products`
        );
        console.log(res);
        if (res.statusText !== "OK") {
          this.alert.message = "Error al cargar los productos";
          this.alert.variant = "warning";
          this.alert.show = true;
          return;
        }
        if (res.data.length === 0) {
          this.alert.message = "Error al cargar los productos";
          this.alert.variant = "primary";
          this.alert.show = true;
          return;
        }

        this.products = [...res.data];
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
