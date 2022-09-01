<template>
	<main class="home-page">
		<el-card>
			<h1>Home</h1>

      <el-row :gutter="10" style="margin-top: 20px">
        <el-col :span="6">
          <el-card @click="$router.replace('/presupuestacion')" class="botonHome">
            <h3 style="text-align: center">Provisión</h3>            
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">assignment</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/borrador')"  class="botonHome">
            <h3 style="text-align: center">Borrador</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">assignment_late</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/plan')" class="botonHome">
            <h3 style="text-align: center">Planes</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">note_alt</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/producto')" class="botonHome">
            <h3 style="text-align: center">Productos</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">inventory_2</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top: 20px">
        <el-col :span="6">
          <el-card @click="$router.replace('/proveedor')" class="botonHome">
            <h3 style="text-align: center">Proveedores</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">local_shipping</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/rubro')" class="botonHome">
            <h3 style="text-align: center">Rubros</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">sell</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/usuarios')" class="botonHome">
            <h3 style="text-align: center">Usuarios</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">group</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/mi-cuenta')" class="botonHome">
            <h3 style="text-align: center">Mi cuenta</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 150px">account_circle</span>
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
  }

  .iconoTarjeta{
    font-size: 150px; 
    margin-top: 20px; 
    color: var(--dark-alt);
  }
</style>