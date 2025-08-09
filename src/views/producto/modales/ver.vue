<script>
import { formatDate, formatNumberToDecimal, formatNumberToMount } from '../../../utils/utils';

export default {
	name: 'VerProductoModal',
	data() {
		return {
			id: null,
			loading: false,
			datos: null
		};
	},

	methods: {
		abrir(id) {
			this.loading = true;
			this.id = null;
			this.id = id;
			this.datos = null;

			this.$refs.modal.abrir();

			// limpio los campos
			this.getDatos();
		},
		cerrar() {
			this.$refs.modal.cerrar();
		},
		async getDatos() {
			await this.axios
				.get("/api/producto/obtenerDatos/" + this.id)
				.then((response) => {
					const respuestaApi = response;

					if (respuestaApi != null) {
						this.datos = respuestaApi.data;
						this.loading = false;
					} else {
						this.cerrar();
					}
				});
		},
		formatDate(date) {
			return formatDate(date);
		},
		formatNumberToMount(mount) {
			return formatNumberToMount(mount);
		},
		formatNumberToDecimal(number) {
			return formatNumberToDecimal(number, 0, 0);
		}
	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Datos del producto"
			:impedir-close="impedirClose"
		>
			<el-descriptions
				v-loading="loading"
				title="Información del producto"
				direction="vertical"
				:column="4"
				:size="size"
				border
			>
				<div v-if="datos != null">
					<el-descriptions-item label="Código">
						{{ formatNumberToDecimal(datos.producto_codigo) }}
					</el-descriptions-item>

					<el-descriptions-item label="Nombre">
						{{ datos.producto_nombre }}
					</el-descriptions-item>

					<el-descriptions-item label="Rubro">
						{{ datos.rubro.rubro_nombre }}
					</el-descriptions-item>

					<el-descriptions-item label="Un. de medida">
						{{ datos.producto_unidad }}
					</el-descriptions-item>

					<el-descriptions-item label="Estado del producto">
						<span v-if="datos.producto_activo == 1">
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
					</el-descriptions-item>

					<el-descriptions-item label="Fecha de ult. compra">
						{{ formatDate(datos.producto_fpuc) }}
					</el-descriptions-item>

					<el-descriptions-item label="Precio de ult. compra">
						{{ formatNumberToMount(datos.producto_puc) }}
					</el-descriptions-item>
				</div>
			</el-descriptions>
		</modal>
	</div>
</template>

<style></style>
