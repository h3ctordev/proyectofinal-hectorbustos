<template>
  <div id="app">
    <nav-bar :cart="cart"></nav-bar>
    <div class="d-flex flex-wrap justify-content-start p-5">
      <products-card
        class="m-2"
        v-for="item in products"
        :key="item.id"
        :product="item"
        @add-cart="onAddCart"
      />
    </div>
  </div>
</template>

<script>
import ProductsCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";

// mock productos
import mockProducts from "./db/products.json";

export default {
  name: "App",
  components: {
    ProductsCard,
    NavBar,
  },
  data() {
    return {
      products: [...mockProducts],
      cart: [],
    };
  },
  methods: {
    onAddCart(value) {
      console.log(value);
      this.products = this.products.map((p) =>
        p.id === value.id ? { ...p, available: p.available - value.qty } : p
      );
      if (this.cart.find((p) => p.id === value.id))
        this.cart = this.cart.map((p) =>
          p.id === value.id ? { ...p, qty: p.qty + value.qty } : { ...p }
        );
      else this.cart.push({ ...value });
      console.log(this.cart);
    },
  },
};
</script>
