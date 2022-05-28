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
    removeItemLocalStorage(item) {
      localStorage.removeItem(item);
      return true;
    },
    setLocalStorage(item, payload) {
      localStorage.setItem(item, JSON.stringify(payload, null, 2));
      return true;
    },
    getSessionStorage(item) {
      return JSON.parse(sessionStorage.getItem(item));
    },
    clearSessionStorage() {
      sessionStorage.clear();
      return true;
    },
    removeItemSessionStorage(item) {
      sessionStorage.removeItem(item);
      return true;
    },
    setSessionStorage(item, payload) {
      sessionStorage.setItem(item, JSON.stringify(payload, null, 2));
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
