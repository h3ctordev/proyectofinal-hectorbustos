<template>
  <div id="app">
    <nav-bar :cart="cart" @confirm.once="onConfirmBuyout" />
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismiss-count-down="countDownChanged"
    >
      This alert will dismiss after {{ dismissCountDown }} seconds...
    </b-alert>
    <div class="d-flex flex-wrap justify-content-center p-5">
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
      dismissCountDown: 0,
      dismissSecs: 10,
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
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    onConfirmBuyout(total) {
      this.cart = [];
      this.contentAlert = `Se genero la compra existosa por el valor de : $${total}. \nMuchas gracias. `;
      this.showAlert();
    },
  },
};
</script>
