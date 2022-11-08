<template>
  <div>
    <modal
      ref="modal"
      titulo="Orden de compra normal"
      :impedir-close="impedirClose"
    >
      <!-- <div v-loading="loadingDatos"> -->
      <!-- <h2>Orden de compra normal</h2> -->
      <!-- {{ ordenCompra }}  -->

      <h3 style="text-align: center">
        ¿Desea generar la orden de compra normal? No se podrá deshacer esta
        acción
      </h3>

      <div style="display: flex; margin-top: 20px">
        <div style="margin: auto">
          <el-button type="danger" @click="cerrar()"> Cancelar </el-button>

          <el-button 
            type="primary" 
            @click="generarOrdenDeCompraNormal()"
            :loading="loadingBtnGenerarOrdenesCompraNormal"
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
  components: {},

  data() {
    return {
      datos: null,
      ordenCompra: null,
      loadingDatos: false,
      loadingBtnGenerarOrdenesCompraNormal: false,
    };
  },

  methods: {
    abrir(datos) {
      this.loadingDatos = true;
      this.datos = datos;
      console.log("this.datos");
      console.log(this.datos);
      this.loadingBtnGenerarOrdenesCompraNormal = false

      this.$refs.modal.abrir();
      // this.generarOrdenDeCompraNormal()
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async generarOrdenDeCompraNormal() {
      this.loadingBtnGenerarOrdenesCompraNormal = true;
      console.log("this.datos");
      console.log(this.datos);

      // conceptos
      let arrayConceptos = [];

      let conceptos = {
        ConceptoImporteGravado:
          this.datos.ordenCompra.ordenes_compras_monto_total,
        ConceptoImporte: this.datos.ordenCompra.ordenes_compras_monto_total,
        ConceptoCodigo: "COMPRA_IVA_21",
      };

      arrayConceptos.push(conceptos);

      let fecha = new Date(this.datos.ordenCompra.updated_at);

      // productos
      let items = [];

      this.datos.productosOrdenCompra.forEach((elemento) => {
        let fila = {
          ProductoCodigo: elemento.producto.producto_codigo,
          ImporteExento: 0,
          ItemRedeterminado: 1,
          Cantidad:
            elemento.productoOrdenCompra
              .ordenes_compras_productos_cantidad_proveedor,
          vinculacionOrigen: "valor",
          Descripcion: this.datos.plan.plan_nombre,
          DimensionDistribucion: [],
          Precio:
            elemento.productoOrdenCompra.ordenes_compras_productos_precio_png,
        };

        items.push(fila);
      });

      let ordenCompra = {
        Nombre: "",
        // Conceptos: conceptos,
        Conceptos: arrayConceptos,
        TransaccionTipoCodigo: "OPER",
        Proveedor: this.datos.proveedorOrdenCompra.proveedor_codigo,
        NumeroComprobante: "",
        IdentificacionExterna: "",
        WorkflowCodigo: "CPRA-INS",
        Fecha:
          fecha.getFullYear() +
          "-" +
          (fecha.getMonth() + 1) +
          "-" +
          fecha.getDate(),
        CondicionPagoCodigo: this.datos.formaPago.condicionpago_codigo,
        EmpresaCodigo: this.datos.plan.empresa_codigo,
        TransaccionSubtipoCodigo: "OC",
        Descripcion: this.datos.plan.plan_nombre,
        Items: items,
      };

      this.ordenCompra = JSON.stringify(ordenCompra);

      console.log("this.ordenCompra");
      console.log(this.ordenCompra);

      console.log("ordenCompra");
      console.log(ordenCompra);

      

      // await this.axios
      //   .get(
      //     "https://2.teamplace.finneg.com/BSA/api/oauth/token?grant_type=client_credentials&client_id=546aed61e07e0a1bf15187826411ec59&client_secret=b7444b18891462bd6e856d58c09af151",
      //     {
      //       headers: {
      //         "Content-Type": "application/json;charset=UTF-8",
      //         "Access-Control-Allow-Origin": "Content-Type",
      //       },
      //       data: {}, // envío un cuerpo (aunque sea un objeto vacío)
      //     }
      //   )
      //   .then((response) => {
      //     console.log("response");
      //     console.log(response);
      //   });

      

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

      this.loadingDatos = false;
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
        .post("/api/ordencompra/enviarOrdenCompra", params)
        .then((response) => {
          console.log("response");
          console.log(response.data);

          if (response.status == 200) {
            console.log("creado");
            this.loadingBtnGenerarOrdenesCompraNormal = false;

             ElMessage({
                message: '¡Orden de compra normal generada con éxito!',
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
