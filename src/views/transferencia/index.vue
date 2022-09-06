<template>
  <main>
    <el-card>
      <template #header>
        <h1>Pedidos de mi envío</h1>
      </template>
      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla">
        <el-table
          :data="
            transferencias.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          "
          fixed
          v-loading="loading"
        >
          <!-- Nro -->
          <el-table-column label="Nro." prop="nro" width="80px">
            <template #default="props">
              <span>{{ props.row.transferencia.transferencia_id }}</span>
            </template>
          </el-table-column>

          <!-- Nro -->
          <el-table-column label="Nro. pres." prop="nroPresupuestacion" width="100px">
            <template #default="props">
              <span>{{ props.row.presupuestacion.presupuestacion_id }}</span>
            </template>
          </el-table-column>
           
          <!-- Nombre -->
          <el-table-column label="Presupuestación" prop="presupuestacion" min-width="200px">
            <template #default="props">
              <span>{{ props.row.presupuestacion.presupuestacion_plan_nombre }}</span>
            </template>
          </el-table-column>

          <!-- Destino -->
          <el-table-column label="Destino" prop="destino">
            <template #default="props">
              <span>{{ props.row.deposito.deposito_nombre }}</span>
            </template>
          </el-table-column>

          <!-- Producto -->
          <el-table-column label="Producto" prop="producto">
            <template #default="props">
              <span>{{ props.row.transferencia.transferencia_producto_nombre }}</span>
            </template>
          </el-table-column>

          <!-- Unidad de medida -->
          <el-table-column label="U.M." prop="unidadMedida">
            <template #default="props">
              <span>{{ props.row.transferencia.transferencia_producto_unidad }}</span>
            </template>
          </el-table-column>

          <!-- Cantidad a stock -->
          <el-table-column label="Cant. stock" prop="cantSacada">
            <template #default="props">
              <span>{{ props.row.transferencia.transferencia_producto_stock }}</span>
            </template>
          </el-table-column>

          <!-- Cantidad a utilizar -->
          <el-table-column label="Cant. sacada" prop="cantSacada">
            <template #default="props">
              <span>{{ props.row.transferencia.transferencia_cantidad_utilizar }}</span>
            </template>
          </el-table-column>

          <!-- Fecha inicio -->
          <el-table-column label="Fecha" prop="fincio">
            <template #default="props">
              <span>{{ formatearFecha(props.row.transferencia.updated_at)}}</span>
            </template>
          </el-table-column>



          <!-- Codigo -->
          <!-- <el-table-column label="Código" prop="codigo">
            <template #default="props">
              <span>{{ props.row.producto_codigo }}</span>
            </template>
          </el-table-column> -->

          <!-- Rubro -->
          <!-- <el-table-column label="Rubro" prop="rubro">
            <template #default="props">
              <span>{{ props.row.rubro.rubro_nombre }}</span>
            </template>
          </el-table-column> -->

          <!-- Editar -->
          <!-- <el-table-column
            label="Ver"
            prop="ver"
            header-align="center"
            align="center"
            width="75px"
          >
            <template #default="props">
              <el-button
                type="primary"
                circle
                @click="$refs.modalVer.abrir(props.row.producto_id)"
              >
                <span class="material-icons">visibility</span>
              </el-button>
            </template>
          </el-table-column> -->

          <!-- Eliminar -->
          <!-- <el-table-column 
            label="Eliminar" 
            prop="eliminar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="danger" 
                  circle 
                  @click="$refs.modalEliminar.abrir(props.row.id)"
                >
                  <span class="material-icons">delete</span>
                </el-button>
              </template>
          </el-table-column> -->
        </el-table>

        <div class="contenedor-paginator">
          <el-pagination
            layout="prev, pager, next, sizes, total, jumper"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :total="transferencias.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: center; margin-top: 1%"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </main>

  <modal-ver ref="modalVer"></modal-ver>

  <!-- <modal-nuevo ref="modalNuevo" @actualizarTabla="obtenerTodos"></modal-nuevo>

  <modal-modificar
    ref="modalModificar"
    @actualizarTabla="obtenerTodos"
  ></modal-modificar>

  <modal-eliminar
    ref="modalEliminar"
    @actualizarTabla="obtenerTodos"
  ></modal-eliminar> -->
</template>

<script>
import ModalVer from "./modales/ver.vue";
//   import ModalNuevo from "./modales/nuevo.vue";
//   import ModalModificar from "./modales/modificar.vue";
//   import ModalEliminar from "./modales/eliminar.vue";

export default {
  components: {
    ModalVer,
    //   ModalNuevo,
    //   ModalModificar,
    //   ModalEliminar,
  },

  data() {
    return {
      transferencias: [],
      paginas: {},
      fecha: Date,
      loading: false,
      pageSize: 20,
      currentPage: 1,
    };
  },

  mounted() {
    this.obtenerTodos();
  },

  methods: {
    async obtenerTodos() {
      this.loading = true;
      await this.axios.get("/api/transferencia/obtenerTodos").then((response) => {
        this.transferencias = response.data;
        this.paginas = response.data.pagina;
        this.fecha = response.data[0].plan_fdesde;
        console.log("fecha" + this.fecha);
        console.log("this.transferencias");
        console.log(this.transferencias);

        console.log(this.paginas);
      });
      this.loading = false;
    },

    formatearFecha(fecha){
      let fecha1 = new Date(fecha)
      // let fecha2 = fecha1.toLocaleString();
      let fecha2 = fecha1.toLocaleDateString();        
      return fecha2
    },

    handleCurrentChange: function (cpage) {
      this.$data.currentPage = cpage;
    },
    handleSizeChange: function (psize) {
      this.$data.pageSize = psize;
    },
  },
};
</script>

<style>
.contenedor-tabla {
  overflow: hidden;
  position: relative;
  float: right;
  width: 99%;
}

.material-icons {
  font-size: 24px;
}

.contenedor-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
