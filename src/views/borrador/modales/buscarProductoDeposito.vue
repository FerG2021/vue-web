<template>
  <div>
    <modal
      ref="modal"
      titulo="Buscar producto en depósito"
      :impedir-close="impedirClose"
    >
      <div>
        <!-- <h3>Buscar producto en depósito</h3> -->

        <!-- Tabla para mostrar por deposito -->
        <el-table :data="datosDeposito" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="date" label="Depósito" >
            <template #default="props">
              <span><b>{{ props.row.deposito.deposito_nombre }}</b></span>
            </template>
          </el-table-column>

          <el-table-column prop="date" label="Producto" >
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="date" label="Estado" >
            <template #default="props">
              <span v-if="props.row.producto_activo == 1">
                <el-tag class="ml-2" type="success">Activo</el-tag>
              </span>
              <span v-else>
                <el-tag class="ml-2" type="danger">Inactivo</el-tag>
              </span>
            </template>
          </el-table-column> -->

          <el-table-column prop="date" label="Stock" >
            <template #default="props">
              <span>{{ props.row.producto_stock }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadAUtilizar" label="Cant. a utilizar">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.cantidadAUtilizar" 
                :max="scope.row.producto_stock"
                :controls="false" 
                align="center" 
                text-align="center"
                style="width: 100%"
                @change="sumardatosSacarDeposito(scope.row.cantidadAUtilizar, scope.row)"
              />
              
            </template>
          </el-table-column>
          
        </el-table>

        <!-- {{cantidadTotalDeposito}} -->

        <el-row :gutter="10" style="margin-top: 15px">
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="2"></el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              style="width: 100%"
              @click="enviarCantidadAUtilizarDeposito()"
            >
              Agregar
            </el-button>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>

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
      indice: null,
      datosDeposito: [],
      loading: false,
      cantidadTotalDeposito: 0,
      datosSacarDeposito: null,
      arrayCantidadesDeposito: [],
      yaSumado: 0
    };
  },

  methods: {
    abrir(scope, arrayCantidadesDepositoRecibido) {
      this.$refs.modal.abrir();
      this.id = scope.row.producto_id;
      this.indice = scope.$index
      this.datosDeposito = []
      this.cantidadTotalDeposito = 0
      this.datosSacarDeposito = null
      this.yaSumado = 0
      console.log(scope);
      console.log("id: " + scope.row.producto_id);
      console.log("indice: " + scope.$index);

      this.arrayCantidadesDeposito = []
      this.arrayCantidadesDeposito = arrayCantidadesDepositoRecibido
      console.log("arrayCantidadesDepositoRecibido");
      console.log(arrayCantidadesDepositoRecibido);

      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos(){
      this.loading = true
      await this.axios.get("/api/depositoArticulo/obtenerDatos/" + this.id)
        .then(response =>{
          this.datosDeposito = response.data;   
          console.log("this.datosDeposito"); 
          console.log(this.datosDeposito);

          console.log("this.arrayCantidadesDeposito en getDatos");
          console.log(this.arrayCantidadesDeposito);


          // recorro el array de cantidades del deposito y datos del deposito para mostrar el input con datos
          this.arrayCantidadesDeposito.forEach((elemento) => {
            this.datosDeposito.forEach((ele) => {
              if (elemento.deposito_id == ele.deposito_id &&
                  elemento.producto_id == ele.producto_id &&
                  elemento.deposito_producto_id == ele.deposito_producto_id                  
              ) {
                ele.cantidadAUtilizar = elemento.cantidad_utilizar
              }
            })
          })    
        })    
      this.loading = false
    },

    sumardatosSacarDeposito(cantidadSacada, row){
      this.yaSumado = 1
      console.log("row");
      console.log(row);

      console.log("this.arrayCantidadesDeposito");
      console.log(this.arrayCantidadesDeposito);
      
      // recorro el array de las cantidades de desposito para saber si esa cantidad ya fue agregada, en el caso de que ya haya sido agregada se modifica, sino se agrega
      let b = 0

      // primero pregunto si el array tiene algun elemento, en el caso de no tener agrego un elemento
      if (this.arrayCantidadesDeposito.length > 0) {
        this.arrayCantidadesDeposito.forEach((elemento) => {
          console.log("entra PRIMERO");
          if (elemento.deposito_id == row.deposito_id && elemento.producto_id == row.producto_id) {
            b = 1
            elemento.producto_stock = row.producto_stock
            elemento.cantidad_utilizar = cantidadSacada
          }
        })
      } else {
        b = 1
        console.log("entra SEGUNDO");

        let fila = {
          deposito_id: row.deposito_id,
          deposito_producto_id: row.deposito_producto_id,
          producto_activo: row.producto_activo,
          producto_id: row.producto_id,
          producto_nombre: row.producto_nombre,
          producto_stock: row.producto_stock,
          producto_unidad: row.producto_unidad,
          rubro_id: row.rubro_id,
          cantidad_utilizar: cantidadSacada,
        }
        this.arrayCantidadesDeposito.push(fila)
      }

      if (b == 0) {
          console.log("entra TERCERO");

        let fila = {
          deposito_id: row.deposito_id,
          deposito_producto_id: row.deposito_producto_id,
          producto_activo: row.producto_activo,
          producto_id: row.producto_id,
          producto_nombre: row.producto_nombre,
          producto_stock: row.producto_stock,
          producto_unidad: row.producto_unidad,
          rubro_id: row.rubro_id,
          cantidad_utilizar: cantidadSacada,
        }
        this.arrayCantidadesDeposito.push(fila)
      }

      // this.cantidadTotalDeposito = this.cantidadTotalDeposito + cantidadSacada

      console.log("this.arrayCantidadesDepositoAgregado");
      console.log(this.arrayCantidadesDeposito);

      console.log("this.cantidadTotalDeposito");
      console.log(this.cantidadTotalDeposito);
    },

    enviarCantidadAUtilizarDeposito(){
      // if (this.yaSumado == 1) {
      //   this.datosSacarDeposito = {
      //     indice: this.indice,
      //     cantidadUsar: this.cantidadTotalDeposito
      //   }
      // } else {
        this.arrayCantidadesDeposito.forEach((elemento) => {
          if (elemento.producto_id == this.id) {
            this.cantidadTotalDeposito  = parseFloat(this.cantidadTotalDeposito) + parseFloat(elemento.cantidad_utilizar)
          }
        })

        this.datosSacarDeposito = {
          indice: this.indice,
          cantidadUsar: this.cantidadTotalDeposito
        }
      // }
      this.$emit("update:cantidadSacarDeposito", this.datosSacarDeposito);
      this.cerrar()
    }
  },
};
</script>

<style></style>
