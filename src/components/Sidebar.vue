<template>
  <aside :class="`${is_expanded && 'is-expanded' }`">
    <div class="logo">
      <img src="../assets/modular_logo.jpg" alt="Vue" >
    </div>

    <!-- items del menu -->
    <div class="menu-toggle-wrap" v-if="tipoUsuario != 2">
      <button class="menu-toggle">
        <span class="material-icons" @click="toggleMenu()">
          keyboard_double_arrow_right
        </span>
      </button>
    </div>

    <h3>MENU</h3>
    <div class="menu">
      <!-- Home -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/" v-if="is_expanded">
          <span class="material-icons">home</span>
          <span class="text">Home</span>
        </router-link>   

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Home"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/" v-if="!is_expanded || is_expanded">
            <span class="material-icons">home</span>
            <span class="text">Home</span>
          </router-link> 
        </el-tooltip>
      </div>

      <!-- Provisión -->
      <div v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
        <router-link class="button" to="/presupuestacion" v-if="is_expanded">
          <span class="material-icons">assignment</span>
          <span class="text">Provisión</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Provisión"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/presupuestacion" v-if="!is_expanded || is_expanded">
            <span class="material-icons">assignment</span>
            <span class="text">Provisión</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Borrador -->
      <div v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
        <router-link class="button" to="/borrador" v-if="is_expanded">
          <span class="material-icons">assignment_late</span>
          <span class="text">Borrador</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Borrador"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/borrador" v-if="!is_expanded || is_expanded">
            <span class="material-icons">assignment_late</span>
            <span class="text">Borrador</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Ordenes de compra -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/ordencompra" v-if="is_expanded">
          <span class="material-icons">receipt</span>
          <span class="text">Órdenes de compra</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Órdenes de compra"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/ordencompra" v-if="!is_expanded || is_expanded">
            <span class="material-icons">receipt</span>
            <span class="text">Órdenes de compra</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Transferencias -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/transferencia" v-if="is_expanded">
          <span class="material-icons">move_up</span>
          <span class="text">Transferencias</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Transferencias"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/transferencia" v-if="!is_expanded || is_expanded">
            <span class="material-icons">move_up</span>
            <span class="text">Transferencias</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Carga proveedores propio -->
      <div v-if="tipoUsuario == 2">
        <router-link class="button" to="/cargaproveedores" v-if="is_expanded">
          <span class="material-icons">add_business</span>
          <span class="text">Carga proveedores</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Carga proveedores"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/cargaproveedores" v-if="!is_expanded || is_expanded">
            <span class="material-icons">add_business</span>
            <span class="text">Carga proveedores</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Planes -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/plan" v-if="is_expanded">
          <span class="material-icons">note_alt</span>
          <span class="text">Planes</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Planes"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/plan" v-if="!is_expanded || is_expanded">
            <span class="material-icons">note_alt</span>
            <span class="text">Planes</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Producto -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/producto" v-if="is_expanded">
          <span class="material-icons">inventory_2</span>
          <span class="text">Productos</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Productos"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/producto" v-if="!is_expanded || is_expanded">
            <span class="material-icons">inventory_2</span>
            <span class="text">Productos</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Proveedor -->
      <div v-if="tipoUsuario == 1 || tipoUsuario == 3 || tipoUsuario == 4 || tipoUsuario == 5 || tipoUsuario == 6">
        <router-link class="button" to="/proveedor" v-if="is_expanded">
          <span class="material-icons">local_shipping</span>
          <span class="text">Proveedores</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Proveedores"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/proveedor" v-if="!is_expanded || is_expanded">
            <span class="material-icons">local_shipping</span>
            <span class="text">Proveedores</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Rubro -->
      <div v-if="tipoUsuario != 2">
        <router-link class="button" to="/rubro" v-if="is_expanded">
          <span class="material-icons">sell</span>
          <span class="text">Rubros</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Rubros"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/rubro" v-if="!is_expanded || is_expanded">
            <span class="material-icons">sell</span>
            <span class="text">Rubros</span>
          </router-link>
        </el-tooltip>
      </div>

      <!-- Usuarios -->
      <div v-if="tipoUsuario != 2 && tipoUsuario != 4 && tipoUsuario != 5 && tipoUsuario != 6">
        <router-link class="button" to="/usuarios" v-if="is_expanded">
          <span class="material-icons">group</span>
          <span class="text">Usuarios</span>
        </router-link>  

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Usuarios"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/usuarios" v-if="!is_expanded || is_expanded">
            <span class="material-icons">group</span>
            <span class="text">Usuarios</span>
          </router-link>
        </el-tooltip>

      </div>
    </div>

    <div class="flex"></div>

    <!-- Mi cuenta -->
    <div class="menu" v-if="tipoUsuario != 2">
      <div>
        <router-link class="button" to="/mi-cuenta" v-if="is_expanded">
          <span class="material-icons">account_circle</span>
          <span class="text">{{ $store.state.user.name }}</span>
        </router-link>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="Mi cuenta"
          placement="right-start"
          v-if="!is_expanded"
        >
          <router-link class="button" to="/mi-cuenta" v-if="!is_expanded || is_expanded">
          <span class="material-icons">account_circle</span>
          <span class="text">{{ $store.state.user.name }}</span>
        </router-link>
        </el-tooltip>

      </div>    


      <!-- Logout -->
      <div class="button logout" v-if="is_expanded">
        <span class="material-icons" @click="logout()">logout</span>
        <span class="text">Salir</span>
      </div>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Salir"
        placement="right-start"
        v-if="!is_expanded"
      >
        <div class="button logout" v-if="!is_expanded">
          <span class="material-icons" @click="logout()">logout</span>
          <span class="text">Salir</span>
        </div>
      </el-tooltip>


      <!-- Configuracion -->
      <!-- <router-link class="button" to="/configuracion" v-if="is_expanded">
          <span class="material-icons">settings</span>
          <span class="text">Configuración</span>
      </router-link>  
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Configuración"
        placement="right-start"
        v-if="!is_expanded"
      >
        <router-link class="button" to="/configuracion" v-if="!is_expanded || is_expanded">
          <span class="material-icons">settings</span>
          <span class="text">Configuración</span>
        </router-link>  
      </el-tooltip> -->
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
  export default {
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
        // console.log("tipo");
        // console.log(localStorage.getItem("tipoUsuario"));
        // this.tipoUsuario = localStorage.getItem("tipoUsuario")
        // console.log("tipo");
        // console.log(tipoUsuario);
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
    min-height: 100vh;
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