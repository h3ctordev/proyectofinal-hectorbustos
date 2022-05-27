const mixin = {
  // lifecycle hooks
  async beforeCreate() {},
  async created() {},
  async beforeMount() {},
  async mounted() {},
  async beforeUpdate() {},
  async undated() {},
  async beforeDestroy() {},
  async destroyed() {},
  //data
  data() {
    return {};
  },
  //watch
  watch: {},
  //computed
  computed: {},
  //methods
  methods: {
    getLocalStorage(item) {
      return JSON.parse(localStorage.getItem(item));
    },
    clearLocalStorage() {
      localStorage.clear();
      return true;
    },
    setLocalStorage(item, payload) {
      localStorage.setItem(item, JSON.stringify(payload, null, 2));
      return true;
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

export default mixin;
