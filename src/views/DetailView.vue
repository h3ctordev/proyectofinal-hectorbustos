<template>
  <b-container style="height: 100%" class="h-100 my-5">
    <nav-bar @open-cart="open = true" :cart="cart" />

    <!-- CARGA -->
    <b-row
      v-show="isLoading"
      align-h="center"
      align-v="center"
      class="p-5 my-2"
    >
      <b-col col cols="12">
        <strong>Cargando...</strong>
      </b-col>
      <b-col col cols="12" class="text-center my-3">
        <b-spinner></b-spinner>
      </b-col>
    </b-row>
    <!-- Tarjeta detalle -->
    <b-row class="my-5 py-5 w-75 mx-auto" role="tablist">
      <b-col cols="12" align-self="start" class="my-3">
        <b-button size="lg" pill to="/">
          <b-icon icon="arrow-left"></b-icon> Volver
        </b-button>
      </b-col>
      <product-detail :product="product" @add-cart="onAddCart" />
    </b-row>
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
  </b-container>
</template>

<script>
import NavBar from "@/components/NavBar";
import ProductDetail from "@/components/ProductDetail";
import CartTable from "@/components/CartTable";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "DetailView",
  components: {
    NavBar,
    CartTable,
    ProductDetail,
  },
  props: {
    productId: String,
  },
  data() {
    return {
      cart: [],
      product: {},
      open: false,
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    const arr = await this.productsList({ id: this.productId });
    this.product = arr[0];
    const order = this.getLocalStorage("order");
    this.cart = [...(order?.cart || [])];
    this.isLoading = false;
  },
  computed: {
    ...mapActions("products", ["getProductList"]),
    ...mapGetters("users", ["loggedUser", "userId"]),
  },
  methods: {
    ...mapActions("orders", ["orderCreate"]),
    ...mapActions("products", ["productsList", "updateProduct"]),
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

<style scoped>
.w-max {
  width: 30rem;
}
.h-min {
  min-height: 35rem;
}
</style>
