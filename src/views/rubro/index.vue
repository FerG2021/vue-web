<script>
import ModalEliminar from './modales/eliminar.vue';
import ModalModificar from './modales/modificar.vue';
import ModalNuevo from './modales/nuevo.vue';
import Configuration from './rubro.configuration';
import i18n from './rubroi18n';

export default {
	name: 'RubrosPage',
	components: {
		ModalNuevo,
		ModalModificar,
		ModalEliminar
	},
	data() {
		return {
			Configuration,
			rubros: [],
			rubrosNuevo: [],
			loading: false,
			pageSize: 20,
			currentPage: 1,
			filtroNombre: '',
			filtroID: null,
			filtroCodigo: ''
		};
	},
	computed: {
		titleSectionLabel() {
			return i18n.TITLE;
		},
		searchByName() {
			return i18n.SEARCH_BY_NAME;
		},
		searchByCode() {
			return i18n.SEARCH_BY_CODE;
		},
		searchById() {
			return i18n.SEARCH_BY_ID;
		}
	},
	watch: {
		filtroNombre(val) {
			if (val == '') {
				this.rubrosNuevo = this.rubros;
			} else {
				this.rubrosNuevo = this.buscarNombre(val);
			}
		},
		filtroID(val) {
			if (val == null) {
				this.rubrosNuevo = this.rubros;
			} else {
				this.rubrosNuevo = this.buscarID(val);
			}
		},
		filtroCodigo(val) {
			if (val == '') {
				this.rubrosNuevo = this.rubros;
			} else {
				this.rubrosNuevo = this.buscarCodigo(val);
			}
		}
	},
	mounted() {
		this.obtenerTodos();
	},
	methods: {
		async obtenerTodos() {
			this.loading = true;
			await this.axios.get("/api/rubro/obtenerTodos")
				.then(response => {
					this.rubros = this.rubrosNuevo = response.data;
				});
			this.loading = false;
		},
		handleCurrentChange: function (cpage) {
			this.$data.currentPage = cpage;
		},
		handleSizeChange: function (psize) {
			this.$data.pageSize = psize;
		},
		buscarNombre(keywords) {
			return this.rubros.filter(item => {
				let nombreLower = item.rubro_nombre.toLowerCase();
				let keywordsLower = keywords.toLowerCase();

				if (nombreLower.includes(keywordsLower)) {
					return item;
				}
			});
		},
		buscarID(keywords) {
			return this.rubros.filter(item => {
				let codigoString = item.rubro_id.toString();
				let keywordsString = keywords.toString();

				if (codigoString.includes(keywordsString)) {
					return item;
				}
			});
		},
		buscarCodigo(keywords) {
			return this.rubros.filter(item => {
				let nombreLower = item.rubro_codigo.toLowerCase();
				let keywordsLower = keywords.toLowerCase();

				if (nombreLower.includes(keywordsLower)) {
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
							<span class="filter-label">
								Filtros
							</span>
						</template>
						<div>
							<el-row :gutter="10">
								<el-col :span="8">
									<el-input
										v-model="filtroNombre"
										:placeholder="searchByName"
										clearable
									/>
								</el-col>

								<el-col :span="8">
									<el-input
										v-model="filtroID"
										:placeholder="searchById"
										clearable
										:controls="false"
										style="width: 100%"
									/>
								</el-col>

								<el-col :span="8">
									<el-input
										v-model="filtroCodigo"
										:placeholder="searchByCode"
										clearable
									/>
								</el-col>
							</el-row>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>

			<div class="contenedor-tabla">
				<el-table
					v-loading="loading"
					:data="
						rubrosNuevo.slice(
							(currentPage - 1) * pageSize,
							currentPage * pageSize
						)
					"
					fixed
				>
					<el-table-column
						label="Nombre"
						prop="rubro_nombre"
					/>

					<el-table-column
						label="ID"
						prop="rubro_id"
						width="100"
					/>

					<el-table-column
						label="Código"
						prop="rubro_codigo"
						width="100"
					/>
				</el-table>

				<div class="contenedor-paginator">
					<el-pagination
						layout="prev, pager, next, sizes, total, jumper"
						:page-sizes="[10, 20, 30]"
						:page-size="pageSize"
						:total="rubros.length"
						style="text-align: center; margin-top: 1%"
						@current-change="handleCurrentChange"
						@size-change="handleSizeChange"
					/>
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
	font-size: 20px;
	color: #95989e;
}
</style>

<style>
  .contenedor-tabla{
    overflow: hidden;
    position: relative;
    float: right;
    width: 99%;
  }

  .material-icons{
    font-size: 24px;
  }

  .contenedor-paginator{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>