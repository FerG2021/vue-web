<template>
  <main class="home-page">
    <el-card class="el-card">
      <h1>Home</h1>
      <div class="container">
        <div v-for="item in homeItems" :key="item" class="container-items">
          <HomeItems :item="item"></HomeItems>
        </div>
      </div>
    </el-card>
  </main>
</template>

<script>
import HomeItems from "./HomeItems.vue";

export default {
  data() {
    return {
      homeItems: [
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/presupuestacion",
          name: "Provisiones",
          icon: "assignment",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/borrador",
          name: "Borradores",
          icon: "assignment_late",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/ordencompra",
          name: "Órdenes de compra",
          icon: "receipt",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/transferencia",
          name: "Transferencias",
          icon: "move_up",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/plan",
          name: "Planes",
          icon: "note_alt",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/producto",
          name: "Productos",
          icon: "inventory_2",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/proveedor",
          name: "Proveedores",
          icon: "local_shipping",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5",
          route: "/rubro",
          name: "Rubros",
          icon: "sell",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3",
          route: "/usuarios",
          name: "Usuarios",
          icon: "group",
        },
        {
          restrictions:
            "$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6",
          route: "/mi-cuenta",
          name: "Mi cuenta",
          icon: "account_circle",
        },
      ],
    };
  },
  components: { HomeItems },
};
</script>

<style scoped lang="scss">
.home-page {
  .el-card {
    height: 100%;
    .container {
      display: flex;
      flex-wrap: wrap;
      .container-items {
        width: 25%;
      }
    }
  }
}
</style>