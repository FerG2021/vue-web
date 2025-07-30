<script>
import moment from 'moment';

import Configuration from './borrador.configuration';
import ModalDetalle from "./modales/detalle.vue";
import ModalEditar from "./modales/editar.vue";

export default {
	name: 'BorradorPage',
	components: {
		ModalDetalle,
		ModalEditar
	},
	data() {
		return {
			Configuration,
			loading: false,
			borradorpresupuestaciones: [],
			tipoUsuario: null
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isEditButtonVisibleForUser() {
			return this.Configuration.allowedRolesForEditButton.includes(this.$store.state.user.tipo_usuario);
		}
	},
	mounted() {
		this.obtenerTipoUsuario();
		this.obtenerTodos();
	},
	methods: {
		obtenerTipoUsuario() {
			this.tipoUsuario = localStorage.getItem("tipoUsuario");
		},
		async obtenerTodos() {
			this.loading = true;
			await this.axios
				.get("/api/borradorpresupuestacion/obtenerTodos")
				.then((response) => {
					this.borradorpresupuestaciones = response.data;
				});
			this.loading = false;
		},
		async obtenerTodosArticulo() {
			this.loading = true;
			await this.axios
				.get(this.base_url + "/api/articulo/obtenerTodos")
				.then((response) => {
					this.articulos = response.data;
				});
			this.loading = false;
		},
		formatearFecha(fecha) {
			return moment(fecha).format('DD/MM/YYYY');
		}
	}
};
</script>

<template>
	<main class="main-container">
		<el-card class="card-container">
			<template #header>
				<h1>Borradores</h1>
			</template>

			<!-- Tabla para mostrar los datos -->
			<div
				v-if="isSectionVisibleForUser"
			>
				<div
					class="contenedor-tabla"
				>
					<el-table
						v-loading="loading"
						:data="borradorpresupuestaciones"
						stripe
					>
						<el-table-column
							prop="presupuestacion_id"
							label="Nro."
							width="70px"
							align="right"
						>
							<template #default="props">
								{{ props.row.borrador_presupuestacion_id }}
							</template>
						</el-table-column>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Fecha de creación"
							width="150px"
						>
							<template #default="props">
								{{
									formatearFecha(
										props.row.borrador_presupuestacion_fecha_creacion
									)
								}}
							</template>
						</el-table-column>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Plan"
						>
							<template #default="props">
								{{ props.row.borrador_presupuestacion_plan_nombre }}
							</template>
						</el-table-column>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Fecha incio"
							width="120px"
						>
							<template #default="props">
								{{
									formatearFecha(props.row.borrador_presupuestacion_fecha_incio)
								}}
							</template>
						</el-table-column>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Fecha fin"
							width="120px"
						>
							<template #default="props">
								{{
									formatearFecha(props.row.borrador_presupuestacion_fecha_fin)
								}}
							</template>
						</el-table-column>

						<el-table-column
							prop="borrador_presupuestado"
							label="Estado"
							width="130px"
						>
							<template #default="props">
								<span v-if="props.row.borrador_presupuestado == 0">
									<el-tag
										class="ml-2"
										type="warning"
									>Borrador</el-tag>
								</span>
								<span v-if="props.row.borrador_presupuestado == 1">
									<el-tag
										class="ml-2"
										type="success"
									>Presupuestado</el-tag>
								</span>
							</template>
						</el-table-column>

						<!-- Modificar -->
						<el-table-column
							label="Editar"
							prop="editar"
							header-align="right"
							align="right"
							width="90px"
						>
							<template #default="props">
								<el-button
									v-if="isEditButtonVisibleForUser"
									type="primary"
									circle
									:disabled="props.row.borrador_presupuestado == 1"
									@click="
										$refs.modalEditar.abrir(
											props.row.borrador_presupuestacion_id
										)
									"
								>
									<span class="material-icons">edit</span>
								</el-button>
							</template>
						</el-table-column>

						<!-- Ver datos -->
						<el-table-column
							label="Detalle"
							prop="detalle"
							header-align="right"
							align="right"
							width="90px"
						>
							<template #default="props">
								<el-button
									v-if="isSectionVisibleForUser"
									type="primary"
									circle
									@click="
										$refs.modalDetalle.abrir(
											props.row.borrador_presupuestacion_id
										)
									"
								>
									<span class="material-icons">visibility</span>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-card>
	</main>

	<modal-editar
		ref="modalEditar"
		@actualizarTabla="obtenerTodos"
	/>

	<modal-detalle ref="modalDetalle" />
</template>

<style>
.contenedor-tabla {
  overflow: hidden;
  position: relative;
  float: right;
  width: 99%;
}

.material-icons {
  font-size: 24px;
}
</style>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
	}
}

</style>
