<template>
  <div>
    <modal ref="modal" titulo="Orden de compra normal" :impedir-close="impedirClose">
      <!-- <div v-loading="loadingDatos"> -->
        <!-- <h2>Orden de compra normal</h2> -->
        <!-- {{ ordenCompra }}  -->

        <h3 style="text-align: center">
          ¿Desea generar la orden de compra normal? No se podrá deshacer esta acción
        </h3>

        <div style="display: flex; margin-top: 20px">
          <div style="margin: auto">
            <el-button
              type="danger"
              @click="cerrar()"
            >
              Cancelar
            </el-button>

            <el-button
              type="primary"
              @click="generarOrdenDeCompraNormal()"
            >
              Aceptar
            </el-button>
          </div>
        </div>
      <!-- </div> -->


      
      
    </modal>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from "element-plus";

  name: "nuevoProducto";
  export default {
    components: {
    },

    data() {
      return {
        datos: null,
        ordenCompra: null,
        loadingDatos: false,
      };
    },

    methods: {
      abrir(datos) {
        this.loadingDatos = true
        this.datos = datos
        this.$refs.modal.abrir();
        // this.generarOrdenDeCompraNormal()
      },

      cerrar() {
        this.$refs.modal.cerrar();
      },

      async generarOrdenDeCompraNormal(){
        console.log("this.datos");
        console.log(this.datos);

        // conceptos
        let arrayConceptos = []

        let conceptos = {
          ConceptoImporteGravado: this.datos.ordenCompra.ordenes_compras_monto_total,
          ConceptoImporte: this.datos.ordenCompra.ordenes_compras_monto_total,
          ConceptoCodigo: 'COMPRA_IVA_21',
        }

        arrayConceptos.push(conceptos)

        let fecha = new Date(this.datos.ordenCompra.updated_at)

        // productos
        let items = []

        this.datos.productosOrdenCompra.forEach((elemento) => {
          let fila = {
            ProductoCodigo: elemento.producto.producto_codigo,
            ImporteExento: 0,
            ItemRedeterminado: 1,
            Cantidad: elemento.productoOrdenCompra.ordenes_compras_productos_cantidad_proveedor,
            vinculacionOrigen: 'valor',
            Descripcion: this.datos.plan.plan_nombre,
            DimensionDistribucion: [],
            Precio:  elemento.productoOrdenCompra.ordenes_compras_productos_precio_png,
          }

          items.push(fila)
        })
         

        let ordenCompra = {
          Nombre: "",
          // Conceptos: conceptos,
          Conceptos: arrayConceptos,          
          TransaccionTipoCodigo: 'OPER',
          Proveedor: this.datos.proveedorOrdenCompra.proveedor_codigo,
          NumeroComprobante: "",
          IdentificacionExterna: "",
          WorkflowCodigo: 'CPRA-INS',
          Fecha: fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate(),
          CondicionPagoCodigo: this.datos.formaPago.condicionpago_codigo,
          EmpresaCodigo: this.datos.plan.empresa_codigo,
          TransaccionSubtipoCodigo: 'OC',
          Descripcion: this.datos.plan.plan_nombre,
          Items: items,

        }

        this.ordenCompra = JSON.stringify(ordenCompra) 


        await this.axios.post("https://2.teamplace.finneg.com/BSA/api/oauth/token?grant_type=client_credentials&client_id=546aed61e07e0a1bf15187826411ec59&client_secret=b7444b18891462bd6e856d58c09af151")
        .then(response => {
          console.log("response");
          console.log(response);

        })



        this.loadingDatos = false
      },
    },
  };
</script>

<style></style>
