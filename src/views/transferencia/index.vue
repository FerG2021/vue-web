<template>
  <main>
    <el-card>
      <template #header>
        <h1>Pedidos de mi envío</h1>
      </template>

      <div v-if="$store.state.user.tipo_usuario == 1 || $store.state.user.tipo_usuario == 3 || $store.state.user.tipo_usuario == 4 || $store.state.user.tipo_usuario == 5 || $store.state.user.tipo_usuario == 6">
        <!-- Collapse para filtros -->
        <div class="demo-collapse">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Filtros" name="1">
              <template #title>
                <!-- <h4 style="color: #95989e">
                <span class="material-icons">manage_search</span>
              </h4> -->

                <span
                  class="material-icons"
                  style="margin-top: -1px; margin-left: 25px; color: #95989e"
                  >filter_list</span
                >
                <span
                  style="
                    font-size: 20px;
                    margin-top: 0px !important;
                    color: #95989e;
                  "
                  >Filtros</span
                >
              </template>
              <div>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <!-- Filtro por nombre -->
                    <!-- <el-input
                    v-model="filtroNombre"
                    placeholder="Buscar por nombre"
                    clearable
                  ></el-input> -->
                  </el-col>

                  <el-col :span="8">
                    <!-- Filtro por codigo -->
                    <!-- <el-input
                    v-model="filtroCodigo"
                    placeholder="Buscar por código"
                    clearable
                    :controls="false"
                    style="width: 100%"
                  ></el-input> -->
                  </el-col>

                  <el-col :span="8">
                    <el-select
                      v-model="filtroEstado"
                      placeholder="Seleccionar por estado"
                      filterable
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in estadosSelect"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- Tabla para mostrar los datos -->
        <div class="contenedor-tabla">
          <div v-loading="loadingDatos">
            <!-- <div v-if="transferencias.length != 0"> -->
            <el-table
              :data="
                transferenciasNuevo.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              v-loading="loading"
              :cell-style="classChecker"
            >
              <!-- :data="transferencias.slice((currentPage - 1) * pageSize,currentPage * pageSize)" -->

              <!-- Nro -->
              <el-table-column label="Nro." prop="nro" width="80px">
                <template #default="props">
                  <span>{{ props.row.transferencia.transferencia_id }}</span>
                </template>
              </el-table-column>

              <!-- Nro -->
              <el-table-column
                label="Nro. pres."
                prop="nroPresupuestacion"
                width="100px"
              >
                <template #default="props">
                  <span>{{
                    props.row.presupuestacion.presupuestacion_id
                  }}</span>
                </template>
              </el-table-column>

              <!-- Nombre -->
              <el-table-column
                label="Presupuestación"
                prop="presupuestacion"
                min-width="200px"
              >
                <template #default="props">
                  <span>{{
                    props.row.presupuestacion.presupuestacion_plan_nombre
                  }}</span>
                </template>
              </el-table-column>

              <!-- Destino -->
              <el-table-column label="Origen" prop="origen">
                <template #default="props">
                  <span>{{ props.row.deposito.deposito_nombre }}</span>
                </template>
              </el-table-column>

              <!-- Producto -->
              <el-table-column label="Producto" prop="producto">
                <template #default="props">
                  <span>{{
                    props.row.transferencia.transferencia_producto_nombre
                  }}</span>
                </template>
              </el-table-column>

              <!-- Unidad de medida -->
              <el-table-column label="U.M." prop="unidadMedida">
                <template #default="props">
                  <span>{{
                    props.row.transferencia.transferencia_producto_unidad
                  }}</span>
                </template>
              </el-table-column>

              <!-- Cantidad a stock -->
              <el-table-column label="Cant. stock" prop="cantSacada">
                <template #default="props">
                  <span>{{
                    props.row.transferencia.transferencia_producto_stock
                  }}</span>
                </template>
              </el-table-column>

              <!-- Cantidad a utilizar -->
              <el-table-column label="Cant. sacada" prop="cantSacada">
                <template #default="props">
                  <span>{{
                    props.row.transferencia.transferencia_cantidad_utilizar
                  }}</span>
                </template>
              </el-table-column>

              <!-- Fecha inicio -->
              <el-table-column label="Fecha" prop="fincio">
                <template #default="props">
                  <span>{{
                    formatearFecha(props.row.transferencia.updated_at)
                  }}</span>
                </template>
              </el-table-column>

              <!-- Estado -->
              <el-table-column label="Estado" prop="estado">
                <template #default="props">
                  <el-select
                    v-if="
                      $store.state.user.tipo_usuario == 1 ||
                      $store.state.user.tipo_usuario == 4
                    "
                    v-model="props.row.transferencia.transferencia_estado"
                    class="m-2"
                    placeholder="Selecciona un estado"
                    @change="
                      cambiarEstado(
                        props.row,
                        props.row.transferencia.transferencia_estado
                      )
                    "
                    :disabled="
                      props.row.transferencia.transferencia_estado ==
                      'Ejecutado'
                    "
                  >
                    <el-option
                      v-for="item in estadosTransferencias"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
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
            <!-- </div> -->
          </div>
        </div>
      </div>
    </el-card>
  </main>

  <modal-ver ref="modalVer"></modal-ver>
  <modal-cambiar-estado
    ref="modalCambiarEstado"
    @obtener-datos="obtenerTodos()"
  ></modal-cambiar-estado>

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
import { ElMessage, ElMessageBox } from "element-plus";

