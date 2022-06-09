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
        <div v-for="item in getProductList" :key="item.id">
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
import { mapActions, mapGetters } from "vuex";
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
    ...mapGetters("products", ["getProductList"]),
    ...mapGetters("users", ["userId"]),
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
    ...mapActions("orders", ["orderCreate"]),
    onCartClean() {
      this.open = false;
      if (this.isCartEmpty) {
        return;
      }
      this.cart = [];
      this.setLocalStorage("order", {
        cart: this.cart,
        userId: this.userId,
      });
    },
    onAddCart(value) {
      // Se evalua si el producto ya existe en el carro
      if (this.cart.find((p) => p.id === value.id))
        this.cart = this.cart.map((p) => {
          // Si el producto ya existe se busca y se actualiza el precio y cantidad
          if (p.id === value.id) {
            // Si la cantidad es mayor de los que hay disponible, se agrega solo hasta lo que hay disponible
            const qty =
              +p.qty + value.qty > +value.available
                ? +value.available
                : +p.qty + value.qty;
            return {
              ...p,
              qty: +qty,
              total: qty * value.price,
            };
          }
          return { ...p };
        });
      else this.cart.push({ ...value, total: value.qty * value.price });
      this.setLocalStorage("order", {
        cart: this.cart,
        userId: this.userId,
      });
    },
    async onCompleteBuyout(total) {
      try {
        this.open = false;
        this.isLoading = true;
        const order = this.getLocalStorage("order");
        order.total = total;
        order.date = parseInt(new Date().getTime() / 1000);
        const productsDb = await this.productsList();
        const cartOrder = [...order.cart];
        await this.orderCreate(order);

        // Se actualiza cantidades en
        const updateProducts = cartOrder.map((p) => {
          const product = productsDb.find((pdb) => +pdb.id === +p.id);
          product.available = product.available - p.qty;
          return this.updateProduct(product);
        });
        await Promise.all([...updateProducts]);
        const content = `Su compra por el monto de $${total} se completo con éxito`;
        this.cart = [];
        this.toast({
          title: "Compra Exitosa",
          message: content,
          variant: "success",
          hide: 5000,
        });
        this.setLocalStorage("order", {
          cart: this.cart,
          userId: this.userId,
        });
        this.open = false;
        await this.getProducts();
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

    async getProducts() {
      try {
        this.isLoading = true;
        await this.productsList();
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
