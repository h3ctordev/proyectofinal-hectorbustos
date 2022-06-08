<template>
  <b-container>
    <b-col cols="12" class="text-right my-2">
      <b-button variant="outline-success" size="lg" pill @click="onModalCreate">
        <b-icon icon="plus-lg" size="lg"></b-icon>
        Agregar
      </b-button>
    </b-col>
    <b-table :busy="isLoading" striped hover :fields="fields" :items="users">
      <template #table-busy>
        <div class="text-center text-success my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando usuarios...</strong>
        </div>
      </template>
      <template #cell(avatar)="{ item }">
        <b-avatar :src="item.avatar"></b-avatar>
      </template>
      <template #cell(role)="{ item }">
        {{ usersRole[item.role] }}
      </template>
      <template #cell(actions)="{ item }">
        <b-button variant="link" @click="onModalEdit(item)">
          <b-icon icon="pencil-square" variant="dark"></b-icon>
        </b-button>
        <b-button variant="link" @click="onModalRemove(item)">
          <b-icon icon="trash" variant="dark"></b-icon>
        </b-button>
      </template>
    </b-table>
    <b-modal v-model="create.show" title="Agregar Usuario" hide-footer>
      <v-form
        :fields="create.fields"
        :button="create.button"
        :values="create.item"
        @send-form="onCreate"
      />
    </b-modal>
    <b-modal v-model="edit.show" title="Editar Usuario" hide-footer>
      <v-form
        :fields="edit.fields"
        :button="edit.button"
        :values="edit.item"
        @send-form="onEdit"
      />
    </b-modal>
    <b-modal
      v-model="remove.show"
      title="Remover Usuario"
      @ok="onRemove(remove.item.id)"
    >
      Se eliminara por completo el usuario id: {{ remove.item.id }}, <br />
      Email: {{ remove.item.email }} <br />
      Nombre: {{ remove.item.firstName }} {{ remove.item.lastName }}
    </b-modal>
  </b-container>
</template>

<script>
import VForm from "@/components/VForm.vue";
import { mapActions } from "vuex";

export default {
  name: "CrudUsers",
  components: {
    VForm,
  },
  async mounted() {
    await this.getUsers();
  },
  data() {
    return {
      isLoading: false,
      usersRole: {
        client: "Cliente",
        admin: "Administrador",
      },
      users: [],
      create: {
        item: {},
        show: false,
        button: {
          label: "Crear",
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
            key: "role",
            label: "Role",
            type: "selec",
            required: true,
            options: [
              { value: "admin", text: "Administrador" },
              { value: "client", text: "Cliente" },
            ],
            messages: {
              success: "Correcto!",
              errors: {
                required: "El Rol es requerido",
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
      },
      edit: {
        item: {},
        show: false,
        button: {
          label: "Editar",
          block: true,
          pill: true,
          class: "px-5 my-3",
          variant: "success",
        },
        fields: [
          {
            key: "id",
            label: "ID",
            required: true,
            disable: true,
            messages: {
              success: "",
              errors: {},
            },
          },
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
            key: "role",
            label: "Role",
            type: "selec",
            required: true,
            options: [
              { value: "admin", text: "Administrador" },
              { value: "client", text: "Cliente" },
            ],
            messages: {
              success: "Correcto!",
              errors: {
                required: "El Rol es requerido",
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
      },
      remove: {
        item: {},
        show: false,
      },
      fields: [
        { label: "ID", key: "id", sortable: true },
        { label: "Avatar", key: "avatar" },
        { label: "Nombre", key: "firstName", sortable: true },
        { label: "Apellido", key: "lastName", sortable: true },
        { label: "Rol", key: "role", sortable: true },
        { label: "Acciones", key: "actions" },
      ],
    };
  },
  methods: {
    ...mapActions("users", [
      "register",
      "usersList",
      "removeUser",
      "updateUser",
      "createUser",
    ]),
    onModalCreate(item) {
      this.create.item = { ...item };
      this.create.show = true;
    },
    onModalRemove(item) {
      this.remove.item = { ...item };
      this.remove.show = true;
    },
    onModalEdit(item) {
      this.edit.item = { ...item };
      this.edit.show = true;
    },
    async onCreate(item) {
      try {
        if (item?.isTrusted) delete item.isTrusted;
        this.isLoading = true;
        const data = await this.createUser(item);
        this.toast({
          title: `Usuario agregado correctamente`,
          message: `El Usuario id: ${data.id}, se agrego correctamente`,
          variant: "success",
          hide: 3000,
        });
        this.create.show = false;
        await this.getUsers();
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
        this.create.show = false;
        this.create.item = { ...item };
      } finally {
        this.isLoading = false;
      }
    },
    async onEdit(item) {
      try {
        this.isLoading = true;
        const data = await this.updateUser(item);
        this.toast({
          title: `Usuario editado correctamente`,
          message: `El Usuario id: ${data?.id}, se edito correctamente`,
          variant: "success",
          hide: 3000,
        });
        this.edit.show = false;
        await this.getUsers();
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    async onRemove(itemId) {
      try {
        this.isLoading = true;
        await this.removeUser(itemId);
        this.remove.show = false;
        await this.getUsers();
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getUsers() {
      try {
        this.isLoading = true;
        this.users = await this.usersList();
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
