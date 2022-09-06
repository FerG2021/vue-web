<template>
  <div>
    <modal ref="modal" titulo="Generar orden de compra" :impedir-close="impedirClose">
      <h3 style="text-align: center">Seleccione el tipo de orden de compra que desea generar</h3>

      <div style="display: flex; margin-top: 20px">
        <div style="margin: auto">
          <el-button
            type="primary"
          >
            Orden de compra normal
          </el-button>

          <el-button
            type="primary"
          >
            Orden de compra adelantada
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
      // this.getDatos();
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
