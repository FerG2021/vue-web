<template>
  <div>
    <modal
      ref="modal"
      titulo="Notas de la comparativa"
      :impedir-close="impedirClose"
    >
      <span>Ingrese la nota deseada</span>
      <el-input 
        v-model="notas" 
        placeholder="Ingrese la nota deseada" 
        clearable 
        style="margin-bottom: 10px"
      />
      

      <div style="display: flex;">
        <div style="margin-left: auto">
          <el-button 
            type="primary"
            @click="guardarNota()"
            :disabled="notas == null"
          >
            Guardar nota
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
      item: null,
      notas: null
    };
  },

  methods: {
    abrir(item) {
      this.$refs.modal.abrir();
      this.item = null
      this.item = item

      this.notas = item.proveedor_notas

      console.log("item");
      console.log(this.item);
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    guardarNota(){
      console.log("guardar nota");
      console.log(this.notas);

      let fila = {
        notas: this.notas,
        item: this.item
      }
      // this.$emit("update:guardarNotas", this.notas, this.item)
      this.$emit("update:cantidadSacarDeposito", fila);
      this.cerrar()
    },

    
  },
};
</script>

<style></style>
