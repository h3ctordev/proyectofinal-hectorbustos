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
      <cart-table
        :cart="cart"
        @complete="onCompleteBuyout"
        @cart-clean="onCartClean"
      />
    </b-modal>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";
import CartTable from "@/components/CartTable";
import services from "@/services";
import { mapActions } from "vuex";
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
    };
  },
  computed: {
    isCartEmpty() {
      if (this.cart.length) return false;
      return true;
    },
  },
  async mounted() {
    await this.getProducts();
    const order = this.getLocalStorage("order");
    this.cart = [...(order?.cart || [])];
  },
  methods: {
    ...mapActions("products", ["productsList", "updateProduct"]),
    onCartClean() {
      this.open = false;
      if (this.isCartEmpty) {
        return;
      }
      this.cart = [];
      this.setLocalStorage("order", {
        cart: this.cart,
        userId: this.getSessionStorage("user").id,
      });
    },
    onAddCart(value) {
      // NOTE: No sestoy seguro de que se deba quitar las cantidades de los items antes de ejecutar la compra
      // this.products = this.products.map((p) =>
      //   p.id === value.id ? { ...p, available: p.available - value.qty } : p
      // );

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
      this.setLocalStorage("order", {
        cart: this.cart,
        userId: this.getSessionStorage("user").id,
      });
    },
    async onCompleteBuyout(total) {
      try {
        const order = this.getLocalStorage("order");
        order.total = total;
        order.date = parseInt(new Date().getTime() / 1000);
        const productsDb = await this.productsList();
        const cartOrder = [...order.cart];
        const orderCreated = await services.orders.create(order);
        if (orderCreated.statusText !== "Created") {
          this.toast({
            title: "Aviso",
            message: "Error al ejecutar la compra",
            variant: "warning",
            hide: 5000,
          });
          return;
        }
        // Se actualiza cantidades en
        const updateProducts = cartOrder.map((p) => {
          const product = productsDb.find((pdb) => +pdb.id === +p.id);
          product.available = product.available - p.qty;
          return this.updateProduct(product);
        });
        await Promise.all([...updateProducts]);
        const content = `Su compra por el monto de $${total} se completo con exito`;
        this.cart = [];
        this.toast({
          title: "Compra Exitosa",
          message: content,
          variant: "success",
          hide: 5000,
        });
        this.setLocalStorage("order", {
          cart: this.cart,
          userId: this.getSessionStorage("user").id,
        });
        this.open = false;
        await this.getProducts();
      } catch (error) {
        console.error(error);
        this.toast({
          title: "Error",
          message: "Error al ejecutar la compra",
          variant: "warning",
          hide: 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },

    async getProducts() {
      try {
        this.isLoading = true;
        this.products = await this.productsList();
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
