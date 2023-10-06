<template>
  <div>
    <modal
      ref="modal"
      titulo="Comparativa de productos"
      :impedir-close="impedirClose"
      width="99%"
    >
      <div v-if="decisionComparativa == false">
        <div style="display: flex">
          <div style="margin: auto">
            <h3 style="text-align: center">Existe un borrador generado para esta comparativa</h3>
            <h3 style="text-align: center">Indique si desea seguir con los datos guardados en el borrador o con los datos originales</h3>
          </div> 
        </div>

        <div style="display: flex; margin-top: 10px">
          <div style="margin: auto">
            <el-button
              type="primary"
              @click="getDatos(0)"
            >
              Continuar con datos originales
            </el-button>

            <el-button
              type="success"
              @click="getDatos(1)"
            >
              Continuar con datos guardados en el borrador
            </el-button>
          </div>
        </div> 

      </div>
      
      <div v-loading="loadingTabla" v-else>
        <el-scrollbar>
          <div class="contenedorTablas">
            <!-- {{datosAPI}} -->
            <!-- :summary-method="getSummaries" -->
            <div style="display: flex; margin-bottom: 10px">
              <div style="margin: auto">
                <!-- <el-button
                  type="primary"
                  @click="moverscroll()"
                >1</el-button>   -->

                <el-button-group>
                  <el-button 
                    type="primary" 
                    :icon="ArrowLeft"
                    @click="moverscroll(-80)"
                    >
                      Mover a la izquierda
                    </el-button>
                  <el-button  
                    type="primary"
                    @click="moverscroll(80)"
                  >
                    Mover a la derecha
                  </el-button>
                </el-button-group>  
              </div>
            </div>
            <!-- {{arraySoloProductos}} -->
            <div 
              style="overflow: auto;" 
              id="midiv"
            >
              <div 
                id="tablaprueba" 
                style="height: 100%; width: 10000px;"
              > 

                <el-table
                  :data="arraySoloProductos"
                  border
                  stripe
                  style="width: 100%;"
                  show-summary
                  @sort-change="sortChange()"
                  @cell-click="cellClick"
                  ref="tablaComparativa"
                  :cell-style="classChecker"
                  :header-cell-style="headerStylePrincipalTable"
                  scrollbar-always-on
                >
                  <el-table-column
                    label="Productos"
                    align="center"
                    style="background-color: red"
                    fixed
                  >
                    <!-- <el-table-column prop="date" label="ID" align="center" fixed>
                      <template #default="props">
                        {{ props.row.producto_id }}
                      </template>
                    </el-table-column> -->

                    <el-table-column 
                      prop="date" 
                      label="Nombre" 
                      align="center"
                      width="200px"
                    >
                      <template #default="props">
                        {{ props.row.producto_nombre }}
                      </template>
                    </el-table-column>

                    <el-table-column 
                      prop="date" 
                      label="U. M." 
                      align="center"
                      width="100px"
                    >
                      <template #default="props">
                        {{ props.row.producto_unidad }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="date"
                      label="Cant. a comprar"
                      align="center"
                      width="100px"
                    >
                      <template #default="props">
                        <!-- {{props.row.cantidad_a_comprar}} -->
                        <el-input-number
                          v-model="props.row.cantidad_a_comprar"
                          style="width: 100%"
                          :controls="false"
                          @change="cambiarCantidad(props)"
                          :disabled="deshabilitarPorOrdenCompra"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                  </el-table-column>

                  <el-table-column label="Proveedores" align="center">
                    <el-table-column
                      v-for="(item, index) in datosAPI"
                      :key="index"
                      :label="item.proveedor_nombre"
                      align="center"
                      :column-key="item.proveedor_id"
                      :cell-style="colorColumnas(index)"
                    > 
                    <template #header>
                      <el-checkbox 
                        v-model="item.proveedorSeleccionado" 
                        :label="item.proveedor_nombre" 
                        size="large" 
                        @change="cambiarProveedorSeleccionado(item)"
                      />
                      <el-button
                        type="primary"
                        size="small"
                        circle
                        style="margin-left: 5px"
                        @click="$refs.modalCargaPorProveedorMostrar.abrir(item.proveedor_id, item.presupuestacion_id)"
                      >
                        <!-- <span class="material-icons">info</span> -->
                        i
                      </el-button>
                    </template>

                      <!-- Factor -->
                      <el-table-column 
                        label="Factor" 
                        align="center"
                        prop="factor"
                        width="80px"
                      >
                        <template #default="scope" >
                          <el-input-number
                            v-model="item.productos[scope.$index].factor"
                            :controls="false"
                            style="width: 100%"
                            @change="cambiarCantidadFactor(item.productos[scope.$index], scope)"
                            :disabled="deshabilitarPorOrdenCompra"
                          ></el-input-number>
                        </template>
                      </el-table-column>

                      <!-- Cantidad proveedor -->
                      <el-table-column 
                        label="Cant" 
                        align="center"
                        prop="cantProv"
                        width="80px"
                      >
                        <template #default="scope" >
                          {{parseFloat(item.productos[scope.$index].cantidad_proveedor)}}
                        </template>
                      </el-table-column>    
                      
                      <!-- PNG -->
                      <el-table-column 
                        label="PNG" 
                        align="center"
                        prop="png"
                        width="150px"
                      >
                        <template #default="scope" >
                          <el-input-number
                            v-model="item.productos[scope.$index].precio_png"
                            :controls="false"
                            style="width: 100%"
                            @change="cambiarPNG(item.productos[scope.$index], scope)"
                            :disabled="deshabilitarPorOrdenCompra"
                          ></el-input-number>
                          <!-- {{parseFloat(item.productos[scope.$index].precio_png)}} -->
                        </template>
                      </el-table-column>

                      <!-- IVA -->
                      <el-table-column 
                        label="%IVA" 
                        align="center"
                        prop="iva"
                        width="60px"
                      >
                        <template #default="scope" >
                          {{parseFloat(item.productos[scope.$index].iva)}}
                        </template>
                      </el-table-column>

                      <!-- Monto iva -->
                      <el-table-column 
                        label="$ IVA" 
                        align="center"
                        prop="montoIva"
                        width="90px"
                      >
                        <template #default="scope" >
                          $ {{ new Intl.NumberFormat('de-DE').format(parseFloat(item.productos[scope.$index].totaliva)) }}
                          <!-- {{parseFloat(item.productos[scope.$index].totaliva)}} -->
                        </template>
                      </el-table-column>

                      <!-- PU -->
                      <el-table-column 
                        label="PU" 
                        align="center"
                        prop="pu"
                        width="140px"
                      >
                        <template #default="scope" >
                          $ {{new Intl.NumberFormat('de-DE').format(parseFloat(item.productos[scope.$index].precio_pu))}}
                          <!-- {{parseFloat(item.productos[scope.$index].precio_pu)}} -->
                        </template>
                      </el-table-column>
                      
                      <!-- PP -->
                      <el-table-column 
                        label="PP" 
                        align="center"
                        @select="seleccionar(param)"
                        style="background-color: red;"
                        prop="pp"
                        width="190px"
                        size="small"
                        
                      >
                        <template #default="scope" >
                          <el-checkbox 
                            v-model="item.productos[scope.$index].productoSeleccionado" 
                            :label="'$' + new Intl.NumberFormat('de-DE').format(parseFloat(item.productos[scope.$index].precio_pp))" 
                            text-color="#ffff"
                            @change="cambiarSeleccionProductoSegmentado(scope, item.productos[scope.$index])"
                            style="color: black"
                            :disabled="item.productos[scope.$index].precio_pp == 0"
                          />
                        </template>
                        <!-- :label="parseFloat(item.productos[scope.$index].precio_pp)"  -->
                      </el-table-column>


                    </el-table-column>
                  </el-table-column>
                </el-table>

                <!-- muestro la informacion de los proveedores -->
                <!-- {{arrayInfoProveedores}} -->
                <!-- {{arrayInfoProveedores}} -->
                <el-table
                  stripe
                  :data="arrayTotal"
                  :cell-style="classCheckerIntermedio"
                  :header-cell-style="headerStyleIntermedio"
                  id="tabla2"

                  border
                  style="width: 100%;"
                  scrollbar-always-on
                >
                  <el-table-column width="254px"></el-table-column>
                  <el-table-column width="146px"></el-table-column>
                  <el-table-column v-for="(item, index) in arrayInfoProveedores" :key="index" align="center">
                    <!-- <template #default="scope"> -->
                    <!-- <el-table-column width="100px" label="F.P." align="center">
                      {{item.proveedor_forma_de_pago_nombre}}
                    </el-table-column> -->

                    <el-table-column width="180px" label="F.P." align="center">
                      <!-- {{item.proveedor_forma_de_pago_nombre}} -->
                      <el-select 
                        v-model="item.proveedor_forma_de_pago_nombre"  placeholder="Select" 
                        size="large"
                        :disabled="deshabilitarPorOrdenCompra"
                      >
                        <el-option
                          v-for="item in arrayFormaPago"
                          :key="item.key"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-table-column>

                    <el-table-column width="100px" label="Notas" align="center">
                      <!-- <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="item.proveedor_notas"
                        placement="bottom-start"
                      > -->
                        <el-input
                          :controls="false"
                          style="width: 100%"
                          v-model="item.proveedor_notas"
                        >
                          <template #prepend>
                            <el-button
                              width="10%"
                              @click="$refs.modalNotas.abrir(item)"
                              :disabled="deshabilitarPorOrdenCompra"
                            >
                              <!-- <span class="material-icons">visibility</span> -->
                              i
                            </el-button>
                          </template>
                        </el-input>
                      <!-- </el-tooltip> -->
                      <!-- {{item.proveedor_forma_de_pago_nombre}} -->
                    </el-table-column>


                    <el-table-column width="70px" label="Fact. A" align="center">
                      <span v-if="item.proveedor_factura_A == 0">
                        No
                      </span>

                      <span v-if="item.proveedor_factura_A == 1">
                        Si
                      </span>
                      <!-- {{item.proveedor_factura_A}} -->
                    </el-table-column>
                    <el-table-column width="110px" label="$ Fact. A" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_factura_A"
                        @change="actualizarPrecioTotal()"
                        :disabled="deshabilitarPorOrdenCompra"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_factura_A}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="Flete" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_flete"
                        @change="actualizarPrecioTotal()"
                        :disabled="deshabilitarPorOrdenCompra"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_flete}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="DyB" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_descuentos_bonificaciones"
                        @change="actualizarPrecioTotal()"
                        :disabled="deshabilitarPorOrdenCompra"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_descuentos_bonificaciones}} -->
                    </el-table-column>
                    <el-table-column width="130px" label="Total" align="center">
                      <span v-if="item.menor_monto_total == 0">
                        $ {{ new Intl.NumberFormat('de-DE').format(item.proveedor_monto_total_homogeneo) }}
                      </span>

                      <span v-if="item.menor_monto_total == 1">
                        <el-tag
                          type="success"
                          class="mx-1"
                          effect="dark"
                        >
                          $ {{ new Intl.NumberFormat('de-DE').format(item.proveedor_monto_total_homogeneo) }}
                        </el-tag>
                      </span>

                    </el-table-column>
                    <!-- </template> -->
                  </el-table-column>
                </el-table>
            
                <!-- muestro el total -->
                <el-table 
                  :data="arrayTotal"
                  style="margin-top: 15px; width: 100%;"
                  :cell-style="classCheckerTotal"
                  :header-cell-style="headerStyleTotal"
                  stripe
                  border
                  scrollbar-always-on
                >
                  <!-- <el-table-column label=""></el-table-column> -->
                  <el-table-column label="Compra seg." align="center" width="296px">
                    <template #default="props">
                      <el-tag
                        type="success"
                        class="mx-1"
                        effect="dark"
                      >
                        $ {{ new Intl.NumberFormat('de-DE').format(props.row.totalHomogeneo) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="" width="100px"></el-table-column>
                  
                  <el-table-column v-for="(item, index) in arrayPrecioPPProveedores" :key="index" :label="item.titulo" align="center" width="99px">
                      <span v-if="!isNaN(item.totalPP)" >
                        $ {{ new Intl.NumberFormat('de-DE').format(item.totalPP)}}
                      </span>

                      <span v-if="!isNaN(item.totalHomogeneo) && item.menorHomogeneo == 1" style="color: red">
                        <el-tag
                          type="success"
                          class="mx-1"
                          effect="dark"
                        >
                          $ {{ new Intl.NumberFormat('de-DE').format(item.totalHomogeneo)}}
                        </el-tag>
                      </span>

                      <span v-if="!isNaN(item.totalHomogeneo) && item.menorHomogeneo == 0" style="color: black">
                        $ {{ new Intl.NumberFormat('de-DE').format(item.totalHomogeneo)}}
                      </span>
                  </el-table-column>

                </el-table>
              </div>
            </div>
          </div>
        </el-scrollbar>


        <!-- boton para generar ordenes de compra -->
        <div style="display: flex">
          <div style="margin-left: auto">
            <el-button
              type="primary"
              style="margin-top: 10px"
              @click="guardarBorrador()"
              :loading="loadingBtnGuardarBorrador"
              v-if="deshabilitarPorOrdenCompra == false" 
              :disabled="$store.state.user.tipo_usuario != 1 && $store.state.user.tipo_usuario != 3"
            >
              Guardar borrador
            </el-button>

            <el-button
              type="success"
              style="margin-top: 10px"
              @click="generarOrdenesDeCompra()"
              :loading="loadingBtnGenerarOrdenesCompra"
              v-if="deshabilitarPorOrdenCompra == false"
              :disabled="$store.state.user.tipo_usuario != 1 && $store.state.user.tipo_usuario != 3"
            >
              Generar órdenes de compra
            </el-button>
          </div>
        </div>       
      </div>
    </modal>
  </div>

  <modal-carga-por-proveedor-mostrar
    ref="modalCargaPorProveedorMostrar"
  ></modal-carga-por-proveedor-mostrar>

  <modal-notas
    ref="modalNotas"
    @update:cantidadSacarDeposito="guardarNotas($event, arrayCantidadesDeposito)"
  ></modal-notas>

</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import modalCargaPorProveedorMostrar from './cargaPorProveedorMostrar.vue'
import modalNotas from './notas.vue'



name: "nuevoProducto";
export default {
  components: {
    modalCargaPorProveedorMostrar,
    modalNotas,
  },
  data() {
    return {
      id: null,
      datosAPI: [],
      arraySoloProductos: [],
      arrAux: [],
      mostrarTabla: false,
      loadingTabla: false,
      arrayTodosProductos: [],
      arrayProductos: [],
      longitudProveedores: null,
      totalHomogeneo: 0,
      arrayTotal: [],
      arrayPrecioPPProveedores: [],
      arrayInfoProveedores: [],
      infoProveedores: [],
      condicionesPago: [],
      valorScroll: 0,
      arrayCondicionesPago: [],
      arrayFormaPago: [],
      arrayTotalHomegeneoProveedores: [],
      arrayOrdenCompra: [],
      arrayOpcionesEntregaFacturaA: [
        {
          label: 'Si',
          value: 1,
        },
        {
          label: 'No',
          value: 0,
        },
      ],
      loadingBtnGenerarOrdenesCompra: false,

      // dato que va a guardar el estado de la comparativa, si se puede editar o no; o si existe borrador
      estadoComparativa: null,
      decisionComparativa: null,
      loadingBtnGuardarBorrador: false,
      deshabilitarPorOrdenCompra: false,
    };
  },

  methods: {
    abrir(id) {
      this.id = null;
      this.id = id;

      this.datosAPI = [];
      this.arraySoloProductos = [];
      this.arrAux = [];
      this.arrayTodosProductos = []
      this.arrayProductos = []
      this.longitudProveedores = null;

      this.mostrarTabla = false;
      this.loadingTabla = true;
      this.totalHomogeneo = 0
      this.arrayPrecioPPProveedores = []
      this.arrayInfoProveedores = []
      this.infoProveedores = []
      this.condicionesPago = []
      this.valorScroll = 0
      this.arrayTotalHomegeneoProveedores = []
      this.arrayOrdenCompra = []
      this.loadingBtnGenerarOrdenesCompra = false

      this.estadoComparativa = null
      this.decisionComparativa = null
      this.loadingBtnGuardarBorrador = false
      this.deshabilitarPorOrdenCompra = false




      this.$refs.modal.abrir();


      let t1 = document.querySelector('#tabla1');

      // let t2 = document.querySelector('#tabla2');

      // t1.addEventListener('scroll', () => {
      //   t2.scrollLeft = box1.scrollLeft;
      // });

      // limpio los campos
      this.getCondicionesPago()
      this.getEstadoComparativa();
      
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getCondicionesPago(){
      await this.axios
        .get("/api/condicionpago/obtenerTodos")
        .then((response) => {
          const respuestaApi = response;

          this.arrayCondicionesPago = respuestaApi.data;
          
          this.arrayCondicionesPago.forEach((elemento) => {
            let fila = {
              key: elemento.condicionpago_id,
              label: elemento.condicionpago_nombre,
              value: elemento.condicionpago_id
            }

            this.arrayFormaPago.push(fila)
          })
        })
    },

      
    async getEstadoComparativa(){
      // primero pregunto la condicion de la comparativa
      await this.axios
        .get("/api/presupuestacionproductosproveedor/condicionComparativa/" + this.id)
        .then((response) => {
          this.estadoComparativa = response.data.code

          if (this.estadoComparativa == 200) {
            // 200 = EXISTE UNA COMPARATIVA GENERADA (NO SE PUEDE EDITAR)
            this.decisionComparativa = true
            this.deshabilitarPorOrdenCompra = true

            this.getDatos(1)
          } else {
            if (this.estadoComparativa == 201) {
              // 201 = EXISTE UN BORRADOR (SE PUEDE EDITAR O TOMAR LOS DATOS ORIGINALES)
              this.decisionComparativa = false
              return
            } else {
              if (this.estadoComparativa == 202) {
                // 202 = NO EXISTE BORRADOR (SE MUESTRAN LOS DATOS ORIGINALES)
                this.decisionComparativa = true
                this.getDatos(0)
              } 
            }
          }
        })

    },

    // armo el array para mostrar unificando los proveedores y sus productos
    async getDatos(datosBorrador) {
      this.decisionComparativa = true      

      let params = {
        id: this.id,
        datosBorrador: datosBorrador
      }

      await this.axios
        // .get("/api/presupuestacionproductosproveedor/obtenerTodos/" + this.id, params)
        .post("/api/presupuestacionproductosproveedor/obtenerTodos" ,params)

        .then((response) => {

          this.arrAux = response.data;

          this.arrAux.forEach((elemento) => {
            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id ,
              // productos: elemento.productos , 
              proveedor_factura_A: elemento.proveedor_factura_A ,
              proveedor_monto_factura_A: elemento.proveedor_monto_factura_A ,
              proveedor_forma_de_pago: elemento.proveedor_forma_de_pago ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_mail: elemento.proveedor_mail , 
              proveedor_monto_descuentos_bonificaciones: elemento.proveedor_monto_descuentos_bonificaciones , 
              proveedor_monto_flete: elemento.proveedor_monto_flete , 
              proveedor_monto_totalPP: Number(elemento.proveedor_monto_totalPP) , 
              proveedor_monto_total_homogeneo: elemento.proveedor_monto_total_homogeneo , 
              proveedor_nombre: elemento.proveedor_nombre , 
              proveedor_rubro_id: elemento.proveedor_rubro_id , 
              proveedorSeleccionado: false,
            }

            let auxProd = [];

            elemento.productos.forEach((ele) => {
              let filaProd = {
                created_at: ele.created_at ,
                iva: ele.iva ,
                totaliva: ele.total_iva,
                precio_png: ele.precio_png ,
                precio_pp: Number(ele.precio_pp) ,
                precio_pu: ele.precio_pu ,
                presupuestacion_id: ele.presupuestacion_id ,
                presupuestacion_plan_id: ele.presupuestacion_plan_id ,
                presupuestacion_producto_id: ele.presupuestacion_producto_id ,
                presupuestacion_productos_proveedores_id: ele.presupuestacion_productos_proveedores_id ,
                presupuestacion_rubro_id: ele.presupuestacion_rubro_id ,
                presupuestacion_rubro_nombre: ele.presupuestacion_rubro_nombre ,
                producto_cantidad_a_comprar: ele.producto_cantidad_a_comprar ,
                producto_id: ele.producto_id ,
                producto_nombre: ele.producto_nombre ,
                proveedor_id: ele.proveedor_id ,
                proveedor_mail: ele.proveedor_mail ,
                proveedor_nombre: ele.proveedor_nombre ,
                updated_at: ele.updated_at ,
                productoSeleccionado: false,
                factor: ele.factor,
                cantidad_proveedor: ele.cantidad_proveedor
              }

              auxProd.push(filaProd)
            })

            fila.productos = auxProd
            fila.productosDB = elemento.productosDB
            
            this.datosAPI.push(fila)
            
          })
          
          this.mostrarTabla = true

          // this.datosAPI = response.data;

          this.longitudProveedores = this.datosAPI.length

          let productosConPP0 = []

          // formo un array con cada uno de los productos que tienen precio pp igual a 0
          this.datosAPI.forEach((elemento) => {
            elemento.productos.forEach((ele) => {
              if (ele.precio_pp == 0) {
                productosConPP0.push(ele)
              }
            })
          })

          this.datosAPI.forEach((elemento) => {
            let fila1 = {}
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            // this.arrayPrecioPPProveedores.push(fila1)

            let fila2 = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_nombre: elemento.proveedor_nombre ,
              proveedor_rubro_id: elemento.proveedor_rubro_id ,
              titulo: "Total homogeneo",
              booleanTotalHomogeneo: 1,
              menorHomogeneo: 0,
              totalHomogeneo: 0,
            }


            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_nombre: elemento.proveedor_nombre ,
              proveedor_rubro_id: elemento.proveedor_rubro_id ,
              titulo: "Total x prov.",
              booleanTotalHomogeneo: 0,
              totalPP: 0 ,
            }

            this.arrayPrecioPPProveedores.push(fila2)
            this.arrayPrecioPPProveedores.push(fila)

          })
        });

      this.crearArraySoloProductos();
      this.calcularCompraSegmentada();
      this.getDatosProveedores(datosBorrador);
      this.calcularTotalHomogeneo();
    },

    crearArraySoloProductos() {
      this.datosAPI[0].productos.forEach((elemento) => {

        let fila = {
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
          producto_rubro_id: elemento.presupuestacion_rubro_id,
          producto_rubro: elemento.presupuestacion_rubro_nombre,
          cantidad_a_comprar: elemento.producto_cantidad_a_comprar,
        };

        this.datosAPI[0].productosDB.forEach((ele) => {
          if (ele.producto_id == fila.producto_id) {
            fila.producto_unidad = ele.producto_unidad
          }
        })

        this.arraySoloProductos.push(fila);
      });

      this.crearArrayTodosProductos();

    },

    crearArrayTodosProductos(){
      this.datosAPI.forEach((elemento) => {
        this.arrayTodosProductos.push(elemento.productos)
      })

      this.arrayTodosProductos.forEach((elemento) => {
        elemento.forEach((ele) => {
          this.arrayProductos.push(ele)
        })
      })
      
      this.marcarMenor()
    },

    marcarMenor(){
      let yaExisteElemento;

      this.arraySoloProductos.forEach((elemento) => {
        yaExisteElemento = this.arrayProductos.filter(
          (x) => x.producto_id == elemento.producto_id
        );
        let min;
        yaExisteElemento.forEach((elemento) => {
          if (elemento.precio_pp > 0) {
            min = elemento.precio_pp
          }
        })
        let producto;

        yaExisteElemento.forEach((ele) => {
          if (ele.precio_pp <= min && ele.precio_pp > 0) {
            min = ele.precio_pp
            producto = ele
          }
        })

        this.datosAPI.forEach((elemento) => {
          elemento.productos.forEach((ele1) => {
            if (ele1.producto_id == producto.producto_id && ele1.proveedor_id == producto.proveedor_id ) {
              ele1.productoSeleccionado = true
            } 

            if (ele1.producto_id == producto.producto_id && ele1.proveedor_id != producto.proveedor_id ) {
            ele1.productoSeleccionado = false
          }
          })
        })
      })
    },

    moverscroll(cantidad){
      const element = document.getElementById("midiv");
      this.valorScroll = this.valorScroll + cantidad
      element.scrollLeft = this.valorScroll;
    },


    cambiarCantidad(props){
      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (props.row.producto_id == ele.producto_id) {
            ele.cantidad_proveedor = props.row.cantidad_a_comprar * ele.factor
            let precio = ele.cantidad_proveedor * ele.precio_pu
            let precioAux = parseFloat(precio)
            ele.precio_pp = precioAux.toFixed(2)

            // se agrega para que se modifique la cantidad a comprar del producto
            ele.producto_cantidad_a_comprar = props.row.cantidad_a_comprar
          }
        })     
      })

      this.actualizarPrecioTotal()
      this.marcarMenor()
      this.calcularPrecioPPProveedores()
      this.calcularTotalHomogeneo()
      this.calcularMenorMontoTotal()
    },

    actualizarPrecioTotal(){
      this.datosAPI.forEach((elemento) => {
        let ppParcial = 0
        let proveedor_id = null
        elemento.productos.forEach((ele) => {
          let precioPPParcial = Number(ele.precio_pp)
          let cantidad = Number(ele.cantidad_proveedor)
          let numero = precioPPParcial
          ppParcial = ppParcial + numero
          proveedor_id = ele
        })

        this.arrayInfoProveedores.forEach((elemento1) => {
          if (elemento1.proveedor_id == elemento.proveedor_id) {
            let parcial = 0
            // parcial = ppParcial + Number(elemento1.proveedor_monto_descuentos_bonificaciones) + Number(elemento1.proveedor_monto_factura_A) + Number(elemento1.proveedor_monto_flete )+ Number(elemento1.proveedor_monto_descuentos_bonificaciones)

            parcial = ppParcial + Number(elemento1.proveedor_monto_descuentos_bonificaciones) + Number(elemento1.proveedor_monto_factura_A) + Number(elemento1.proveedor_monto_flete)

            elemento1.proveedor_monto_total_homogeneo = Number(parcial).toFixed(2)

            // elemento1.proveedor_monto_total_homogeneo = Number(parcial).toFixed(2)
          }
        })
        
      })
      this.calcularMenorMontoTotal()
      this.calcularTotalHomogeneo()      
    },


    calcularMenorMontoTotal(){
      // primero limpio el campo y asigno un menor
      // let min = 0
      let menorAux = 0
      let arrayValores = []
    

      this.arrayInfoProveedores.forEach((elemento1) => {        
        menorAux = parseFloat(elemento1.proveedor_monto_total_homogeneo)
        arrayValores.push(menorAux)        
      })

      let min = Math.min(...arrayValores);

      let menorTotal = 0
      this.arrayInfoProveedores.forEach((elemento) => {
        menorTotal = parseFloat(elemento.proveedor_monto_total_homogeneo)
        // elemento.menor_monto_total = 0
        if (menorTotal <= min && menorTotal > 0) {
          min = menorTotal
          elemento.menor_monto_total = 1 
        } else {
          elemento.menor_monto_total = 0 
        }
      })    
      
    },

    cambiarCantidadFactor(item, scope){
      // cambio la cantidad proveedor
      let cantidad_proveedor_aux = scope.row.cantidad_a_comprar * item.factor
      item.cantidad_proveedor = cantidad_proveedor_aux.toFixed(2)

      // cambio el precio pp
      let precio_pp_aux = item.cantidad_proveedor * Number(item.precio_pu)
      
      item.precio_pp = precio_pp_aux.toFixed(2)

      this.actualizarPrecioTotal()
      this.marcarMenor()
      this.calcularTotalHomogeneo()
      this.calcularMenorMontoTotal()
    },

    cambiarPNG(item, scope){
      // cambio el pu
      let precio_pu_aux = item.precio_png + ((Number(item.iva) * 0.01) * item.precio_png)
      item.precio_pu = Number(precio_pu_aux).toFixed(2)

      // cambio el precio pp a partir del resultado de precio_pu
      let precio_pp_aux = Number(item.cantidad_proveedor) * item.precio_pu
      item.precio_pp = Number(precio_pp_aux).toFixed(2)

      this.actualizarPrecioTotal()
      this.marcarMenor()
      this.calcularTotalHomogeneo()
      this.calcularMenorMontoTotal()

      // se agrega, sacar si hay algun cambio que no funcione
      this.calcularPrecioPPProveedores()
    },

    agregar(scope, item, precio, index) {
    },

    mostrarLabel(prov) {
      return prov;
    },

    

    sortChange(sortProps){
      this.headerClick(sortProps.column,event) //optional: trigger header-click event
    },

    headerClick(param){
      let estadoProveedor = false
      let estadoOtrosProveedores = false
      let indexSeleccionado
      this.datosAPI.forEach((elemento, index) => {
        
        if (param.label == elemento.proveedor_nombre) {
          indexSeleccionado = index
          // pregunto si el proveedor tiene estado de seleccionado o no
          if (elemento.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = false
            estadoProveedor = false
          } else {
            elemento.proveedorSeleccionado = true
            estadoProveedor = true
          }

          // a cada uno de sus productos los pongo en el mismo estado del proveedor
          elemento.productos.forEach((ele) => {
            if (ele.productoSeleccionado == false) {
              ele.productoSeleccionado = estadoProveedor              
            } else {
              ele.productoSeleccionado = estadoProveedor    
            }
          })
        } else {
          // pongo a los otros proveedores en falso
          elemento.proveedorSeleccionado = false

          // pongo a cada uno de los productos del resto de los proveedores en falso
          elemento.productos.forEach((ele) => {
            ele.productoSeleccionado = false
          })

        }
      })
    },

    

    cambiarProveedorSeleccionado(item){
      let estadoProveedor = false
      let estadoOtrosProveedores = false
      let indexSeleccionado

      this.datosAPI.forEach((elemento, index) => {
        if (item.proveedor_id == elemento.proveedor_id) {
          if (item.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = true

            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = true
            })
          } else {
            elemento.proveedorSeleccionado = false

            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = false
            })
          }
        } else {
          if (item.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = false
            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = false
            })
          }
        }
      })

      this.calcularCompraSegmentada()
    },

    calcularCompraSegmentada(){
      this.totalHomogeneo = 0

      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            this.totalHomogeneo = this.totalHomogeneo + Number(ele.precio_pp)
          }
        })
      })

      this.arrayTotal = []

      let fila = {
        aux: null,
        totalHomogeneo: Number(this.totalHomogeneo).toFixed(2),
        aux2: null
      }

      this.arrayTotal.push(fila)

      this.calcularPrecioPPProveedores()
    },

    calcularPrecioPPProveedores(){
      let arrayProductosTotalPP0 = []
      let precioPPParcial = 0
      let b = 0
      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            let precioPPParcialAux = parseFloat(precioPPParcial)

            precioPPParcial = precioPPParcialAux + ele.precio_pp
          }

          // busco los productos que tiene pp 0 para no sumarlos
          // b = 0
          // if (ele.precio_pp == 0) {
          //   arrayProductosTotalPP0.forEach((ele0) => {
          //     if (ele.producto_id == ele0.producto_id) {
          //       b = 1
          //     }
          //   })

          //   if (b == 0) {
          //     arrayProductosTotalPP0.push(ele)
          //   }
          // }
        })

        

        this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
          if (elementoArrayProv.proveedor_id == elemento.proveedor_id && elementoArrayProv.booleanTotalHomogeneo == 0) {
            let precioPPParcialAux = parseFloat(precioPPParcial)
            elementoArrayProv.totalPP = precioPPParcialAux.toFixed(2)
            // elementoArrayProv.totalPP = parseFloat(elementoArrayProv.totalPP) +  precioPPParcialAux.toFixed(2)
          }
        })

        precioPPParcial = 0
      })

      // console.log("arrayProductosTotalPP0");
      // console.log(arrayProductosTotalPP0);

      // this.datosAPI.forEach((elemento) => {
      //   this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
      //     if (elementoArrayProv.proveedor_id == elemento.proveedor_id && elementoArrayProv.booleanTotalHomogeneo == 1) {
      //       elemento.productos.forEach((eleProductos) => {
      //         arrayProductosTotalPP0.forEach((eleProductos0) => {
      //           if (eleProductos.producto_id != eleProductos0.producto_id) {
      //             elementoArrayProv.totalHomogeneo = elementoArrayProv.totalHomogeneo + parseFloat(eleProductos.precio_pp) 
      //           }
      //         })
      //       })
      //     }
      //   })
      // })

    },

    obtenerProductosTotalHomogeneo() {
      // metodo que busca los productos que estan presupuestados por todos los proveedores para sacar el total homégeneo
      let products = [];

      this.datosAPI.forEach((element) => {
        products.push(element.productos);
      })

      const nuevoArray = [];

      // Obtener la longitud del primer array interno para determinar la cantidad de elementos
      const longitudElementos = products[0].length;

      // Iterar sobre la longitud de elementos
      for (let i = 0; i < longitudElementos; i++) {
        // Crear un nuevo array interno con los elementos en la posición i de cada array interno
        const nuevoElemento = products.map((subArray) => subArray[i]);
        
        // Agregar el nuevo elemento al nuevo array resultante
        nuevoArray.push(nuevoElemento);
      }


      let arrayProductosNoPresupuestados = []; // array donde voy a guardar los elementos que no sean presupuestados por todos los proveedores

      nuevoArray.forEach((element) => {
        const allElements = element.filter(item => item.precio_pp === 0);

        if (allElements.length !== 0) {
          let row = {
            producto_id: allElements[0].producto_id,
            producto_nombre: allElements[0].producto_nombre
          }

          arrayProductosNoPresupuestados.push(row);
        } 
      })

      return arrayProductosNoPresupuestados;
    },

    calcularTotalHomogeneo(){
      let arrayProductosTotalPP0 = [], arrayProductosTotalNoPP0 = [];
      let precioPPParcial = 0
      let b = 0, c= 0;
 

      const productosNoPresupuestados = this.obtenerProductosTotalHomogeneo();

      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          // if (ele.productoSeleccionado == true) {
          //   console.log("////////");
          //   console.log("ele.precio_pp");
          //   console.log(ele.precio_pp);
          //   console.log("precioPPParcial");
          //   console.log(precioPPParcial);
          //   let precioPPParcialAux = parseFloat(precioPPParcial)

          //   precioPPParcial = precioPPParcialAux + ele.precio_pp
          // }

          // busco los productos que tiene pp 0 para no sumarlos
          b = 0
          ele.yaSumado = 0;
          if (ele.precio_pp == 0) {
            arrayProductosTotalPP0.forEach((ele0) => {
              if (ele.producto_id == ele0.producto_id) {
                b = 1
              }
            })

            if (b == 0) {
              arrayProductosTotalPP0.push(ele)
            }
          }

          c = 0
          if (ele.precio_pp > 0) {
            arrayProductosTotalNoPP0.forEach((ele0) => {
              if (ele.producto_id == ele0.producto_id) {
                c = 1
              }
            })

            if (c == 0) {
              arrayProductosTotalNoPP0.push(ele)
            }
          }
        })
        precioPPParcial = 0
      })

      // limpio el campo totalHomogeneo
      this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
        if (elementoArrayProv.totalHomogeneo) {
          elementoArrayProv.totalHomogeneo = 0
        }
      })

      this.datosAPI.forEach((elemento) => {
        this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
          if (elementoArrayProv.proveedor_id == elemento.proveedor_id && elementoArrayProv.booleanTotalHomogeneo == 1) {
            elemento.productos.forEach((eleProductos) => {
              if (productosNoPresupuestados.length === 0) {
                elementoArrayProv.totalHomogeneo = elementoArrayProv.totalHomogeneo + parseFloat(eleProductos.precio_pp);
                eleProductos.yaSumado = 1; 
              } else {
                arrayProductosTotalPP0.forEach((eleProductos0) => {
                if (eleProductos.producto_id != eleProductos0.producto_id &&
                    productosNoPresupuestados.filter(item => item.producto_id === eleProductos.producto_id).length === 0 &&
                    eleProductos.yaSumado === 0
                ) {
                  elementoArrayProv.totalHomogeneo = elementoArrayProv.totalHomogeneo + parseFloat(eleProductos.precio_pp);
                  eleProductos.yaSumado = 1; 
                }
              })
              }
            })
          }
        })
      })

      let min = 0;

      this.arrayPrecioPPProveedores.forEach((elemento) => {
          
        if (elemento.totalHomogeneo) {
          if (elemento.totalHomogeneo > 0) {
            min = elemento.totalHomogeneo
          }
        }
      })

      let proveedor_id = null;

      this.arrayPrecioPPProveedores.forEach((ele) => {
        if (ele.totalHomogeneo) {
          if (ele.totalHomogeneo <= min && ele.totalHomogeneo > 0) {
            min = ele.totalHomogeneo
            proveedor_id = ele.proveedor_id
            ele.menorHomogeneo = 1
          } else {
            ele.menorHomogeneo = 0
          }
        }
      })

      this.arrayPrecioPPProveedores.forEach((ele) => {
        if (ele.totalHomogeneo) {
          if (ele.proveedor_id != proveedor_id) {
            ele.menorHomogeneo = 0
          }
        }
      })
    },

    // traigo los datos de cada uno de los proveedores para mostrar la informacion de la factura, la forma de pago, etc
    async getDatosProveedores(datosBorrador){
      let params = {
        id: this.id,
        datosBorrador: datosBorrador,
      }

      await this.axios
        .post("/api/presupuestacionproductosproveedor/obtenerTodosProveedores", params )
        .then((response) => {
          const respuestaApi = response;
          if (respuestaApi != null) {
            this.infoProveedores = respuestaApi.data
          }
      })

      await this.axios
        .get("/api/condicionpago/obtenerTodos")
        .then((response) => {
          const respuestaApiCondicionPago = response.data;
          this.condicionesPago = respuestaApiCondicionPago
        })

      this.infoProveedores.forEach((elemento) => {
        let fila = {
          created_at: elemento.created_at,
          presupuestacion_id: elemento.presupuestacion_id,
          presupuestacion_plan_id: elemento.presupuestacion_plan_id,
          presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id,
          proveedor_factura_A: elemento.proveedor_factura_A,
          proveedor_forma_de_pago: elemento.proveedor_forma_de_pago,
          proveedor_id: elemento.proveedor_id,
          proveedor_mail: elemento.proveedor_mail,
          proveedor_monto_descuentos_bonificaciones: elemento.proveedor_monto_descuentos_bonificaciones,
          proveedor_monto_factura_A: elemento.proveedor_monto_factura_A,
          proveedor_monto_flete: elemento.proveedor_monto_flete,
          proveedor_monto_totalPP: elemento.proveedor_monto_totalPP,
          proveedor_monto_total_homogeneo: elemento.proveedor_monto_total_homogeneo,
          menor_monto_total: 0,
          proveedor_nombre: elemento.proveedor_nombre,
          proveedor_rubro_id: elemento.proveedor_rubro_id,
          proveedor_notas: null,
          updated_at: elemento.updated_at,
        }

        this.condicionesPago.forEach((ele) => {
          if (fila.proveedor_forma_de_pago == ele.condicionpago_id) {
            fila.proveedor_forma_de_pago_nombre = ele.condicionpago_nombre
          }
        })

        this.arrayInfoProveedores.push(fila)
      })
      this.calcularMenorMontoTotal()

      this.loadingTabla = false;
    },


    cellClick(param){
      console.log("param celdas");
      // console.log(param);

    },

    getSummaries(param) {
      const  tabla = this.$refs.tablaComparativa
      const { columns, data } = param;
      const sums = [];
      let ind = 7

      this.datosAPI.forEach((elemento, index) => {
        if (index == 0) {
          sums[index] = 'Total'          
        }
        sums[ind] = 0
        elemento.productos.forEach((ele) => {
          sums[ind] = sums[ind] + ele.precio_pp
        })

        sums[ind] = sums[ind].toFixed(2)

        ind=ind+6
      })

      return sums;
    },

    cambiarSeleccionProductoSegmentado(scope, producto){
      let index = scope.$index
      let cellIndex = scope.cellIndex

      // producto.
      this.datosAPI.forEach((elemento, index) => {
        elemento.productos.forEach((ele, ind) => {
          // ele.productoSeleccionado = false
          if (ele.producto_id == producto.producto_id && ele.proveedor_id == producto.proveedor_id) {
            ele.productoSeleccionado = true
          } 

          if (ele.producto_id == producto.producto_id && ele.proveedor_id != producto.proveedor_id) {
            ele.productoSeleccionado = false
          }
        })
      })

      this.calcularCompraSegmentada()
      // this.marcarMenor()
      
    },

    guardarNotas(elemento, arrayCantidadesDeposito){
      this.arrayInfoProveedores.forEach((elementoProv) => {
        if (elementoProv.proveedor_id == elemento.item.proveedor_id) {
          elementoProv.proveedor_notas = elemento.notas
        }
      })    
    },

    async guardarBorrador(){
      this.loadingBtnGuardarBorrador = true
      // recorro los array para cambiar los datos que faltan a datosAPI
      this.datosAPI.forEach((elemento) => {
        this.arrayInfoProveedores.forEach((ele) => {
          if (elemento.proveedor_id == ele.proveedor_id) {
            elemento.proveedor_forma_de_pago = ele.proveedor_forma_de_pago
            elemento.proveedor_monto_factura_A = parseFloat(ele.proveedor_monto_factura_A)
            elemento.proveedor_monto_flete = parseFloat(ele.proveedor_monto_flete)
            elemento.proveedor_monto_descuentos_bonificaciones = parseFloat(ele.proveedor_monto_descuentos_bonificaciones)
            elemento.proveedor_monto_total_homogeneo = parseFloat(ele.proveedor_monto_total_homogeneo)
          }
        })
      })

      let params = {
        presupuestacion_id: this.id, 
        arrayDatosBorrador: JSON.stringify(this.datosAPI)
      }

      await this.axios.post("/api/presupuestacionproductosproveedor/crearBorrador", params)
        .then(response =>{
          ElMessage({
            type: 'success',
            message: response.data.message,
          })
          this.cerrar();
          this.loadingBtnGuardarBorrador = false

        })
    },

    async guardarBorradorOrdeCompraDirecto(){
      this.loadingBtnGenerarOrdenesCompra = true
      // recorro los array para cambiar los datos que faltan a datosAPI
      this.datosAPI.forEach((elemento) => {
        this.arrayInfoProveedores.forEach((ele) => {
          if (elemento.proveedor_id == ele.proveedor_id) {
            elemento.proveedor_forma_de_pago = ele.proveedor_forma_de_pago
            elemento.proveedor_monto_factura_A = parseFloat(ele.proveedor_monto_factura_A)
            elemento.proveedor_monto_flete = parseFloat(ele.proveedor_monto_flete)
            elemento.proveedor_monto_descuentos_bonificaciones = parseFloat(ele.proveedor_monto_descuentos_bonificaciones)
            elemento.proveedor_monto_total_homogeneo = parseFloat(ele.proveedor_monto_total_homogeneo)
          }
        })
      })

      let params = {
        presupuestacion_id: this.id, 
        arrayDatosBorrador: JSON.stringify(this.datosAPI)
      }
      await this.axios.post("/api/presupuestacionproductosproveedor/crearBorrador", params)
        .then(response =>{
          this.loadingBtnGenerarOrdenesCompra = false
        })
    },


    generarOrdenesDeCompra(){
      this.guardarBorradorOrdeCompraDirecto();


      this.loadingBtnGenerarOrdenesCompra = true
      this.arrayOrdenCompra = []

      this.datosAPI.forEach((elemento) => {
        let arrayProductosProveedor = []
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            arrayProductosProveedor.push(ele)
          }
        })

        let montoTotalOrdenCompra = 0
        arrayProductosProveedor.forEach((ele1) => {
          montoTotalOrdenCompra = montoTotalOrdenCompra +  parseFloat(ele1.precio_pp)
        })

        if (arrayProductosProveedor.length > 0) {
          let fila = {
            presupuestacion_id: elemento.presupuestacion_id,
            presupuestacion_plan_id: elemento.presupuestacion_plan_id,
            presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id,
            proveedorSeleccionado: elemento.proveedorSeleccionado,
            proveedor_factura_A: elemento.proveedor_factura_A,
            proveedor_forma_de_pago: elemento.proveedor_forma_de_pago,
            proveedor_id: elemento.proveedor_id,
            proveedor_mail: elemento.proveedor_mail,
            proveedor_monto_descuentos_bonificaciones: elemento.proveedor_monto_descuentos_bonificaciones,
            proveedor_monto_flete: elemento.proveedor_monto_flete,
            proveedor_monto_totalPP: elemento.proveedor_monto_totalPP,
            proveedor_monto_total_homogeneo: elemento.proveedor_monto_total_homogeneo,
            proveedor_nombre: elemento.proveedor_nombre,
            proveedor_rubro_id: elemento.proveedor_rubro_id,
            productos: JSON.stringify(arrayProductosProveedor),            montoTotalOrdenCompra: montoTotalOrdenCompra,
          }

          this.arrayOrdenCompra.push(fila)
        }
      })

      this.postOrdenesDeCompra(this.arrayOrdenCompra)
    },


    async postOrdenesDeCompra(arrayOrdenCompra){
      let params = {
        arrayOrdenesCompra: JSON.stringify(arrayOrdenCompra),
        arrayDatosBorrador: JSON.stringify(this.datosAPI),
        presupuestacion_id: this.id, 
      }

      await this.axios.post("/api/ordencompra/crear", params)
        .then(response =>{
          ElMessage({
            type: 'success',
            message: response.data.message,
          })
          this.cerrar();
        })

      this.loadingBtnGenerarOrdenesCompra = false
    },

    // funcion que se va a usar para guardar los borradores de las comparativas, usando solamente el array datosAPI, ya que en ese array se guarda toda la informacion
    mostrarInfo(){
    },

    scroll(scrollLeft, scrollTop){
    },

    scrollLeft(){

    },

    
    // header de las filas del arriba
    headerStylePrincipalTable(row, column, rowIndex, columnIndex){
      // 
      // P1
      // 
      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 0) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 1) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 3) {
        return { background: "#96ceb4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 4) {
        return { background: "#96ceb4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 5) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 6) {
        return { background: "#96ceb4", color: "#000000" }
      }


      // 
      // P2
      // 
      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 12) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 13) {
        return { background: "#adcbe3", color: "#000000" }
      }

      // 
      // P3
      // 
      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 14) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 15) {
        return { background: "#ffeead", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 16) {
        return { background: "#ffeead", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 17) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 18) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 19) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 20) {
        return { background: "#ffeead", color: "#000000" }
      }

      // 
      // P4
      // 
      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 21) {
        return { background: "#ff6f69", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 22) {
        return { background: "#ff6f69", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 23) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 24) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 25) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 26) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 27) {
        return { background: "#ff6f69", color: "#000000" }
      }

      // 
      // P5
      // 
      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#ffcc5c", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 28) {
        return { background: "#ffcc5c", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 29) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 30) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 31) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 32) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 33) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 34) {
        return { background: "#ffcc5c", color: "#000000" }
      }


      // 
      // P6
      // 
      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 35) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 36) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 37) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 38) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 39) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 40) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 41) {
        return { background: "#c8ae8d", color: "#000000" }
      }


      // 
      // P7
      // 
      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 42) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 43) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 44) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 45) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 46) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 47) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 48) {
        return { background: "#a3b899", color: "#000000" }
      }


      // 
      // P8
      // 
      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 49) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 50) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 51) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 52) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 53) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 54) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 55) {
        return { background: "#667b68", color: "#000000" }
      }


      // 
      // P9
      // 
      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 56) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 57) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 58) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 59) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 60) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 61) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 62) {
        return { background: "#ecd8be", color: "#000000" }
      }


      // 
      // P10
      // 
      if (row.rowIndex == 1 && row.columnIndex == 12) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 63) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 64) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 65) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 66) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 67) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 68) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 69) {
        return { background: "#f0f5ee", color: "#000000" }
      }
    },

    headerStyleTotal(row, column, rowIndex, columnIndex){
      // 
      // P1
      // 
      if (row.rowIndex == 1 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 0) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 1) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 3) {
        return { background: "#96ceb4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 4) {
        return { background: "#96ceb4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 5) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 7) {
        return { background: "#96ceb4", color: "#000000" }
      }


      // 
      // P2
      // 
      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 12) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 13) {
        return { background: "#ffeead", color: "#000000" }
      }


      // 
      // P3
      // 
      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 14) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 15) {
        return { background: "#ffeead", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 16) {
        return { background: "#ffeead", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 17) {
        return { background: "#ffeead", color: "#000000" }
      }

      // 
      // P4
      // 
      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 18) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 19) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 20) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 21) {
        return { background: "#ff6f69", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 22) {
        return { background: "#ff6f69", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 23) {
        return { background: "#ff6f69", color: "#000000" }
      }


      // 
      // P5
      // 
      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 24) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 25) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 26) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 27) {
        return { background: "#ffcc5c", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 28) {
        return { background: "#ffcc5c", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 29) {
        return { background: "#ffcc5c", color: "#000000" }
      }


      // 
      // P6
      // 
      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 30) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 31) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 32) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 33) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 34) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 35) {
        return { background: "#c8ae8d", color: "#000000" }
      }


      // 
      // P7
      // 
      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 36) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 37) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 38) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 39) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 40) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 41) {
        return { background: "#a3b899", color: "#000000" }
      }


      // 
      // P8
      // 
      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 42) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 43) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 44) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 45) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 46) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 47) {
        return { background: "#667b68", color: "#000000" }
      }


      // 
      // P9
      // 
      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 48) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 49) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 50) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 51) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 52) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 53) {
        return { background: "#ecd8be", color: "#000000" }
      }


      // 
      // P10
      // 
      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 54) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 55) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 56) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 57) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 58) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 59) {
        return { background: "#f0f5ee", color: "#000000" }
      }

    },

    headerStyle(row, column, rowIndex, columnIndex) {
      
      // 
      // P1
      // 
      if (row.rowIndex == 0 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 0) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 1) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#96ceb4", color: "#000000" }
      }

      // 
      // P2
      // 
      if (row.rowIndex == 0 && row.columnIndex == 3) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }

      // 
      // P3
      // 
      if (row.rowIndex == 0 && row.columnIndex == 4) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 12) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 13) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 14) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 15) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 16) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 17) {
        return { background: "#ffeead", color: "#000000" }
      }

      // 
      // P4
      // 
      if (row.rowIndex == 0 && row.columnIndex == 5) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 18) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 19) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 20) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 21) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 22) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 23) {
        return { background: "#ff6f69", color: "#000000" }
      }

      // 
      // P5
      // 
      if (row.rowIndex == 0 && row.columnIndex == 6) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 24) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 25) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 26) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 27) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 28) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 29) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      
      // 
      // P6
      // 
      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 30) {
        return { background: "#c8ae8d", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 31) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 32) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 33) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 34) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 35) {
        return { background: "#c8ae8d", color: "#000000" }
      }


      // 
      // P7
      // 
      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 36) {
        return { background: "#a3b899", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 37) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 38) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 39) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 40) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 41) {
        return { background: "#a3b899", color: "#000000" }
      }


      // 
      // P8
      // 
      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 42) {
        return { background: "#667b68", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 43) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 44) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 45) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 46) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 47) {
        return { background: "#667b68", color: "#000000" }
      }


      // 
      // P9
      // 
      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 48) {
        return { background: "#ecd8be", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 49) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 50) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 51) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 52) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 53) {
        return { background: "#ecd8be", color: "#000000" }
      }


      // 
      // P10
      // 
      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 54) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 55) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 56) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 57) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 58) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 59) {
        return { background: "#f0f5ee", color: "#000000" }
      }
      

      
    },

    

    headerCellStyle({ row, column, rowIndex, columnIndex }){
      if (column.label == "PP") {
        // console.log("row de cell style");
        // console.log(row);

        // console.log("column de cell style");
        // console.log(column);

        // console.log("rowIndex de cell style");
        // console.log(rowIndex);

        // console.log("columnIndex de cell style");
        // console.log(columnIndex);


        if (columnIndex == 2) {
          return {'background' : 'lightblue'}
        }

        if (columnIndex == 3) {
          return {'background' : 'lightgreen'}
        }
        
      }

      if (column.label == "Proveedores") {
        return {'background' : 'blue'}
      }


    },

    filterTag(value, row) {
      let value1 = value;
      return row
    },

    click(){
      console.log("e");
    },

    yellowBg (row, column, rowIndex, columnIndex) {
      return {
        background: ''
      }
    },

    seleccionar(param){
    },

    colorColumnas(columnas){
      return {
          background: '#eceb3c'
        }

    },


    // filas de datos de arriba
    classChecker({ row, column, rowIndex, columnIndex }) {
      // Proveedor1
      if (columnIndex == 3) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 4) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 5) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
     
      if (columnIndex == 6) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 7) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 8) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      if (columnIndex == 9) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      // P2
      if (columnIndex == 10) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 11) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 12) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 13) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 14) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 15) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 16) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P3
      if (columnIndex == 17) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 18) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 19) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 20) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 21) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 22) {
        return {'background': '#ffeead' , 'color': 'black'}
      }
      
      if (columnIndex == 23) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      // P4
      if (columnIndex == 24) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 25) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 26) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 27) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 28) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 29) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 30) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }


      //P5
      if (columnIndex == 31) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 32) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 33) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 34) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 35) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 36) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 37) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }
      
      //P6
      if (columnIndex == 38) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 41) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }      

      if (columnIndex == 42) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 44) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 45) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 50) {
        return {'background': '#a3b899' , 'color': 'black'}
      }
      
      if (columnIndex == 51) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      //P8
      if (columnIndex == 52) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 56) {
        return {'background': '#667b68' , 'color': 'black'}
      }

       if (columnIndex == 57) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 58) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      // P9
      if (columnIndex == 59) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 62) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 65) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 66) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 68) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 72) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      // P11
      // if (columnIndex == 73) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 74) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

    },

    // Header de las filas del medio
    headerStyleIntermedio(row, column, rowIndex, columnIndex) {
      // P1
      if (row.rowIndex == 0 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 0) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 1) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 2) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#96ceb4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#96ceb4", color: "#000000" }
      }


      // P2
      if (row.rowIndex == 0 && row.columnIndex == 3) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 12) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 13) {
        return { background: "#adcbe3", color: "#000000" }
      }


      // P3
      if (row.rowIndex == 0 && row.columnIndex == 4) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 14) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 15) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 16) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 17) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 18) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 19) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 20) {
        return { background: "#ffeead", color: "#000000" }
      }


      // P4
      if (row.rowIndex == 0 && row.columnIndex == 5) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 21) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 22) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 23) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 24) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 25) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 26) {
        return { background: "#ff6f69", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 27) {
        return { background: "#ff6f69", color: "#000000" }
      }


      // P5
      if (row.rowIndex == 0 && row.columnIndex == 6) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 28) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 29) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 30) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 31) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 32) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 33) {
        return { background: "#ffcc5c", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 34) {
        return { background: "#ffcc5c", color: "#000000" }
      }



      // P6
      if (row.rowIndex == 0 && row.columnIndex == 7) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 35) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 36) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 37) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 38) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 39) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 40) {
        return { background: "#c8ae8d", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 41) {
        return { background: "#c8ae8d", color: "#000000" }
      }


      // P7
      if (row.rowIndex == 0 && row.columnIndex == 8) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 42) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 43) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 44) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 45) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 46) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 47) {
        return { background: "#a3b899", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 48) {
        return { background: "#a3b899", color: "#000000" }
      }


      // P8
      if (row.rowIndex == 0 && row.columnIndex == 9) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 49) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 50) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 51) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 52) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 53) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 54) {
        return { background: "#667b68", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 55) {
        return { background: "#667b68", color: "#000000" }
      }


      // P9
      if (row.rowIndex == 0 && row.columnIndex == 10) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 56) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 57) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 58) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 59) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 60) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 61) {
        return { background: "#ecd8be", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 62) {
        return { background: "#ecd8be", color: "#000000" }
      }


      // P10
      if (row.rowIndex == 0 && row.columnIndex == 11) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 63) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 64) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 65) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 66) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 67) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 68) {
        return { background: "#f0f5ee", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 69) {
        return { background: "#f0f5ee", color: "#000000" }
      }
    },


    // filas de datos del medio
    classCheckerIntermedio({ row, column, rowIndex, columnIndex }){
      // Proveedor1
      if (columnIndex == 2) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 3) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 4) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
     
      if (columnIndex == 5) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 6) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 7) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 8) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      // P2
      if (columnIndex == 9) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 10) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 11) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 12) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 13) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 14) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 15) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P3
      if (columnIndex == 16) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 17) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 18) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 19) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 20) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 21) {
        return {'background': '#ffeead' , 'color': 'black'}
      }
      
      if (columnIndex == 22) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      // P4
      if (columnIndex == 23) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 24) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 25) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }
      
      if (columnIndex == 26) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 27) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 28) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 29) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }


      //P5
      if (columnIndex == 30) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 31) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }
      
      if (columnIndex == 32) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 33) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 34) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 35) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 36) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      //P6
      if (columnIndex == 37) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 38) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }      

      if (columnIndex == 41) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 42) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 44) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#a3b899' , 'color': 'black'}
      }
      
      if (columnIndex == 50) {
        return {'background': '#a3b899' , 'color': 'black'}
      }
      
      // P8
      if (columnIndex == 51) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 52) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 56) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      //P9
      if (columnIndex == 58) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 62) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 65) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 66) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }
      
      if (columnIndex == 68) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      // P11
      // if (columnIndex == 72) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 73) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 74) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 75) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 76) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 77) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // if (columnIndex == 78) {
      //   return {'background': '#e7eff6' , 'color': 'black'}
      // }

      // P12 ff6f69
      // if (columnIndex == 79) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 80) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 81) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 82) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 83) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 84) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }

      // if (columnIndex == 85) {
      //   return {'background': '#ff6f69' , 'color': 'black'}
      // }
    },


    // fila de datos de la fila de abajo, no tiene header
    classCheckerTotal({ row, column, rowIndex, columnIndex }) {
      // Proveedor1
      if (columnIndex == 2) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 3) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 4) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
     
      if (columnIndex == 5) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 6) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }
      
      if (columnIndex == 7) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      if (columnIndex == 8) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      if (columnIndex == 9) {
        return {'background': '#96ceb4' , 'color': 'black'}
      }

      // P2
      if (columnIndex == 10) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 11) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 12) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 13) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 14) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 15) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 16) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 17) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P3
      if (columnIndex == 18) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 19) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 20) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 21) {
        return {'background': '#ffeead' , 'color': 'black'}
      }
      
      if (columnIndex == 22) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 23) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 24) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      if (columnIndex == 25) {
        return {'background': '#ffeead' , 'color': 'black'}
      }

      // P4
      if (columnIndex == 26) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 27) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 28) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 29) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 30) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 31) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 32) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 33) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }


      //P5
      if (columnIndex == 34) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 35) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 36) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 37) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }
      
      if (columnIndex == 38) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 41) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }
      
      //P6

      if (columnIndex == 42) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 44) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#c8ae8d' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 50) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 51) {
        return {'background': '#a3b899' , 'color': 'black'}
      }      

      if (columnIndex == 52) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 56) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#a3b899' , 'color': 'black'}
      }

      // P8
      if (columnIndex == 58) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 62) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      if (columnIndex == 65) {
        return {'background': '#667b68' , 'color': 'black'}
      }

      //P9
      if (columnIndex == 66) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 68) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 72) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      if (columnIndex == 73) {
        return {'background': '#ecd8be' , 'color': 'black'}
      }

      // P10

      if (columnIndex == 74) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 75) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 76) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 77) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 78) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 79) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 80) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }

      if (columnIndex == 81) {
        return {'background': '#f0f5ee' , 'color': 'black'}
      }
      
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

  .el-table .blueClass {
    background: #0090ff !important;
  }
  .redClass {
    color: red;
  }

  .my-header {
    background: blue !important; 
  }

  .scrollbar-flex-content {
    display: flex;
    height: 900px;
  }

  /* .contenedorTablas {
    width: 100vh;
    height: 100vh;
    
    overflow-x: auto;
    white-space: nowrap;
    display:  inline-block;

  } */

  /* .el-table {

  } */
</style>
