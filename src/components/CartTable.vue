<template>
  <b-container>
    <b-col>
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
    </b-col>
    <b-row align-h="end">
      <b-col col cols="3">
        <b-button
          variant="outline-success"
          :disabled="countItems === 0"
          @click="onConfirmBuyout"
        >
          Confirmar compra
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "CartTable",
  props: {
    cart: {
      type: Array,
      default: () => [],
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
  data() {
    return {
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
  filters: {
    clp: (value) => {
      return new Intl.NumberFormat("es-CL", {
        maximumSignificantDigits: 5,
      }).format(value);
    },
  },
};
</script>
