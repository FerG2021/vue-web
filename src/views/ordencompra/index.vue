<template>
  <main>
    <el-card>
      <template #header>
        <h1>Órdenes de compra</h1>
      </template>

      <div
        v-if="
          $store.state.user.tipo_usuario == 1 ||
          $store.state.user.tipo_usuario == 3 ||
          $store.state.user.tipo_usuario == 4 ||
          $store.state.user.tipo_usuario == 5 ||
          $store.state.user.tipo_usuario == 6
        "
      >
        <div class="contenedor-tabla">
          <div v-loading="loadingDatos">
            <el-table :data="arrayOrdenesCompra" stripe style="width: 100%">
              <el-table-column prop="date" label="Nro" width="100px">
                <template #default="props">
                  {{ props.row.ordenes_compras_id }}
                </template>
              </el-table-column>

              <el-table-column prop="date" label="Nro presupuestación">
                <template #default="props">
                  {{ props.row.ordenes_compras_presupuestacion_id }}
                </template>
              </el-table-column>

              <el-table-column prop="date" label="Proveedor">
                <template #default="props">
                  {{ props.row.ordenes_compras_proveedor_nombre }}
                </template>
              </el-table-column>

              <el-table-column prop="date" label="Monto total">
                <template #default="props">
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(
                      props.row.ordenes_compras_monto_total
                    )
                  }}
                </template>
              </el-table-column>

              <el-table-column prop="date" label="Fecha de creación">
                <template #default="props">
                  {{ formatearFecha(props.row.updated_at) }}
                </template>
              </el-table-column>

              <el-table-column
                label="Detalle"
                prop="detalle"
                header-align="center"
                align="center"
                width="90px"
              >
                <template #default="props">
                  <div style="display: flex">
                    <div style="margin: auto">
                      <el-button
                        type="primary"
                        circle
                        @click="
                          $refs.modalDetalle.abrir(props.row.ordenes_compras_id)
                        "
                        v-if="
                          $store.state.user.tipo_usuario == 1 ||
                          $store.state.user.tipo_usuario == 3 ||
                          $store.state.user.tipo_usuario == 4
                        "
                      >
                        <span class="material-icons">visibility</span>
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="Generar O.C."
                prop="detalle"
                header-align="center"
                align="center"
                width="120px"
              >
                <template #default="props">
                  <div style="display: flex">
                    <div style="margin: auto">
                      <el-button
                        v-if="
                          $store.state.user.tipo_usuario == 1 ||
                          $store.state.user.tipo_usuario == 3 ||
                          $store.state.user.tipo_usuario == 4 ||
                          $store.state.user.tipo_usuario == 5 ||
                          $store.state.user.tipo_usuario == 6
                        "
                        type="primary"
                        circle
                        @click="
                          $refs.modalGenerarOrdenCompra.abrir(
                            props.row.ordenes_compras_id
                          )
                        "
                        :disabled="props.row.ordenes_compras_estado == 1"
                      >
                        <span class="material-icons">verified</span>
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="contenedor-paginator">
              <el-pagination
                layout="prev, pager, next, sizes, total, jumper"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                :total="arrayOrdenesCompra.length"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                style="text-align: center; margin-top: 1%"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </main>

  <modal-detalle ref="modalDetalle"></modal-detalle>

  <modal-generar-orden-compra
    ref="modalGenerarOrdenCompra"
    @actualizarTabla="obtenerTodos"
  ></modal-generar-orden-compra>
</template>

<script>
import ModalDetalle from "./modales/ver.vue";
import ModalGenerarOrdenCompra from "./modales/generarOrdenCompra.vue";

export default {
  components: {
    ModalDetalle,
    ModalGenerarOrdenCompra,
  },

  data() {
    return {
      arrayOrdenesCompra: [],
      paginas: {},
      pageSize: 20,
      currentPage: 1,
      loadingDatos: false,
    };
  },

  mounted() {
    this.obtenerTodos();
  },

  methods: {
    async obtenerTodos() {
      this.loadingDatos = true;
      await this.axios.get("/api/ordencompra/obtenerTodos").then((response) => {
        this.arrayOrdenesCompra = response.data;
        console.log("this.arrayOrdenesCompra");
        console.log(this.arrayOrdenesCompra);
      });
      this.loadingDatos = false;
    },

    formatearFecha(fecha) {
      let fecha1 = new Date(fecha);
      // let fecha2 = fecha1.toLocaleString();
      let fecha2 = fecha1.toLocaleDateString();
      return fecha2;
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
