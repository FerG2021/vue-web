<template>
  <main>
    <el-card>
      <template #header>
        <h1>Provisiones</h1>
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
        <div class="button-container">
          <el-button
            type="primary"
            @click="$refs.modalNuevo.abrir()"
            class="btnElement"
            style="margin-left: 10px"
            v-if="
              $store.state.user.tipo_usuario == 1 ||
              $store.state.user.tipo_usuario == 4
            "
          >
            Nuevo
          </el-button>
        </div>
        

        <!-- Tabla para mostrar los datos -->
        <div class="contenedor-tabla">
          <el-table
            :data="budgets"
            stripe
            v-loading="loading"
            class="table"
            :height="getHeightWindow()"
          >
            <el-table-column
              prop="presupuestacion_id"
              label="Nro."
              width="100px"
            />

            <el-table-column
              prop="presupuestacion_plan_nombre"
              label="Fecha de creación"
            >
              <template #default="props">
                {{ formatearFecha(props.row.presupuestacion_fecha_creacion) }}
              </template>
            </el-table-column>

            <el-table-column prop="presupuestacion_plan_nombre" label="Plan" />

            <el-table-column prop="presupuestacion_rubro_nombre" label="Rubro">
              <template #default="props">
                {{ props.row.presupuestacion_rubro_nombre }}
              </template>
            </el-table-column>

            <el-table-column prop="rangoProvisión" label="Rango">
              <template #default="props">
                {{
                  formatearFechaSinDia(props.row.presupuestacion_fecha_incio)
                }}
                -
                {{ formatearFechaSinDia(props.row.presupuestacion_fecha_fin) }}
              </template>
            </el-table-column>

            <!-- Aregar rubro -->
            <el-table-column
              label="Carga"
              prop="editar"
              header-align="center"
              align="center"
              width="90px"
            >
              <template #default="props">
                <el-button
                  type="primary"
                  circle
                  @click="$refs.modalCarga.abrir(props.row.presupuestacion_id)"
                >
                  <span class="material-icons">add_shopping_cart</span>
                </el-button>
              </template>
            </el-table-column>

            <!-- Crear presupuestacion -->
            <el-table-column
              label="Comparativa"
              prop="comparativa"
              header-align="center"
              align="center"
              width="110px"
            >
              <template #default="props">
                <el-button
                  v-if="
                    $store.state.user.tipo_usuario == 1 ||
                    $store.state.user.tipo_usuario == 3 ||
                    $store.state.user.tipo_usuario == 4 ||
                    $store.state.user.tipo_usuario == 5 ||
                    $store.state.user.tipo_usuario == 6"
                  type="primary"
                  circle
                  @click="
                    $refs.modalComparativa.abrir(props.row.presupuestacion_id)
                  "
                >
                  <span class="material-icons">view_week</span>
                </el-button>
              </template>
            </el-table-column>

            <!-- Ver datos -->
            <el-table-column
              label="Detalle"
              prop="detalle"
              header-align="right"
              align="right"
              width="90px"
            >
              <template #default="props">
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
                    $refs.modalDetalle.abrir(props.row.presupuestacion_id)
                  "
                >
                  <span class="material-icons">visibility</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else><h1>No tiene permisos para realizar esta acción</h1></div>
    </el-card>
  </main>

  <modal-nuevo ref="modalNuevo" @actualizarTabla="obtenerTodos"></modal-nuevo>
  <modal-carga ref="modalCarga"></modal-carga>
  <modal-detalle ref="modalDetalle"></modal-detalle>
  <modal-comparativa ref="modalComparativa"></modal-comparativa>
</template>

<script>
import ModalNuevo from "./modales/nuevo.vue";
import ModalDetalle from "./modales/detalle.vue";
import ModalCarga from "./modales/carga.vue";
import ModalComparativa from "./modales/comparativa.vue";
import moment from 'moment';

export default {
  components: {
    ModalNuevo,
    ModalDetalle,
    ModalCarga,
    ModalComparativa,
  },

  data() {
    return {
      loading: false,
      budgets: [],
      loading: false,
    };
  },

  mounted() {
    this.obtenerTodos();
  },

  methods: {
    async obtenerTodos() {
      this.loading = true;
      await this.axios
        .get("/api/presupuestacion/obtenerTodos")
        .then((response) => {
          this.budgets = response.data;
        });
      this.loading = false;
    },

    formatearFecha(fecha) {
      return moment(fecha).format('DD/MM/YYYY');
    },

    formatearFechaSinDia(fecha) {
      return moment(fecha).format('MM/YYYY');
    },

    getHeightWindow() {
      var alturaPestana = window.innerHeight - 210;
      return  alturaPestana + 'px';
    },
  },
};
</script>

<style scoped lang="scss">
.button-container {
  display: flex; 
  flex-direction: row-reverse; 
  margin-right: 20px;
}

.contenedor-tabla {
  overflow: hidden;
  position: relative;
  float: right;
  width: 99%;
  margin-top: 15px;
}

.material-icons {
  font-size: 24px;
}

.table {
  width: 100%; 
  // height:  calc(100% - 20px);
}
</style>
