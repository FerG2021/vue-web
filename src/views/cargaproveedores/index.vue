<template>
  <main>
    <el-card>
      <template #header>
        <h1>Carga de los productos por el proveedor</h1>
      </template>
      
       <div v-loading="loadingDatosProveedor">
        <div v-if="datosProveedor" >
          <!-- mostrar mensaje si se superó la fecha límite -->
          <div v-if="deshabilitarPorFecha == true">
            <el-alert
              title="Información importante"
              type="warning"
              description="Ya no podrá modificar ninguno de los datos debido a que ya se superó la fecha límite de carga"
              show-icon
              :closable="false"
              effect="light"
            />
          </div>

          <el-descriptions 
            title="Datos del proveedor" 
            :column="4" 
            border 
            style="margin-top: 15px"
            size="large"
          >
            <el-descriptions-item
              label="Proveedor"
              label-align="center"
              align="center"
            >
              <el-tag size="large" type="primary">
                <b>{{datosProveedor.proveedor_nombre}}</b>
              </el-tag> 
            </el-descriptions-item>
            
            <el-descriptions-item 
              label="Mail" 
              label-align="center" 
              align="center"
            >
              <el-tag size="large" type="primary">
                <b>{{datosProveedor.proveedor_mail}}</b>
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item 
              label="Rubro" 
              label-align="center" 
              align="center"
            >
              <el-tag size="large" type="success">{{datosGenerales.presupuestacion_rubro_nombre}}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item 
              label="Fecha límite" 
              label-align="center" 
              align="center"
            >
              <el-tag size="large" type="success">{{formatearFecha(fechaLimiteCarga)}}</el-tag>
            </el-descriptions-item>

          </el-descriptions>
        </div>
      </div>
      <!-- {{arrayInformacionParaCarga}} -->
      <div v-loading="loadingArrayInformacionParaCarga">
        <div v-if="deshabilitarPorFecha != true">
          <el-alert
            title="Información importante"
            type="success"
            description="En caso de que trabaje con una unidad de medida distinta a la que se muestra en cada uno de los productos, por favor realice la conversión correspondiente"
            show-icon
            :closable="false"
            effect="light"
            style="margin-top: 15px"
            class="info-alert"
          />
        </div>
       

        <div v-if="arrayInformacionParaCarga" style="margin-top: 20px">
          <el-table 
            :data="arrayInformacionParaCarga" 
            stripe 
            style="width: 100%; margin-top: 15px"
            :cell-class-name="classChecker"
            :summary-method="getSummaries"
            show-summary
          >
            <!-- <el-table-column prop="ID" label="ID" width="80">
              <template #default="props">
                {{props.row.producto_id}}            
              </template>
            </el-table-column> -->
            
            <el-table-column prop="nombre" label="Nombre" min-width="150">
              <template #default="props">
                {{props.row.producto_nombre}}            
              </template>
            </el-table-column>

            <el-table-column prop="unidadMedida" label="Un. medida" min-width="150">
              <template #default="props">
                {{props.row.producto_unidad}}            
              </template>
            </el-table-column>

            <el-table-column prop="observaciones" label="Observaciones" min-width="150">
              <template #default="props">
                {{props.row.observaciones}}            
              </template>
            </el-table-column>

            <!-- <el-table-column prop="rubro" label="Rubro">
              <template #default="props">
                {{props.row.presupuestacion_rubro_nombre}}            
              </template>
            </el-table-column> -->

            <el-table-column prop="cantidad" label="Cantidad">
              <template #default="props">
                {{props.row.producto_cantidad_a_comprar}}            
              </template>
            </el-table-column>

            <!-- <el-table-column prop="factor" label="Factor" align="center">
              <template #default="props">
                <el-input-number
                  v-model="props.row.factor"
                  :controls="false"
                  style="width: 100%"
                  @change="cambiarCantidadProveedor(props)"
                ></el-input-number>            
              </template>
            </el-table-column> -->

            <!-- <el-table-column prop="cantidadProveedor" label="Cant. prov." align="center">
              <template #default="props">
                <el-input-number
                  v-model="props.row.producto_cantidad_real_a_comprar"
                  :controls="false"
                  style="width: 100%"
                ></el-input-number>            
              </template>
            </el-table-column> -->

            <el-table-column prop="png" label="PNG ($)" align="center">
              <template #default="props">
                <el-input-number
                  v-model="props.row.precio_png"
                  :controls="false"
                  style="width: 100%"
                  @change="calcularPrecioPP(props)"
                  :disabled="deshabilitarPorFecha"
                ></el-input-number>            
              </template>
            </el-table-column>

            <el-table-column prop="iva" label="IVA (%)" align="center"> 
              <template #default="props">
                <!-- <el-input-number
                  v-model="props.row.iva"
                  :controls="false"
                  style="width: 100%"
                  @change="calcularPrecioPP(props)"
                ></el-input-number>     -->


                <el-select 
                  v-model="props.row.iva" 
                  placeholder="Seleccione" 
                  style="width: 100%"
                  @change="calcularPrecioPP(props)"
                  :disabled="deshabilitarPorFecha"
                >
                  <el-option
                    v-for="item in opcionesIVA"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>  
                <!-- {{props.row.iva}}    -->
              </template>
            </el-table-column>

            <el-table-column prop="montoIva" label="Total IVA ($)" align="center"> 
              <template #default="props">
                <el-input-number
                  v-model="props.row.total_iva"
                  :controls="false"
                  style="width: 100%"
                  disabled
                ></el-input-number>            
              </template>
            </el-table-column>

            <el-table-column prop="pu" label="PU ($)" align="center"> 
              <template #default="props">
                <el-input-number
                  v-model="props.row.precio_pu"
                  :controls="false"
                  style="width: 100%"
                  disabled
                ></el-input-number>            
              </template>
            </el-table-column>

            <el-table-column prop="pp" label="PP ($)" align="center"> 
              <template #default="props">
                <el-input-number
                  v-model="props.row.precio_pp"
                  :controls="false"
                  style="width: 100%"
                  disabled
                ></el-input-number>            
              </template>
            </el-table-column>


          </el-table>

          <el-row :gutter="10" style="margin-top: 15px">
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              
            </el-col>
            <el-col :span="3">
              
            </el-col>
            <el-col :span="3">
              
            </el-col>
            <el-col :span="3">
              <span style="text-align: center">Total PP</span>
              <el-input-number
                :controls="false"
                v-model="totalPP"
                style="width: 100%"
                disabled
                @change="calcularTotalHomegeno()"
              ></el-input-number>
            </el-col>

          </el-row>

          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <span>Forma de pago</span>
              <el-select 
                v-model="condicionpago" 
                placeholder="Forma de pago"
                style="width: 100%"
                filterable
                @change="cambiaCondicionPago()"
                :disabled="deshabilitarPorFecha"
              >
                <el-option
                  v-for="item in arrayCondicionesPago"
                  :key="item.condicionpago_id"
                  :label="item.condicionpago_nombre"
                  :value="item.condicionpago_id"
                />
              </el-select>
            </el-col>
            <!-- {{condicionpago}} -->
            <el-col :span="3">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Para el caso de que el proveedor no entregue factura, introduzca en la celda adyacente a la derecha el importe de ahorro de IVA en números negativos"
                placement="top-start"
              >
                <span>¿Entrega factura A?</span>
              </el-tooltip>
              
                <el-select 
                  v-model="facturaA" 
                  placeholder="Seleccione" 
                  style="width: 100%"
                  @change="cambiarDisabledEmiteFactura()"
                  :disabled="deshabilitarPorFecha"
                >
                  <el-option
                    v-for="item in opcionesFacturaA"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
            </el-col>
            <!-- {{facturaA}} -->
            <el-col :span="3">
              <span style="text-align: center">Monto desc. x  IVA</span>
              <el-input-number
                :controls="false"
                v-model="montoIVA"
                style="width: 100%"
                :disabled="disabledEmiteFactura"
                @change="calcularTotalHomegeno()"
                :max="0"
              ></el-input-number>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <!-- <span>Se debe pagar el día:</span>
              <el-input
                v-model="diaPago"
                disabled
              ></el-input> -->
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Flete del proveedor o terceros transportistas. SI EL FLETE ESTÁ INCLUIDO NO INGRESAR NINGUN IMPORTE"
                placement="left-end"
              >
                <span style="text-align: center">Flete</span>
              </el-tooltip>
              <el-input-number
                :controls="false"
                v-model="precioFlete"
                style="width: 100%"
                :min="0"
                @change="calcularTotalHomegeno()"
                :disabled="deshabilitarPorFecha"
              ></el-input-number>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="3">Referencias</el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Bonificaciones por conceptos comerciales, como por ejemplo: Bonificación por gran volumen de compra, descuentos por conceptos financieros, etc"
                placement="left-end"
              >
                <span style="text-align: center">Desc. y bonif. (en nros. neg.)</span>
              </el-tooltip>
              <el-input-number
                :controls="false"
                v-model="descuentosyBonificaciones"
                style="width: 100%"
                @change="calcularTotalHomegeno()"
                :disabled="deshabilitarPorFecha"
                :max="0"
              ></el-input-number>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="3"><b>PNG:</b> Precio neto gravado</el-col>
            <el-col :span="3"><b>PU:</b> Precio unitario</el-col>
            <el-col :span="3"><b>PP:</b> Precio parcial</el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3">
              <span style="text-align: center">Total</span>
              <el-input-number
                :controls="false"
                v-model="totalHomogeneo"
                style="width: 100%"
                :min="0"
                disabled
                align="center"
                text-align="center"
              ></el-input-number>
            </el-col>
          </el-row>


        </div>

        <div class="contenedorBtnSiguienteAtras">
          <!-- <el-button  
            type="info"    
            class="btnAtras"
            @click="active = 0"
          >
            Atrás
          </el-button> -->

          <el-button  
            type="primary"    
            class="btnSiguiente"
            @click="onSubmit()"
            :loading="loadingBtnGuardar"
            :disabled="deshabilitarPorFecha"
          >
            Guardar
          </el-button>
        </div>

      </div>
    </el-card>
  </main>

