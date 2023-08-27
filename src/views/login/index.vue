<template>
  <div class="background-login">
    <el-card class="card-login">
      <template #header>
        <div class="title">
          Bienvenido a ModulAr
        </div>
      </template>
      <div class="contenedor-login" v-loading="loadingLogin">
        <div class="form">
          <div class="material-icons">account_circle</div>
          <div v-if="disabledInputEmail == false">
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
                  v-if="disabledInputEmail == false"
                >
                  <el-input
                    :disabled="disabledInputEmail"
                    v-model="form.email"
                    placeholder="Ingrese su email..."
                    @keyup.enter="login()"
                  />
                </el-form-item>

                <!-- contrasena -->
                <el-form-item
                  label="Contraseña"
                  prop="password"
                  v-if="disabledInputPassword == false"
                >
                  <el-input
                    :disabled="disabledInputPassword"
                    v-model="form.password"
                    placeholder="Ingrese su contraseña..."
                    type="password"
                    @keyup.enter="login()"
                  />
                </el-form-item>

                <el-form-item v-if="disabledInputPassword == false">
                  <el-button
                    class="btnSubmit"
                    type="primary"
                    @click="login()"
                    :disabled="disabledBtnLogin()"
                  >
                    Ingresar
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <div v-else>
            <div v-loading="loadingProvider"></div>
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
      form: {
        email: "",
        password: "",
      },
      disabledInputEmail: false,
      disabledInputPassword: false,
      loadingProvider: false,
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
          this.directLogin(
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
      let errorExist = 0;

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
        let params = {
          mail_usuario: this.form.email,
        };
        await this.axios
          .post("/api/usuario/obtenerDatosMail", params)
          .then((response) => {
            if (response) {
              if (response.data != undefined) {
                if (response.data.data) {
                  localStorage.setItem("usuarioID", response.data.data.id);
                  localStorage.setItem(
                    "tipoUsuario",
                    response.data.data.tipo_usuario
                  );
                }
              } else {
                ElMessage({
                  type: "error",
                  message: "¡Usuario o contraseña incorrecta!",
                });
                this.loadingLogin = false;
              }
            }
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });

        await this.axios.get("/sanctum/csrf-cookie");
        await this.axios
          .post("/login", this.form)
          .then((res) => {
            this.$store.dispatch("getUser");
          })
          .catch(function (error) {
            errorExist = 1;
          });

        this.loadingLogin = false;

        if (errorExist == 1) {
          ElMessage({
            message:
              "Usuario o contraseña incorrectos",
            type: "error",
          });
        }

        return this.$router.replace("/");
      }
    },

    async directLogin(
      user,
      password,
      proveedorID,
      presupuestacionID,
      fechaLimiteCarga
    ) {
      this.disabledInputEmail = true;
      this.disabledInputPassword = true;
      this.loadingProvider = true;

      localStorage.setItem("proveedorID", proveedorID);
      localStorage.setItem("presupuestacionID", presupuestacionID);
      localStorage.setItem("fechaLimiteCarga", fechaLimiteCarga);

      this.form.email = user;
      this.form.password = password;

      this.$store.state.proveedorID = proveedorID;
      this.$store.state.presupuestacionID = presupuestacionID;

      let params = {
        mail_usuario: this.form.email,
        proveedor_id: proveedorID,
      };

      await this.$store.dispatch("login", this.form);

      await this.axios
        .post("/api/usuario/obtenerDatosMail", params)
        .then((response) => {
          if (response) {
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

    disabledBtnLogin() {
      if (
        this.form.email === null ||
        this.form.email === "" ||
        this.form.password === null ||
        this.form.password === ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.background-login {
  height: 100vh;
  background-color: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
  .card-login {
    width: 65vh;
    .title {
      font-size: 5vh; 
      text-align: center;
    }
    .contenedor-login {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .form {
        width: 90vh;
        height: 100%;
        text-align: center;
        display: block;
        .material-icons {
          font-size: 18vh;
          color: var(--dark);
        }
        .card-form {
          height: 100%;
        }
        .btnSubmit {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
