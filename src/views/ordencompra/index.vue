<script>
import { formatDate, formatNumberToMount } from "../../utils/utils";

import ModalGenerarOrdenCompra from "./modales/generarOrdenCompra.vue";
import ModalDetalle from "./modales/ver.vue";
import Configuration from './ordencompra.configuration';
import i18n from './ordencomprai18n';

export default {
	name: 'OrdenCompra',
	components: {
		ModalDetalle,
		ModalGenerarOrdenCompra
	},
	data() {
		return {
			Configuration,
			arrayOrdenesCompra: [],
			paginas: {},
			pageSize: 20,
			currentPage: 1,
			loadingDatos: false
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isDetailButtonVisibleForUser() {
			return this.Configuration.allowedRolesInDetailButton.includes(this.$store.state.user.tipo_usuario);
		},
		titleSectionLabel() {
			return i18n.TITLE;
		}
	},
	mounted() {
		this.obtenerTodos();
	},
	methods: {
		async obtenerTodos() {
			this.loadingDatos = true;
			await this.axios.get("/api/ordencompra/obtenerTodos").then((response) => {
				this.arrayOrdenesCompra = response.data;
			});
			this.loadingDatos = false;
		},
		formatearFecha(fecha) {
			return formatDate(fecha);
		},
		handleCurrentChange: function (cpage) {
			this.$data.currentPage = cpage;
		},
		handleSizeChange: function (psize) {
			this.$data.pageSize = psize;
		},
		formatNumberToMount(mount) {
			return formatNumberToMount(mount);
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
				<div class="contenedor-tabla">
					<div v-loading="loadingDatos">
						<el-table
							:data="arrayOrdenesCompra"
							stripe
						>
							<el-table-column
								prop="ordenes_compras_id"
								label="Nro"
								width="80px"
								align="right"
							/>

							<el-table-column
								prop="ordenes_compras_presupuestacion_id"
								label="Nro presupuestación"
								width="160px"
								align="right"
							/>

							<el-table-column
								prop="ordenes_compras_proveedor_nombre"
								label="Proveedor"
							/>

							<el-table-column
								prop="ordenes_compras_monto_total"
								label="Monto total"
								align="right"
							>
								<template #default="props">
									{{
										formatNumberToMount(props.row.ordenes_compras_monto_total)
									}}
								</template>
							</el-table-column>

							<el-table-column
								prop="updated_at"
								label="Fecha de creación"
								width="160px"
							>
								<template #default="props">
									{{ formatearFecha(props.row.updated_at) }}
								</template>
							</el-table-column>

							<el-table-column
								label="Detalle"
								prop="detalle"
								header-align="center"
								align="center"
								width="90px"
							>
								<template #default="props">
									<div style="display: flex">
										<div style="margin: auto">
											<el-button
												v-if="isDetailButtonVisibleForUser"
												type="primary"
												circle
												@click="
													$refs.modalDetalle.abrir(props.row.ordenes_compras_id)
												"
											>
												<span class="material-icons">visibility</span>
											</el-button>
										</div>
									</div>
								</template>
							</el-table-column>

							<el-table-column
								label="Generar O.C."
								prop="detalle"
								header-align="center"
								align="center"
								width="120px"
							>
								<template #default="props">
									<div style="display: flex">
										<div style="margin: auto">
											<el-button
												v-if="isSectionVisibleForUser"
												type="primary"
												circle
												:disabled="props.row.ordenes_compras_estado == 1"
												@click="
													$refs.modalGenerarOrdenCompra.abrir(
														props.row.ordenes_compras_id
													)
												"
											>
												<span class="material-icons">verified</span>
											</el-button>
										</div>
									</div>
								</template>
							</el-table-column>
						</el-table>

						<div class="contenedor-paginator">
							<el-pagination
								layout="prev, pager, next, sizes, total, jumper"
								:page-sizes="[10, 20, 30]"
								:page-size="pageSize"
								:total="arrayOrdenesCompra.length"
								style="text-align: center; margin-top: 1%"
								@current-change="handleCurrentChange"
								@size-change="handleSizeChange"
							/>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</main>

	<modal-detalle ref="modalDetalle" />

	<modal-generar-orden-compra
		ref="modalGenerarOrdenCompra"
		@actualizarTabla="obtenerTodos"
	/>
</template>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
		.contenedor-tabla {
			height: 100%;
		}
	}
}
</style>

<style>
.material-icons {
  font-size: 24px;
}

.contenedor-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
