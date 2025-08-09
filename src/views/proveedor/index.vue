<script>
import ModalDetalle from "./modales/detalle.vue";
import ModalEliminar from "./modales/eliminar.vue";
import ModalModificar from "./modales/modificar.vue";
import ModalNuevo from "./modales/nuevo.vue";
import ModalRubro from "./modales/rubro.vue";
import Configuration from './proveedor.configuration';
import i18n from './proveedori18n';

export default {
	name: 'ProveedorPage',
	components: {
		ModalNuevo,
		ModalModificar,
		ModalEliminar,
		ModalRubro,
		ModalDetalle
	},

	data() {
		return {
			Configuration,
			proveedores: [],
			proveedoresNuevo: [],
			loading: false,
			pageSize: 20,
			currentPage: 1,

			filtroNombre: "",
			filtroRazonSocial: "",
			filtroCodigo: null,
			filtroCuit: "",
			filtroRubro: "",
			rubrosSelect: []
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isEditButtonVisibleForUser() {
			return this.Configuration.allowedRolesInEditButton.includes(this.$store.state.user.tipo_usuario);
		},
		titleSectionLabel() {
			return i18n.TITLE;
		},
		searchByName() {
			return i18n.SEARCH_BY_NAME;
		},
		searchByCode() {
			return i18n.SEARCH_BY_CODE;
		},
		searchBySocialReason() {
			return i18n.SEARCH_BY_SOCIAL_REASON;
		},
		searchByCuit() {
			return i18n.SEARCH_BY_CUIT;
		}
	},
	watch: {
		filtroNombre(val) {
			if (val == "") {
				this.proveedoresNuevo = this.proveedores;
			} else {
				this.proveedoresNuevo = this.buscarNombre(val);
			}
		},
		filtroRazonSocial(val) {
			if (val == "") {
				this.proveedoresNuevo = this.proveedores;
			} else {
				this.proveedoresNuevo = this.buscarRazonSocial(val);
			}
		},
		filtroCodigo(val) {
			if (val == null) {
				this.proveedoresNuevo = this.proveedores;
			} else {
				this.proveedoresNuevo = this.buscarCodigo(val);
			}
		},
		filtroCuit(val) {
			if (val == null) {
				this.proveedoresNuevo = this.proveedores;
			} else {
				this.proveedoresNuevo = this.buscarCuit(val);
			}
		},
		filtroRubro(val) {
			if (val == "") {
				this.proveedoresNuevo = this.proveedores;
			} else {
				this.proveedoresNuevo = this.buscarRubro(val);
			}
		}
	},
	mounted() {
		this.obtenerTodos();
		this.obtenerTodosRubro();
	},
	methods: {
		async obtenerTodos() {
			this.loading = true;
			await this.axios.get("/api/proveedor/obtenerTodos").then((response) => {
				this.proveedores = this.proveedoresNuevo = response.data;
			});
			this.loading = false;
		},
		async obtenerTodosRubro() {
			await this.axios.get("/api/rubro/obtenerTodosSelect").then((response) => {
				this.rubrosSelect = response.data;
			});
		},
		handleCurrentChange: function (cpage) {
			this.$data.currentPage = cpage;
		},
		handleSizeChange: function (psize) {
			this.$data.pageSize = psize;
		},
		buscarNombre(keywords) {
			return this.proveedores.filter((item) => {
				let nombreLower = item.proveedor_nombre.toLowerCase();
				let keywordsLower = keywords.toLowerCase();

				if (nombreLower.includes(keywordsLower)) {
					return item;
				}
			});
		},
		buscarRazonSocial(keywords) {
			return this.proveedores.filter((item) => {
				let nombreLower = item.proveedor_razonsocial.toLowerCase();
				let keywordsLower = keywords.toLowerCase();

				if (nombreLower.includes(keywordsLower)) {
					return item;
				}
			});
		},
		buscarCodigo(keywords) {
			return this.proveedores.filter((item) => {
				let codigoString = item.proveedor_codigo.toString();
				let keywordsString = keywords.toString();

				if (codigoString.includes(keywordsString)) {
					return item;
				}
			});
		},
		buscarCuit(keywords) {
			return this.proveedores.filter((item) => {
				let codigoString = item.proveedor_cuit.toString();
				let keywordsString = keywords.toString();

				if (codigoString.includes(keywordsString)) {
					return item;
				}
			});
		},
		buscarRubro(keywords) {
			return this.proveedores.filter((item) => {
				if (item.rubro_id == keywords) {
					return item;
				}
			});
		}
	}
};
</script>

<template>
	<main class="main-container">
		<el-card class="card-container">
			<template #header>
				<h1>{{ titleSectionLabel }}</h1>
			</template>

			<div v-if="isSectionVisibleForUser">
				<!-- Collapse para filtros -->
				<div class="demo-collapse">
					<el-collapse
						v-model="activeNames"
						@change="handleChange"
					>
						<el-collapse-item
							title="Filtros"
							name="1"
						>
							<template #title>
								<span
									class="material-icons filter-icon"
								> filter_list </span>
								<span
									class="filter-label"
								> Filtros </span>
							</template>
							<div>
								<el-row :gutter="10">
									<el-col :span="6">
										<el-input
											v-model="filtroNombre"
											:placeholder="searchByName"
											clearable
										/>
									</el-col>

									<el-col :span="6">
										<el-input
											v-model="filtroRazonSocial"
											:placeholder="searchBySocialReason"
											clearable
										/>
									</el-col>

									<el-col :span="6">
										<el-input
											v-model="filtroCodigo"
											:placeholder="searchByCode"
											clearable
											:controls="false"
										/>
									</el-col>

									<el-col :span="6">
										<el-input
											v-model="filtroCuit"
											:placeholder="searchByCuit"
											clearable
											:controls="false"
											style="width: 100%"
										/>
									</el-col>
								</el-row>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>

				<!-- Tabla para mostrar los datos -->
				<div class="contenedor-tabla">
					<el-table
						v-loading="loading"
						:data="
							proveedoresNuevo.slice(
								(currentPage - 1) * pageSize,
								currentPage * pageSize
							)
						"
						fixed
					>
						<!-- Nombre -->
						<el-table-column
							label="Nombre"
							prop="proveedor_nombre"
						/>

						<!-- Razon social -->
						<el-table-column
							label="Razón social"
							prop="proveedor_razonsocial"
						/>

						<!-- Codigo -->
						<el-table-column
							label="Código"
							prop="proveedor_codigo"
							width="150px"
						/>

						<!-- CUIT -->
						<el-table-column
							label="CUIT"
							prop="proveedor_cuit"
							width="150px"
						/>

						<!-- Activo -->
						<el-table-column
							label="Activo"
							prop="activo"
							width="70"
						>
							<template #default="props">
								<span v-if="props.row.proveedor_activo == 1">
									<el-tag
										class="ml-2"
										type="success"
									>SI</el-tag>
								</span>
								<span v-else>
									<el-tag
										class="ml-2"
										type="danger"
									>NO</el-tag>
								</span>
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
									v-if="isEditButtonVisibleForUser"
									type="primary"
									circle
									@click="$refs.modalModificar.abrir(props.row.proveedor_id)"
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
									@click="$refs.modalDetalle.abrir(props.row.proveedor_id)"
								>
									<span class="material-icons">visibility</span>
								</el-button>
							</template>
						</el-table-column>

						<!-- Aregar rubro -->
						<el-table-column
							label="Rubro"
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
									@click="$refs.modalRubro.abrir(props.row.proveedor_id)"
								>
									<span class="material-icons">sell</span>
								</el-button>
							</template>
						</el-table-column>
					</el-table>

					<div class="contenedor-paginator">
						<el-pagination
							layout="prev, pager, next, sizes, total, jumper"
							:page-sizes="[10, 20, 30]"
							:page-size="pageSize"
							:total="proveedores.length"
							style="text-align: center; margin-top: 1%"
							@current-change="handleCurrentChange"
							@size-change="handleSizeChange"
						/>
					</div>
				</div>
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
	<modal-detalle ref="modalDetalle" />
	<modal-rubro ref="modalRubro" />
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

.filter-icon {
	color: #95989e;
}
.filter-label {
	font-size: 21px;
	color: #95989e;
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

.contenedor-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
