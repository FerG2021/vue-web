<template>
  <div>
    <modal
      ref="modal"
      titulo="Detalle de la presupuestación"
      :impedir-close="impedirClose"
      width="90%"
    >
      <el-descriptions
          title="Información de la presupuestación"
          direction="vertical"
          :column="3"
          :size="size"
          border
          v-loading="loading"
        >
          <div v-if="datos != null">
            <el-descriptions-item label="Nro. presupuestación">
              {{ datos.presupuestacion_id }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Fecha de creación">
              {{ formatearFecha(datos.presupuesto_fecha_creacion) }}  
            </el-descriptions-item>
            
            <el-descriptions-item label="Plan">
              {{ datos.presupuestacion_plan_nombre }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Incio de presupuestación">
              {{ formatearFecha(datos.presupuestacion_fecha_incio) }}  
            </el-descriptions-item>

            <el-descriptions-item label="Fin de presupuestación">
              {{ formatearFecha(datos.presupuestacion_fecha_fin) }}  
            </el-descriptions-item>

            <el-descriptions-item label="Rubro">
              <el-tag class="ml-2" type="success">{{ datos.presupuestacion_rubro_nombre }}</el-tag>
            </el-descriptions-item>
          </div>
        </el-descriptions>


        <h3 style="margin-top: 15px"><b>Productos</b></h3>
        <div v-if="datosProductos">
          <el-table :data="datosProductos" stripe style="width: 100%" v-loading="loadingProductos">
            <el-table-column prop="nombre" label="Nombre" >
              <template #default="props">
                <span>{{ props.row.productoPresupuestacion.producto_nombre }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="nombre" label="Rubro" >
              <template #default="props">
                <span>{{ props.row.productoPresupuestacion.producto_rubro_nombre }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="nombre" label="Unidad" >
              <template #default="props">
                <span>{{ props.row.producto.producto_unidad }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="cantidad" label="Cantidad a comprar" >
              <template #default="props">
                <span>{{ props.row.productoPresupuestacion.producto_cantidad_real_a_comprar }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="observaciones" label="Observaciones">
              <template #default="props">
                <span v-if="props.row.productoPresupuestacion.producto_observaciones">{{ props.row.productoPresupuestacion.producto_observaciones }}</span>
                <span v-else>-</span>

              </template>
            </el-table-column>

            <el-table-column label="Eliminar" width="120">
              <template #default="scope">
                <el-button                    
                  type="danger"                    
                  circle 
                  @click="$refs.modalEliminar.abrir(scope)"
                >
                  <span class="material-icons">delete</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>


        <h3 style="margin-top: 15px"><b>Proveedores</b></h3>
        <div v-if="datosProveedores">
          <el-table :data="datosProveedores" stripe style="width: 100%" v-loading="loadingProductos">
            <el-table-column prop="nombre" label="Nombre" >
              <template #default="props">
                <span>{{ props.row.proveedor_nombre }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="nombre" label="Mail" >
              <template #default="props">
                <span>{{ props.row.proveedor_mail }}</span>
              </template>
            </el-table-column>
            
          </el-table>
        </div>
    </modal>
  </div>

  <modal-eliminar
    ref="modalEliminar"
    @actualizarTabla="getDatos"
  ></modal-eliminar>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import ModalEliminar from "./eliminar.vue";


name: "nuevoProducto";
export default {
  components: { ModalEliminar },

  data() {
    return {
      id: null,
      loading: false,
      loadingProductos: false,
      loadingProveedores: false,
      datos: null,
      datosProductos: [],
      datosProveedores: [],
    };
  },

  methods: {
    abrir(id) {
      this.loading = true;
      this.loadingProductos = true;
      this.loadingProveedores = true;
      this.id = null;
      this.id = id;
      this.datos = null
      this.datosProductos = []
      this.datosProveedores = []

      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();

    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/presupuestacion/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          console.log(respuestaApi);

          if (respuestaApi != null) {
            this.datos = respuestaApi.data
            console.log(this.datos);
            this.loading = false;

            this.datosProductos = respuestaApi.data.productos
            this.loadingProductos = false

            console.log("this.datosProductos");
            console.log(this.datosProductos);


            this.datosProveedores = respuestaApi.data.proveedores 
            this.loadingProveedores = false;


          } else {
            this.cerrar();
          }
        });
    },

    formatearFecha(fecha){
      let fecha1 = new Date(fecha)
      let fecha2 = fecha1.toLocaleDateString();
      return fecha2
    },
  },
};
</script>

<style></style>
