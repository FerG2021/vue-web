<template>
  <div class="background-login">
    <el-card class="card-login">
      <template #header>
        <div style="font-size: 5vh; text-align: center">
          <!-- Proyecto prueba -->
          Bienvenido a ModulAr
          <!-- Proyecto prueba -->
          <!-- Nutrimarg balanceados - Quimilí -->
        </div>
      </template>
      <div class="contenedor-login" v-loading="loadingLogin">
        <div class="formulario">
          <div class="material-icons">account_circle</div>
          <!-- <span v-if="$store.state.auth">{{ $store.state.user.name }}</span> -->
          <div v-if="deshabilitarInputEmail == false">
            <el-card class="card-form">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                status-icon
                label-position="top"
              >
                <!-- email -->
                <el-form-item
                  label="Email"
                  prop="email"
                  v-if="deshabilitarInputEmail == false"
                >
                  <el-input
                    :disabled="deshabilitarInputEmail"
                    v-model="form.email"
                    placeholder="Ingrese su email..."
                    @keyup.enter="login()"
                  />
                </el-form-item>

                <!-- contrasena -->
                <el-form-item
                  label="Contraseña"
                  prop="password"
                  v-if="deshabilitarInputPassword == false"
                >
                  <el-input
                    :disabled="deshabilitarInputPassword"
                    v-model="form.password"
                    placeholder="Ingrese su contraseña..."
                    type="password"
                    @keyup.enter="login()"
                  />
                </el-form-item>

                <el-form-item v-if="deshabilitarInputPassword == false">
                  <el-button
                    class="btnEnviar"
                    type="primary"
                    @click="login()"
                    :disabled="deshabilitarBtnIngresar()"
                  >
                    Ingresar
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <div v-else>
            <div v-loading="loadingProveedor"></div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      user: {},
      ejemplo: null,
      form: {
        email: "",
        password: "",
      },
      emailDirecto: null,
      passwordDirecto: null,
      deshabilitarInputEmail: false,
      deshabilitarInputPassword: false,
      loadingProveedor: false,
      loadingLogin: false,
      rules: {
        email: [
          {
            required: true,
            message: "Por favor ingrese su mail.",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "Por favor ingrese su contraseña.",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    "$route.query": {
      inmediate: true,
      handler(query) {

        if (query.user) {
          this.loginDirecto(
            query.user,
            query.password,
            query.proveedorID,
            query.presupuestacionID,
            query.fechaLimiteCarga
          );
        }
      },
    },

    "$route.query.password": {
      inmediate: true,
      handler(password) {
        console.log(password);
      },
    },
  },

  methods: {
    async login() {
      if (this.form.email == null ||
          this.form.email == "" ||
          this.form.password == null ||
          this.form.password == ""
      ) {
        ElMessage({
          type: "error",
          message: "¡Se deben completar todos los campos!",
        });
      } else {
        this.loadingLogin = true;
        console.log("this.form");
        console.log(this.form);
        // this.me()
        let params = {
          mail_usuario: this.form.email,
        };
        await this.axios
          .post("/api/usuario/obtenerDatosMail", params)
          .then((response) => {
            console.log("response");
            console.log(response);
            if (response) {
              // if (response.data.data != undefined) {
              if (response.data != undefined) {

                console.log("response");
                console.log(response);
                // console.log(response.data.data);
                if (response.data.data) {
                  localStorage.setItem("usuarioID", response.data.data.id);
                  localStorage.setItem(
                    "tipoUsuario",
                    response.data.data.tipo_usuario
                  );
                }
              } else {
                console.log("usuario o contraseña incorrecta");
                ElMessage({
                  type: "error",
                  message: "¡Usuario o contraseña incorrecta!",
                });
                this.loadingLogin = false;
              }
            }
          });

        // this.loadingLogin = false
        console.log("antes del login");
        await this.$store.dispatch("login", this.form);
        console.log("hace algo");
        this.loadingLogin = false;

        return this.$router.replace("/");
      }
    },

    async loginDirecto(
      user,
      password,
      proveedorID,
      presupuestacionID,
      fechaLimiteCarga
    ) {
      this.deshabilitarInputEmail = true;
      this.deshabilitarInputPassword = true;
      this.loadingProveedor = true;
      console.log("user en logindirecto");
      console.log(user);

      console.log("password en logindirecto");
      console.log(password);

      console.log("proveedorID en login directo");
      console.log(proveedorID);

      console.log("presupuestacionID en login directo");
      console.log(presupuestacionID);

      localStorage.setItem("proveedorID", proveedorID);
      localStorage.setItem("presupuestacionID", presupuestacionID);
      localStorage.setItem("fechaLimiteCarga", fechaLimiteCarga);

      this.form.email = user;
      this.form.password = password;

      this.$store.state.proveedorID = proveedorID;
      this.$store.state.presupuestacionID = presupuestacionID;

      console.log("this.form");
      console.log(this.form);

      let params = {
        mail_usuario: this.form.email,
        proveedor_id: proveedorID,
      };

      await this.$store.dispatch("login", this.form);
      console.log("hace algo");

      await this.axios
        .post("/api/usuario/obtenerDatosMail", params)
        .then((response) => {
          if (response) {
            console.log("response DATOSMAIL");
            console.log(response.data.data);
            if (response.data.data) {
              localStorage.setItem("usuarioID", response.data.data.id);
              localStorage.setItem(
                "tipoUsuario",
                response.data.data.tipo_usuario
              );
            }
          }
        });

      return this.$router.replace("/cargaproveedores");
    },

    async me() {
      console.log("entra me");
      await this.axios.get("/api/user").then((res) => {
        console.log(res.data);
        // this.user = res.data;
      });
    },

    deshabilitarBtnIngresar() {
      if (
        this.form.email == null ||
        this.form.email == "" ||
        this.form.password == null ||
        this.form.password == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.background-login {
  height: 100vh;
  background-color: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-login {
  width: 65vh;
}

.contenedor-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.material-icons {
  font-size: 18vh;
  color: var(--dark);
}

.card-form {
  height: 100%;
}



.formulario {
  width: 90vh;
  height: 100%;
  text-align: center;
  display: block;
}

.btnEnviar {
  width: 100%;
  text-align: center;
}
</style>
