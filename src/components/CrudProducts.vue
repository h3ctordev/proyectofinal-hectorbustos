<template>
  <b-container>
    <b-col cols="12" class="text-right my-2">
      <b-button variant="outline-success" size="lg" pill @click="onModalCreate">
        <b-icon icon="plus-lg" size="lg"></b-icon>
        Agregar
      </b-button>
    </b-col>
    <b-table :busy="isLoading" striped hover :fields="fields" :items="products">
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
import services from "@/services";
import VForm from "@/components/VForm.vue";

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
  methods: {
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
        const res = await services.products.create(item);

        if (res.statusText !== "Created") {
          this.toast({
            title: `Problemas al crear el producto`,
            message: `El producto no se agrego correctamente`,
            variant: "danger",
            hide: 5000,
          });
          this.create.show = false;
          this.create.item = { ...item };
          return;
        }
        this.toast({
          title: `Producto agregado correctamente`,
          message: `El Producto [id: ${res.data.id}]${res.data.name}, se agrego correctamente`,
          variant: "success",
          hide: 3000,
        });
        this.create.show = false;
        await this.getProducts();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async onEdit(item) {
      try {
        this.isLoading = true;
        const res = await services.products.update(item);
        if (res.statusText !== "OK") {
          this.toast({
            title: `Problemas al editar.`,
            message: `Problemas al editar el producto id: ${res?.data?.id}`,
            variant: "danger",
            hide: 5000,
          });
          return;
        }
        this.toast({
          title: `Producto editado correctamente`,
          message: `El Producto id: ${res?.data?.id}, se edito correctamente`,
          variant: "success",
          hide: 3000,
        });
        this.edit.show = false;
        await this.getProducts();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async onRemove(itemId) {
      try {
        this.isLoading = true;
        const res = await services.products.delete(itemId);
        if (res.statusText !== "OK") {
          this.toast({
            title: "Error",
            message: "Error al cargar los productos",
            variant: "danger",
            hide: 5000,
          });
          return;
        }
        this.remove.show = false;
        await this.getProducts();
      } catch (error) {
        console.errorg(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getProducts() {
      try {
        this.isLoading = true;
        const res = await services.products.getAll();
        if (res.statusText !== "OK") {
          this.toast({
            title: "Error",
            message: "Error al cargar los productos",
            variant: "danger",
            hide: 5000,
          });
          return;
        }
        if (res.data.length === 0) {
          this.toast({
            title: "Error",
            message: "Error al cargar los productos",
            variant: "danger",
            hide: 5000,
          });
          return;
        }

        this.products = [...res.data];
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
