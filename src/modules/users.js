import services from "@/services";

export default {
  state: {
    user: {},
    list: [],
  },
  mutations: {
    SET_USER_LOGGED: (state, user) => (state.user = { ...user }),
    SET_USERS_LIST: (state, users) => (state.list = [...users]),
  },
  actions: {
    usersList: async ({ commit }) => {
      try {
        const { data, statusText } = await services.users.getAll();
        if (statusText !== "OK")
          throw { title: "Error", message: "Error en la consulta" };

        commit("SET_USERS_LIST", data);
        return [...data];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    updateUser: async ({ commit, state }, user) => {
      try {
        if (!user?.password) {
          // Si password no viene, se elimina del objeto para que no lo remplace por un null
          delete user.password;
        }
        const { statusText, data } = await services.users.update(user);
        if (statusText !== "OK")
          throw {
            title: `Problemas al editar.`,
            message: `Problemas al editar el usuario id: ${data?.id}`,
            variant: "danger",
          };
        if (state.user.id === user.id) commit("SET_USER_LOGGED", data);
        const res = await services.users.getAll();
        commit("SET_USERS_LIST", [...res.data]);
        return { ...data };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    createUser: async ({ commit }, user) => {
      try {
        const { data, statusText } = await services.users.create(user);

        if (statusText !== "Created")
          throw {
            title: `Problemas al crear el Usuario`,
            message: `El Usuario no se agrego correctamente`,
            variant: "danger",
          };

        const res = await services.users.getAll();
        commit("SET_USERS_LIST", [...res.data]);
        return { ...data };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    removeUser: async ({ commit }, id) => {
      try {
        const { statusText } = await services.users.delete(id);
        if (statusText !== "OK")
          throw { title: "Error", message: "Error en la consulta" };
        const res = await services.users.getAll();
        commit("SET_USERS_LIST", [...res.data]);
        return true;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    login: async ({ commit }, user) => {
      try {
        const { data, statusText } = await services.users.getAll({
          email: user.email,
        });
        if (statusText !== "OK")
          throw { title: "Error", message: "Error en la consulta" };
        if (data.length === 0 || user.password !== data[0].password)
          throw {
            variant: "warning",
            message: "Clave o usuario no corresponde",
          };

        // eslint-disable-next-line
        const { password, ...userLogged } = data[0];
        commit("SET_USER_LOGGED", userLogged);
        return userLogged;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // eslint-disable-next-line
    register: async ({ commit }, user) => {
      try {
        const query = await services.users.getAll({
          email: user.email,
        });
        // Error en consulta
        if (query.statusText !== "OK")
          throw {
            title: "Error",
            message: "Error en la consulta al servidor",
            variant: "danger",
          };
        // Usuario existe o ya esta registrado
        if (query.data.length > 0)
          throw {
            title: "Aviso",
            message: "El usuario esta registrado",
            variant: "warning",
          };
        const { statusText } = await services.users.create(user);
        // Error en consulta
        if (statusText !== "Created")
          throw {
            title: "Error",
            message: "Error en la consulta al servidor",
            variant: "danger",
          };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  getters: {
    loggedUser: (state) => ({ ...state.user }),
    userFullName: ({ user }) =>
      `${user?.firstName || ""} ${user?.lastName || ""}`,
    userAvatar: ({ user }) => user?.avatar || null,
    userRole: ({ user }) => user?.role || null,
  },
  namespaced: true,
};
