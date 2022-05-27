<template>
  <b-card
    :img-src="product.img || '@/assets/logo.png'"
    img-alt="Image"
    img-top
    img-height="260"
    style="width: 20rem"
    class="mb-2"
  >
    <b-card-title class="text-center" v-text="product.name || 'producto'" />
    <b-card-text class="text-center">
      Disponibles: {{ product.available }}
    </b-card-text>
    <b-card-text class="text-center text-black">
      <b> $ {{ product.price | clp }} </b>
    </b-card-text>
    <b-card-text>
      <b-input-group class="d-flex justify-content-center">
        <b-input-group-prepend>
          <b-button variant="outline-secondary" @click="removeQty()">
            -
          </b-button>
        </b-input-group-prepend>
        <b-form-input
          variant="outline-secondary"
          v-model="qty"
          class="text-center"
          style="max-width: 3rem"
        />
        <b-input-group-append>
          <b-button
            variant="outline-secondary"
            @click="addQty(product.available)"
          >
            +
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-card-text>
    <b-card-text class="text-center">
      <b-button
        href="#"
        variant="outline-secondary"
        @click="addCart(product)"
        :disabled="product.available === 0"
      >
        Agregar al Carro
      </b-button>
    </b-card-text>
  </b-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      qty: this.product.available === 0 ? 0 : 1,
    };
  },
  watch: {
    "product.available"() {
      if (this.product.available === 0) {
        this.qty = 0;
      } else {
        this.qty = 1;
      }
    },
  },
  methods: {
    addCart(product) {
      const { available, ...productProps } = product;

      const item = { ...productProps, qty: this.qty };
      this.$emit("add-cart", item);
    },
    addQty(available) {
      if (this.qty >= available) return;
      this.qty += 1;
    },
    removeQty() {
      if (this.qty === 1) return;
      this.qty -= 1;
    },
  },
};
</script>
