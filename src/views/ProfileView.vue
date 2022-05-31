<template>
  <b-container style="height: 100%" class="h-100">
    <!-- CARGA -->
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
    <!-- Administrador -->
    <b-row
      v-if="user.role === 'admin'"
      class="accordion w-100 mx-auto"
      role="tablist"
    >
      <b-col cols="12" align-self="start" class="my-3">
        <b-button size="lg" pill to="/">
          <b-icon icon="arrow-left"></b-icon> Volver
        </b-button>
      </b-col>
      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button
            block
            v-b-toggle="'crud-product'"
            variant="outline-info"
            pill
          >
            Productos
            <b-icon
              :animation="show.crudProduct ? 'cylon-vertical' : ''"
              :icon="show.crudProduct ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="crud-product"
          @input="(value) => (show.crudProduct = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <crud-products></crud-products>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button block v-b-toggle="'crud-user'" variant="outline-info" pill>
            Usuarios
            <b-icon
              :animation="show.crudUser ? 'cylon-vertical' : ''"
              :icon="show.crudUser ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="crud-user"
          visible
          @input="(value) => (show.crudUser = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <crud-users></crud-users>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button block v-b-toggle="'edit-user'" variant="outline-info" pill>
            Mi Usuario
            <b-icon
              :animation="show.edit ? 'cylon-vertical' : ''"
              :icon="show.edit ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="edit-user"
          @input="(value) => (show.edit = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <edit-user-card @send-edit="onEdit" />
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-row>
    <!-- Cliente -->
    <b-row v-else class="accordion w-75 mx-auto" role="tablist">
      <b-col cols="12" align-self="start" class="my-3">
        <b-button size="lg" pill to="/">
          <b-icon icon="arrow-left"></b-icon> Volver
        </b-button>
      </b-col>
      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button block v-b-toggle="'edit-user'" variant="outline-info" pill>
            Usuario
            <b-icon
              :animation="show.edit ? 'cylon-vertical' : ''"
              :icon="show.edit ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="edit-user"
          visible
          @input="(value) => (show.edit = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <edit-user-card @send-edit="onEdit" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-button block v-b-toggle="'list-order'" variant="outline-info" pill>
            Compras
            <b-icon
              :animation="show.order ? 'cylon-vertical' : ''"
              :icon="show.order ? 'chevron-bar-up' : 'chevron-bar-down'"
            ></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="list-order"
          @input="(value) => (show.order = value)"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <b-row>
              <b-col cols="12">
                <h3>Compras</h3>
              </b-col>
              <b-col cols="12" v-for="order in orders" :key="order.id">
                <b-table
                  :fields="fieldsOrdersCart"
                  striped
                  hover
                  :items="order.cart"
                >
                  <template #cell(img)="{ item }">
                    <b-avatar :src="item.img" rounded></b-avatar>
                  </template>
                  <template #cell(price)="{ item }">
                    $ {{ item.price | clp }}
                  </template>
                  <template #cell(description)="{ item }">
                    {{ item.description | truncate }}
                  </template>
                  <template #cell(tot)="{ item }">
                    $ {{ (item.price * item.qty) | clp }}
                  </template>
                </b-table>
                <b-col class="mb-3">
                  <h5><b>Total: </b> $ {{ +order.total | clp }}</h5>
                  <b> Fecha: </b>
                  {{ new Date(order.date * 1000).toLocaleDateString() }}
                  <br />
                </b-col>
                <hr />
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import EditUserCard from "@/components/EditUserCard.vue";
import CrudProducts from "@/components/CrudProducts.vue";
import CrudUsers from "@/components/CrudUsers.vue";
import services from "@/services";

export default {
  name: "AccessView",
  components: {
    EditUserCard,
    CrudProducts,
    CrudUsers,
  },
  data() {
    return {
      show: {
        edit: true,
        order: true,
        crudProduct: true,
        crudUser: true,
      },
      user: {},
      orders: [],
      fieldsOrdersCart: [
        { label: "Imagen", key: "img" },
        { label: "Nombre", key: "name", sortable: true },
        { label: "Precio", key: "price", sortable: true },
        { label: "Cantidad", key: "qty", sortable: true },
        { label: "Descripción", key: "description" },
        { label: "Total", key: "tot" },
      ],
      isLoading: false,
    };
  },
  async created() {
    this.user = this.getSessionStorage("user");
    const res = await services.orders.getAll(this.user.id);
    this.orders = [...res.data];
    console.log("Orders: ", this.orders);
  },
  methods: {
    async onEdit(user) {
      try {
        this.isLoading = true;
        const { data, statusText } = await services.users.getAll({
          email: user.email,
        });
        if (statusText !== "OK") {
          this.toast({
            title: "Error",
            message: "Error en la consulta al servidor",
            variant: "danger",
            hide: 5000,
          });
          return;
        }
        if (data.length === 0) {
          this.toast({
            message: "No se encontro el usuario",
            variant: "warning",
            hide: 5000,
          });
          return;
        }
        if (user.email !== data[0].email && data[0].role !== "admin") {
          this.toast({
            message: "No esta autorizado para este cambio",
            variant: "warning",
            hide: 5000,
          });
          return;
        }
        // eslint-disable-next-line
        const { password, ...userLogged } = user;

        if (!password) {
          await services.users.update(userLogged);
          this.setSessionStorage("user", userLogged);
        } else {
          await services.users.update({
            password,
            ...userLogged,
          });
          this.setSessionStorage("user", userLogged);
        }
        this.toast({
          title: "Usuario editado",
          message: "Usuario editado correctamente",
          variant: "success",
          hide: 5000,
        });
        const cart = this.getLocalStorage("cart");
        if (cart)
          this.setLocalStorage("cart", { ...cart, userId: userLogged.id });
      } catch (error) {
        console.error(error);
        this.toast({
          title: "Error",
          message: JSON.stringify(error),
          variant: "danger",
          hide: 5000,
        });
        return;
      } finally {
        this.isLoading = false;
        this.user = this.getSessionStorage("user");
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
