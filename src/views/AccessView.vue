<template>
  <b-container style="height: 100px">
    <b-row cols="2" class="h-100" align-v="center">
      <login-card></login-card>
      <register-card></register-card>
    </b-row>
  </b-container>
</template>

<script>
import LoginCard from "@/components/Login.vue";
import RegisterCard from "@/components/Register.vue";
export default {
  name: "AccessView",
  components: {
    LoginCard,
    RegisterCard,
  },
};
</script>

<style></style>
