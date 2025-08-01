<script>
import { ElMessage } from "element-plus";

import Configuration from './micuenta.configuration';
import i18n from './micuentai18n';

export default {
	name: 'MiCuentaPage',
	emits: ['actualizarTabla'],
	data() {
		return {
			Configuration,
			id: null,
			form: {
				nombre: null,
				email: null,
				contrasena: null,
				repetirContrasena: null,
				rol: null
			},
			rolBD: null,
			habilitarEdicion: false,
			rules: {
				nombre: [{
					required: true,
					message: i18n.MANDATORY_NAME,
					trigger: "change"
				}],
				email: [{
					required: true,
					message: i18n.MANDATORY_MAIL,
					trigger: "change"
				}],
				contrasena: [{
					required: true,
					message: i18n.MANDATORY_PASSWORD,
					trigger: "change"
				}],
				repetirContrasena: [{
					required: true,
					message: i18n.MANDATORY_REPEAT_PASSWORD,
					trigger: "change"
				}]
			}
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		deshabilitarBtnGuardarDatos() {
			return this.form.nombre == null ||
			this.form.nombre == "" ||
			this.form.email == null ||
			this.form.email == "" ||
			this.habilitarEdicion == false;
		},
		title() {
			return i18n.TITLE;
		},
		important() {
			return i18n.IMPORTANT;
		},
		importantDescription() {
			return i18n.IMPORTANT_DESCRIPTION;
		},
		enabledEditionLabel() {
			return i18n.ENABLED_EDITION;
		},
		nameLabel() {
			return i18n.NAME;
		},
		emailLabel() {
			return i18n.EMAIL;
		},
		passwordLabel() {
			return i18n.PASSWORD;
		},
		repeatPasswordLabel() {
			return i18n.REPEAT_PASSWORD;
		},
		roleLabel() {
			return i18n.ROLE;
		},
		assignedRoleLabel() {
			return i18n.ASSIGNED_ROLE;
		},
		selectedRoleLabel() {
			return i18n.SELECTED_ROLE;
		},
		saveDataLabel() {
			return i18n.SAVE_DATA;
		}
	},
	created() {
		this.getDatosMiCuenta();
	},
	methods: {
		getDatosMiCuenta() {
			this.id = this.$store.state.user.id;
			this.form.nombre = this.$store.state.user.name;
			this.form.email = this.$store.state.user.email;

			this.Configuration.roles.forEach((elemento) => {
				if (elemento.id == this.$store.state.user.tipo_usuario) {
					this.rolBD = elemento.nombre;
				}
			});
		},
		habilitarEdicionNombre() {
			if (this.habilitarEdicion == false) {
				return true;
			} else {
				return false;
			}
		},
		habilitarEdicionEmail() {
			if (this.habilitarEdicion == false) {
				return true;
			} else {
				return false;
			}
		},
		habilitarEdicionContrasena() {
			if (this.habilitarEdicion == false) {
				return true;
			} else {
				return false;
			}
		},
		habilitarEdicionRepetirContrasena() {
			if (this.habilitarEdicion == false) {
				return true;
			} else {
				return false;
			}
		},
		async onSubmit() {
			let params = {
				id: this.id,
				nombre: this.form.nombre,
				email: this.form.email,
				tipoUsuario: this.form.rol
			};

			if (this.form.contrasena != null) {
				params.contrasena = this.form.contrasena;
			} else {
				params.contrasena = null;
			}

			if (this.form.repetirContrasena != null) {
				params.repetirContrasena = this.form.repetirContrasena;
			} else {
				params.repetirContrasena = null;
			}

			const respuestaApi = await this.axios.put(
				"/api/usuario/actualizar/" + this.id,
				params
			);

			if (respuestaApi.data.code == 200) {
				ElMessage({
					type: "success",
					message: i18n.UPDATE_DATA_SUCCESS
				});
				this.$emit("actualizarTabla");
				this.logout();
			} else {
				if (respuestaApi.data.code == 400) {
					let erroresMostrar = "// ";
					let erorres = Object.values(respuestaApi.data.data);

					erorres.forEach((elemento) => {
						erroresMostrar = erroresMostrar + " " + elemento + " //";
					});

					ElMessage({
						type: "error",
						grouping: true,
						message: erroresMostrar,
						duration: 5000
					});
				}
			}
		},

		async logout() {
			await this.$store.dispatch("logout");

			return this.$router.replace("/login");
		}
	}
};
</script>

<template>
	<main class="main-container">
		<el-card class="card-container">
			<template #header>
				<h1>{{ title }}</h1>
			</template>

			<div v-if="isSectionVisibleForUser">
				<div
					class="warning-container"
				>
					<span
						class="warning-label-container"
					>
						{{ enabledEditionLabel }}
					</span>
					<el-switch v-model="habilitarEdicion" />
					<div v-if="habilitarEdicion == true">
						<el-alert
							:title="important"
							:description="importantDescription"
							type="warning"
							show-icon
						/>
					</div>
				</div>
				<el-form
					ref="form"
					label-width="150px"
					:model="form"
					:rules="rules"
					status-icon
					class="form"
				>
					<el-form-item
						:label="nameLabel"
						prop="nombre"
					>
						<el-input
							v-model="form.nombre"
							:disabled="habilitarEdicionNombre()"
						/>
					</el-form-item>

					<el-form-item
						:label="emailLabel"
						prop="email"
					>
						<el-input
							v-model="form.email"
							:disabled="habilitarEdicionEmail()"
						/>
					</el-form-item>

					<el-form-item
						:label="passwordLabel"
						prop="contrasena"
					>
						<el-input
							v-model="form.contrasena"
							:disabled="habilitarEdicionContrasena()"
							type="password"
						/>
					</el-form-item>

					<el-form-item
						:label="repeatPasswordLabel"
						prop="repetirContrasena"
					>
						<el-input
							v-model="form.repetirContrasena"
							:disabled="habilitarEdicionRepetirContrasena()"
							type="password"
						/>
					</el-form-item>

					<el-form-item
						:label="assignedRoleLabel"
						prop="rolAsignado"
					>
						<el-input
							v-model="rolBD"
							disabled
						/>
					</el-form-item>

					<el-form-item
						:label="roleLabel"
						prop="rol"
					>
						<el-select
							v-model="form.rol"
							:placeholder="selectedRoleLabel"
							style="width: 100%"
							:disabled="habilitarEdicionRepetirContrasena()"
						>
							<el-option
								v-for="item in Configuration.roles"
								:key="item.id"
								:label="item.nombre"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button
							class="btnEnviar"
							type="primary"
							:disabled="deshabilitarBtnGuardarDatos"
							@click="onSubmit()"
						>
							{{ saveDataLabel }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</main>
</template>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
		.warning-container {
			margin-bottom: 20px;
			.warning-label-container {
				margin-right: 10px;
			}
		}
		.contenedor-tabla {
			height: 100%;
		}
	}
}
</style>
