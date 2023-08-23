<template>
  <div>
    <modal ref="modal" titulo="Eliminar producto" :impedir-close="impedirClose">
      <div class="container">
        <h3 class="legend">
          ¿Desea eliminar el producto de la presupuestación y la comparativa? <br>
          Esta acción no se puede deshacer
        </h3>
        <div class="actions-btn-container">
          <div class="actions-btn">
            <el-button type="danger" @click="cerrar()" class="btn-close"> Cancelar </el-button>
            <el-button type="primary" @click="deleteProduct()" :loading="loadingBtnConfirmDelete" class="btn-confirm"> Confirmar </el-button>
          </div>
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
      product: null,
      loadingBtnConfirmDelete: false,
    };
  },

  methods: {
    abrir(scope) {
      this.product = scope.row;
      this.$refs.modal.abrir();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async deleteProduct() {
      this.loadingBtnConfirmDelete = true;

      let params = {
        producto_id: this.product.productoPresupuestacion.producto_id,
        presupuestacion_id: this.product.productoPresupuestacion.presupuestacion_id,
      };

      await this.axios
        .post("/api/presupuestacion/deleteProduct", params)
        .then((response) => {
          if (response.status === 200) {
            ElMessage({
              type: "success",
              message: "¡Producto eliminado con éxito!",
            });
            this.loadingBtnConfirmDelete = false;
            this.$emit("actualizarTabla");
            this.cerrar();
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  .legend {
    text-align: center;
  }
  .actions-btn-container {
    display: flex;
    margin-top: 10px;
    .actions-btn {
      margin: auto;
    }
  }
}
</style>