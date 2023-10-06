<template>
  <div>
    <modal
      ref="modal"
      titulo="Borrador presupuestación"
      :impedir-close="impedirClose"
      width="95%"
    >
      <el-steps
        :active="active"
        finish-status="success"
        simple
        style="margin-top: 5px; margin-bottom: 5px"
      >
        <el-step title="Obra"></el-step>
        <el-step title="Materiales"></el-step>
        <el-step title="Proveedores"></el-step>
        <el-step title="Resumen"></el-step>
      </el-steps>

      <!-- Paso 1 -->
      <div v-show="active == 0" style="padding: 30px">
        <el-form label-width="120px">
          <!-- Nombre -->
          <el-form-item label="Nombre obra" prop="nombreObra">
            <el-select
              v-model="form.nombreObra"
              placeholder="Seleccione un plan"
              style="width: 100%"
              @change="tomarValorPlan(form.nombreObra)"
              disabled
            >
              <el-option
                v-for="item in planesSelect"
                :key="item.plan_id"
                :label="item.plan_nombre"
                :value="item.plan_id"
                :disabled="item.disabled"
                style="width: 100%"
              />
            </el-select>
          </el-form-item>
          <!-- {{form.nombreObra}} -->
          <!-- <el-form-item label="Nombre obra" prop="nombreObra">
            <el-input v-model="form.nombreObra"></el-input>
          </el-form-item> -->
          <!-- {{datosPlanSeleccionado.plan_nombre}} -->

          <!-- Fecha de inicio y de fin -->
          <el-form-item label="Fecha de obra" style="width: 100%">
            <el-row :gutter="10" style="width: 100%">
              <el-col :span="12" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="form.fDesde"
                  disabled
                  placeholder="Fecha de inicio"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
              <el-col :span="12" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="form.fHasta"
                  disabled
                  placeholder="Fecha de fin"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <!-- Cantidad de meses -->
          <el-form-item label="Meses totales">
            <el-input
              style="width: 100%"
              v-model="form.cantMeses"
              disabled
              placeholder="Cantidad de meses"
              v-loading="loadingDesdeSelectPlan"
            ></el-input>
          </el-form-item>

          <!-- Fecha presupuestada -->
          <!-- <el-form-item label="Fecha presup.">
            <el-row :gutter="10" style="width: 100%">
              <el-col :span="12" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="form.fDesdePresupuestada"
                  disabled
                  placeholder="Fecha de inicio"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
              <el-col :span="12" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="form.fHastaPresupuestada"
                  disabled
                  placeholder="Fecha de fin"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item> -->

          <!-- Fecha a presupuestar -->
          <el-form-item label="Fecha a presup.">
            <el-date-picker
              v-model="form.fechaaPresupuestar"
              type="monthrange"
              range-separator="a"
              start-placeholder="Mes de inicio"
              end-placeholder="Mes de fin"
              style="width: 100%"
              @change="cantidadMesesManual()"
              :disabled="deshabilitarSelectFechaaPresupuestar()"
            />
          </el-form-item>
          <!-- {{form.fechaaPresupuestar}} -->

          <!-- Meses a presupuestar -->
          <el-form-item label="Meses a presup.">
            <el-input
              style="width: 100%"
              v-model="form.mesesaPresupuestar"
              disabled
              placeholder="Cantidad de meses"
            ></el-input>
          </el-form-item>

          <el-form-item label="Rubro a presup.">
            <!-- v-if="form.fechaaPresupuestar.length != 0" -->
            <el-select
              v-model="filtroRubro"
              placeholder="Seleccionar por rubro"
              filterable
              clearable
              style="width: 100%"
              @change="limpiarFilaProductoSeleccionado()"
            >
              <el-option
                v-for="item in rubrosSelect"
                :key="item.rubro_id"
                :label="item.rubro_nombre"
                :value="item.rubro_id"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="contenedorBtnSiguienteAtras">
          <el-button
            type="primary"
            class="btnSiguiente"
            @click="activar1YRecargar()"
          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Precio y stock -->
      <div v-show="active == 1" style="padding: 30px">
        <el-row :gutter="10">
          <el-col :span="6">
            <span>Inicio presupuestación</span>
            <el-input
              v-model="mostrarFechaIncioPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Fin presupuestación</span>
            <el-input
              v-model="mostrarFechaFinPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Cantidad de meses</span>
            <el-input
              v-model="mostrarCantidadMesesPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Rubro</span>
            <el-input v-model="mostrarRubroPresupuestacion" disabled></el-input>
          </el-col>
        </el-row>

        <!-- fila para seleccionar el producto -->
        <el-row :gutter="10" style="margin-top: 15px">
          <el-col :span="10">
            <span>Producto</span>
            <el-select
              v-model="productoSeleccionado"
              placeholder="Seleccionar producto"
              filterable
              clearable
              style="width: 100%"
              @change="seleccionarRubroProductoSeleccionado()"
            >
              <el-option
                v-for="item in productosDesdePrevisionNuevo"
                :key="item.producto_id"
                :label="item.producto_nombre"
                :value="item.producto_id"
              />
            </el-select>
          </el-col>

          <el-col :span="6">
            <span>Rubro</span>
            <el-input
              v-model="rubroProductoSeleccionado"
              disabled
              style="width: 100%"
            ></el-input>
          </el-col>

          <el-col :span="2">
            <span>Unidad</span>
            <el-input
              v-model="unidadProductoSeleccionado"
              disabled
              style="width: 100%"
            ></el-input>
          </el-col>

          <el-col :span="4">
            <span>Cantidad a comprar</span>
            <el-input-number
              v-loading="loadingCantidadAComprar"
              v-model="cantidadAComprarProductoSeleccionado"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-col>

          <el-col :span="2">
            <span style="color: white">btn</span>
            <el-button
              type="primary"
              style="width: 100%"
              @click="agregarProductoAComprar()"
            >
              +
            </el-button>
          </el-col>
        </el-row>

        <!-- tabla para mostrar los productos a comprar -->
        <el-table :data="arrayProductosAComprar" stripe style="width: 100%" gutter="5">
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="codigo" label="Código" width="120px">
            <template #default="props">
              <span>{{ props.row.producto_codigo }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="unidad" label="Unidad" width="120px">
            <template #default="props">
              <span>{{ props.row.producto_unidad }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="rubro" label="Rubro" width="120px">
            <template #default="props">
              <span>{{ props.row.rubro_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidad" label="Cant. a comp." width="120px">
            <template #default="props">
              <span>{{ props.row.cantidadAComprar }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="cantidadDeposito"
            label="Cant. depósito"
            width="120px"
          >
            <template #default="props">
              <span v-if="props.row.cantidadDeposito != null">{{ parseFloat(props.row.cantidadDeposito) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadDeposito" label="" width="70">
            <template #default="scope">
              <el-button
                type="primary"
                style="width: 10%; margin-bottom: 3px; margin-left: 3px"
                @click="$refs.modalBuscarProductoDeposito.abrir(scope, arrayCantidadesDeposito)"
              >
                <span class="material-icons">search</span>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="cantidadReal"
            label="Cant. real a comprar"
            width="120px"
          >
            <template #default="scope">
              <el-input-number
                v-model="scope.row.cantidadRealAComprar"
                :max="scope.row.cantidadAComprar"
                :controls="false"
                align="center"
                text-align="center"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column
            prop="cantidadReal"
            label="Observaciones"
            width="120px"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.observaciones"
                align="center"
                text-align="center"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="Eliminar"
            width="120"
            align="center"
            text-align="center"
          >
            <template #default="scope">
              <el-button
                type="danger"
                circle
                @click="eliminarItemArrayProductosAComprar(scope)"
              >
                <span class="material-icons">delete</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="contenedorBtnSiguienteAtras">
          <el-button type="info" class="btnAtras" @click="active = 0">
            Atrás
          </el-button>

          <el-button
            type="primary"
            class="btnSiguiente"
            @click="activar2yTraerProveedoresxRubro()"
          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Proveedores -->
      <div
        v-show="active == 2"
        style="padding: 30px"
        v-loading="loadingProveedoresParaMail"
      >
        <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
          <!-- <div><h3><b>{{item.rubro_nombre}}</b></h3></div> -->
          <el-checkbox
            v-model="item.rubro_elegido"
            @change="cambiarSeleccionSubItemsRubroElegido(item)"
          >
            <h3>
              <b>{{ item.rubro_nombre }}</b>
            </h3>
          </el-checkbox>

          <div v-for="(item1, index1) in arrayProveedoresMostrar" :key="index1">
            <div
              v-if="item1.rubro.rubro_id == item.rubro_id"
              style="margin-bottom: 5px"
            >
              <!-- {{item1.proveedor.proveedor_nombre}}  -->
              <el-checkbox
                v-model="item1.proveedor_elegido"
                size="large"
                border
              >
                {{ item1.proveedor.proveedor_nombre }} -
                {{ item1.proveedor.proveedor_email }}
              </el-checkbox>
            </div>
          </div>
        </div>

        <!-- {{arrayProveedoresMostrar}} -->

        <!-- <hr>
        <hr>
        <hr> -->

        <div class="contenedorBtnSiguienteAtras">
          <el-button type="info" class="btnAtras" @click="active = 1">
            Atrás
          </el-button>
          <el-button type="primary" class="btnSiguiente" @click="active = 3">
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Resumen -->
      <div v-show="active == 3" style="padding: 30px">
        <h1 style="text-align: center; margin: 0px">
          <u><b>Resumen de presupuestación</b></u>
        </h1>
        <!-- {{arrayCantidadesDeposito}} -->
        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <div class="block">
              <span style="margin-right: 10px" class="demonstration">Fecha límite de carga proveedor</span>
              <el-date-picker
                v-model="fechaLimiteCarga"
                type="date"
                placeholder="Ingrese la fecha límite"
                :size="size"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </div>
          </el-col>
          <!-- {{fechaLimiteCarga}} -->
        </el-row>

        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="12">
            <h3><b>Productos</b></h3>
            <!-- {{arrayProductosAComprar}} -->
            <!-- {{arrayProductosAComprar}} -->
            <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
              <h4 style="margin-top: 10px">
                <b><u>{{ item.rubro_nombre }}</u></b>
              </h4>

              <el-row>
                <el-col :span="10">
                  <b>Nombre</b>
                </el-col> 
                <el-col :span="1"></el-col>
                <el-col :span="2">
                  <span style="margin-left: 0px"><b>U. M.</b></span>
                </el-col> 
                <el-col :span="1"></el-col>
                <el-col :span="3">
                  <b>Cant.</b>
                </el-col> 
                <el-col :span="1"></el-col>
                <el-col :span="4">
                  <b>Obs.</b>
                </el-col> 
              </el-row>

              <div
                v-for="(item1, index1) in arrayProductosAComprar"
                :key="index1"
              >
                <ul>
                  <div
                    v-if="item1.rubro_id == item.rubro_id"
                    style="margin-bottom: 5px"
                  >
                    <!-- <li>{{ item1.producto_nombre }} - {{item1.cantidadRealAComprar}}</li> -->
                    <li>
                      <el-row>
                        <el-col :span="10">
                          {{ item1.producto_nombre }}
                        </el-col> 
                        <el-col :span="1"></el-col>
                        <el-col :span="2">
                          {{ item1.producto_unidad }}
                        </el-col> 
                        <el-col :span="1"></el-col>
                        <el-col :span="3">
                          <span style="margin-left: 5px">{{ item1.cantidadRealAComprar }}</span>
                        </el-col> 
                        <el-col :span="1"></el-col>
                        <el-col :span="4">
                          {{ item1.observaciones }}
                        </el-col> 
                      </el-row>
                    </li>

                    
                  </div>
                </ul>
              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <h3><b>Proveedores</b></h3>

            <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
              <!-- <div><h3><b>{{item.rubro_nombre}}</b></h3></div> -->

              <h4 style="margin-top: 10px">
                <b>{{ item.rubro_nombre }}</b>
              </h4>

              <div
                v-for="(item1, index1) in arrayProveedoresMostrar"
                :key="index1"
              >
                <ul>
                  <div
                    v-if="item1.rubro.rubro_id == item.rubro_id"
                    style="margin-bottom: 5px"
                  >
                    <!-- {{item1.proveedor.proveedor_nombre}}  -->
                    <div v-if="item1.proveedor_elegido == true">
                      <!-- <li>
                        {{ item1.proveedor.proveedor_nombre }} -
                        {{ item1.proveedor.proveedor_email }}
                      </li> -->

                      <li>
                        <el-row>
                          <el-col :span="12">
                            {{ item1.proveedor.proveedor_nombre }}
                          </el-col> 
                          <el-col :span="12">
                            {{ item1.proveedor.proveedor_email }}
                          </el-col> 
                        </el-row>
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="contenedorBtnSiguienteAtras">
          <el-button type="info" class="btnAtras" @click="active = 2">
            Atrás
          </el-button>

          <!-- <el-button  
              type="success"    
              class="btnBorrador"
              @click="onSubmit"
            >
              Guardar como borrador
            </el-button>
            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="onSubmit"
            >
              Guardar
            </el-button> -->

          <el-button-group class="btnSiguiente">
            <el-button 
              type="primary" 
              @click="onSubmitBorrador"
              :loading="loadingOnSubmitBorrador"
            >
              Guardar como borrador
            </el-button>
            <el-button 
              type="success" 
              @click="onSubmit"
              :loading="loadingOnSubmit"
            > Generar presupuestación </el-button>
          </el-button-group>
        </div>
      </div>
    </modal>
  </div>

  <modal-buscar-producto-deposito
    ref="modalBuscarProductoDeposito"
    @update:cantidadSacarDeposito="cantidadSacadaDeposito($event)"
  ></modal-buscar-producto-deposito>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { createElementVNode } from "@vue/runtime-core";
import ModalBuscarProductoDeposito from "./buscarProductoDeposito.vue";

name: "nuevoProducto";
export default {
  components: {
    ModalBuscarProductoDeposito,
  },
  data() {
    return {
      form: {
        nombreObra: null,
        montoObra: null,
        fechaObra: null,
        producto: null,
        fDesde: null,
        fHasta: null,
        cantMeses: null,
        fDesdePresupuestada: null,
        fHastaPresupuestada: null,
        fechaaPresupuestar: [],
        mesesaPresupuestar: null,
        rubroaPresupuestar: null,
      },

      cargando: false,
      loadingDesdeSelectPlan: false,
      rubrosSelect: [],
      active: 0,

      // valores para tomar los datos del plan
      planesSelect: [],
      datosPlanSeleccionado: [],
      arrayMeses: [],

      // PASO 2
      mostrarFechaIncioPresupuestacion: null,
      mostrarFechaFinPresupuestacion: null,
      mostrarCantidadMesesPresupuestacion: null,
      mostrarRubroPresupuestacion: null,
      filtroRubro: "",
      productos: [],
      productosNuevo: [],

      // nuevo array para el select tomando los datos de la tabla de prevision
      arrAuxProductosDesdePrevision: [],
      productosDesdePrevision: [],
      productosDesdePrevisionNuevo: [],
      arrayBuscarProductosEnPrevision: [],

      // fila para seleccionar el producto y agregarlo a la lista
      productoSeleccionado: null,
      rubroProductoSeleccionado: null,
      unidadProductoSeleccionado: null,
      cantidadAComprarProductoSeleccionado: null,

      // array para guardar los productos a comprar
      arrayProductosAComprar: [],
      arrayProductosAComprarEnviar: [],

      // array para guardar los rubros a comprar
      arrayRubrosAComprar: [],
      b: 0,
      arrayRubrosAComprarEnviar: [],

      // array para mandar datos para buscar la cantidad de la prevision del producto
      arrayDatosParaCantidadPresupestacion: [],
      loadingCantidadAComprar: false,

      // array donde se van a ir guardando las cantidades que se vayan tomando de los diferentes depósitos
        arrayCantidadesDeposito: [],

      // PASO 3
      loadingProveedoresParaMail: false,
      arrayProveedoresRecibidos: [],
      arrayProveedoresMostrar: [],
      arrayProveedoresMostrarEnviar: [],
      fechaLimiteCarga: null,

      checked2: null,

      //////////////////////////////
      // datos para la edicion del borrador
      //
      id: null,
      datosGenerales: [],
      productosYaPresupuestados: [],
      proveedoresYaPresupuestados: [],
      loadingOnSubmitBorrador: false,
      loadingOnSubmit: false,

    };
  },

  created() {
    this.obtenerPlanesSelect();
    this.obtenerRubrosSelect();
    this.obtenerProductosSelect();
  },

  watch: {
    filtroRubro(val) {

      if (val == "") {
        this.productosDesdePrevisionNuevo = [];

        this.productosDesdePrevision.forEach((elemento) => {
          let b = 0;
          this.productosDesdePrevisionNuevo.forEach((ele) => {
            if (ele.producto_id == elemento.producto_id) {
              b = 1;
            }
          });

          if (b == 0) {
            this.productosDesdePrevisionNuevo.push(elemento);
          }
        });

        // this.productosDesdePrevisionNuevo = this.productosDesdePrevision
      } else {
        this.productosDesdePrevisionNuevo = this.buscarRubro(val);
      }
    },
  },

  methods: {
    abrir(id) {
      this.id = id
      // formulario
      this.form.nombreObra = null;
      this.form.montoObra = null;
      this.form.fechaObra = null;
      this.form.producto = null;
      this.form.fDesde = null;
      this.form.fHasta = null;
      this.form.cantMeses = null;
      this.form.fDesdePresupuestada = null;
      this.form.fHastaPresupuestada = null;
      this.form.fechaaPresupuestar = [];
      this.form.mesesaPresupuestar = null;
      this.form.rubroaPresupuestar = null;

      this.cargando = false;
      this.loadingDesdeSelectPlan = false;
      // this.rubrosSelect = []
      this.active = 0;

      // valores para tomar los datos del plan
      this.planesSelect = [];
      this.datosPlanSeleccionado = [];
      this.arrayMeses = [];

      // PASO 2
      this.mostrarFechaIncioPresupuestacion = null;
      this.mostrarFechaFinPresupuestacion = null;
      this.mostrarCantidadMesesPresupuestacion = null;
      this.mostrarRubroPresupuestacion = null;
      this.filtroRubro = "";
      // this.productos = []
      // this.productosNuevo = []

      // nuevo array para el select tomando los datos de la tabla de prevision
      this.arrAuxProductosDesdePrevision = [];
      this.productosDesdePrevision = [];
      this.arrayBuscarProductosEnPrevision = [];

      // fila para seleccionar el producto y agregarlo a la lista
      this.productoSeleccionado = null;
      this.rubroProductoSeleccionado = null;
      this.unidadProductoSeleccionado = null;
      this.cantidadAComprarProductoSeleccionado = null;

      // array para guardar los productos a comprar
      this.arrayProductosAComprar = [];
      this.arrayProductosAComprarEnviar = [];

      // array para guardar los rubros a comprar
      this.arrayRubrosAComprar = [];
      this.b = 0;
      this.arrayRubrosAComprarEnviar = [];

      // array para mandar datos para buscar la cantidad de la prevision del producto
      this.arrayDatosParaCantidadPresupestacion = [];

      // array donde se van a ir guardando las cantidades que se vayan tomando de los diferentes depósitos
        this.arrayCantidadesDeposito = []

      // PASO 3
      this.arrayProveedoresRecibidos = [];
      this.arrayProveedoresMostrar = [];
      this.arrayProveedoresMostrarEnviar = [];

      this.checked2 = null;

      ////////////////////////////////////
      // datos para el edicion del borrador
      //
      this.datosGenerales = [];
      this.productosYaPresupuestados = [];
      this.proveedoresYaPresupuestados = [];
      this.fechaLimiteCarga = null

      this.loadingOnSubmitBorrador = false
      this.loadingOnSubmit = false

      this.$refs.modal.abrir();
      this.getDatos();
      this.obtenerPlanesSelect();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/borradorpresupuestacion/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          console.log("respuestaApi");
          console.log(respuestaApi.data);


          if (respuestaApi != null) {
            // this.datos = respuestaApi.data;
            // console.log(this.datos);
            // this.loading = false;

            // this.datosProductos = respuestaApi.data.productos;
            // this.loadingProductos = false;

            // console.log("this.datosProductos");
            // console.log(this.datosProductos);

            // this.datosProveedores = respuestaApi.data.proveedores;

            this.datosGenerales = respuestaApi.data;

            // genero el array para mostrar las cantidades obtenidas de cada uno de los depositos

            this.datosGenerales.transferencias.forEach((elemento) => {
              console.log("elemento trans");

              let fila = {
                deposito_id: elemento.itemTransferencia.transferencia_deposito_id,
                deposito_producto_id: elemento.itemTransferencia.transferencia_deposito_producto_id,
                producto_activo: elemento.itemTransferencia.transferencia_producto_activo,
                producto_id: elemento.itemTransferencia.transferencia_producto_id,
                producto_nombre: elemento.itemTransferencia.transferencia_producto_nombre,
                producto_stock: elemento.itemTransferencia.transferencia_producto_stock,
                producto_unidad: elemento.itemTransferencia.transferencia_producto_unidad,
                rubro_id: elemento.itemTransferencia.transferencia_producto_rubro_id,
                cantidad_utilizar: elemento.itemTransferencia.transferencia_cantidad_utilizar,            
              }

              this.arrayCantidadesDeposito.push(fila)
            })


            console.log("this.arrayCantidadesDeposito");
            console.log(this.arrayCantidadesDeposito);

            this.fechaLimiteCarga = this.datosGenerales.borrador_presupuesto_fecha_limite

            console.log("this.datosGenerales");
            console.log(this.datosGenerales);

            this.form.fechaaPresupuestar[0] = this.datosGenerales.borrador_presupuestacion_fecha_incio

            this.form.fechaaPresupuestar[1] = this.datosGenerales.borrador_presupuestacion_fecha_fin

            // this.form.nombreObra = this.datosGenerales.borrador_presupuestacion_plan_nombre

            this.form.nombreObra = this.datosGenerales.borrador_presupuestacion_plan_id


            this.form.fDesde = this.datosGenerales.borrador_presupuestacion_plan_fecha_inicio

            this.form.fHasta = this.datosGenerales.borrador_presupuestacion_plan_fecha_fin

            this.form.cantMeses = this.datosGenerales.borrador_presupuestacion_plan_plazo

            this.form.fDesdePresupuestada = this.datosGenerales.borrador_presupuestacion_fecha_incio

            this.form.fHastaPresupuestada = this.datosGenerales.borrador_presupuestacion_fecha_fin

            // PRODUCTOS DESDE API
            this.datosGenerales.productos.forEach((elemento) => {

              let fila = {
                borrador_presupuestacion_producto_id: elemento.productoPresupuestacion.borrador_presupuestacion_producto_id,
                producto_id: elemento.productoPresupuestacion.borrador_producto_id,
                producto_codigo: elemento.producto.producto_codigo,
                producto_nombre: elemento.productoPresupuestacion.borrador_producto_nombre,
                producto_puc: elemento.producto.producto_puc,
                producto_fpuc: elemento.producto.producto_fpuc,
                producto_unidad: elemento.producto.producto_unidad,
                producto_activo: elemento.producto.producto_activo,
                rubro_id: elemento.producto.rubro_id,
                rubro_nombre: elemento.productoPresupuestacion.borrador_producto_rubro_nombre,
                // cantidadAComprar: this.cantidadAComprarProductoSeleccionado,
                cantidadAComprar: elemento.productoPresupuestacion.borrador_producto_cantidad_a_comprar,
                cantidadDeposito: elemento.productoPresupuestacion.borrador_producto_cantidad_deposito,
                cantidadRealAComprar: elemento.productoPresupuestacion.borrador_producto_cantidad_real_a_comprar,
                observaciones: elemento.productoPresupuestacion.borrador_producto_observaciones,
                accion: "B",
              }

              this.productosYaPresupuestados.push(fila)
            })

            console.log("this.productosYaPresupuestados");
            console.log(this.productosYaPresupuestados);

            this.productosYaPresupuestados.forEach((elemento) => {
              let fila = {
                producto_id: elemento.producto_id,
                producto_codigo: elemento.producto_codigo,
                producto_nombre: elemento.producto_nombre,
                producto_puc: elemento.producto_puc,
                producto_fpuc: elemento.producto_fpuc,
                producto_unidad: elemento.producto_unidad,
                producto_activo: elemento.producto_activo,
                rubro_id: elemento.rubro_id,
                rubro_nombre: elemento.rubro_nombre,
                // cantidadAComprar: this.cantidadAComprarProductoSeleccionado,
                cantidadAComprar: elemento.cantidadAComprar,
                cantidadDeposito: elemento.cantidadDeposito,
                cantidadRealAComprar: elemento.cantidadRealAComprar,
                observaciones: elemento.observaciones,
                accion: "A",
              }

              this.arrayProductosAComprar.push(fila)
            })

            // PROVEEDORES DESDE API
            this.datosGenerales.proveedores.forEach((elemento) => {
              let fila = {
                presupuestacion_proveedor_id: elemento.proveedor.borrador_presupuestacion_proveedor_id,
                presupuestacion_id: elemento.proveedor.borrador_presupuestacion_id,
                presupuestacion_plan_id: elemento.proveedor.borrador_presupuestacion_plan_id,
                proveedor_id: elemento.proveedor.borrador_proveedor_id,
                proveedor_nombre: elemento.proveedor.borrador_proveedor_nombre,
                proveedor_rubro_id: elemento.proveedor.borrador_proveedor_rubro_id,
                proveedor_mail: elemento.proveedor.borrador_proveedor_mail,
                accion: "B"
              }

              this.proveedoresYaPresupuestados.push(fila)
            })

            console.log("this.proveedoresYaPresupuestados");
            console.log(this.proveedoresYaPresupuestados);

            


            this.loadingProveedores = false;

            this.tomarValorPlan(this.datosGenerales.borrador_presupuestacion_plan_id)
          } else {
            this.cerrar();
          }
        });
      this.cantidadMeses()
      
    },

    activar1YRecargar() {
      this.active = 1;
      console.log("recargar");
    },

    buscarRubro(keywords) {
      // return this.productosDesdePrevision.filter(item =>{
      //   if(item.rubro.rubro_id == keywords){
      //     return item
      //   }
      // })

      this.productosDesdePrevision.forEach((elemento) => {
        let b = 0;
        if (elemento.rubro.rubro_id == keywords) {
          this.productosDesdePrevisionNuevo.forEach((ele) => {
            if (ele.producto_id == elemento.producto_id) {
              b = 1;
            }
          });

          if (b == 0) {
            this.productosDesdePrevisionNuevo.push(elemento);
          }
        }
      });

      return this.productosDesdePrevisionNuevo;
    },

    async obtenerPlanesSelect() {
      this.cargando = true;
      await this.axios.get("/api/plan/obtenerTodosSelect").then((response) => {
        this.planesSelect = response.data;
      });
      this.cargando = false;
    },

    async obtenerRubrosSelect() {
      await this.axios.get("/api/rubro/obtenerTodosSelect").then((response) => {
        this.rubrosSelect = response.data;
      });
    },

    async obtenerProductosSelect() {
      await this.axios.get("/api/producto/obtenerTodos").then((response) => {
        this.productos = this.productosNuevo = response.data.datos;
      });
    },

    async tomarValorPlan(id) {
      this.loadingDesdeSelectPlan = true;

      await this.axios.get("/api/plan/obtenerDatos/" + id).then((response) => {
        this.datosPlanSeleccionado = response.data;
        this.form.fDesde = this.datosPlanSeleccionado.plan_fdesde;
        this.form.fHasta = this.datosPlanSeleccionado.plan_fhasta;
        this.form.cantMeses = this.datosPlanSeleccionado.plan_plazo;

        let fecha = new Date(2021, 8, 28);

        for (let index = 0; index < this.form.cantMeses; index++) {
          let fila = {
            // nombre: new Date(fecha.setMonth(fecha.getMonth() + 1))
            nombre: fecha,
          };
          this.arrayMeses.push(fila);
          fecha = new Date(fecha.setMonth(fecha.getMonth() + 1));
        }
        console.log(this.datosPlanSeleccionado);
      });

      this.loadingDesdeSelectPlan = false;
    },

    tomarValor(id) {
      this.planesSelect.forEach((elemento) => {
        if (elemento.id == id) {
          console.log(elemento);
          this.idProducto = elemento.id;
          this.nombreProducto = elemento.descripcion;
          this.unidadMedidaProducto = elemento.unidadMedida.nombre;
          this.categoriaProducto = elemento.categoria.nombre;
        }
      });
    },

    deshabilitarSelectFechaaPresupuestar() {
      if (this.form.nombreObra == null) {
        return true;
      } else {
        return false;
      }
    },

    seleccionarRubroPresupuestar() {

      if (this.filtroRubro != "") {
        this.rubrosSelect.forEach((elemento) => {
          // console.log(this.rubrosSelect);
          // console.log(this.form.rubroaPresupuestar);
          if (elemento.rubro_id == this.filtroRubro) {
            this.mostrarRubroPresupuestacion = elemento.rubro_nombre;
          }
        });
      } else {
        this.mostrarRubroPresupuestacion = null;
      }

      // NUEVA FUNCION: a partir del rubro elegido ya cargo la tabla
      console.log(
        "this.productosDesdePrevisionNuevo en seleccionarRubroPresupuestar"
      );
      console.log(this.productosDesdePrevisionNuevo);

      console.log(
        "this.productosDesdePrevision en seleccionarRubroPresupuestar"
      );
      console.log(this.productosDesdePrevision);

      // NUEVA FUNCION: al seleccionar un rubro cargo todos los productos pertenecientes al rubro en la tabla

      // pregunto si el rubro que se quiere agregar ya fue agregado
      let yaExisteElemento = false;
      yaExisteElemento = this.arrayRubrosAComprar.filter(
        (x) => x.rubro_id == this.filtroRubro
      );
      console.log("yaExisteElemento");
      console.log(yaExisteElemento);

      if (yaExisteElemento.length == 0) {
        let hayProductosParaRubro = 0;

        this.productosDesdePrevision.forEach((elemento) => {
          let b = 0;
          if (elemento.rubro.rubro_id == this.filtroRubro) {
            hayProductosParaRubro = 1;
            // pregunto si el producto ya fue agregado
            this.arrayProductosAComprar.forEach((ele) => {
              if (ele.producto_id == elemento.producto_id) {
                ele.cantidadAComprar =
                  ele.cantidadAComprar + elemento.prevision_cantidad;
                b = 1;
              }
            });

            console.log("elementoooooooooo");
            console.log(elemento);

            if (b == 0) {
              let fila = {
                // producto_auto: elemento.producto_auto,
                producto_id: elemento.producto_id,
                producto_codigo: elemento.producto_codigo,
                producto_nombre: elemento.producto_nombre,
                producto_puc: elemento.producto_puc,
                producto_fpuc: elemento.producto_fpuc,
                producto_unidad: elemento.producto_unidad,
                producto_activo: elemento.producto.producto_activo,
                rubro_id: elemento.rubro.rubro_id,
                rubro_nombre: elemento.rubro.rubro_nombre,
                // cantidadAComprar: this.cantidadAComprarProductoSeleccionado,
                cantidadAComprar: elemento.prevision_cantidad,
                cantidadDeposito: null,
                cantidadRealAComprar: null,
                accion: "A",
              };

              this.arrayProductosAComprar.push(fila);

              console.log("this.arrayProductosAComprar");
              console.log(this.arrayProductosAComprar);

              let filaRubro = {
                rubro_id: fila.rubro_id,
                rubro_nombre: fila.rubro_nombre,
              };

              // pregunto si el rubro ya esta agregado
              this.b = 0;
              let yaExisteElemento = false;
              // if (this.arrayRubrosAComprar.length == 0) {
              //   this.arrayRubrosAComprar.push(filaRubro);
              // } else {
              // this.arrayRubrosAComprar.forEach((elemento) => {
              //   if (elemento.rubro_id == fila.rubro_id) {
              //     this.b = 0
              //   } else {
              //     this.b = 1
              //   }
              // })

              yaExisteElemento = this.arrayRubrosAComprar.filter(
                (x) => x.rubro_id == filaRubro.rubro_id
              );
              console.log("yaExisteElemento");
              console.log(yaExisteElemento);

              // }

              if (yaExisteElemento.length == 0) {
                this.arrayRubrosAComprar.push(filaRubro);
              }
            }
          }
        });

        if (hayProductosParaRubro == 0) {
          ElMessage({
            message:
              "¡No hay productos para el rubro seleccionado en el periodo eledigo!",
            type: "error",
          });
        }
      } else {
        ElMessage({
          message:
            "¡El rubro seleccionado ya fue agregado a la presupuestación!",
          type: "error",
        });
      }
    },

    deshabilitarBtnSiguientePaso1() {
      if (this.form.fechaaPresupuestar.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    

    // esta funcion se agrega para permitir que al cargar los datos del borrador la cantidad de meses y el array de los productos no se alterar de como se los declara en la presupestacion (cuando se los guarda como borrador). Si se cambian los meses manualmente desde el date picker del modal de editar borrador recien se llama a la funcion para que se limpien todos los campos y se carguen de nuevo. 
    // SI SE DECIDE QUE NO SEA ASI SE DEBE ELIMINAR ESTA FUNCION Y EN EL CHANGE DEL DATE PICKER LLAMAR A cantidadMeses()

    cantidadMesesManual(){
      // al cambiar la fecha de presupuestacion limpiar los campos de rubro a presupuestar y la lista con todos los productos para que se vuelvan a elegir acorde a los nuevos meses seleccionados
      // this.form.mesesaPresupuestar = null
      this.filtroRubro = null
      this.arrayProductosAComprar = []
      this.arrayRubrosAComprar = []
      this.arrayCantidadesDeposito = []

      this.cantidadMeses()
    },

    async cantidadMeses() {
      let fechaaPresupuestar0 = new Date(this.form.fechaaPresupuestar[0])
      console.log("fechaaPresupuestar0");
      console.log(fechaaPresupuestar0.getMonth());

      let fechaaPresupuestar1 = new Date(this.form.fechaaPresupuestar[1])
      console.log("fechaaPresupuestar1");
      console.log(fechaaPresupuestar1.getMonth());

      let meses =
        fechaaPresupuestar1.getMonth() -
        fechaaPresupuestar0.getMonth() +
        12 *
          (fechaaPresupuestar1.getFullYear() -
            fechaaPresupuestar0.getFullYear()) +
        1;


      this.form.mesesaPresupuestar = meses;

      let mostrarFechaIncio =
        fechaaPresupuestar0.getDate() +
        "/" +
        (fechaaPresupuestar0.getMonth() + 1) +
        "/" +
        fechaaPresupuestar0.getFullYear();


      let mostrarFechaFin =
        fechaaPresupuestar1.getDate() +
        "/" +
        (fechaaPresupuestar1.getMonth() + 1) +
        "/" +
        fechaaPresupuestar1.getFullYear();

      this.mostrarFechaIncioPresupuestacion = mostrarFechaIncio;
      this.mostrarFechaFinPresupuestacion = mostrarFechaFin;
      this.mostrarCantidadMesesPresupuestacion = meses;

      // voy a buscar los productos de la prevision teniendo en cuenta el id de la obra y los meses a presupuestar
      this.arrayBuscarProductosEnPrevision = [];

      let fila = {
        plan_id: this.form.nombreObra,
        fechaDesdePresupuestacion: this.form.fechaaPresupuestar[0],
        fechaHastaPresupuestacion: this.form.fechaaPresupuestar[1],
      };

      this.arrayBuscarProductosEnPrevision.push(fila);

      console.log("this.arrayBuscarProductosEnPrevision");
      console.log(this.arrayBuscarProductosEnPrevision);

      let params = {
        arrayBuscarProductosEnPrevision: JSON.stringify(
          this.arrayBuscarProductosEnPrevision
        ),
      };

      console.log("params");
      console.log(params);

      this.productosDesdePrevision = [];
      this.productosDesdePrevisionNuevo = [];
      console.log("this.productosDesdePrevision");
      console.log(this.productosDesdePrevision);

      await this.axios
        .post("/api/vistaprevision/obtenerDatos", params)
        .then((response) => {
          this.productosDesdePrevision = this.productosDesdePrevisionNuevo =
            response.data;
          console.log("this.productosDesdePrevision");
          console.log(this.productosDesdePrevision);
        });
    },

    limpiarFilaProductoSeleccionado() {
      this.productosDesdePrevisionNuevo = [];
      this.productoSeleccionado = null;
      this.rubroProductoSeleccionado = null;
      this.unidadProductoSeleccionado = null;
      this.cantidadAComprarProductoSeleccionado = null;

      this.seleccionarRubroPresupuestar();
    },

    deshabilitarSelectRubroaPresupuestar() {
      if (this.form.fechaaPresupuestar.length == 0) {
        return true;
      } else {
        return false;
      }
    },

    seleccionarRubroProductoSeleccionado() {
      this.arrayDatosParaCantidadPresupestacion = [];
      this.productosNuevo.forEach((elemento) => {
        if (elemento.producto_id == this.productoSeleccionado) {
          console.log("datos del producto seleccionado");
          console.log(elemento);
          this.rubroProductoSeleccionado = elemento.rubro.rubro_nombre;
          this.unidadProductoSeleccionado = elemento.producto_unidad;

          let fila = {
            fechaDesdePresupuestacion: this.form.fechaaPresupuestar[0],
            fechaHastaPresupuestacion: this.form.fechaaPresupuestar[1],
            plan_id: this.form.nombreObra,
            rubro_id: elemento.rubro_id,
            producto_id: elemento.producto_id,
            producto_nombre: elemento.producto_nombre,
          };

          console.log("fila");
          console.log(fila);

          this.arrayDatosParaCantidadPresupestacion.push(fila);

          this.buscarCantidadPrevision(fila.producto_id);
        }
      });

      //
    },

    async buscarCantidadPrevision(producto_id) {
      this.loadingCantidadAComprar = true;

      this.productosDesdePrevisionNuevo.forEach((elemento) => {
        if (elemento.producto_id == producto_id) {
          this.cantidadAComprarProductoSeleccionado =
            elemento.prevision_cantidad;
        }
      });

      this.loadingCantidadAComprar = false;
    },

    agregarProductoAComprar() {
      if (
        this.rubroProductoSeleccionado == null ||
        this.rubroProductoSeleccionado == "" ||
        this.unidadProductoSeleccionado == null ||
        this.unidadProductoSeleccionado == "" ||
        this.cantidadAComprarProductoSeleccionado == null ||
        this.cantidadAComprarProductoSeleccionado == "" ||
        this.cantidadAComprarProductoSeleccionado == 0
      ) {
        ElMessage({
          message: "¡Se deben completar todos los campos!",
          type: "error",
        });
      } else {
        // recorro el array de los productos a comprar para poder saber si el producto que quiero agregar ya ha sido agregado
        let b = 0;
        this.arrayProductosAComprar.forEach((ele) => {
          if (ele.producto_id == this.productoSeleccionado) {
            b = 1;
          }
        });

        // si el producto ya esta agregado muestro el mensaje
        if (b == 1) {
          ElMessage({
            message: "¡El producto seleccionado ya ha sido agregado!",
            type: "error",
          });

          // limpio los campos
          this.productoSeleccionado = null;
          this.rubroProductoSeleccionado = null;
          this.unidadProductoSeleccionado = null;
          this.cantidadAComprarProductoSeleccionado = null;
        } else {
          // si no ha sido agregado lo agrego
          this.productosNuevo.forEach((elemento) => {
            if (elemento.producto_id == this.productoSeleccionado) {
              let fila = {
                producto_auto: elemento.producto_auto,
                producto_id: elemento.producto_id,
                producto_codigo: elemento.producto_codigo,
                producto_nombre: elemento.producto_nombre,
                producto_puc: elemento.producto_puc,
                producto_fpuc: elemento.producto_fpuc,
                producto_unidad: elemento.producto_unidad,
                producto_activo: elemento.producto_activo,
                rubro_id: elemento.rubro_id,
                rubro_nombre: elemento.rubro.rubro_nombre,
                cantidadAComprar: this.cantidadAComprarProductoSeleccionado,
                cantidadDeposito: null,
                cantidadRealAComprar: null,
              };

              this.arrayProductosAComprar.push(fila);

              let filaRubro = {
                rubro_id: fila.rubro_id,
                rubro_nombre: fila.rubro_nombre,
              };

              // pregunto si el rubro ya esta agregado
              this.b = 0;
              let yaExisteElemento = false;
              // if (this.arrayRubrosAComprar.length == 0) {
              //   this.arrayRubrosAComprar.push(filaRubro);
              // } else {
              // this.arrayRubrosAComprar.forEach((elemento) => {
              //   if (elemento.rubro_id == fila.rubro_id) {
              //     this.b = 0
              //   } else {
              //     this.b = 1
              //   }
              // })

              yaExisteElemento = this.arrayRubrosAComprar.filter(
                (x) => x.rubro_id == filaRubro.rubro_id
              );
              console.log("yaExisteElemento");
              console.log(yaExisteElemento);

              // }

              if (yaExisteElemento.length == 0) {
                this.arrayRubrosAComprar.push(filaRubro);
              }

              // limpio los campos
              this.productoSeleccionado = null;
              this.rubroProductoSeleccionado = null;
              this.unidadProductoSeleccionado = null;
              this.cantidadAComprarProductoSeleccionado = null;

              // console.log(this.arrayProductosAComprar);
            }
          });
        }
      }
    },

    eliminarItemArrayProductosAComprar(scope) {
      this.arrayProductosAComprar.splice(scope.$index, 1);
      // this.arrayRubrosAComprar.splice(scope.$index, 1);

      this.verificarRubroProductoSigueExistente(scope);
    },

    verificarRubroProductoSigueExistente(scope) {
      console.log("scope");
      console.log(scope);

      let index = 0;
      this.arrayRubrosAComprar.forEach((elemento) => {
        let b = 0;
        this.arrayProductosAComprar.forEach((ele) => {
          if (elemento.rubro_id == ele.rubro_id) {
            b = 1;
          }
        });

        if (b == 0) {
          this.arrayRubrosAComprar.splice(index, 1);
        }

        index++;
      });
    },

    cantidadSacadaDeposito(elemento) {
      console.log("elemento desde modal");
      console.log(elemento);

      if (
        this.arrayProductosAComprar[elemento.indice].cantidadAComprar <
        elemento.cantidadUsar
      ) {
        ElMessage({
          message:
            "¡Cantidad extraída de los depositos mayor que la cantidad a presupuestar, por favor seleccione otra cantidad!",
          type: "error",
        });
      } else {
        this.arrayProductosAComprar[elemento.indice].cantidadDeposito =
          elemento.cantidadUsar;

        this.arrayProductosAComprar[elemento.indice].cantidadRealAComprar =
          this.arrayProductosAComprar[elemento.indice].cantidadAComprar -
          elemento.cantidadUsar;
      }
    },

    // deshabilitarBtnSiguientePaso2(){
    //   this.arrayProductosAComprar.forEach((elemento) => {
    //     if (elemento.cantidadRealAComprar == null) {
    //       return true
    //     }
    //   })
    // },

    activar2yTraerProveedoresxRubro() {
      let b = 0;
      this.arrayProductosAComprar.forEach((elemento) => {
        if (
          // elemento.cantidadRealAComprar == 0 ||
          // elemento.cantidadRealAComprar == null ||
          elemento.cantidadDeposito == null
        ) {
          b = 1;
        }
      });

      if (b == 1) {
        ElMessage({
          message:
            "¡Se deben completar la cantidad real y de depósito de cada uno de los productos agregados!",
          type: "error",
        });
      } else {
        this.arrayProductosAComprar.forEach((elemento) => {
          let filaRubro = {
            rubro_id: elemento.rubro_id,
            rubro_nombre: elemento.rubro_nombre,
          }

          this.b = 0;
          let yaExisteElemento = false;

          yaExisteElemento = this.arrayRubrosAComprar.filter(
            (x) => x.rubro_id == filaRubro.rubro_id
          );
          console.log("yaExisteElemento");
          console.log(yaExisteElemento);

          // }

          if (yaExisteElemento.length == 0) {
            this.arrayRubrosAComprar.push(filaRubro);
          }
        })


        this.active = 2;
        this.obtenerProveedorxRubro();
      }
    },

    async obtenerProveedorxRubro() {
      this.arrayProveedoresMostrar = [];
      console.log("array prov al inicio");
      console.log(this.arrayProveedoresMostrar);
      this.loadingProveedoresParaMail = true;

      this.arrayRubrosAComprarEnviar = [];

      this.arrayRubrosAComprar.forEach((elemento) => {
        let fila = {
          rubro_id: elemento.rubro_id,
          rubro_nombre: elemento.rubro_nombre,
          rubro_elegido: null,
        };
        this.arrayRubrosAComprarEnviar.push(fila);
      });

      console.log("this.arrayRubrosAComprarEnviar");
      console.log(this.arrayRubrosAComprarEnviar);

      let params = {
        arrRubrosAComprar: JSON.stringify(this.arrayRubrosAComprarEnviar),
      };

      await this.axios
        .post("/api/proveedorxrubro/obtenerProveedorxRubro", params)
        .then((response) => {
          console.log(response.data);
          this.arrayProveedoresRecibidos = response.data;
        });

      this.arrayRubrosAComprarEnviar.forEach((elemento) => {
        this.arrayProveedoresRecibidos.forEach((ele) => {
          if (elemento.rubro_id == ele.rubro_id) {
            let fila = {
              rubro: {
                rubro_id: elemento.rubro_id,
                rubro_nombre: elemento.rubro_nombre,
              },
              proveedor: ele.proveedor,
              proveedor_elegido: null,
            };

            this.arrayProveedoresMostrar.push(fila);
          }
        });
      });

      console.log("this.arrayProveedoresMostrar");
      console.log(this.arrayProveedoresMostrar);

      this.loadingProveedoresParaMail = false;
    },

    cambiarSeleccionSubItemsRubroElegido(item) {
      console.log(item);

      this.arrayProveedoresMostrar.forEach((elemento) => {
        if (elemento.rubro.rubro_id == item.rubro_id) {
          if (item.rubro_elegido == true) {
            elemento.proveedor_elegido = true;
          } else {
            elemento.proveedor_elegido = false;
          }
        }
      });
    },

    async onSubmit() {
      this.loadingOnSubmit = true
      
      let fechaIngresada = 0
      if (this.fechaLimiteCarga == null) {
        ElMessage({
          type: 'error',
          message: '¡Se debe seleccionar una fecha límite!',
        })
        this.loadingOnSubmit = false
        return
      } 

      // recorro el array de proveedores para ver si al menos uno tiene proveedor_elegido == true
      let cantidadElegido = 0
      this.arrayProveedoresMostrar.forEach((elemento) => {
        if (elemento.proveedor_elegido == true) {
          cantidadElegido = cantidadElegido + 1
        }
      })


      if (cantidadElegido == 0) {
        ElMessage({
          type: 'error',
          message: '¡Se debe seleccionar al menos un proveedor!',
        })
        this.loadingOnSubmit = false
        return
      } 



      this.loadingOnSubmit = true
      let params = {
        // presuestacion
        presupuestacion_id: this.id,
        presupuestacion_plan_id: this.form.nombreObra,
        presupuestacion_plan_nombre: this.datosPlanSeleccionado.plan_nombre,
        // presupuestacion_fecha_incio: this.form.fDesdePresupuestada,
        presupuestacion_fecha_incio: this.form.fechaaPresupuestar[0],
        // presupuestacion_fecha_fin: this.form.fHastaPresupuestada,
        presupuestacion_fecha_fin: this.form.fechaaPresupuestar[1],
        presupuestacion_fecha_limite: this.fechaLimiteCarga
      };

      // if (this.form.fechaaPresupuestar != null ||
      //     this.form.fechaaPresupuestar != ""
      // ) {
      //   params.presupuestacion_fecha_incio = this.form.fechaaPresupuestar[0]
      //   params.presupuestacion_fecha_fin = this.form.fechaaPresupuestar[1]
      // } else {
      //   params.presupuestacion_fecha_incio = this.form.fDesdePresupuestada
      //   params.presupuestacion_fecha_fin = this.form.fHastaPresupuestada
      // }

      // presupuestacion_productos
      this.arrayProductosAComprar.forEach((elemento) => {
        let fila = {
          presupuestacion_producto_id: 0,
          presupuestacion_id: this.id,
          presupuestacion_plan_id: this.form.nombreObra,
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
          producto_rubro_id: elemento.rubro_id,
          producto_rubro_nombre: elemento.rubro_nombre,
          producto_unidad_medida: elemento.producto_unidad,
          producto_cantidad_a_comprar: elemento.cantidadAComprar,
          producto_cantidad_deposito: elemento.cantidadDeposito,
          producto_cantidad_real_a_comprar: elemento.cantidadRealAComprar,
          producto_observaciones: elemento.observaciones,
          accion: "A",
        };

        this.arrayProductosAComprarEnviar.push(fila);
      });

      params.arrayProductosAComprarEnviar = JSON.stringify(
        this.arrayProductosAComprarEnviar
      );

      // presupuestacion_proveedores
      this.arrayProveedoresMostrar.forEach((elemento) => {
        if (elemento.proveedor_elegido == true) {
          let fila = {
            presupuestacion_proveedor_id: 0,
            // presupuestacion_id: 0,
            presupuestacion_id: this.id,
            presupuestacion_plan_id: this.form.nombreObra,
            proveedor_id: elemento.proveedor.proveedor_id,
            proveedor_nombre: elemento.proveedor.proveedor_nombre,
            proveedor_rubro_id: elemento.rubro.rubro_id,
            proveedor_mail: elemento.proveedor.proveedor_email,
            accion: "A"
          };

          this.arrayProveedoresMostrarEnviar.push(fila);
        }
      });

      this.productosYaPresupuestados.forEach((elemento) => {
        this.arrayProveedoresMostrarEnviar.push(elemento);
      })

      params.arrayProveedoresMostrarEnviar = JSON.stringify(
        this.arrayProveedoresMostrarEnviar
      );

      params.arrayRubrosAComprar = JSON.stringify(
        this.arrayRubrosAComprarEnviar
      );

      // if (this.arrayCantidadesDeposito.length > 0) {
      //   params.arrTransferencias = JSON.stringify(this.arrayCantidadesDeposito)
      // }

        params.arrTransferencias = JSON.stringify(this.arrayCantidadesDeposito)


      await this.axios
        .post("/api/borradorpresupuestacion/crearPresupuestacion", params)
        .then((response) => {
          console.log(response);

          if (response.data) {
            ElMessage({
              type: "success",
              message: "¡Prespuestación realizada con éxito!",
            });
            this.$emit("actualizarTabla");
            this.cerrar();
          }
        });
      
      this.loadingOnSubmit = false
    },

    async onSubmitBorrador() {
      this.loadingOnSubmitBorrador = true

      let fechaIngresada = 0
      if (this.fechaLimiteCarga == null) {
        ElMessage({
          type: 'error',
          message: '¡Se debe seleccionar una fecha límite!',
        })
        this.loadingOnSubmitBorrador = false
        return
      } 

      // recorro el array de proveedores para ver si al menos uno tiene proveedor_elegido == true
      let cantidadElegido = 0
      this.arrayProveedoresMostrar.forEach((elemento) => {
        if (elemento.proveedor_elegido == true) {
          cantidadElegido = cantidadElegido + 1
        }
      })


      if (cantidadElegido == 0) {
        ElMessage({
          type: 'error',
          message: '¡Se debe seleccionar al menos un proveedor!',
        })
        this.loadingOnSubmitBorrador = false
        return
      } 

      this.loadingOnSubmitBorrador = true
      let params = {
        // presuestacion
        presupuestacion_id: this.id,
        presupuestacion_plan_id: this.form.nombreObra,
        presupuestacion_plan_nombre: this.datosPlanSeleccionado.plan_nombre,
        presupuestacion_fecha_incio: this.form.fechaaPresupuestar[0],
        presupuestacion_fecha_fin: this.form.fechaaPresupuestar[1],
        presupuestacion_fecha_limite: this.fechaLimiteCarga,
      };

      // presupuestacion_productos
      this.arrayProductosAComprar.forEach((elemento) => {
        let fila = {
          presupuestacion_producto_id: 0,
          presupuestacion_id: this.id,
          presupuestacion_plan_id: this.form.nombreObra,
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
          producto_rubro_id: elemento.rubro_id,
          producto_rubro_nombre: elemento.rubro_nombre,
          producto_cantidad_a_comprar: elemento.cantidadAComprar,
          producto_cantidad_deposito: elemento.cantidadDeposito,
          producto_cantidad_real_a_comprar: elemento.cantidadRealAComprar,
          producto_observaciones: elemento.observaciones,
          accion: "A"
        };

        this.arrayProductosAComprarEnviar.push(fila);
      });
      

      this.productosYaPresupuestados.forEach((elemento) => {
        this.arrayProductosAComprarEnviar.push(elemento)
      })


      params.arrayProductosAComprarEnviar = JSON.stringify(
        this.arrayProductosAComprarEnviar
      );

      // presupuestacion_proveedores
      this.arrayProveedoresMostrar.forEach((elemento) => {
        if (elemento.proveedor_elegido == true) {
          let fila = {
            presupuestacion_proveedor_id: 0,
            // presupuestacion_id: 0,
            presupuestacion_id: this.id,
            presupuestacion_plan_id: this.form.nombreObra,
            proveedor_id: elemento.proveedor.proveedor_id,
            proveedor_nombre: elemento.proveedor.proveedor_nombre,
            proveedor_rubro_id: elemento.rubro.rubro_id,
            proveedor_mail: elemento.proveedor.proveedor_email,
            accion: "A"
          };
          this.arrayProveedoresMostrarEnviar.push(fila);
        }

      });

      this.productosYaPresupuestados.forEach((elemento) => {
        this.arrayProveedoresMostrarEnviar.push(elemento);
      })

      params.arrayProveedoresMostrarEnviar = JSON.stringify(
        this.arrayProveedoresMostrarEnviar
      );

      params.arrayRubrosAComprar = JSON.stringify(
        this.arrayRubrosAComprarEnviar
      );

      // if (this.arrayCantidadesDeposito.length > 0) {
      //   params.arrTransferencias = JSON.stringify(this.arrayCantidadesDeposito)
      // }

        params.arrTransferencias = JSON.stringify(this.arrayCantidadesDeposito)


      await this.axios
        .post("/api/borradorpresupuestacion/actualizar", params)
        .then((response) => {
          console.log(response);

          if (response.data) {
            ElMessage({
              type: "success",
              message: "¡Borrador actualizado con éxito!",
            });
            this.$emit("actualizarTabla");
            this.cerrar();
          }
        });
    

      
    },
  },
};
</script>

<style scoped>
.contenedorBtnSiguienteAtras {
  display: flex;
  width: 100%;
  margin-top: 10px;
}

.btnSiguiente {
  margin: auto;
  margin-right: 10px;
}

.btnBorrador {
  margin: right;
  margin-right: 10px;
}
</style>
