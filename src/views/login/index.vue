<script>
import { ElMessage } from "element-plus";

import i18n from './logini18n';

export default {
	name: "IndexLogin",
	data() {
		return {
			user: {},
			ejemplo: null,
			form: {
				email: "",
				password: ""
			},
			emailDirecto: null,
			passwordDirecto: null,
			deshabilitarInputEmail: false,
			deshabilitarInputPassword: false,
			loadingProveedor: false,
			loadingLogin: false,
			rules: {
				email: [{
					required: true,
					message: i18n.REQUIRED_MAIL,
					trigger: "change"
				}],
				password: [{
					required: true,
					message: i18n.REQUIRED_PASSWORD,
					trigger: "change"
				}]
			}
		};
	},
	computed: {
		greetingLabel() {
			return i18n.GREETING;
		},
		formFieldsIsEmpty() {
			return this.form.email == null ||
				this.form.email == "" ||
				this.form.password == null ||
				this.form.password == "";
		}
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
			}
		},

		"$route.query.password": {
			inmediate: true,
			handler(password) {
				console.log(password);
			}
		}
	},

	methods: {
		async login() {
			if (this.formFieldsIsEmpty) {
				ElMessage({
					type: "error",
					message: i18n.ALL_FIELDS_REQUIRED
				});
			} else {
				this.loadingLogin = true;
				let params = { mail_usuario: this.form.email };
				await this.axios
					.post("/api/usuario/obtenerDatosMail", params)
					.then((response) => {
						if (response) {
							if (response.data != undefined) {
								if (response.data.data) {
									localStorage.setItem(
										"usuarioID",
										response.data.data.id
									);
									localStorage.setItem(
										"tipoUsuario",
										response.data.data.tipo_usuario
									);
								}
							} else {
								console.log("usuario o contraseña incorrecta");
								ElMessage({
									type: "error",
									message: i18n.INCORRECT_CREDENTIALS
								});
								this.loadingLogin = false;
							}
						}
					});

				await this.$store.dispatch("login", this.form);
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

			localStorage.setItem("proveedorID", proveedorID);
			localStorage.setItem("presupuestacionID", presupuestacionID);
			localStorage.setItem("fechaLimiteCarga", fechaLimiteCarga);

			this.form.email = user;
			this.form.password = password;

			this.$store.state.proveedorID = proveedorID;
			this.$store.state.presupuestacionID = presupuestacionID;

			let params = {
				mail_usuario: this.form.email,
				proveedor_id: proveedorID
			};

			await this.$store.dispatch("login", this.form);

			await this.axios
				.post("/api/usuario/obtenerDatosMail", params)
				.then((response) => {
					if (response) {
						if (response.data.data) {
							localStorage.setItem(
								"usuarioID",
								response.data.data.id
							);
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
			await this.axios.get("/api/user").then((res) => {
				console.log(res.data);
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
		}
	}
};
</script>

<template>
	<div class="background-login">
		<el-card class="card-login">
			<template #header>
				<div style="font-size: 5vh; text-align: center">
					{{ greetingLabel }}
				</div>
			</template>
			<div
				v-loading="loadingLogin"
				class="contenedor-login"
			>
				<div class="formulario">
					<div class="material-icons">
						account_circle
					</div>
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
									v-if="deshabilitarInputEmail == false"
									label="Email"
									prop="email"
								>
									<el-input
										v-model="form.email"
										:disabled="deshabilitarInputEmail"
										placeholder="Ingrese su email..."
										@keyup.enter="login()"
									/>
								</el-form-item>

								<!-- contrasena -->
								<el-form-item
									v-if="deshabilitarInputPassword == false"
									label="Contraseña"
									prop="password"
								>
									<el-input
										v-model="form.password"
										:disabled="deshabilitarInputPassword"
										placeholder="Ingrese su contraseña..."
										type="password"
										@keyup.enter="login()"
									/>
								</el-form-item>

								<el-form-item
									v-if="deshabilitarInputPassword == false"
								>
									<el-button
										class="btnEnviar"
										type="primary"
										:disabled="deshabilitarBtnIngresar()"
										@click="login()"
									>
										Ingresar
									</el-button>
								</el-form-item>
							</el-form>
						</el-card>
					</div>
					<div v-else>
						<div v-loading="loadingProveedor" />
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

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
