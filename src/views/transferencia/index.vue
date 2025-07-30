<script>
import { ElMessage } from "element-plus";
import moment from 'moment';

import ModalCambiarEstado from "./modales/cambiarEstado.vue";
import ModalVer from "./modales/ver.vue";
import Configuration from './transferencia.configuration';
import i18n from './transferenciai18n';

export default {
	name: 'TransferenciaPage',
	components: {
		ModalVer,
		ModalCambiarEstado
	},
	data() {
		return {
			Configuration,
			transferencias: [],
			transferenciasNuevo: [],
			paginas: {},
			fecha: Date,
			pageSize: 20,
			currentPage: 1,
			loadingDatos: false,
			filtroEstado: "",
			estadosTransferencias: [
				{
					value: "Pendiente",
					label: "Pendiente"
				},
				{
					value: "Ejecutado",
					label: "Ejecutado"
				},
				{
					value: "No realizado",
					label: "No realizado"
				}
			],
			estadosSelect: [
				{
					value: "Pendiente",
					label: "Pendiente"
				},
				{
					value: "Ejecutado",
					label: "Ejecutado"
				},
				{
					value: "No realizado",
					label: "No realizado"
				}
			]
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
		},
		isStatusButtonVisibleForUser() {
			return this.Configuration.allowedRolesInStatusButton.includes(this.$store.state.user.tipo_usuario);
		},
		titleSectionLabel() {
			return i18n.TITLE;
		},
		selectByStateLabel() {
			return i18n.SELECT_BY_STATE;
		},
		filtersLabel() {
			return i18n.FILTERS;
		}
	},
	watch: {
		filtroEstado(val) {
			if (val == "") {
				this.transferenciasNuevo = this.transferencias;
			} else {
				this.transferenciasNuevo = this.buscarEstado(val);
			}
		}
	},
	mounted() {
		this.obtenerTodos();
	},
	methods: {
		async obtenerTodos() {
			this.loadingDatos = true;
			this.transferencias = [];
			await this.axios
				.get("/api/transferencia/obtenerTodos")
				.then((response) => {
					if (response.data.length != 0) {
						response.data.forEach((elemento) => {
							if (elemento.presupuestacion != null) {
								this.transferencias.push(elemento);
							}
						});

						this.transferenciasNuevo = this.transferencias;
						this.paginas = response.data.pagina;
						this.fecha = response.data[0].plan_fdesde;
					}
				});
			this.loadingDatos = false;
		},
		async cambiarEstado(row, estado) {
			if (estado == "Ejecutado") {
				this.$refs.modalCambiarEstado.abrir(row, estado);
			} else {
				let params = {
					id: row.transferencia.transferencia_id,
					estado: estado
				};

				await this.axios
					.post("/api/transferencia/actualizar", params)
					.then((response) => {
						ElMessage({
							type: "success",
							message: "¡Estado de la transferencia actualizada con éxito!"
						});
						this.obtenerTodos();
					});
			}
		},
		buscarEstado(keywords) {
			return this.transferencias.filter((item) => {
				if (item.transferencia.transferencia_estado == keywords) {
					return item;
				}
			});
		},
		classChecker({ row, column, rowIndex, columnIndex }) {
			if (row.transferencia.transferencia_estado == "Ejecutado") {
				return {
					background: "#96ceb4",
					color: "black"
				};
			}

			if (row.transferencia.transferencia_estado == "Pendiente") {
				return {
					background: "#ffeead",
					color: "black"
				};
			}

			if (row.transferencia.transferencia_estado == "No realizado") {
				return {
					background: "#ff6f69",
					color: "black"
				};
			}
		},
		handleCurrentChange: function (cpage) {
			this.$data.currentPage = cpage;
		},
		handleSizeChange: function (psize) {
			this.$data.pageSize = psize;
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
				<h1> {{ titleSectionLabel }} </h1>
			</template>

			<div
				v-if="isSectionVisibleForUser"
				class="filter-main-container"
			>
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
								<span class="material-icons filter-icon">
									filter_list
								</span>
								<span class="filters-label">
									{{ filtersLabel }}
								</span>
							</template>
							<div>
								<el-row :gutter="10">
									<el-col :span="8" />
									<el-col :span="8" />
									<el-col :span="8">
										<el-select
											v-model="filtroEstado"
											:placeholder="selectByStateLabel"
											filterable
											clearable
											style="width: 100%"
										>
											<el-option
												v-for="item in estadosSelect"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-col>
								</el-row>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>

				<!-- Tabla para mostrar los datos -->
				<div class="contenedor-tabla">
					<div v-loading="loadingDatos">
						<el-table
							v-loading="loading"
							:data="
								transferenciasNuevo.slice(
									(currentPage - 1) * pageSize,
									currentPage * pageSize
								)
							"
							:cell-style="classChecker"
						>
							<!-- Nro -->
							<el-table-column
								label="Nro."
								prop="transferencia_id"
								width="80px"
							>
								<template #default="props">
									<span>{{ props.row.transferencia.transferencia_id }}</span>
								</template>
							</el-table-column>

							<!-- Nro -->
							<el-table-column
								label="Nro. pres."
								prop="nroPresupuestacion"
								width="100px"
							>
								<template #default="props">
									<span>{{
										props.row.presupuestacion.presupuestacion_id
									}}</span>
								</template>
							</el-table-column>

							<!-- Nombre -->
							<el-table-column
								label="Presupuestación"
								prop="presupuestacion"
								min-width="200px"
							>
								<template #default="props">
									<span>{{
										props.row.presupuestacion.presupuestacion_plan_nombre
									}}</span>
								</template>
							</el-table-column>

							<!-- Destino -->
							<el-table-column
								label="Origen"
								prop="origen"
							>
								<template #default="props">
									<span>{{ props.row.deposito.deposito_nombre }}</span>
								</template>
							</el-table-column>

							<!-- Producto -->
							<el-table-column
								label="Producto"
								prop="producto"
							>
								<template #default="props">
									<span>{{
										props.row.transferencia.transferencia_producto_nombre
									}}</span>
								</template>
							</el-table-column>

							<!-- Unidad de medida -->
							<el-table-column
								label="U.M."
								prop="unidadMedida"
							>
								<template #default="props">
									<span>{{
										props.row.transferencia.transferencia_producto_unidad
									}}</span>
								</template>
							</el-table-column>

							<!-- Cantidad a stock -->
							<el-table-column
								label="Cant. stock"
								prop="cantSacada"
							>
								<template #default="props">
									<span>{{
										props.row.transferencia.transferencia_producto_stock
									}}</span>
								</template>
							</el-table-column>

							<!-- Cantidad a utilizar -->
							<el-table-column
								label="Cant. sacada"
								prop="cantSacada"
							>
								<template #default="props">
									<span>{{
										props.row.transferencia.transferencia_cantidad_utilizar
									}}</span>
								</template>
							</el-table-column>

							<!-- Fecha inicio -->
							<el-table-column
								label="Fecha"
								prop="fincio"
							>
								<template #default="props">
									<span>{{
										formatearFecha(props.row.transferencia.updated_at)
									}}</span>
								</template>
							</el-table-column>

							<!-- Estado -->
							<el-table-column
								label="Estado"
								prop="estado"
							>
								<template #default="props">
									<el-select
										v-if="isStatusButtonVisibleForUser"
										v-model="props.row.transferencia.transferencia_estado"
										class="m-2"
										placeholder="Selecciona un estado"
										:disabled="
											props.row.transferencia.transferencia_estado ==
												'Ejecutado'
										"
										@change="
											cambiarEstado(
												props.row,
												props.row.transferencia.transferencia_estado
											)
										"
									>
										<el-option
											v-for="item in estadosTransferencias"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</template>
							</el-table-column>
						</el-table>

						<div class="contenedor-paginator">
							<el-pagination
								layout="prev, pager, next, sizes, total, jumper"
								:page-sizes="[10, 20, 30]"
								:page-size="pageSize"
								:total="transferencias.length"
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

	<modal-ver ref="modalVer" />
	<modal-cambiar-estado
		ref="modalCambiarEstado"
		@obtener-datos="obtenerTodos()"
	/>
</template>

<style lang="scss" scoped>
.main-container {
	.card-container {
		height: 100%;
		.filter-main-container {
			.demo-collapse {
				.filter-icon {
					color: #95989e;
				}
				.filters-label {
					font-size: 20px;
					color: #95989e;
				}
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
