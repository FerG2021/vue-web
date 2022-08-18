<template>
  <div>
    <modal
      ref="modal"
      titulo="Comparativa de productos"
      :impedir-close="impedirClose"
      width="99%"
    >
      <div v-loading="loadingTabla" >
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

            <div 
              style="overflow: auto;" 
              id="midiv"
            >
              <div 
                id="tablaprueba" 
                style="height: 100%; width: 5000px;"
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
                          {{parseFloat(item.productos[scope.$index].totaliva)}}
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
                          {{parseFloat(item.productos[scope.$index].precio_pu)}}
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
                            :label="parseFloat(item.productos[scope.$index].precio_pp)" 
                            text-color="#ffff"
                            @change="cambiarSeleccionProductoSegmentado(scope, item.productos[scope.$index])"
                            style="color: black"
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
                >
                  <el-table-column width="200px"></el-table-column>
                  <el-table-column width="100px"></el-table-column>
                  <el-table-column v-for="(item, index) in arrayInfoProveedores" :key="index" align="center">
                    <!-- <template #default="scope"> -->
                    <!-- <el-table-column width="100px" label="F.P." align="center">
                      {{item.proveedor_forma_de_pago_nombre}}
                    </el-table-column> -->

                    <el-table-column width="190px" label="F.P." align="center">
                      <!-- {{item.proveedor_forma_de_pago_nombre}} -->
                      <el-select v-model="item.proveedor_forma_de_pago_nombre" class="m-2" placeholder="Select" size="large">
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
                            >
                              <!-- <span class="material-icons">visibility</span> -->
                              i
                            </el-button>
                          </template>
                        </el-input>
                      <!-- </el-tooltip> -->
                      <!-- {{item.proveedor_forma_de_pago_nombre}} -->
                    </el-table-column>


                    <el-table-column width="100px" label="Fact. A" align="center">
                      <span v-if="item.proveedor_factura_A == 0">
                        No
                      </span>

                      <span v-if="item.proveedor_factura_A == 1">
                        Si
                      </span>
                      <!-- {{item.proveedor_factura_A}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="$ Fact. A" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_factura_A"
                        @change="actualizarPrecioTotal()"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_factura_A}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="Flete" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_flete"
                        @change="actualizarPrecioTotal()"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_flete}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="DyB" align="center">
                      <el-input-number
                        :controls="false"
                        style="width: 100%"
                        v-model="item.proveedor_monto_descuentos_bonificaciones"
                        @change="actualizarPrecioTotal()"
                      ></el-input-number>
                      <!-- {{item.proveedor_monto_descuentos_bonificaciones}} -->
                    </el-table-column>
                    <el-table-column width="100px" label="Total" align="center">
                      <!-- {{item.proveedor_monto_totalPP}} -->
                      {{item.proveedor_monto_total_homogeneo}}
                    </el-table-column>
                    <!-- </template> -->
                  </el-table-column>
                </el-table>
            
                <!-- muestro el total -->
                <el-table 
                  :data="arrayTotal"
                  style="margin-top: 15px"
                  :cell-style="classCheckerTotal"
                  :header-cell-style="headerStyleTotal"
                  stripe
                >
                  <!-- <el-table-column label=""></el-table-column> -->
                  <el-table-column label="Compra seg." align="center" width="200px">
                    <template #default="props">
                      {{props.row.totalHomogeneo}}
                    </template>
                  </el-table-column>
                  <el-table-column label="" width="100px"></el-table-column>
                  
                  <el-table-column v-for="(item, index) in arrayPrecioPPProveedores" :key="index" :label="item.titulo" align="center" width="99px">
                    <!-- <template #default="scope"> -->
                      {{item.totalPP}}
                    <!-- </template> -->
                  </el-table-column>

                </el-table>
              </div>
            </div>
          </div>
        </el-scrollbar>

        <!-- {{arrayPrecioPPProveedores}} -->
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
    <!-- @update:guardarNotas="gurdarNotas($event, notas, item)" -->


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

      arrayOpcionesEntregaFacturaA: [
        {
          label: 'Si',
          value: 1,
        },
        {
          label: 'No',
          value: 0,
        },
      ]
    };
  },

  methods: {
    abrir(id) {
      this.id = null;
      this.id = id;
      console.log("id que mando");
      console.log(this.id);

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
      


      this.$refs.modal.abrir();


      let t1 = document.querySelector('#tabla1');
      console.log("t1");
      console.log(t1);

      // let t2 = document.querySelector('#tabla2');

      // t1.addEventListener('scroll', () => {
      //   t2.scrollLeft = box1.scrollLeft;
      // });

      // limpio los campos
      this.getCondicionesPago()
      this.getDatos();
      
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
          
          console.log("this.arrayCondicionesPago");
          console.log(this.arrayCondicionesPago);

          this.arrayCondicionesPago.forEach((elemento) => {
            let fila = {
              key: elemento.condicionpago_id,
              label: elemento.condicionpago_nombre,
              value: elemento.condicionpago_id
            }

            this.arrayFormaPago.push(fila)
          })

          console.log("this.arrayFormaPago");
          console.log(this.arrayFormaPago);


        })
    },

    async getDatos() {
      await this.axios
        .get("/api/presupuestacionproductosproveedor/obtenerTodos/" + this.id)
        .then((response) => {

          this.arrAux = response.data;
          console.log("this.arrAux");
          console.log(this.arrAux);


          this.arrAux.forEach((elemento) => {
            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id ,
              // productos: elemento.productos , 
              proveedor_factura_A: elemento.proveedor_factura_A ,
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
            
            this.datosAPI.push(fila)
            
          })
          
          this.mostrarTabla = true

          // this.datosAPI = response.data;
          console.log("this.datosAPI");
          console.log(this.datosAPI);

          this.longitudProveedores = this.datosAPI.length
          console.log("this.longitudProveedores");
          console.log(this.longitudProveedores);

          this.datosAPI.forEach((elemento) => {
            let fila1 = {}
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)





            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_nombre: elemento.proveedor_nombre ,
              proveedor_rubro_id: elemento.proveedor_rubro_id ,
              titulo: "Total x prov.",
              totalPP: 0 ,
            }

            this.arrayPrecioPPProveedores.push(fila)
          })


          console.log("this.arrayPrecioPPProveedores");
          console.log(this.arrayPrecioPPProveedores);

          
        });

      this.crearArraySoloProductos();
      this.calcularTotalHomogeneo();
      this.getDatosProveedores();
    },

    crearArraySoloProductos() {
      this.datosAPI[0].productos.forEach((elemento) => {
        // console.log(elemento);

        let fila = {
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
          producto_rubro_id: elemento.presupuestacion_rubro_id,
          producto_rubro: elemento.presupuestacion_rubro_nombre,
          cantidad_a_comprar: elemento.producto_cantidad_a_comprar,
        };

        this.arraySoloProductos.push(fila);
      });

      // let fila1 = {}
      // this.arraySoloProductos.push(fila1)

      // console.log("this.arraySoloProductos");
      // console.log(this.arraySoloProductos);

      

      this.crearArrayTodosProductos();

    },

    crearArrayTodosProductos(){
      this.datosAPI.forEach((elemento) => {
        // console.log("elemento todos los productos");
        // console.log(elemento.productos);
        this.arrayTodosProductos.push(elemento.productos)
      })

      console.log("this.arraySoloProductos");
      console.log(this.arraySoloProductos);

      console.log("this.arrayTodosProductos");
      console.log(this.arrayTodosProductos);


      this.arrayTodosProductos.forEach((elemento) => {
        // console.log("elemento array");
        // console.log(elemento);
        elemento.forEach((ele) => {
          // console.log("ele array");
          // console.log(ele);
          this.arrayProductos.push(ele)
        })
      })

      console.log("this.arrayProductos");
      console.log(this.arrayProductos);

      
      this.marcarMenor()
    },

    marcarMenor(){
      let yaExisteElemento;

      this.arraySoloProductos.forEach((elemento) => {
        yaExisteElemento = this.arrayProductos.filter(
          (x) => x.producto_id == elemento.producto_id
        );
        // console.log("yaExisteElemento");
        // console.log(yaExisteElemento);

        let min = yaExisteElemento[0].precio_pp
        let producto;

        // console.log("min");
        // console.log(min);

        
        yaExisteElemento.forEach((ele) => {
          // console.log("ele");
          // console.log(ele);

          if (ele.precio_pp <= min) {
            min = ele.precio_pp
            producto = ele
          }
        })

        console.log("min");
        console.log(min);

        // console.log("producto");
        // console.log(producto);

        this.datosAPI.forEach((elemento) => {
          elemento.productos.forEach((ele1) => {
            // console.log("ele para datos API");
            // console.log(ele);
            if (ele1.producto_id == producto.producto_id && ele1.proveedor_id == producto.proveedor_id) {
              ele1.productoSeleccionado = true
            } 

            if (ele1.producto_id == producto.producto_id && ele1.proveedor_id != producto.proveedor_id) {
            ele1.productoSeleccionado = false
          }
          })
        })
      })
    },

    moverscroll(cantidad){
      const element = document.getElementById("midiv");
      console.log("element");
      console.log(element);

      this.valorScroll = this.valorScroll + cantidad

      element.scrollLeft = this.valorScroll;

      console.log("element.scrollLeft"); 
      console.log(element.scrollLeft); 

    },


    cambiarCantidad(props){
      console.log("props");
      console.log(props);

      console.log("this.datosAPI");
      console.log(this.datosAPI);

      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (props.row.producto_id == ele.producto_id) {
            console.log("ele");
            console.log(ele);

            ele.cantidad_proveedor = props.row.cantidad_a_comprar * ele.factor
            let precio = ele.cantidad_proveedor * ele.precio_pu
            let precioAux = parseFloat(precio)
            ele.precio_pp = precioAux.toFixed(2)
          }
        })     
      })

      this.actualizarPrecioTotal()
      this.marcarMenor()
      this.calcularPrecioPPProveedores()
    },

    actualizarPrecioTotal(){
      // console.log("props");
      // console.log(props);


      console.log("llamando a precio total");
      console.log("this.datosAPI");
      console.log(this.datosAPI);

      console.log("this.arrayInfoProveedores");
      console.log(this.arrayInfoProveedores);


      this.datosAPI.forEach((elemento) => {
        let ppParcial = 0
        let proveedor_id = null
        elemento.productos.forEach((ele) => {
          let precioPPParcial = Number(ele.precio_pp)
          let cantidad = Number(ele.cantidad_proveedor)
          let numero = precioPPParcial
          console.log("ele.precio_pp");
          console.log(ele.precio_pp);
          console.log("ppParcial antes de sunar");
          console.log(ppParcial);
          ppParcial = ppParcial + numero
          console.log("ppParcial despues de sunar");
          console.log(ppParcial);
          proveedor_id = ele
        })

        console.log("ppParcial");
        console.log(ppParcial);

        console.log("proveedor@@@@@");
        console.log(proveedor_id);
        
        this.arrayInfoProveedores.forEach((elemento1) => {
          if (elemento1.proveedor_id == elemento.proveedor_id) {

            console.log("ppParcial");
            console.log(ppParcial);

            console.log("proveedor_id");
            console.log(proveedor_id);

            console.log("elemento1");
            console.log(elemento1);

            let parcial = 0
            // parcial = ppParcial + Number(elemento1.proveedor_monto_descuentos_bonificaciones) + Number(elemento1.proveedor_monto_factura_A) + Number(elemento1.proveedor_monto_flete )+ Number(elemento1.proveedor_monto_descuentos_bonificaciones)

            parcial = ppParcial + Number(elemento1.proveedor_monto_descuentos_bonificaciones) + Number(elemento1.proveedor_monto_factura_A) + Number(elemento1.proveedor_monto_flete)

            elemento1.proveedor_monto_total_homogeneo = Number(parcial).toFixed(2)

            // elemento1.proveedor_monto_total_homogeneo = Number(parcial).toFixed(2)
            console.log( "elemento1.proveedor_monto_total_homogeneo");
            console.log( elemento1.proveedor_monto_total_homogeneo);

          }
        })

      })


    },

    cambiarCantidadFactor(item, scope){
      console.log("item cantidad factor");
      console.log(item);

      console.log("scope.row");
      console.log(scope.row);
      
      // cambio la cantidad proveedor
      let cantidad_proveedor_aux = scope.row.cantidad_a_comprar * item.factor
      item.cantidad_proveedor = cantidad_proveedor_aux.toFixed(2)

      // cambio el precio pp
      let precio_pp_aux = item.cantidad_proveedor * Number(item.precio_pu)
      
      item.precio_pp = precio_pp_aux.toFixed(2)

      this.actualizarPrecioTotal()
      this.marcarMenor()
    },

    cambiarPNG(item, scope){
      console.log("item");
      console.log(item);

      console.log("scope");
      console.log(scope);

      // cambio el pu
      let precio_pu_aux = item.precio_png + ((Number(item.iva) * 0.01) * item.precio_png)
      item.precio_pu = Number(precio_pu_aux).toFixed(2)

      // cambio el precio pp a partir del resultado de precio_pu
      let precio_pp_aux = Number(item.cantidad_proveedor) * item.precio_pu
      item.precio_pp = Number(precio_pp_aux).toFixed(2)

      this.actualizarPrecioTotal()
      this.marcarMenor()
    },

    agregar(scope, item, precio, index) {
      console.log("scope");
      console.log(scope);

      console.log("item");
      console.log(item);

      console.log("precio");
      console.log(precio);

      console.log("index");
      console.log(index);
    },

    mostrarLabel(prov) {
      return prov;
    },

    

    sortChange(sortProps){
      this.headerClick(sortProps.column,event) //optional: trigger header-click event
    },

    headerClick(param){
      console.log(param)

      // console.log("nombre");
      // console.log(param.label);
      
      let estadoProveedor = false
      let estadoOtrosProveedores = false
      let indexSeleccionado
      this.datosAPI.forEach((elemento, index) => {
        
        if (param.label == elemento.proveedor_nombre) {
          console.log(elemento);
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
        console.log("indexSeleccionado");
        console.log(indexSeleccionado);
      })
    },

    

    cambiarProveedorSeleccionado(item){
      console.log("this.datosAPI");
      console.log(this.datosAPI);

      console.log("item");
      console.log(item);


      
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

      this.calcularTotalHomogeneo()
    },

    calcularTotalHomogeneo(){
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

      console.log("this.arrayTotal");
      console.log(this.arrayTotal);


      this.calcularPrecioPPProveedores()
    },

    calcularPrecioPPProveedores(){
      let precioPPParcial = 0
      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            console.log("////////");
            console.log("ele.precio_pp");
            console.log(ele.precio_pp);
            console.log("precioPPParcial");
            console.log(precioPPParcial);
            let precioPPParcialAux = parseFloat(precioPPParcial)

            precioPPParcial = precioPPParcialAux + ele.precio_pp
          }
        })

        this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
          if (elementoArrayProv.proveedor_id == elemento.proveedor_id) {
            console.log("*************");
            console.log("precioPPParcial");
            console.log(precioPPParcial);
            console.log("**************");
            let precioPPParcialAux = parseFloat(precioPPParcial)
            elementoArrayProv.totalPP = precioPPParcialAux.toFixed(2)
          }
        })

        precioPPParcial = 0
      })
    },

    // traigo los datos de cada uno de los proveedores para mostrar la informacion de la factura, la forma de pago, etc
    async getDatosProveedores(){
      await this.axios
        .get("/api/presupuestacionproductosproveedor/obtenerTodosProveedores/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          // console.log("respuestaApi de arrayInfoProveedores");
          // console.log(respuestaApi.data);

          if (respuestaApi != null) {
            // this.arrayInfoProveedores = respuestaApi.data
            // console.log("respuestaApi de arrayInfoProveedores");
            // console.log(respuestaApi.data);

            this.infoProveedores = respuestaApi.data

          }
      })

      await this.axios
        .get("/api/condicionpago/obtenerTodos")
        .then((response) => {
          const respuestaApiCondicionPago = response.data;

          // console.log("respuestaApiCondicionPago");
          // console.log(respuestaApiCondicionPago);

          this.condicionesPago = respuestaApiCondicionPago
          // this.arrayCondicionesPago = respuestaApi.data;
          
          // console.log("this.arrayCondicionesPago");
          // console.log(this.arrayCondicionesPago);

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

      console.log("this.arrayInfoProveedores");
      console.log(this.arrayInfoProveedores);

      this.loadingTabla = false;
    },


    cellClick(param){
      console.log("param celdas");
      // console.log(param);

    },

    getSummaries(param) {
      console.log("param de getSummaries");
      console.log(param);

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

      console.log("sums");
      console.log(sums);

      return sums;
    },

    cambiarSeleccionProductoSegmentado(scope, producto){
      console.log("cambio seleccionado");
      console.log(scope);
      let index = scope.$index
      console.log("index");
      console.log(index);

      let cellIndex = scope.cellIndex
      console.log("cellIndex");
      console.log(cellIndex);


      console.log("productos");
      console.log(producto);

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

      this.calcularTotalHomogeneo()
      // this.marcarMenor()
      
    },

    abrirModalNotas(notas){
      console.log("abrir");
      console.log("notas");
      console.log(notas);

    },

    gurdarNotas(elemento, notas, item){
      console.log("elemento");
      console.log(elemento);


      console.log("notas");
      console.log(notas);

      console.log("item");
      console.log(item);


    },

    guardarNotas(elemento, arrayCantidadesDeposito){
      console.log("elemento desde modal" );
      console.log(elemento);

      this.arrayInfoProveedores.forEach((elementoProv) => {
        if (elementoProv.proveedor_id == elemento.item.proveedor_id) {
          console.log("elementoProv");
          console.log(elementoProv);

          elementoProv.proveedor_notas = elemento.notas
        }
      })    
    },

    scroll(scrollLeft, scrollTop){
      console.log("scrollLeft");
      console.log(scrollLeft);

      console.log("scrollTop");
      console.log(scrollTop);

    },

    scrollLeft(){

    },

    headerStylePrincipalTable(row, column, rowIndex, columnIndex){
      // P1
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

      if (row.rowIndex == 2 && row.columnIndex == 6) {
        return { background: "#96ceb4", color: "#000000" }
      }
      
      // P2
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
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 13) {
        return { background: "#adcbe3", color: "#000000" }
      }

      // P3
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

      if (row.rowIndex == 2 && row.columnIndex == 18) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 19) {
        return { background: "#ffeead", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 20) {
        return { background: "#ffeead", color: "#000000" }
      }


      // P4
      if (row.rowIndex == 1 && row.columnIndex == 5) {
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


      // P5
      if (row.rowIndex == 1 && row.columnIndex == 6) {
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
    },

    headerStyleTotal(row, column, rowIndex, columnIndex){
      // P1
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

      
      // P2
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


      // P3
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


      // P4
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


      // P5
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
    },

    headerStyle(row, column, rowIndex, columnIndex) {
      // console.log("row de headerStyle");
      // console.log(row);
      
      // console.log("column de headerStyle");
      // console.log(column);

      // console.log("rowIndex de headerStyle");
      // console.log(rowIndex);

      // console.log("columnIndex de headerStyle");
      // console.log(columnIndex);

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


      // P2
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


      // P3
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


      // P4
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


      // P4
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

      

      

      
    },

    headerStyleIntermedio(row, column, rowIndex, columnIndex) {
      // console.log("row de headerStyle");
      // console.log(row);
      
      // console.log("column de headerStyle");
      // console.log(column);

      // console.log("rowIndex de headerStyle");
      // console.log(rowIndex);

      // console.log("columnIndex de headerStyle");
      // console.log(columnIndex);

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


      // P4
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
        console.log("row de cell style en Proveedores");
        console.log(row);

        console.log("column de cell style en Proveedores");
        console.log(column);

        console.log("rowIndex de cell style en Proveedores");
        console.log(rowIndex);

        console.log("columnIndex de cell style en Proveedores");
        console.log(columnIndex);

        return {'background' : 'blue'}
      }


    },

    filterTag(value, row) {
      let value1 = value;
      console.log("value1");
      console.log(value1);

      console.log("row");
      console.log(row);

      return row
    },

    click(){
      console.log("e");
    },

    yellowBg (row, column, rowIndex, columnIndex) {
      console.log("entra a yellow");
      return {
        background: ''
      }
    },

    seleccionar(param){
      console.log("paramSeleccionar");
      console.log(param);

    },

    colorColumnas(columnas){
      // console.log("color columnas");
      // console.log(columnas);

      return {
          background: '#eceb3c'
        }

    },

    classChecker({ row, column, rowIndex, columnIndex }) {
      // console.log("*******************************");
      // console.log("rowIndex de classchecker");
      // console.log(rowIndex);

      // console.log("columnIndex de classchecker");
      // console.log(columnIndex);

      // console.log("column de classchecker");
      // console.log(column);
      
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
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P6
      if (columnIndex == 38) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }      

      if (columnIndex == 41) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 42) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 44) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      //P8
      if (columnIndex == 50) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 51) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 52) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      // P9
      if (columnIndex == 56) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 58) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 62) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 65) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 66) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P11
      if (columnIndex == 68) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 72) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 73) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

    },

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
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 38) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }      

      if (columnIndex == 41) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 42) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 44) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }
      
      if (columnIndex == 50) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }
      
      // P8
      if (columnIndex == 51) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 52) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 56) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      //P9
      if (columnIndex == 58) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 62) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 65) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 66) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 68) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P11
      if (columnIndex == 72) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 73) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 74) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 75) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 76) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 77) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 78) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P12 ff6f69
      if (columnIndex == 79) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 80) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 81) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 82) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 83) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 84) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 85) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }
    },

    classCheckerTotal({ row, column, rowIndex, columnIndex }) {
      // console.log("*******************************");
      // console.log("rowIndex de classchecker");
      // console.log(rowIndex);

      // console.log("columnIndex de classchecker");
      // console.log(columnIndex);

      // console.log("column de classchecker");
      // console.log(column);
      
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
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 44) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 49) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 50) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 51) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }      

      if (columnIndex == 52) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P8
      if (columnIndex == 44) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      //P9
      if (columnIndex == 50) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 51) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 52) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#ffcc5c' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 56) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 58) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P11
      if (columnIndex == 62) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 65) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 66) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P12
      if (columnIndex == 68) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 72) {
        return {'background': '#ff6f69' , 'color': 'black'}
      }

      if (columnIndex == 73) {
        return {'background': '#ff6f69' , 'color': 'black'}
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

  .el-table {

  }
</style>
