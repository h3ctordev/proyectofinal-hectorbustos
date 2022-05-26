<template>
  <div id="app">
    <nav-bar :cart="cart" @complete="onCompleteBuyout" />
    <div class="d-flex flex-wrap justify-content-center p-5 my-5">
      <div v-for="item in products" :key="item.id">
        <product-card class="m-2" :product="item" @add-cart="onAddCart" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";

// mock productos
import mockProducts from "./db/products.json";

export default {
  name: "App",
  components: {
    ProductCard,
    NavBar,
  },
  data() {
    return {
      products: [...mockProducts],
      cart: [],
      dismissCountDown: 0,
      dismissSecs: 10,
    };
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
  },
};
</script>
