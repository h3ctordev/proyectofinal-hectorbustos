<template>
  <b-container class="w-max my-3">
    <b-card title="Registrarse" border-variant="dark">
      <b-card-text>
        <hr />
        <b-col col cols="12" align-self="center">
          <v-form
            :fields="fields"
            :values="user"
            @send-form="onSendForm"
            :button="button"
          />
        </b-col>
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import VForm from "@/components/VForm.vue";
export default {
  name: "RegisterCard",
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
        label: "Registrar",
        block: true,
        pill: true,
        class: "px-5 my-3",
        variant: "primary",
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
          key: "firstName",
          label: "Nombre",
          required: true,
          minlength: 3,
          messages: {
            success: "Correcto!",
            errors: {
              required: "El Nombre es requerido",
              minlength: "Debe tener al menos 3 caracteres.",
            },
          },
        },
        {
          key: "lastName",
          label: "Apellido",
          required: true,
          minlength: 3,
          messages: {
            success: "Correcto!",
            errors: {
              required: "El Apellido es requerido",
              minlength: "Debe tener al menos 3 caracteres.",
            },
          },
        },
        {
          key: "avatar",
          label: "Avatar",
          minlength: 6,
          messages: {
            success: "Correcto!",
            errors: {
              minlength: "Debe tener al menos 6 caracteres.",
            },
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
              minlength: "Debe tener al menos 8 caracteres.",
            },
          },
        },
      ],
    };
  },
  methods: {
    async onSendForm(user) {
      console.log(user);
      this.$emit("send-register", user);
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
