<template>
  <b-container>
    <b-col cols="12" class="text-right my-2">
      <b-button variant="outline-success" size="lg" pill @click="onModalCreate">
        <b-icon icon="plus-lg" size="lg"></b-icon>
        Agregar
      </b-button>
    </b-col>
    <b-table
      :busy="isLoading"
      striped
      hover
      :fields="fields"
      :items="getProductList"
    >
      <template #table-busy>
        <div class="text-center text-success my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando productos...</strong>
        </div>
      </template>
      <template #cell(img)="{ item }">
        <b-avatar :src="item.img" rounded></b-avatar>
      </template>
      <template #cell(price)="{ item }"> $ {{ item.price | clp }} </template>
      <template #cell(actions)="{ item }">
        <b-button variant="link" @click="onModalEdit(item)">
          <b-icon icon="pencil-square" variant="dark"></b-icon>
        </b-button>
        <b-button variant="link" @click="onModalRemove(item)">
          <b-icon icon="trash" variant="dark"></b-icon>
        </b-button>
      </template>
    </b-table>
    <b-modal v-model="create.show" title="Agregar Producto" hide-footer>
      <v-form
        :fields="create.fields"
        :button="create.button"
        :values="create.item"
        @send-form="onCreate"
      />
    </b-modal>
    <b-modal v-model="edit.show" title="Editar Producto" hide-footer>
      <v-form
        :fields="edit.fields"
        :button="edit.button"
        :values="edit.item"
        @send-form="onEdit"
      />
    </b-modal>
    <b-modal
      v-model="remove.show"
      title="Remover Producto"
      @ok="onRemove(remove.item.id)"
    >
      {{ remove.item }}
    </b-modal>
  </b-container>
</template>

<script>
import VForm from "@/components/VForm.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "CrudProducts",
  components: {
    VForm,
  },
  async mounted() {
    await this.getProducts();
  },
  data() {
    return {
      isLoading: false,
      products: [],
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
            key: "name",
            label: "Nombre",
            required: true,
            messages: {
              success: "Correcto",
              errors: {
                required: "El nombre es requerido",
              },
            },
          },
          {
            key: "img",
            label: "Imagen",
            required: true,
            messages: {
              success: "Correcto",
              errors: {
                required: "La imagen es requerida",
              },
            },
          },
          {
            key: "price",
            label: "Precio",
            required: true,
            min: 0,
            type: "number",
            messages: {
              success: "Correcto",
              errors: {
                required: "El precio es requerido",
              },
            },
          },
          {
            key: "available",
            label: "Disponible",
            required: true,
            type: "number",
            min: 0,
            messages: {
              success: "Correcto",
              errors: {
                required: "La disponibilidad es requerida",
                min: "Debe ser positiva",
              },
            },
          },
          {
            key: "description",
            label: "Descripcion",
            required: true,
            type: "textarea",
            messages: {
              success: "Correcto",
              errors: {
                required: "La descripcion es requerida",
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
            key: "name",
            label: "Nombre",
            required: true,
            messages: {
              success: "Correcto",
              errors: {
                required: "El nombre es requerido",
              },
            },
          },
          {
            key: "img",
            label: "Imagen",
            required: true,
            messages: {
              success: "Correcto",
              errors: {
                required: "La imagen es requerida",
              },
            },
          },
          {
            key: "price",
            label: "Precio",
            required: true,
            min: 0,
            type: "number",
            messages: {
              success: "Correcto",
              errors: {
                required: "El precio es requerido",
              },
            },
          },
          {
            key: "available",
            label: "Disponible",
            required: true,
            type: "number",
            min: 0,
            messages: {
              success: "Correcto",
              errors: {
                required: "La disponibilidad es requerida",
                min: "Debe ser positiva",
              },
            },
          },
          {
            key: "description",
            label: "Descripcion",
            required: true,
            type: "textarea",
            messages: {
              success: "Correcto",
              errors: {
                required: "La descripcion es requerida",
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
        { label: "Imagen", key: "img" },
        { label: "Disponibles", key: "available", sortable: true },
        { label: "Nombre", key: "name", sortable: true },
        { label: "Precio", key: "price", sortable: true },
        { label: "Descripción", key: "description" },
        { label: "Acciones", key: "actions" },
      ],
    };
  },
  computed: {
    ...mapGetters("products", ["getProductList"]),
  },
  methods: {
    ...mapActions("products", [
      "productsList",
      "createProduct",
      "updateProduct",
      "removeProduct",
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
        const data = await this.createProduct(item);
        this.toast({
          title: `Producto agregado correctamente`,
          message: `El Producto [id: ${data?.id}]${data?.name}, se agrego correctamente`,
          variant: "success",
          hide: 3000,
        });
        this.create.show = false;
        await this.getProducts();
      } catch (error) {
        this.create.show = false;
        this.create.item = { ...item };
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
    async onEdit(item) {
      try {
        this.isLoading = true;
        const data = await this.updateProduct(item);
        this.toast({
          title: `Producto editado correctamente`,
          message: `El Producto id: ${data?.id}, se edito correctamente`,
          variant: "success",
          hide: 3000,
        });
        await this.getProducts();
        this.edit.show = false;
      } catch (error) {
        console.error(error);
        this.toast({
          title: error.title || "Aviso",
          message: error?.message || "Error al cargar los productos",
          variant: error?.variant || "danger",
          hide: error?.time || 5000,
        });
      } finally {
        this.edit.show = false;
        this.isLoading = false;
      }
    },
    async onRemove(itemId) {
      try {
        this.isLoading = true;
        await this.removeProduct(itemId);
        await this.getProducts();
      } catch (error) {
        this.remove.show = false;
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
    async getProducts() {
      try {
        this.isLoading = true;
        const data = await this.productsList();

        this.products = [...data];
      } catch (error) {
        console.error(error);
        this.toast({
          title: "Error",
          message: JSON.stringify(error),
          variant: "danger",
          hide: 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
