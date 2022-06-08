<template>
  <b-container class="w-max my-3">
    <b-card title="Ingresar" body-class="py-5" border-variant="dark">
      <b-col col cols="12">
        <hr />
        <v-form
          :fields="fields"
          :values="user"
          @send-form="onSendForm"
          :button="button"
        />
      </b-col>
    </b-card>
  </b-container>
</template>

<script>
import VForm from "@/components/VForm.vue";
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
      button: {
        label: "Ingresar",
        block: true,
        pill: true,
        class: "px-5 my-3",
        variant: "success",
      },
      fields: [
        {
          key: "email",
          label: "Email",
          required: true,
          type: "email",
          messages: {
            errors: {},
          },
        },
        {
          key: "password",
          label: "Clave",
          required: true,
          type: "password",
          minlength: 8,
          messages: {
            success: "Correcto!",
            errors: {
              required: "La clave es requerida",
              minlength: "La clave debe teenr almenos 8 caracteres",
            },
          },
        },
      ],
    };
  },
  methods: {
    async onSendForm(user) {
      this.$emit("send-login", user);
    },
  },
};
</script>

<style scoped>
.w-max {
  width: 30rem;
}
.h-min {
  min-height: 40rem;
}
</style>
