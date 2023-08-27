<template>
  <aside :class="`${is_expanded && 'is-expanded' }`">
    <div class="logo">
      <img src="../assets/modular_logo.jpg" alt="Vue" >
    </div>

    <div class="menu-toggle-wrap" v-if="tipoUsuario != 2">
      <button class="menu-toggle">
        <span class="material-icons" @click="toggleMenu()">
          keyboard_double_arrow_right
        </span>
      </button>
    </div>

    <h3>MENU</h3>
    <div class="menu">
      <div v-for="item in itemsSidebar" :key="item">
        <ItemSidebar :item="item" :is_expanded="is_expanded" v-if="item.restriction"></ItemSidebar>
      </div>
    </div>

    <div class="flex"></div>


    <div class="menu" v-if="tipoUsuario != 2">
      <div v-for="item in itemsSidebarBottom" :key="item">
        <ItemSidebar :item="item" :is_expanded="is_expanded" ></ItemSidebar>
      </div>
    </div>
  </aside>
</template>

<script setup>
  import {ref} from 'vue'


  const is_expanded = ref(false)
  const tipoUsuario = localStorage.getItem("tipoUsuario")

  // const is_expanded = ref(localStorage.getItem("is_expanded") === "true")


  const toggleMenu = () => {
    is_expanded.value = !is_expanded.value

    // localStorage.setItem("is_expanded", is_expanded.value) 
    // console.log("entra");
  }
  
</script>

