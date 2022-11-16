<template>
	<main class="home-page">
		<el-card>
			<h1>Home</h1>
      <!-- {{ $store.state.user.tipo_usuario }} -->
      <el-row :gutter="10" style="margin-top: 20px">
        <!--  -->
        <!-- Provisiones -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/presupuestacion')" class="botonHome">
            <h3 style="text-align: center">Provisiones</h3>            
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">assignment</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Borradores -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/borrador')"  class="botonHome">
            <h3 style="text-align: center">Borradores</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">assignment_late</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Órdenes de compra -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/ordencompra')"  class="botonHome">
            <h3 style="text-align: center">Órdenes de compra</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">receipt</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Transferencias -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/transferencia')"  class="botonHome">
            <h3 style="text-align: center">Transferencias</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">move_up</span>
              </div>
            </div>
          </el-card>
        </el-col>
        
      </el-row>

      <el-row :gutter="10" style="margin-top: 20px">
        <!--  -->
        <!-- Planes -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/plan')" class="botonHome">
            <h3 style="text-align: center">Planes</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">note_alt</span>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!--  -->
        <!-- Productos -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/producto')" class="botonHome">
            <h3 style="text-align: center">Productos</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">inventory_2</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Proveedores -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
          <el-card @click="$router.replace('/proveedor')" class="botonHome">
            <h3 style="text-align: center">Proveedores</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">local_shipping</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Rubros -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5">
          <el-card @click="$router.replace('/rubro')" class="botonHome">
            <h3 style="text-align: center">Rubros</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">sell</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top: 20px">
        <!--  -->
        <!-- Usuarios -->
        <!--  -->
        <el-col :span="6" v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3">
          <el-card @click="$router.replace('/usuarios')" class="botonHome">
            <h3 style="text-align: center">Usuarios</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">group</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--  -->
        <!-- Mi cuenta -->
        <!--  -->
        <el-col :span="6">
          <el-card @click="$router.replace('/mi-cuenta')" class="botonHome">
            <h3 style="text-align: center">Mi cuenta</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">account_circle</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

		</el-card>     
	</main>
</template>

<script>
	export default {

	}
</script>

<style>
	el-card{
		margin: 0px;
		padding: 0px;
	}

  .botonHome:hover{
    transform: translateY(-2px);
    box-shadow: 0px 2px 5px #0000002a !important;
    cursor: pointer;
    background-color: #cccccc
;
  }

  .iconoTarjeta{
    font-size: 16vh; 
    margin-top: 20px; 
    color: var(--dark-alt);
  }
</style>