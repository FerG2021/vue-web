<template>
  <div>
    <modal ref="modal" titulo="Productos de la orden de compra" :impedir-close="impedirClose">
      <div v-loading="loading">
        <el-table :data="datos" stripe style="width: 100%">
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              {{ props.row.ordenes_compras_productos_producto_nombre }}
            </template>
          </el-table-column>  

          <el-table-column prop="rubro" label="Rubro">
            <template #default="props">
              {{ props.row.ordenes_compras_productos_rubro_nombre }}
            </template>
          </el-table-column>    

          <el-table-column prop="rubro" label="Cantidad prov.">
            <template #default="props">
              {{ props.row.ordenes_compras_productos_cantidad_proveedor }}
            </template>
          </el-table-column>  

          <el-table-column prop="rubro" label="PU">
            <template #default="props">
              $ {{ new Intl.NumberFormat("de-DE").format(props.row.ordenes_compras_productos_precio_pu) }}
            </template>
          </el-table-column>  

          <el-table-column prop="rubro" label="PNG">
            <template #default="props">
              $ {{ new Intl.NumberFormat("de-DE").format(props.row.ordenes_compras_productos_precio_png) }}
            </template>
          </el-table-column>  

          
        </el-table>
      </div>
    </modal>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevoProducto";
export default {
  data() {
    return {
      id: null,
      loading: false,
      datos: null,
    };
  },

  methods: {
    abrir(id) {
      this.loading = true;
      this.id = null;
      this.id = id;
      this.datos = null;

      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/ordencompra/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          // console.log(respuestaApi);

          if (respuestaApi != null) {
            this.datos = respuestaApi.data;
            console.log("this.datos");
            console.log(this.datos);


            this.loading = false;
          } else {
            this.cerrar();
          }
        });
    },

    // async categoriaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/api/categoria/obtenerTodosSelectt")
    //     .then((response) => {
    //       this.categoriasSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // async unidadMedidaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/unidad-medida/obtenerTodosSelect")
    //     .then((response) => {
    //       this.unidadMedidaSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // cambiarValorIDUnMed() {
    //   this.form.idUnidadMedida = this.form.unidadMedida;
    // },

    // cambiarValorIDCategoria() {
    //   this.form.idCategoria = this.form.categoria;
    // },

    // onSubmit() {
    //   let params = {
    //     id: this.id,
    //     descripcion: this.form.nombre,
    //     precio: this.form.precio,
    //     stock: this.form.stock,
    //     idCategoria: this.form.idCategoria,
    //     idUnidadMedida: this.form.idUnidadMedida,
    //   };

    //   this.axios
    //     .put(this.base_url + "/articulo/actualizar/" + this.id, params)
    //     .then((response) => {
    //       ElMessage({
    //         type: "success",
    //         message: "¡Producto modificado con éxito!",
    //       });
    //       this.$emit("actualizarTabla");
    //       this.cerrar();
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    // deshabilitarBtnGuardar() {
    //   if (
    //     this.form.nombre == null ||
    //     this.form.nombre == "" ||
    //     this.form.precio == null ||
    //     this.form.precio == 0 ||
    //     this.form.precio == "" ||
    //     this.form.stock == null ||
    //     this.form.stock == 0 ||
    //     this.form.stock == ""
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
};
</script>

<style></style>