<script>
  import ItemSidebar from './ItemSidebar.vue'

  export default {
    data() {
      return {
        itemsSidebar: [
          {
            restriction: this.restrictionHome(),
            route: '/',
            icon: 'home',
            name: 'Home',
          },
          {
            restriction: this.restrictionPresupuestacion(),
            route: '/presupuestacion',
            icon: 'assignment',
            name: 'Provisión',
          },
          {
            restriction: this.restrictionBorrador(),
            route: '/borrador',
            icon: 'assignment_late',
            name: 'Borrador',
          },
          {
            restriction: this.restrictionOrdenCompra(),
            route: '/ordencompra',
            icon: 'receipt',
            name: 'Órdenes de compra',
          },
          {
            restriction: this.restrictionTransferencia(),
            route: '/transferencia',
            icon: 'move_up',
            name: 'Transferencias',
          },
          {
            restriction: this.restrictionProvidersCharge(),
            route: '/cargaproveedores',
            icon: 'add_business',
            name: 'Carga proveedores',
          },
          {
            restriction: this.restrictionPlans(),
            route: '/plan',
            icon: 'note_alt',
            name: 'Planes',
          },
          {
            restriction: this.restrictionProducts(),
            route: '/producto',
            icon: 'inventory_2',
            name: 'Productos',
          },
          {
            restriction: this.restrictionProviders(),
            route: '/proveedor',
            icon: 'local_shipping',
            name: 'Proveedores',
          },
          {
            restriction: this.restrictionRubro(),
            route: '/rubro',
            icon: 'sell',
            name: 'Rubros',
          },
          {
            restriction: this.restrictionUsers(),
            route: '/usuarios',
            icon: 'group',
            name: 'Usuarios',
          },
        ],

        itemsSidebarBottom: [
          {
            route: '/mi-cuenta',
            icon: 'account_circle',
            name: this.$store.state.user.name,
          },
          {
            route: '/mi-cuenta',
            icon: 'logout',
            name: 'Salir',
            type: 'button'
          },
        ]
      }
    },

    components: { ItemSidebar },

    created() {
      this.ver()
    },

   

    methods: {
      async logout(){
        await this.$store.dispatch("logout")
        // redirect
        return this.$router.replace("/login")
      },

      ver(){
        console.log("tipo");
        console.log(localStorage.getItem("tipoUsuario"));
      },

      restrictionHome() {
        return this.tipoUsuario !== 2 ? true : false;
      },

      restrictionPresupuestacion() {
        return this.$store.state.user.tipo_usuario == 1 || this.$store.state.user.tipo_usuario == 3 || this.$store.state.user.tipo_usuario == 4 || this.$store.state.user.tipo_usuario == 5 || this.$store.state.user.tipo_usuario == 6 ? true : false;
      },

      restrictionBorrador() {
        return this.$store.state.user.tipo_usuario == 1 || this.$store.state.user.tipo_usuario == 3 || this.$store.state.user.tipo_usuario == 4 || this.$store.state.user.tipo_usuario == 5 || this.$store.state.user.tipo_usuario == 6 ? true : false;
      },

      restrictionOrdenCompra() {
        return localStorage.getItem("tipoUsuario") !== 2 ? true : false;
      },

      restrictionTransferencia() {
        return localStorage.getItem("tipoUsuario") !== 2 ? true : false;
      },

      restrictionProvidersCharge() {
        return localStorage.getItem("tipoUsuario") === 2 ? true : false;
      },

      restrictionPlans() {
        return localStorage.getItem("tipoUsuario") !== 2 ? true : false;
      },

      restrictionProducts() {
        return localStorage.getItem("tipoUsuario") !== 2 ? true : false;
      },

      restrictionProviders() {
        return localStorage.getItem("tipoUsuario") == 1 || localStorage.getItem("tipoUsuario") == 3 || localStorage.getItem("tipoUsuario") == 4 || localStorage.getItem("tipoUsuario") == 5 || localStorage.getItem("tipoUsuario") == 6 ? true : false;
      },

      restrictionRubro() {
        return localStorage.getItem("tipoUsuario") !== 2 ? true : false;
      },

      restrictionUsers() {
        return localStorage.getItem("tipoUsuario") != 2 && localStorage.getItem("tipoUsuario") != 4 && localStorage.getItem("tipoUsuario") != 5 && localStorage.getItem("tipoUsuario") != 6 ? true : false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  aside{
    display: flex;
    top: 0;
    flex-direction: column;
    width: calc(2rem + 32px);
    height: calc(100vh - 32px);
    overflow: hidden;
    padding: 1rem;

    background-color: var(--dark);
    color: var(--light);

    transition: 0.2s ease-out;

    


    .flex{
      flex: 1 1 0;
    }

    .logo{
      margin-bottom: 1rem;
      img{
        width: 2rem;
        height: 2rem;
      }
    }

    .menu-toggle-wrap{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;

      position: relative;
      top: 0;
      transition: 0.2s ease-out;

      .menu-toggle{
        transition: 0.2s ease-out;

        .material-icons{
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-out;
        }

        &:hover{
          .material-icons{
            color: var(--primary);
            transform: translateX(0.5rem);
          }
        }
      }
    }

    h3, .button .text{
      opacity: 0;
      transition: 0.3s ease-out;
    }

    .menu{
      margin: 0 -1rem;

      .button{
        display: flex;
        align-items: center;
        text-decoration: none;

        padding: 0.5rem 1rem;
        transition: 0.2s ease-out;

        .material-icons{
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-out;
        }

        .text{
          color: var(--light);
          transition: 0.2s ease-out;
        }

        &:hover, &.router-link-exact-active{
          background-color: var(--dark-alt);

          .material-icons, .text{
            color: var(--primary);
          }
        }

        &.router-link-exact-active{
          border-right: 5px solid var(--primary);
        }

      }
    }

    &.is-expanded{
      width: var(--sidebar-width);

      .menu-toggle-wrap{
        top: -3rem;
        .menu-toggle{
          transform: rotate(-180deg);
        }
      }

      h3, .button .text{
        opacity: 1;
      }

      h3{
        color: var(--grey);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }

      .button{
        .material-icons{
          margin-right: 1rem;
        }
      }
    }

    @media(max-width: 768px){
      position: fixed;
      z-index: 99;
    }

    .logout{
      cursor: pointer;
    }
  }
</style>