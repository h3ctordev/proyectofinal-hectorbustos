<template>
  <b-container style="height: 100%" class="h-100">
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
    <b-row class="my-2" align-h="center" align-v="center">
      <b-alert
        :show="alert.show"
        dismissible
        :variant="alert.varian"
        @dismissed="alert.show = 0"
        @dismiss-count-down="countDownChanged"
        class="px-5"
      >
        {{ alert.message }} <br />
        <b-progress
          height="2px"
          :max="alert.seconds"
          :value="alert.show"
        ></b-progress>
      </b-alert>
    </b-row>
    <b-row>
      <b-col
        col
        cols="12"
        class="d-flex flex-wrap justify-content-center align-items-center p-5 my-5"
      >
        <login-card @send-login="onLogin" />
        <register-card @send-register="onRegister" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LoginCard from "@/components/Login.vue";
import RegisterCard from "@/components/Register.vue";
import services from "@/services";

export default {
  name: "AccessView",
  components: {
    LoginCard,
    RegisterCard,
  },
  data() {
    return {
      isLoading: false,
      alert: {
        seconds: 0,
        show: 0,
        message: "",
        variant: null,
      },
    };
  },
  methods: {
    async onRegister(user) {
      try {
        this.isLoading = true;
        console.log(user);
        const query = await services.users.getAll({
          email: user.email,
        });
        console.log("Query: ", query);
        // Error en consulta
        if (query.statusText !== "OK") {
          this.alert.message = "Error en la consulta al servidor";
          this.alert.variant = "danger";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        // Usuario existe o ya esta registrado
        if (query.data.length > 0) {
          this.alert.message = "El usuario esta registrado";
          this.alert.variant = "warning";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        const { statusText } = await services.users.create(user);
        // Error en consulta
        console.log("Create status: ", statusText);
        if (statusText !== "Created") {
          this.alert.message = "Error en la consulta al servidor";
          this.alert.variant = "danger";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        // Se incia sesión con usuario recien registrado
        // eslint-disable-next-line
        const { email, password } = user;
        this.onLogin({ email, password });
      } catch (error) {
        console.error(error);
        this.alert.message = JSON.stringify(error);
        this.alert.variant = "danger";
        this.alert.show = 10;
        this.alert.seconds = 10;
        return;
      } finally {
        this.isLoading = false;
      }
    },
    async onLogin(user) {
      try {
        this.isLoading = true;
        console.log(user);
        const { data, statusText } = await services.users.getAll({
          email: user.email,
        });
        console.log(data);
        if (statusText !== "OK") {
          this.alert.message = "Error en la consulta al servidor";
          this.alert.variant = "danger";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        if (data.length === 0) {
          this.alert.message = "No se encontro el usuario";
          this.alert.variant = "warning";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        if (user.password !== data[0].password) {
          this.alert.message = "Clave o usuario no correponde";
          this.alert.variant = "warning";
          this.alert.show = 5;
          this.alert.seconds = 5;
          return;
        }
        // eslint-disable-next-line
        const { password, ...userLogged } = data[0];
        this.setSessionStorage("user", userLogged);
        const cart = this.getLocalStorage("cart");
        if (cart)
          this.setLocalStorage("cart", { ...cart, userId: userLogged.id });
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error);
        this.alert.message = JSON.stringify(error);
        this.alert.variant = "danger";
        this.alert.show = 10;
        this.alert.seconds = 10;
        return;
      } finally {
        this.isLoading = false;
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown;
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