import ModalVer from "./modales/ver.vue";
import ModalCambiarEstado from "./modales/cambiarEstado.vue";
//   import ModalNuevo from "./modales/nuevo.vue";
//   import ModalModificar from "./modales/modificar.vue";
//   import ModalEliminar from "./modales/eliminar.vue";

export default {
  components: {
    ModalVer,
    ModalCambiarEstado,
    //   ModalNuevo,
    //   ModalModificar,
    //   ModalEliminar,
  },

  data() {
    return {
      transferencias: [],
      transferenciasNuevo: [],
      paginas: {},
      fecha: Date,
      pageSize: 20,
      currentPage: 1,
      loadingDatos: false,
      filtroEstado: "",

      estadosTransferencias: [
        {
          value: "Pendiente",
          label: "Pendiente",
        },
        {
          value: "Ejecutado",
          label: "Ejecutado",
        },
        {
          value: "No realizado",
          label: "No realizado",
        },
      ],

      estadosSelect: [
        {
          value: "Pendiente",
          label: "Pendiente",
        },
        {
          value: "Ejecutado",
          label: "Ejecutado",
        },
        {
          value: "No realizado",
          label: "No realizado",
        },
      ],
    };
  },

  mounted() {
    this.obtenerTodos();
  },

  watch: {
    filtroEstado(val) {
      console.log("entra");
      console.log("val");
      console.log(val);

      if (val == "") {
        this.transferenciasNuevo = this.transferencias;
      } else {
        this.transferenciasNuevo = this.buscarEstado(val);
        console.log("this.transferenciasNuevo recibido");
        console.log(this.transferenciasNuevo);
      }
    },
  },

  methods: {
    async obtenerTodos() {
      this.loadingDatos = true;
      this.transferencias = [];
      await this.axios
        .get("/api/transferencia/obtenerTodos")
        .then((response) => {
          console.log("response");
          console.log(response);

          if (response.data.length != 0) {
            console.log("entro");
            response.data.forEach((elemento) => {
              if (elemento.presupuestacion != null) {
                this.transferencias.push(elemento);
              }
            });

            this.transferenciasNuevo = this.transferencias;

            // this.transferencias = response.data;
            this.paginas = response.data.pagina;
            this.fecha = response.data[0].plan_fdesde;
            console.log("fecha" + this.fecha);
            console.log("this.transferencias");
            console.log(this.transferencias);

            console.log(this.paginas);
          }
        });
      this.loadingDatos = false;
    },

    formatearFecha(fecha) {
      let fecha1 = new Date(fecha);
      // let fecha2 = fecha1.toLocaleString();
      let fecha2 = fecha1.toLocaleDateString();
      return fecha2;
    },

    async cambiarEstado(row, estado) {
      console.log("cambio estado");
      console.log("row");
      console.log(row);

      console.log("estado");
      console.log(estado);

      if (estado == "Ejecutado") {
        this.$refs.modalCambiarEstado.abrir(row, estado);
      } else {
        let params = {
          id: row.transferencia.transferencia_id,
          estado: estado,
        };

        console.log("params");
        console.log(params);

        await this.axios
          .post("/api/transferencia/actualizar", params)
          .then((response) => {
            console.log("response");
            console.log(response);
            ElMessage({
              type: "success",
              message: "¡Estado de la transferencia actualizada con éxito!",
            });
            this.obtenerTodos();
          });
      }
    },

    buscarEstado(keywords) {
      return this.transferencias.filter((item) => {
        // console.log("item.transferencia");
        // console.log(item.transferencia.transferencia_estado);

        if (item.transferencia.transferencia_estado == keywords) {
          console.log("item");
          console.log(item);
          return item;
        }
      });
    },

    classChecker({ row, column, rowIndex, columnIndex }) {
      // console.log("*******************************");
      // console.log("rowIndex de classchecker");
      // console.log(rowIndex);

      // console.log("row de classchecker");
      // console.log(row);

      // console.log("columnIndex de classchecker");
      // console.log(columnIndex);

      // console.log("column de classchecker");
      // console.log(column);

      if (row.transferencia.transferencia_estado == "Ejecutado") {
        return { background: "#96ceb4", color: "black" };
      }

      if (row.transferencia.transferencia_estado == "Pendiente") {
        return { background: "#ffeead", color: "black" };
      }

      if (row.transferencia.transferencia_estado == "No realizado") {
        return { background: "#ff6f69", color: "black" };
      }
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
