<template>
  <b-navbar
    type="dark"
    variant="dark"
    class="d-flex justify-content-between px-4"
    fixed="top"
  >
    <b-navbar-brand class="text-white" href="/">AppPedidos</b-navbar-brand>

    <b-button class="ml-auto" variant="outline-success" @click="open = !open">
      <b-icon icon="cart4"></b-icon> ({{ countItems }})
    </b-button>
    <b-modal id="cart-modal" v-model="open" size="lg" scrollable centered>
      <template #modal-header>
        <b-container>
          <b-row align-h="between">
            <b-col cols="6">
              <h4>Mi Carro</h4>
            </b-col>
            <b-col cols="2" sm="1">
              <b-button
                class="text-decoration-none text-black"
                variant="link"
                @click="open = false"
              >
                <b-icon icon="x"></b-icon>
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <b-table :items="cart" :fields="fields">
        <template #cell(price)="{ item }"> $ {{ item.price | clp }} </template>
        <template #cell(total)="{ item }"> $ {{ item.total | clp }} </template>
        <template #custom-foot>
          <b-tr>
            <b-th></b-th>
            <b-th></b-th>
            <b-th class="text-end">Total</b-th>
            <b-th class="text-center"> $ {{ getTotal | clp }}</b-th>
          </b-tr>
        </template>
      </b-table>
      <template #modal-footer>
        <div class="text-left">
          <b-button
            variant="outline-success"
            :disabled="countItems === 0"
            @click="onConfirmBuyout"
          >
            Confirmar compra
          </b-button>
        </div>
      </template>
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
      fields: [
        { key: "name", label: "Nombre", class: "text-center" },
        {
          key: "price",
          label: "Precio",
          class: "text-center",
        },
        { key: "qty", label: "Cantidad", class: "text-center" },
        { key: "total", label: "Total", class: "text-center" },
      ],
    };
  },
  methods: {
    onConfirmBuyout() {
      delete this.cart.__ob__;
      console.table(this.cart);
      const total = this.$options.filters.clp(this.getTotal);
      this.open = false;
      this.$emit("complete", total);
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
  filters: {
    clp: (value) => {
      return new Intl.NumberFormat("es-CL", {
        maximumSignificantDigits: 5,
      }).format(value);
    },
  },
};
</script>
