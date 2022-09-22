<template>
  <div>
    <modal-sin-cerrar
      ref="modal"
      titulo="Confirmación de cambio de estado"
      :impedir-close="impedirClose"
      :show-close="false"
    >
      <h3 style="text-align: center">¿Está seguro que desea cambiar el estado ?</h3>
      <h3 style="text-align: center">Al cambiar a "Ejecutado" no podrá volver a cambiar el estado</h3>

      <div style="display: flex; margin-top: 20px">
        <div style="margin: auto">
          <el-button
            type="danger"
            style="margin-right: 20px"
            @click="cancelar()"
          >
            Cancelar
          </el-button>

          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="actualizarEstado()"
            :loading="loadingBtnCambiarEstado"
          >
            Aceptar
          </el-button>
        </div>
      </div>
    </modal-sin-cerrar>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevoProducto";
export default {
  data() {
    return {
      row: null,
      estado: null,
      loadingBtnCambiarEstado: false,
    };
  },

  methods: {
    abrir(row, estado) {
      
      this.$refs.modal.abrir();
      this.row = null
      this.estado = null
      this.row = row
      this.estado = estado
      this.loadingBtnCambiarEstado = false


      // limpio los campos
      // this.getDatos();

    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    impedirClose(done) {
      console.log("entro aqui");
        if (this.impedirClose)
          return

        this.$confirm('¿Está seguro de que desea cerrar la ventana?')
          .then((_) => {
            done()
          })
          .catch(() => { })
      },

    cancelar(){
      this.$emit('obtener-datos')
      this.cerrar()
    },

    async actualizarEstado(){
      this.loadingBtnCambiarEstado = true

      console.log("this.row");
      console.log(this.row);
      console.log("this.estado");
      console.log(this.estado);

      let params = {
        id: this.row.transferencia.transferencia_id,
        estado: this.estado
      }

      console.log("params");
      console.log(params);


      await this.axios.post("/api/transferencia/actualizar", params)
        .then(response => {
          console.log("response");
          console.log(response);
          ElMessage({
            type: 'success',
            message: '¡Estado de la transferencia actualizada con éxito!',
          })
          this.$emit('obtener-datos')
          this.cerrar();

        })
      
      this.loadingBtnCambiarEstado = false


    },

    

    
  },
};
</script>

<style></style>
