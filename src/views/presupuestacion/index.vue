<script>
import moment from 'moment';

import ModalCarga from "./modales/carga.vue";
import ModalComparativa from "./modales/comparativa.vue";
import ModalDetalle from "./modales/detalle.vue";
import ModalNuevo from "./modales/nuevo.vue";
import Configuration from './presupuestacion.configuration';
import i18n from './presupuestacioni18n';

export default {
	name: 'PresupuestacionPage',
	components: {
		ModalNuevo,
		ModalDetalle,
		ModalCarga,
		ModalComparativa
	},
	data() {
		return {
			Configuration,
			loading: false,
			presupuestaciones: [],
			tipoUsuario: null
		};
	},
	computed: {
		titleSectionLabel() {
			return i18n.PROVISIONS;
		},
		newButtonLabel() {
			return i18n.NEW;
		},
		notAllowedLabel() {
			return i18n.NOT_ALLOWED;
		},
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isNewButtonVisibleForUser() {
			return this.Configuration.allowedRolesInNewButton.includes(this.$store.state.user.tipo_usuario);
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
				.get("/api/presupuestacion/obtenerTodos")
				.then((response) => {
					this.presupuestaciones = response.data;
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
		},
		formatearFechaSinDia(fecha) {
			return moment(fecha).format('MM/YYYY');
		}
	}
};
</script>

<template>
	<main class="main-container">
		<el-card class="card-container">
			<template #header>
				<h1> {{ titleSectionLabel }} </h1>
			</template>
			<div
				v-if="isSectionVisibleForUser"
			>
				<el-button
					v-if="isNewButtonVisibleForUser"
					type="primary"
					class="btnElement"
					style="margin-left: 10px"
					@click="$refs.modalNuevo.abrir()"
				>
					{{ newButtonLabel }}
				</el-button>

				<!-- Tabla para mostrar los datos -->
				<div
					class="contenedor-tabla"
				>
					<el-table
						v-loading="loading"
						:data="presupuestaciones"
						stripe
					>
						<el-table-column
							prop="presupuestacion_id"
							label="Nro."
							width="70px"
							align="right"
						/>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Fecha de creación"
							width="150px"
						>
							<template #default="props">
								{{ formatearFecha(props.row.presupuestacion_fecha_creacion) }}
							</template>
						</el-table-column>

						<el-table-column
							prop="presupuestacion_plan_nombre"
							label="Plan"
						/>

						<el-table-column
							prop="presupuestacion_rubro_nombre"
							label="Rubro"
						>
							<template #default="props">
								{{ props.row.presupuestacion_rubro_nombre }}
							</template>
						</el-table-column>

						<el-table-column
							prop="rangoProvisión"
							label="Rango"
							width="150px"
						>
							<template #default="props">
								{{
									formatearFechaSinDia(props.row.presupuestacion_fecha_incio)
								}}
								-
								{{ formatearFechaSinDia(props.row.presupuestacion_fecha_fin) }}
							</template>
						</el-table-column>

						<!-- Aregar rubro -->
						<el-table-column
							label="Carga"
							prop="editar"
							header-align="right"
							align="right"
							width="90px"
						>
							<template #default="props">
								<el-button
									type="primary"
									circle
									@click="$refs.modalCarga.abrir(props.row.presupuestacion_id)"
								>
									<span class="material-icons">add_shopping_cart</span>
								</el-button>
							</template>
						</el-table-column>

						<!-- Crear presupuestacion -->
						<el-table-column
							label="Comparativa"
							prop="comparativa"
							header-align="center"
							align="center"
							width="110px"
						>
							<template #default="props">
								<el-button
									v-if="isSectionVisibleForUser"
									type="primary"
									circle
									@click="
										$refs.modalComparativa.abrir(props.row.presupuestacion_id)
									"
								>
									<span class="material-icons">view_week</span>
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
										$refs.modalDetalle.abrir(props.row.presupuestacion_id)
									"
								>
									<span class="material-icons">visibility</span>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div v-else>
				<h1> {{ notAllowedLabel }} </h1>
			</div>
		</el-card>
	</main>

	<modal-nuevo
		ref="modalNuevo"
		@actualizarTabla="obtenerTodos"
	/>

	<modal-carga ref="modalCarga" />

	<modal-detalle ref="modalDetalle" />

	<modal-comparativa ref="modalComparativa" />
</template>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
	}
}
</style>

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