</template>

<script>
  import { ElMessage, ElMessageBox } from "element-plus";


  export default {
    components: {
      
    },

    data() {
      return {
        proveedorID: null,
        presupuestacionID: null, 
        loading: false,
        presupuestaciones: [],
        loading: false,

        // parte carga
        idProveedor: null,
        idPresupuestacion: null,
        arrayInformacionParaCarga: [],
        datosGenerales: null,
        datosProductos: [],
        datosProveedor: null,
        arrayInformacionParaCarga: [],
        arrayProductosDesdeAPI: [],

        loadingDatosProveedor: false,
        loadingArrayInformacionParaCarga: false,

        totalPP: 0,
        precioFlete: 0,
        facturaA: null,
        montoIVA: 0,
        disabledEmiteFactura: true,
        arrayCondicionesPago: [],
        condicionpago: null,
        descuentosyBonificaciones: 0,
        totalHomogeneo: 0,
        loadingBtnGuardar: false,
        diaPago: null,
        diaPagoSinFormatear: null,

        fechaLimiteCarga: localStorage.getItem("fechaLimiteCarga"),

        // disabled si se pasa la fecha limite para la carga de los precios por el proveedor
        deshabilitarPorFecha: false,

        opcionesFacturaA: [
          {
            value: '1',
            label: 'Si',
          },
          {
            value: '0',
            label: 'No',
          },
        ],

        opcionesIVA: [
          {
            value: '21',
            label: '21',
          },
          {
            value: '10.5',
            label: '10,5',
          },
          {
            value: '27',
            label: '27',
          },
        ]
      };
    },

    mounted() {
      this.getCondicionesPago();
      this.getDatos();
    },

    // created() {
    //   this.getCondicionesPago();
    //     this.getDatos();
    // },

    methods: {
      verDatos(){
        // this.proveedorID = this.$store.state.proveedorID
        this.proveedorID = localStorage.getItem("proveedorID")

        // this.presupuestacionID = this.$store.state.presupuestacionID
        this.presupuestacionID = localStorage.getItem("presupuestacionID")


        //console.log("this.proveedorID");
        //console.log(this.proveedorID);

        //console.log("this.presupuestacionID");
        //console.log(this.presupuestacionID);

        
      },

      limpiarCampos(){

        this.idProveedor = null;

        this.idPresupuestacion = null

        this.arrayInformacionParaCarga = []
        this.datosGenerales = null
        this.datosProductos = []
        this.datosProveedor = null
        this.arrayInformacionParaCarga = []
        this.arrayProductosDesdeAPI = []

        this.totalPP = 0
        this.precioFlete = null
        this.facturaA = null
        this.montoIVA = 0
        this.disabledEmiteFactura = true

        this.arrayCondicionesPago = []
        this.condicionpago = null
        this.descuentosyBonificaciones = null;
        this.totalHomogeneo = null;
        this.diaPago = null
        this.diaPagoSinFormatear = null

        this.getCondicionesPago();
        this.getDatos();

      },

      async getDatos() {
        this.loadingDatosProveedor = true
        this.loadingArrayInformacionParaCarga = true

        // this.proveedorID = this.$store.state.proveedorID
        this.proveedorID = localStorage.getItem("proveedorID")
        this.idProveedor = localStorage.getItem("proveedorID")


        // this.presupuestacionID = this.$store.state.presupuestacionID
        this.presupuestacionID = localStorage.getItem("presupuestacionID")
        this.idPresupuestacion = localStorage.getItem("presupuestacionID")

        
        // comparo los fechas
        let fechaActual = new Date()
        let fechaLimiteCarga = new Date(this.fechaLimiteCarga)

        console.log("fechaActual");
        console.log(fechaActual);

        console.log("fechaLimiteCarga");
        console.log(fechaLimiteCarga);


        console.log("comp fecha");
        console.log(fechaLimiteCarga > fechaActual);

        if (fechaLimiteCarga > fechaActual) {
          console.log("mayor fecha carga");
          this.deshabilitarPorFecha = false
        } else {
          console.log("menor fecha carga");
          console.log(this.fechaLimiteCarga);
          console.log(fechaActual);
          this.deshabilitarPorFecha = true
        }
        
        //console.log("this.proveedorID");
        //console.log(this.proveedorID);

        //console.log("this.presupuestacionID");
        //console.log(this.presupuestacionID);
        await this.axios
          .get("/api/presupuestacion/obtenerDatos/" + this.presupuestacionID)
          .then((response) => {
            const respuestaApi = response;
            // //console.log("respuestaApi de getDatos");
            // //console.log(respuestaApi.data);

            if (respuestaApi != null) {
              this.datosGenerales = respuestaApi.data;
              // console.log("this.datosGenerales");
              // console.log(this.datosGenerales);

              this.datosProductos = respuestaApi.data.productos;
              console.log("this.datosProductos");
              console.log(this.datosProductos);

              let proveedoresApi = []
              proveedoresApi = respuestaApi.data.proveedores;
              // console.log("proveedoresApi");
              // console.log(proveedoresApi);


              proveedoresApi.forEach((elemento) => {
                if (this.proveedorID == elemento.proveedor_id) {
                  let fila = {
                    presupuestacion_id: elemento.presupuestacion_id,
                    presupuestacion_plan_id: elemento.presupuestacion_plan_id,
                    presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id,
                    proveedor_id: elemento.proveedor_id,
                    proveedor_mail:elemento.proveedor_mail, 
                    proveedor_nombre: elemento.proveedor_nombre,
                    proveedor_rubro_id: elemento.proveedor_rubro_id,
                  }

                  this.datosProveedor = fila
                }
              })
              //console.log("this.datosProveedor");
              //console.log(this.datosProveedor);


              this.mostrarInformacionParaCargar()


            } else {
              this.cerrar();
            }
          });
      },

      async getCondicionesPago(){
        await this.axios
          .get("/api/condicionpago/obtenerTodos")
          .then((response) => {
            const respuestaApi = response;

            this.arrayCondicionesPago = respuestaApi.data;
            
            //console.log("this.arrayCondicionesPago");
            //console.log(this.arrayCondicionesPago);

          })

        // this.getDatos()
      },

      mostrarInformacionParaCargar(){
        this.datosProductos.forEach((ele) => {
          let fila = {
            presupuestacion_productos_proveedores_id: 0,
            presupuestacion_plan_id: this.datosGenerales.presupuestacion_plan_id,
            presupuestacion_id: this.datosGenerales.presupuestacion_id,
            presupuestacion_producto_id: ele.productoPresupuestacion.presupuestacion_producto_id,
            presupuestacion_rubro_id: this.datosGenerales.presupuestacion_rubro_id,
            presupuestacion_rubro_nombre: this.datosGenerales.presupuestacion_rubro_nombre,
            proveedor_id: this.datosProveedor.proveedor_id,
            proveedor_nombre: this.datosProveedor.proveedor_nombre,
            proveedor_mail: this.datosProveedor.proveedor_mail,
            producto_id: ele.productoPresupuestacion.producto_id,
            producto_nombre: ele.productoPresupuestacion.producto_nombre,
            producto_unidad: ele.producto.producto_unidad,
            producto_cantidad_a_comprar: ele.productoPresupuestacion.producto_cantidad_real_a_comprar,
            producto_cantidad_real_a_comprar: ele.productoPresupuestacion.producto_cantidad_real_a_comprar,
            precio_png: ele.productoPresupuestacion.precio_png,
            factor: 1,
            // cantidad_proveedor: ele.productoPresupuestacion.producto_cantidad_a_comprar,
            cantidad_proveedor: ele.productoPresupuestacion.producto_cantidad_real_a_comprar,
            // iva: ele.productoPresupuestacion.iva,
            iva: 21, // se agrega de esta forma para dejar de forma predeterminad el 21% de iva, de lo contrario se debe comentar esta linea y descomentar de arriba
            total_iva: null,
            precio_pu: ele.productoPresupuestacion.precio_pu,
            precio_pp: ele.productoPresupuestacion.precio_pp,
            observaciones: ele.productoPresupuestacion.producto_observaciones,
            ya_agregado: 0,
          }

          this.arrayInformacionParaCarga.push(fila)
        })

        console.log("this.arrayInformacionParaCarga");
        console.log(this.arrayInformacionParaCarga);

        this.completarArrayConProductosAgregados();

      },

      // luego busco los productos que ya tengo creados y los reemplazo en el array
      async completarArrayConProductosAgregados(){
        let params = {
          idPresupuestacion: this.idPresupuestacion,
          idProveedor: this.idProveedor,
        }
          await this.axios.post("/api/presupuestacionproductosproveedor/obtenerTodosDatos", params)
            .then(response =>{
              console.log("response.data*********");
              console.log(response.data);
              if (response.data.productoProveedor.length > 0) {
                this.arrayProductosDesdeAPI = response.data.productoProveedor

                  //  total PP
                  // if (response.data.presupuestacionProveedorDB.proveedor_monto_totalPP) {
                  //   this.totalPP =  response.data.presupuestacionProveedorDB.proveedor_monto_totalPP
                  // }

                  // precio Flete
                  this.precioFlete = response.data.presupuestacionProveedorDB.proveedor_monto_flete

                  // factura A
                  if (response.data.presupuestacionProveedorDB.proveedor_factura_A == 1) {
                    this.facturaA = "Si"
                  } else {
                    this.facturaA = "No"
                  }

                  // monto factura A
                  if (response.data.presupuestacionProveedorDB.proveedor_monto_factura_A == null) {
                    this.montoIVA = 0
                  } else {
                    this.montoIVA = response.data.presupuestacionProveedorDB.proveedor_monto_factura_A
                  }

                  // Forma de pago
                  this.arrayCondicionesPago.forEach((elemento) => {
                    if (elemento.condicionpago_id == response.data.presupuestacionProveedorDB.proveedor_forma_de_pago) {
                      this.condicionpago = elemento.condicionpago_nombre
                    }
                  })

                  // descuento y bonificacion
                  this.descuentosyBonificaciones = response.data.presupuestacionProveedorDB.proveedor_monto_descuentos_bonificaciones

                  // total homogeneo
                  this.totalHomogeneo = response.data.presupuestacionProveedorDB.proveedor_monto_total_homogeneo

                  

                  // agregado dentro del then
                  this.arrayInformacionParaCarga.forEach((elemento) => {
                  this.arrayProductosDesdeAPI.forEach((ele) => {
                    // //console.log("*******************");
                    // //console.log("presupuestacion_producto_id de Info carga");
                    // //console.log(elemento.presupuestacion_producto_id );
                    // //console.log("presupuestacion_producto_id de API");
                    // //console.log(ele.presupuestacion_producto_id);
                    // //console.log("*******************");

                    if (elemento.presupuestacion_producto_id == ele.presupuestacion_producto_id && elemento.proveedor_id == ele.proveedor_id) {
                      elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id,
                      
                      elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id
                      
                      elemento.presupuestacion_producto_id = ele.presupuestacion_producto_id
                      
                      elemento.presupuestacion_id = ele.presupuestacion_id
                      
                      elemento.presupuestacion_plan_id = ele.presupuestacion_plan_id
                      
                      elemento.presupuestacion_rubro_id = ele.presupuestacion_rubro_id
                      
                      elemento.presupuestacion_rubro_nombre = ele.presupuestacion_rubro_nombre
                      
                      elemento.proveedor_id = ele.proveedor_id
                      
                      elemento.proveedor_nombre = ele.proveedor_nombre
                      
                      elemento.proveedor_mail = ele.proveedor_mail
                      // 
                      elemento.producto_id = ele.producto_id
                      
                      elemento.producto_nombre = ele.producto_nombre
                      
                      elemento.producto_cantidad_real_a_comprar = ele.producto_cantidad_a_comprar

                      elemento.factor = ele.factor

                      elemento.cantidad_proveedor= ele.cantidad_proveedor
                      
                      elemento.precio_png = ele.precio_png
                      
                      elemento.iva = ele.iva
                      
                      elemento.total_iva = ele.total_iva

                      elemento.precio_pu = ele.precio_pu

                      elemento.precio_pp = ele.precio_pp
                      
                      elemento.ya_agregado = 1
                    }
                  })
                })

                //console.log("this.arrayInformacionParaCarga despues de API");
                //console.log(this.arrayInformacionParaCarga);

                this.loadingArrayInformacionParaCarga = false;

                this.sumarPP()

              }

              this.loadingDatosProveedor = false
              this.loadingArrayInformacionParaCarga = false
            
          })  
          
          
          
      },

      getSummaries(param) {
        //console.log("param de getSummaries");
        //console.log(param);

        const  tabla = this.$refs.tablaComparativa
        const { columns, data } = param;
        const sums = [];
        let ind = 5
        sums[ind] = 0
        let num = 0

        
        this.arrayInformacionParaCarga.forEach((elemento, index) => {
          if (index == 0) {
            sums[index] = 'Total'          
          }
         
          num =  Number(sums[ind]) + Number(elemento.total_iva)
          sums[ind] = num.toFixed(2)
        })

        //console.log("sums");
        //console.log(sums);

        return sums;
      },
      
      cambiarCantidadProveedor(props){
        //console.log("cambia");

        //console.log("props");
        //console.log(props);

        this.arrayInformacionParaCarga[props.$index].cantidad_proveedor = this.arrayInformacionParaCarga[props.$index].producto_cantidad_a_comprar * this.arrayInformacionParaCarga[props.$index].factor 

        this.calcularPrecioPP(props)
      },

      calcularPrecioPP(props){
        console.log("Calcular precio");
        //console.log(props.$index);
        //console.log(props.row);

        if (this.arrayInformacionParaCarga[props.$index].iva != null &&
          this.arrayInformacionParaCarga[props.$index].precio_png != null
        ) {
          
          // calculo pu
          let iva = parseFloat(this.arrayInformacionParaCarga[props.$index].iva)
          let porcentaje = iva * 0.01
          //console.log("porcentaje");
          //console.log(porcentaje);

          let precioParcial = parseFloat(porcentaje * this.arrayInformacionParaCarga[props.$index].precio_png)
          //console.log("precioParcial");
          //console.log(precioParcial);

          this.arrayInformacionParaCarga[props.$index].total_iva = precioParcial.toFixed(2)


          let precio_png = parseFloat(this.arrayInformacionParaCarga[props.$index].precio_png)

          let precio_pu = (precio_png + precioParcial).toFixed(2)

          
          //console.log("precio_pu");
          //console.log(precio_pu);

          this.arrayInformacionParaCarga[props.$index].precio_pu = precio_pu
          // this.arrayInformacionParaCarga[props.$index].precio_pu = precio_pu


          //console.log("this.arrayInformacionParaCarga[props.$index].precio_pu");
          //console.log(this.arrayInformacionParaCarga[props.$index].precio_pu);

          // calculo pp
          // this.arrayInformacionParaCarga[props.$index].precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pu * this.arrayInformacionParaCarga[props.$index].producto_cantidad_a_comprar

          // this.arrayInformacionParaCarga[props.$index].precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pu * this.arrayInformacionParaCarga[props.$index].cantidad_proveedor

          this.arrayInformacionParaCarga[props.$index].precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pu * this.arrayInformacionParaCarga[props.$index].producto_cantidad_a_comprar


          let precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pp
          
          this.arrayInformacionParaCarga[props.$index].precio_pp = precio_pp.toFixed(2)
          
          this.sumarPP(props)

          this.calcularMontoIVA(props)
        } 
      },

      calcularMontoIVA(props){
        //console.log("props de monto iva");
        //console.log(props);


      },

      sumarPP(props){
        this.totalPP = 0
        //console.log("ejecuta sumarPP");
        this.arrayInformacionParaCarga.forEach((elemento) => {
          //console.log("elemento.precio_pp");
          //console.log(elemento.precio_pp);
          if (elemento.precio_pp != null) {
            this.totalPP = this.totalPP + parseFloat(elemento.precio_pp)
          }
        })

        let total = this.totalPP.toFixed(2)
        //console.log("total");
        //console.log(total);
        this.totalPP = total
        // //console.log(this.totalPP);
        // //console.log("this.arrayInformacionParaCarga[props.$index].precio_pp");
        // //console.log(this.arrayInformacionParaCarga[props.$index].precio_pp);
        

        // this.totalPP = this.totalPP + parseInt(this.arrayInformacionParaCarga[props.$index].precio_pp)

        //console.log(this.totalPP);
        
        this.calcularTotalHomegeno()
      },

      cambiarDisabledEmiteFactura(){
        //console.log("emite factura");
        if (this.facturaA == 0 || this.facturaA === "No") {
          this.disabledEmiteFactura = false
        } else {
          if (this.facturaA == 1 || this.facturaA == "Si") {
            this.disabledEmiteFactura = true
            this.montoIVA = 0
            this.calcularTotalHomegeno()          
          }
        }
      },

      calcularTotalHomegeno(){
        //console.log("this.totalPP");
        //console.log(parseFloat(this.totalPP));

        //console.log("this.precioFlete");
        //console.log(parseFloat(this.precioFlete));

        //console.log("this.descuentosyBonificaciones");
        //console.log(parseFloat(this.descuentosyBonificaciones));

        
      
        let totalHomogeneoVar = parseFloat(this.totalPP) + parseFloat(this.precioFlete) + parseFloat(this.descuentosyBonificaciones) + parseFloat(this.montoIVA)

        let totalHomogeneoVar2 = totalHomogeneoVar.toLocaleString('de-DE')

        this.totalHomogeneo = totalHomogeneoVar.toFixed(2)
        // this.totalHomogeneo = totalHomogeneoVar2

      },

      cambiaCondicionPago(){
        //console.log("cambia condicion pago");

        //console.log("this.condicionpago");
        //console.log(this.condicionpago);

        let date = null
        date = new Date()
        //console.log("date");
        //console.log(date);

        //console.log(date.setDate(date.getDate()));

        let nuevoDate = Date()
        nuevoDate = date.setDate(date.getDate() + 180)

        //console.log("nuevoDate");
        //console.log(nuevoDate);

        // 0 - 180
        if (this.condicionpago == 39) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 180))
          //console.log("date dentro");
          //console.log(date.setDate(date.getDate() + 180));
          // this.diaPagoSinFormatear = date.setDate(date.getDate() + 180)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 -30
        if (this.condicionpago == 26) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30))
          // this.diaPagoSinFormatear = date.setDate(date.getDate() + 30)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 - 30 - 60
        if (this.condicionpago == 25) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60))
          // this.diaPagoSinFormatear = date.setDate(date.getDate() + 60)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 - 45
        if (this.condicionpago == 30) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45))
          // this.diaPagoSinFormatear = date.setDate(date.getDate() + 45)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 - 10
        if (this.condicionpago == 17) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 10))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 10)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 15 - 20
        if (this.condicionpago == 20) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 20))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 20)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 15 - 30
        if (this.condicionpago == 18) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 30)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 15 - 30 - 45 - 60 - 75
        if (this.condicionpago == 34) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 75))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 75)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 15 - 45 - 75
        if (this.condicionpago == 24) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 75))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 75)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 
        // 20 - 45
        if (this.condicionpago == 19) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 75)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 30
        if (this.condicionpago == 22) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 30)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 30 - 60
        if (this.condicionpago == 10) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 60)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 45
        if (this.condicionpago == 27) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 45)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 45 - 60
        if (this.condicionpago == 16) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 60)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 45 - 60 - 75 - 105
        if (this.condicionpago == 36) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 105))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 105)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 45 - 60 - 90
        if (this.condicionpago == 14) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 90)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 60
        if (this.condicionpago == 28) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 60)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 60 - 90
        if (this.condicionpago == 37) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 90)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 60 - 90 - 120
        if (this.condicionpago == 38) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 120))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 120)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 90
        if (this.condicionpago == 12) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 90)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 1 
        if (this.condicionpago == 23) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 1))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 1)        
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 - 30 - 60
        if (this.condicionpago == 32) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 60)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 0 - 30 - 60 - 90
        if (this.condicionpago == 33) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 90)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        // 30 - 70
        if (this.condicionpago == 35) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 70))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 70)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        }   

        // 90
        if (this.condicionpago == 29) {
          let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90))
          this.diaPagoSinFormatear = date.setDate(date.getDate() + 90)
          //console.log("nuevoDate");
          //console.log(nuevoDate);
          this.diaPago = nuevoDate
        } 

        if (this.condicionpago != 39 &&
            this.condicionpago != 26 &&
            this.condicionpago != 25 &&
            this.condicionpago != 30 &&
            this.condicionpago != 17 &&
            this.condicionpago != 20 &&
            this.condicionpago != 18 &&
            this.condicionpago != 34 &&
            this.condicionpago != 24 &&
            this.condicionpago != 19 &&
            this.condicionpago != 22 &&
            this.condicionpago != 10 &&
            this.condicionpago != 27 &&
            this.condicionpago != 16 &&
            this.condicionpago != 36 &&
            this.condicionpago != 14 &&
            this.condicionpago != 28 &&
            this.condicionpago != 37 &&
            this.condicionpago != 38 &&
            this.condicionpago != 12 &&
            this.condicionpago != 23 &&
            this.condicionpago != 32 &&
            this.condicionpago != 33 &&
            this.condicionpago != 35 &&
            this.condicionpago != 29
        ) {
          this.diaPago = null
        }
      },

      formatearFecha(fecha) {
        //console.log("fecha en form");
        //console.log(fecha);

        let fecha1 = new Date(fecha);
        //console.log("fecha1");
        //console.log(fecha1);

        this.diaPagoSinFormatear = fecha1.getUTCDate();
        //console.log("this.diaPagoSinFormatear");
        //console.log(this.diaPagoSinFormatear);


        // let fecha2 = fecha1.toLocaleString();
        let fecha2 = fecha1.toLocaleDateString();
        return fecha2;
      },

      async onSubmit(){
        // verifico que en todos los productos se hayan cargado los precios, en el caso de que no hayan sido cargados todos muestro el mensaje de error
        var res = this.arrayInformacionParaCarga.filter(element => element.precio_png == null)

        console.log("res");
        console.log(res.length);


        if (res.length > 0) {
          ElMessage({
            type: 'error',
            message: '¡Se deben colocar todos los precios, en el caso de que no tenga disponibilidad de un producto colocar 0 en PNG ($)!',
          })
        } else {
          if (this.condicionpago == null || this.facturaA == null) {
            ElMessage({
              type: 'error',
              message: '¡Se debe seleccionar forma de pago e indicar si entrega o no factura A!',
            })
          } else {
            this.loadingBtnGuardar = true
            console.log("this.arrayInformacionParaCarga");
            console.log(this.arrayInformacionParaCarga);

            let params = {
              idProveedor: this.idProveedor,
              idPresupuestacion: this.idPresupuestacion,
              totalPP: this.totalPP,
              precioFlete: this.precioFlete,
              // facturaA: this.facturaA,
              // condicionpago: this.condicionpago,
              proveedor_monto_factura_A: this.montoIVA,
              descuentosyBonificaciones: this.descuentosyBonificaciones,
              totalHomogeneo: this.totalHomogeneo,
              arrProductosProveedores: JSON.stringify(this.arrayInformacionParaCarga)
            } 


            // if (this.diaPago != null) {
            //   params.diaPago = this.diaPagoSinFormatear
            // }

            // if (this.facturaA == "Si") {
            //   params.facturaA = 1
            // } else {
            //   params.facturaA = 0
            // }

            this.opcionesFacturaA.forEach((ele) => {
              if (this.facturaA == ele.value || this.facturaA == ele.label) {
                params.facturaA = ele.value
              }
            })

            this.arrayCondicionesPago.forEach((elemento) => {
              if (this.condicionpago === elemento.condicionpago_nombre ||
                  this.condicionpago === elemento.condicionpago_id
              ) {
                params.condicionpago = elemento.condicionpago_id
              }
            })

            console.log("params");
            console.log(params);

            console.log("this.arrayInformacionParaCarga");
            console.log(this.arrayInformacionParaCarga);


            await this.axios.post("/api/presupuestacionproductosproveedor/crear", params)
              .then(response => {
                //console.log(response);

                if (response) {
                  ElMessage({
                    type: 'success',
                    message: '¡Carga realizada con éxito!',
                  })
                  // this.$emit('actualizarTabla')
                  // this.cerrar()
                  this.loadingBtnGuardar = false
                }
              }
            )
          }
        }



        
      },

      classChecker({ row, column }) {
        if (column.property == "pp") {
          // //console.log("column");
          // //console.log(column);
        }
        // //console.log("row");
        // //console.log(row);

        // const val = row[column.property];
        // //console.log("val");
        // //console.log(val);

        // if (val > 0) {
        //   return "blueClass";
        // } else {
        //   return "redClass";
        // }
      },

      formatearFecha(fecha){
        let fecha1 = new Date(fecha)
        // let fecha2 = fecha1.toLocaleString();
        let fecha2 = fecha1.toLocaleDateString();        
        return fecha2
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

  .contenedorBtnSiguienteAtras {
    display: flex;
    width: 100%;
    margin-top: 10px;
  }

  .btnSiguiente {
    margin: auto;
    margin-right: 10px;
  }

  .info-alert .el-alert__icon{
    font-size: 34px !important;
  }

  .info-alert .el-alert__title{
    font-size: 16px !important;
  }

  .info-alert .el-alert__description{
    font-size: 14px !important;
  }
</style>
