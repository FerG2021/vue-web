<script>
import { ElMessage } from "element-plus";

import ModalEliminar from "./modales/eliminar.vue";
import ModalModificar from "./modales/modificar.vue";
import ModalNuevo from "./modales/nuevo.vue";
import Configuration from './usuarios.configuration';
import i18n from './usuariosi18n';

export default {
	name: 'UsuariosPage',
	components: {
		ModalNuevo,
		ModalModificar,
		ModalEliminar
	},
	data() {
		return {
			Configuration,
			usuarios: [],
			usuariosSinProveedores: [],
			loading: false,
			roles: [
				{
					id: 1,
					nombre: "Administrador"
				},
				{
					id: 2,
					nombre: "Proveedor"
				},
				{
					id: 3,
					nombre: "Gerente General"
				},
				{
					id: 4,
					nombre: "Encargado de compras"
				},
				{
					id: 5,
					nombre: "Administrativo compras"
				},
				{
					id: 6,
					nombre: "Invitado"
				}
			]
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isNewButtonVisibleForUser() {
			return this.Configuration.allowedRolesInNewButton.includes(this.$store.state.user.tipo_usuario);
		},
		title() {
			return i18n.TITLE;
		},
		newLabel() {
			return i18n.NEW;
		}
	},
	mounted() {
		this.obtenerTodos();
	},
	methods: {
		async obtenerTodos() {
			this.usuariosSinProveedores = [];
			this.loading = true;
			await this.axios.get("/api/usuario/obtenerTodos").then((res) => {
				this.usuarios = res.data;
				this.usuarios.forEach((elemento) => {
					if (elemento.tipo_usuario != 2) {
						let fila = {
							id: elemento.id,
							email: elemento.email,
							name: elemento.name,
							tipo_usuario: elemento.tipo_usuario
						};
						this.roles.forEach((ele) => {
							if (ele.id == elemento.tipo_usuario) {
								fila.nombreUsuario = ele.nombre;
							}
						});
						this.usuariosSinProveedores.push(fila);
					}
				});
			});

			this.loading = false;
		},

		async generarUsuariosProveedores() {
			this.axios.post("api/usuario/crearUsuarioProveedor").then((response) => {
				ElMessage({
					type: "success",
					message: "¡Usuarios proveedores añadidos con éxito!"
				});
				this.obtenerTodos();
			});
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

			<div class="new-button-container">
				<el-button
					v-if="isNewButtonVisibleForUser"
					type="primary"
					class="btnElement"
					style="margin-left: 10px"
					@click="$refs.modalNuevo.abrir()"
				>
					{{ newLabel }}
				</el-button>
			</div>

			<div class="contenedor-tabla">
				<el-table
					v-loading="loading"
					:data="usuariosSinProveedores"
					fixed
				>
					<!-- Nombre -->
					<el-table-column
						label="Nombre"
						prop="nombre"
					>
						<template #default="props">
							<span>{{ props.row.name }}</span>
						</template>
					</el-table-column>

					<!-- Email -->
					<el-table-column
						label="Email"
						prop="email"
					>
						<template #default="props">
							<span>{{ props.row.email }}</span>
						</template>
					</el-table-column>

					<!-- Rol -->
					<el-table-column
						label="Rol"
						prop="rol"
					>
						<template #default="props">
							<span>{{ props.row.nombreUsuario }}</span>
						</template>
					</el-table-column>

					<!-- Editar -->
					<el-table-column
						label="Editar"
						prop="editar"
						header-align="right"
						align="right"
						width="90px"
					>
						<template #default="props">
							<el-button
								v-if="props.row.id != $store.state.user.id && $store.state.user.tipo_usuario == 1"
								type="primary"
								circle
								@click="$refs.modalModificar.abrir(props.row.id)"
							>
								<span class="material-icons">edit</span>
							</el-button>
						</template>
					</el-table-column>

					<!-- Eliminar -->
					<el-table-column
						label="Eliminar"
						prop="eliminar"
						header-align="right"
						align="right"
						width="90px"
					>
						<template #default="props">
							<el-button
								v-if="props.row.id != $store.state.user.id && $store.state.user.tipo_usuario == 1"
								type="danger"
								circle
								@click="$refs.modalEliminar.abrir(props.row.id)"
							>
								<span class="material-icons">delete</span>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
	</main>

	<modal-nuevo
		ref="modalNuevo"
		@actualizarTabla="obtenerTodos"
	/>

	<modal-modificar
		ref="modalModificar"
		@actualizarTabla="obtenerTodos"
	/>

	<modal-eliminar
		ref="modalEliminar"
		@actualizarTabla="obtenerTodos"
	/>
</template>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
		.new-button-container {
			display: flex;
			flex-direction: row-reverse;
			padding: 10px;
		}
	}
}
</style>
