<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  created() {
    // Se setea el usuario en store si el esta logiado
    this.SET_USER_LOGGED(this.getSessionStorage("user") || {});
  },
  methods: {
    ...mapMutations("users", ["SET_USER_LOGGED"]),
  },
};
</script>
