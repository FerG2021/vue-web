<template>
  <div>
    <modal ref="modal" titulo="Orden de compra normal" :impedir-close="impedirClose">
      <div v-loading="loadingDatos">
        <h2>Orden de compra normal</h2>
        {{ ordenCompra }} 
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
      };
    },

    methods: {
      abrir(datos) {
        this.loadingDatos = true
        this.datos = datos
        this.$refs.modal.abrir();
        this.generarOrdenCompra()
      },

      cerrar() {
        this.$refs.modal.cerrar();
      },

      generarOrdenCompra(){
        console.log("this.datos");
        console.log(this.datos);

        // conceptos
        let conceptos = {
          ConceptoImporteGravado: this.datos.ordenCompra.ordenes_compras_monto_total,
          ConceptoImporte: this.datos.ordenCompra.ordenes_compras_monto_total,
          ConceptoCodigo: 'COMPRA_IVA_21',
        }

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
          Conceptos: conceptos,
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

        this.loadingDatos = false
      },
    },
  };
</script>

<style></style>
