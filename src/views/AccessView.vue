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
    <b-row class="accordion w-75 mx-auto" role="tablist">
      <b-col cols="12" align-self="start" class="my-3">
        <b-button size="lg" pill to="/">
          <b-icon icon="arrow-left"></b-icon> Volver
        </b-button>
      </b-col>
      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button block v-b-toggle="'login-user'" variant="outline-info" pill>
            Login
            <b-icon
              :animation="show.login ? 'cylon-vertical' : ''"
              :icon="show.login ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="login-user"
          visible
          @input="(value) => (show.login = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <login-card @send-login="onLogin" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button
            block
            v-b-toggle="'register-user'"
            variant="outline-info"
            pill
          >
            Registrate
            <b-icon
              :animation="show.register ? 'cylon-vertical' : ''"
              :icon="show.register ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="register-user"
          @input="(value) => (show.register = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <register-card @send-register="onRegister" />
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import LoginCard from "@/components/Login.vue";
import RegisterCard from "@/components/Register.vue";
import { mapActions } from "vuex";

export default {
  name: "AccessView",
  components: {
    LoginCard,
    RegisterCard,
  },
  data() {
    return {
      show: {
        login: true,
        register: false,
      },
      isLoading: false,
    };
  },
  methods: {
    ...mapActions("users", ["login", "register"]),
    async onRegister(user) {
      try {
        this.isLoading = true;
        await this.register(user);
        // Se incia sesión con usuario recien registrado
        // eslint-disable-next-line
        const { email, password } = user;
        this.onLogin({ email, password });
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
        return;
      } finally {
        this.isLoading = false;
      }
    },
    async onLogin(user) {
      try {
        this.isLoading = true;
        const userLogged = await this.login(user);
        this.setSessionStorage("user", userLogged);
        const cart = this.getLocalStorage("cart");
        if (cart)
          this.setLocalStorage("cart", { ...cart, userId: userLogged.id });
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
        return;
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
