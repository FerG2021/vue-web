<template>
  <div>
    <modal ref="modal" titulo="Orden de compra adelantada" :impedir-close="impedirClose">
      <!-- <div v-loading="loadingDatos">
        <h2>Orden de compra adelantada</h2>
        {{ ordenCompra }} 
      </div> -->

      <h3 style="text-align: center">
        ¿Desea generar la orden de compra adelantada? No se podrá deshacer esta
        acción
      </h3>

      <div style="display: flex; margin-top: 20px">
        <div style="margin: auto">
          <el-button type="danger" @click="cerrar()"> Cancelar </el-button>

          <el-button 
            type="primary" 
            @click="generarOrdenDeCompraAdelantada()"
            :loading="loadingBtnGenerarOrdenesCompraAdelantada"
          >
            Aceptar
          </el-button>
        </div>
      </div>
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
        loadingBtnGenerarOrdenesCompraAdelantada: false,
      };
    },

    methods: {
      abrir(datos) {
        this.loadingDatos = true
        this.datos = datos
        this.loadingBtnGenerarOrdenesCompraAdelantada = false

        this.$refs.modal.abrir();
        // this.generarOrdenCompra()
      },

      cerrar() {
        this.$refs.modal.cerrar();
      },

      async generarOrdenDeCompraAdelantada(){
        this.loadingBtnGenerarOrdenesCompraAdelantada = true;
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
          WorkflowCodigo: 'CIADEL',
          Fecha: fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate(),
          CondicionPagoCodigo: this.datos.formaPago.condicionpago_codigo,
          EmpresaCodigo: this.datos.plan.empresa_codigo,
          TransaccionSubtipoCodigo: 'OCAD',
          Descripcion: this.datos.plan.plan_nombre,
          Items: items,

        }

        this.ordenCompra = JSON.stringify(ordenCompra) 

        await this.axios
          .get("/api/ordencompra/obtenerToken")
          .then((response) => {
            console.log("response");
            console.log(response.data);
            if (response) {
              let token = response.data;

              this.enviarOrdenCompra(token, ordenCompra)
            }
        });


        this.loadingDatos = false
      },

      async enviarOrdenCompra(token, ordenCompra) {
        let params = {
          ordenCompraID: this.datos.ordenCompra.ordenes_compras_id,
          token: token,
          // ordenCompra: this.ordenCompra
          ordenCompra: ordenCompra
        }

        console.log("token en orden compra");
        console.log(token);

        await this.axios
          .post("/api/ordencompra/enviarOrdenCompraAdelantada", params)
          .then((response) => {
            console.log("response");
            console.log(response.data);

            if (response.status == 200) {
              console.log("creado");
              this.loadingBtnGenerarOrdenesCompraAdelantada = false;

                ElMessage({
                  message: '¡Orden de compra adelantada generada con éxito!',
                  type: 'success',
                })   

              this.cerrar()
              this.$emit('orden-creada');
            }
          
          });
      }
    },
  };
</script>

<style></style>
