<template>
  <div class="background-login">
    <el-card class="card-login">
      <template #header>
        <div style="font-size: 40px; text-align: center">
          Bienvenido a ModulAr
        </div>
      </template>
      <div class="contenedor-login">
        <div class="formulario">
          <div class="material-icons">account_circle</div>
          <span v-if="$store.state.auth">{{ $store.state.user.name }}</span>
          <div v-if="deshabilitarInputEmail == false">
          
            <el-card>
                <el-form
                  label-width="120px"
                  ref="form"
                  :model="form"
                  :rules="rules"
                  status-icon
                >
                  <!-- email -->
                  <el-form-item label="Email" prop="email" v-if="deshabilitarInputEmail == false">
                    <el-input
                      :disabled="deshabilitarInputEmail"
                      v-model="form.email"
                      placeholder="Ingrese su email..."
                    />
                  </el-form-item>

                  <!-- contrasena -->
                  <el-form-item label="Contraseña" prop="password" v-if="deshabilitarInputPassword == false">
                    <el-input
                      :disabled="deshabilitarInputPassword"
                      v-model="form.password"
                      placeholder="Ingrese su contraseña..."
                      type="password"
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
import { watch } from '@vue/runtime-core';
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
    
  
    // console.log("this.user");
    // console.log(this.user);

    // this.ejemplo = this.$route

    // console.log("this.$route"); 
    // console.log(this.$route); 

    // if (this.$route.query != {}) {
    //   // this.form.username = this.$route.query.user
    //   console.log("hay datos");
    //   console.log(this.$route.fullPath);   
    // } 

    "$route.query": {
      inmediate: true,
      handler(query){
        console.log("watch");
        console.log(query);  

        if (query.user) {
          this.loginDirecto(query.user, query.password)
        }
      }
    },

    "$route.query.password": {
      inmediate: true,
      handler(password){
        console.log(password);
      }
    }

  },

  created() {
    console.log("this.$route created");
    console.log(this.$route);
  },
  
  methods: {
    async login() {
      console.log("this.form");
      console.log(this.form);

      await this.$store.dispatch("login", this.form);
      console.log("hace algo");
      return this.$router.replace("/");
    },

    async loginDirecto(user, password){
      this.deshabilitarInputEmail = true
      this.deshabilitarInputPassword = true
      this.loadingProveedor = true
      console.log("user en logindirecto");
      console.log(user);

      console.log("password en logindirecto");
      console.log(password);

      this.form.email = user
      this.form.password = password

      console.log("this.form");
      console.log(this.form);

      await this.$store.dispatch("login", this.form);
      console.log("hace algo");
      return this.$router.replace("/");
      
    },

    me() {
      this.axios.get(this.base_url + "/user").then((res) => {
        console.log(res.data);
        this.user = res.data;
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
  width: 65%;
  height: 65%;
}

.contenedor-login {
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icons {
  width: 100%;
  text-align: center;
  font-size: 150px;
  display: block;
  color: var(--dark);
}

.formulario {
  width: 50%;
  height: 200px;
  text-align: center;
  display: block;
}

.btnEnviar {
  width: 100%;
  text-align: center;
}
</style>
