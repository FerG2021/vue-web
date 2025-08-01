<script>
import { formatNumberToDecimal } from "../../utils/utils";

import ModalEliminar from "./modales/eliminar.vue";
import ModalModificar from "./modales/modificar.vue";
import ModalNuevo from "./modales/nuevo.vue";
import ModalVer from "./modales/ver.vue";
import Configuration from './producto.configuration';
import i18n from './productoi18n';

export default {
	name: 'ProductoPage',
	components: {
		ModalVer,
		ModalNuevo,
		ModalModificar,
		ModalEliminar
	},
	data() {
		return {
			Configuration,
			productos: [],
			productosNuevo: [],
			paginas: {},
			loading: false,
			pageSize: 20,
			currentPage: 1,

			filtroNombre: "",
			filtroCodigo: null,
			rubrosSelect: [],
			filtroRubro: ""
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		titleSectionLabel() {
			return i18n.TITLE;
		},
		filtersLabel() {
			return i18n.FILTERS;
		},
		searchByNameLabel() {
			return i18n.SEARCH_BY_NAME;
		},
		searchByCodeLabel() {
			return i18n.SEARCH_BY_CODE;
		},
		searchByCategoryLabel() {
			return i18n.SEARCH_BY_CATEGORY;
		}
	},
	watch: {
		filtroNombre(val) {
			if (val == "") {
				this.productosNuevo = this.productos;
			} else {
				this.productosNuevo = this.buscarNombre(val);
			}
		},
		filtroCodigo(val) {
			if (val == null) {
				this.productosNuevo = this.productos;
			} else {
				this.productosNuevo = this.buscarCodigo(val);
			}
		},
		filtroRubro(val) {
			if (val == "") {
				this.productosNuevo = this.productos;
			} else {
				this.productosNuevo = this.buscarRubro(val);
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
			await this.axios.get("/api/producto/obtenerTodos").then((response) => {
				this.productos = this.productosNuevo = response.data.datos;
				this.paginas = response.data.pagina;
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
			return this.productos.filter((item) => {
				let nombreLower = item.producto_nombre.toLowerCase();
				let keywordsLower = keywords.toLowerCase();

				if (nombreLower.includes(keywordsLower)) {
					return item;
				}
			});
		},
		buscarCodigo(keywords) {
			return this.productos.filter((item) => {
				let codigoString = item.producto_codigo.toString();
				let keywordsString = keywords.toString();

				if (codigoString.includes(keywordsString)) {
					return item;
				}
			});
		},
		buscarRubro(keywords) {
			return this.productos.filter((item) => {
				if (item.rubro_id == keywords) {
					return item;
				}
			});
		},
		formatNumberToDecimal(number) {
			return formatNumberToDecimal(number, 0, 0);
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
				<div class="filters-container">
					<el-collapse
						v-model="activeNames"
						class="collapse"
						@change="handleChange"
					>
						<el-collapse-item
							:title="filtersLabel"
							name="1"
							class="collapse-item"
						>
							<template #title>
								<span class="material-icons filter-icon">
									filter_list
								</span>
								<span class="filter-label">
									{{ filtersLabel }}
								</span>
							</template>
							<div>
								<el-row :gutter="10">
									<el-col :span="8">
										<!-- Filtro por nombre -->
										<el-input
											v-model="filtroNombre"
											:placeholder="searchByNameLabel"
											clearable
										/>
									</el-col>

									<el-col :span="8">
										<!-- Filtro por codigo -->
										<el-input
											v-model="filtroCodigo"
											:placeholder="searchByCodeLabel"
											clearable
											:controls="false"
											style="width: 100%"
										/>
									</el-col>

									<el-col :span="8">
										<el-select
											v-model="filtroRubro"
											:placeholder="searchByCategoryLabel"
											filterable
											clearable
											style="width: 100%"
										>
											<el-option
												v-for="item in rubrosSelect"
												:key="item.rubro_id"
												:label="item.rubro_nombre"
												:value="item.rubro_id"
											/>
										</el-select>
									</el-col>
								</el-row>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>

				<!-- Tabla para mostrar los datos -->
				<div
					class="contenedor-tabla"
					style="margin-top: 10px"
				>
					<el-table
						v-loading="loading"
						:data="
							productosNuevo.slice(
								(currentPage - 1) * pageSize,
								currentPage * pageSize
							)
						"
						fixed
					>
						<!-- Nombre -->
						<el-table-column
							label="Nombre"
							prop="producto_nombre"
						/>

						<!-- Codigo -->
						<el-table-column
							label="Código"
							prop="producto_codigo"
							align="right"
							width="150"
						>
							<template #default="props">
								<span>{{ formatNumberToDecimal(props.row.producto_codigo) }}</span>
							</template>
						</el-table-column>

						<!-- Rubro -->
						<el-table-column
							label="Rubro"
							prop="rubro"
						>
							<template #default="props">
								<span>{{ props.row.rubro.rubro_nombre }}</span>
							</template>
						</el-table-column>

						<!-- Detalle -->
						<el-table-column
							label="Detalle"
							prop="ver"
							header-align="center"
							align="center"
							width="75px"
						>
							<template #default="props">
								<el-button
									v-if="isSectionVisibleForUser"
									type="primary"
									circle
									@click="$refs.modalVer.abrir(props.row.producto_id)"
								>
									<span class="material-icons">visibility</span>
								</el-button>
							</template>
						</el-table-column>
					</el-table>

					<div class="contenedor-paginator">
						<el-pagination
							layout="prev, pager, next, sizes, total, jumper"
							:page-sizes="[10, 20, 30]"
							:page-size="pageSize"
							:total="productos.length"
							style="text-align: center; margin-top: 1%"
							@current-change="handleCurrentChange"
							@size-change="handleSizeChange"
						/>
					</div>
				</div>
			</div>
		</el-card>
	</main>

	<modal-ver ref="modalVer" />

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
		.contenedor-tabla {
			height: 100%;
		}
		.filters-container {
			.filter-icon {
				margin-left: 25px;
				color: #95989e
			}
			.filter-label {
				font-size: 20px;
				color: #95989e;
			}
		}
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

.contenedor-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
