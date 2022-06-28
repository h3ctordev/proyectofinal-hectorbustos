<template>
  <b-container class="p-5">
    <b-card
      class="w-100"
      title="Editar Usuario"
      body-class="p-5"
      border-variant="dark"
    >
      <b-col col cols="12">
        <hr />
        <v-form
          :fields="fields"
          :values="user"
          :button="button"
          @send-form="onSendForm"
        />
      </b-col>
    </b-card>
  </b-container>
</template>

<script>
import VForm from '@/components/VForm.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'EditUserCard',
  components: {
    VForm,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // user: null,
      button: {
        label: 'Editar',
        block: true,
        pill: true,
        class: 'px-5 my-3',
        variant: 'success',
      },
      fields: [
        {
          key: 'id',
          label: 'ID',
          required: true,
          disable: true,
          messages: {
            success: '',
            errors: {},
          },
        },
        {
          key: 'email',
          label: 'Email',
          required: true,
          type: 'email',
          messages: {
            success: 'Correcto!',
            errors: {
              required: 'El Mail es requerido',
              email: 'El Mail no es valido',
            },
          },
        },
        {
          key: 'firstName',
          label: 'Nombre',
          required: true,
          minlength: 3,
          messages: {
            success: 'Correcto!',
            errors: {
              required: 'El Nombre es requerido',
              minlength: 'Debe tener al menos 3 caracteres.',
            },
          },
        },
        {
          key: 'lastName',
          label: 'Apellido',
          required: true,
          minlength: 3,
          messages: {
            success: 'Correcto!',
            errors: {
              required: 'El Apellido es requerido',
              minlength: 'Debe tener al menos 3 caracteres.',
            },
          },
        },
        {
          key: 'avatar',
          label: 'Avatar',
          minlength: 6,
          messages: {
            success: 'Correcto!',
            errors: {
              minlength: 'Debe tener al menos 6 caracteres.',
            },
          },
        },
        {
          key: 'password',
          label: 'Clave Nueva',
          type: 'password',
          minlength: 8,
          messages: {
            errors: {
              minlength: 'Debe tener al menos 8 caracteres.',
            },
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['loggedUser']),
  },
  methods: {
    onSendForm(user) {
      this.$emit('send-edit', user);
    },
  },
};
</script>

<style scoped>
.h-min {
  min-height: 40rem;
}
</style>
