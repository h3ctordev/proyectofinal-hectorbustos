<template>
  <b-container>
    <b-card title="Ingresar" border-variant="dark" class="rounded-0">
      <b-card-text>
        <hr />
        <b-col col cols="12" align-self="center">
          <v-form :fields="fields" :values="user" @send-form="onSendForm" />
        </b-col> </b-card-text
      >78
    </b-card>
  </b-container>
</template>

<script>
import VForm from "@/components/VForm.vue";
import services from "@/services";
export default {
  name: "LoginCard",
  components: {
    VForm,
  },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      fields: [
        {
          key: "email",
          label: "Email",
          required: true,
          type: "email",
          messages: {
            success: "Correcto!",
            errors: {
              required: "El Mail es requerido",
              email: "El Mail no es valido",
            },
          },
        },
        {
          key: "password",
          label: "Clave",
          required: true,
          type: "password",
          passwd: true,
          messages: {
            success: "Correcto!",
            errors: {
              required: "La clave es requerida",
              passwd:
                "La clave debe teenr almenos 8 caracteres, mayusculas, minusculas y un caracteres especial",
            },
          },
        },
      ],
    };
  },
  methods: {
    async onSendForm(user) {
      console.log(user);
      console.log(services.users);
      const login = await services.users.getAll({ email: user.email });
      console.log(login.data);
    },
  },
};
</script>

<style></style>
