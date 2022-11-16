<template>
  <div>
    <modal ref="modal" titulo="Nuevo usuario" :impedir-close="impedirClose">
      <el-form
        label-width="200px"
        ref="form"
        :model="form"
        :rules="rules"
        status-icon
      >
        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input
            v-model="form.nombre"
            placeholder="Ingrese su nombre y apellido"
          ></el-input>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            placeholder="Ingrese su mail"
          ></el-input>
        </el-form-item>

        <!-- Contraseña -->
        <el-form-item label="Contraseña" prop="contrasena">
          <el-input
            v-model="form.contrasena"
            type="password"
            placeholder="Ingrese la contraseña (mínimo 8 caracteres)"
          ></el-input>
        </el-form-item>

        <!-- Repetir contraseña -->
        <el-form-item label="Confirmar contraseña" prop="repetirContrasena">
          <el-input
            v-model="form.repetirContrasena"
            type="password"
            placeholder="Confirme la contraseña ingresada (mínimo 8 caracteres)"
          ></el-input>
        </el-form-item>

        <el-form-item label="Rol" prop="rol">
          <el-select
            v-model="form.rol"
            placeholder="Seleccione el rol del usuario"
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.nombre"
              :value="item.id"
            />
          </el-select>
          <!-- {{ form.rol }} -->
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button
          type="primary"
          @click="onSubmit()"
          :disabled="deshabilitarBtnGuardar()"
        >
          Guardar
        </el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevoProducto";
export default {
  data() {
    return {
      form: {
        nombre: null,
        email: null,
        contrasena: null,
        repetirContrasena: null,
        rol: null,
      },

      roles: [
        {
          id: 1,
          nombre: "Administrador",
        },
        {
          id: 2,
          nombre: "Proveedor",
        },
        {
          id: 3,
          nombre: "Gerente General",
        },
        {
          id: 4,
          nombre: "Encargado de compras",
        },
        {
          id: 5,
          nombre: "Administrativo compras",
        },
        {
          id: 6,
          nombre: "Invitado",
        },
      ],

      rules: {
        nombre: [
          {
            required: true,
            message: "Por favor ingrese un nombre.",
            trigger: "change",
          },
        ],

        email: [
          {
            required: true,
            message: "Por favor ingrese un email.",
            trigger: "change",
          },
        ],

        contrasena: [
          {
            required: true,
            message: "Por favor ingrese una contraseña.",
            trigger: "change",
          },
        ],

        repetirContrasena: [
          {
            required: true,
            message: "Por favor repita la contraseña.",
            trigger: "change",
          },
        ],

        rol: [
          {
            required: true,
            message: "Por favor seleccione el rol del usuario.",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    abrir() {
      this.form.nombre = null;
      this.form.email = null;
      this.form.contrasena = null;
      this.form.repetirContrasena = null;
      this.form.rol = null;
      if (this.$refs.form) this.$refs.form.resetFields();
      this.$refs.modal.abrir();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    onSubmit() {
      let params = {
        nombre: this.form.nombre,
        email: this.form.email,
        contrasena: this.form.contrasena,
        repetirContrasena: this.form.repetirContrasena,
        tipoUsuario: this.form.rol,
      };

      this.axios.post("api/usuario/crear", params).then((response) => {
        if (response.data.code == 400) {
          let erroresMostrar = "// ";
          let erorres = Object.values(response.data.data);

          erorres.forEach((elemento) => {
            erroresMostrar = erroresMostrar + " " + elemento + " //";
          });

          ElMessage({
            type: "error",
            grouping: true,
            message: erroresMostrar,
            duration: 5000,
          });
        } else {
          ElMessage({
            type: "success",
            message: "¡Usuario añadido con éxito!",
          });
          this.$emit("actualizarTabla");
          this.cerrar();
        }

        // ElMessage({
        //     type: 'success',
        //     message: '¡Usuario añadido con éxito!',
        // })
        // this.$emit('actualizarTabla')
        // this.cerrar()
      });
    },

    deshabilitarBtnGuardar() {
      if (
        this.form.nombre == null ||
        this.form.nombre == "" ||
        this.form.email == null ||
        this.form.email == "" ||
        this.form.nombre == null ||
        this.form.nombre == "" ||
        this.form.contrasena == null ||
        this.form.contrasena == "" ||
        this.form.repetirContrasena == null ||
        this.form.repetirContrasena == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style></style>
