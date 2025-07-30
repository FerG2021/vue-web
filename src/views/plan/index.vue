<script>
import { formatDate } from "../../utils/utils";

import ModalVer from "./modales/ver.vue";
import Configuration from './plan.configuration';
import i18n from './plani18n';

export default {
	name: 'PlanesPage',
	components: { ModalVer },
	data() {
		return {
			Configuration,
			planes: [],
			paginas: {},
			fecha: Date,
			loading: false,
			pageSize: 20,
			currentPage: 1
		};
	},
	computed: {
		isSectionVisibleForUser() {
			return this.Configuration.allowedRolesInSection.includes(this.$store.state.user.tipo_usuario);
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
			this.loading = true;
			await this.axios.get("/api/plan/obtenerTodos").then((response) => {
				this.planes = response.data;
				this.paginas = response.data.pagina;
				this.fecha = response.data[0].plan_fdesde;
			});
			this.loading = false;
		},
		handleCurrentChange: function (cpage) {
			this.$data.currentPage = cpage;
		},
		handleSizeChange: function (psize) {
			this.$data.pageSize = psize;
		},
		formatDate(date) {
			return formatDate(date, 'DD/MM/YYYY HH:mm');
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
				<!-- Tabla para mostrar los datos -->
				<div class="contenedor-tabla">
					<el-table
						v-loading="loading"
						:data="
							planes.slice((currentPage - 1) * pageSize, currentPage * pageSize)
						"
						fixed
					>
						<el-table-column
							label="Nombre"
							prop="plan_nombre"
						/>

						<el-table-column
							label="Fecha inicio"
							prop="fincio"
							width="150"
						>
							<template #default="props">
								<span>{{ formatDate(props.row.plan_fdesde) }}</span>
							</template>
						</el-table-column>

						<el-table-column
							label="Fecha fin"
							prop="fincio"
							width="150"
						>
							<template #default="props">
								<span>{{ formatDate(props.row.plan_fhasta) }}</span>
							</template>
						</el-table-column>

						<el-table-column
							label="Cant. meses"
							prop="plan_plazo"
							width="120"
							align="right"
						/>

						<el-table-column
							label="Estado"
							prop="fincio"
							width="100"
						>
							<template #default="props">
								<span v-if="props.row.plan_activo == 1">
									<el-tag
										size="small"
										type="success"
									>Activo</el-tag>
								</span>
								<span v-else>
									<el-tag
										size="small"
										type="danger"
									>Inactivo</el-tag>
								</span>
							</template>
						</el-table-column>
					</el-table>

					<div class="contenedor-paginator">
						<el-pagination
							layout="prev, pager, next, sizes, total, jumper"
							:page-sizes="[10, 20, 30]"
							:page-size="pageSize"
							:total="planes.length"
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
