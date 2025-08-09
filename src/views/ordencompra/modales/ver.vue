<script>
import { formatNumberToDecimal, formatNumberToMount } from '../../../utils/utils';

export default {
	name: 'ModalVerOrdenCompra',
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
			this.datos = [];
			this.$refs.modal.abrir();

			// limpio los campos
			this.getDatos();
		},
		cerrar() {
			this.$refs.modal.cerrar();
		},
		async getDatos() {
			await this.axios
				.get("/api/ordencompra/obtenerDatos/" + this.id)
				.then((response) => {
					const respuestaApi = response;

					if (respuestaApi != null) {
						respuestaApi.data.productosOrdenCompra.forEach((elemento) => {
							this.datos.push(elemento.productoOrdenCompra);
						});

						this.loading = false;
					} else {
						this.cerrar();
					}
				});
		},
		formatNumberToDecimal(number) {
			return formatNumberToDecimal(number);
		},
		formatNumberToMount(number) {
			return formatNumberToMount(number);
		}
	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Productos de la orden de compra"
			:impedir-close="impedirClose"
		>
			<div v-loading="loading">
				<el-table
					:data="datos"
					stripe
					style="width: 100%"
				>
					<el-table-column
						prop="nombre"
						label="Nombre"
					>
						<template #default="props">
							{{ props.row.ordenes_compras_productos_producto_nombre }}
						</template>
					</el-table-column>

					<el-table-column
						prop="rubro"
						label="Rubro"
					>
						<template #default="props">
							{{ props.row.ordenes_compras_productos_rubro_nombre }}
						</template>
					</el-table-column>

					<el-table-column
						prop="rubro"
						label="Cantidad prov."
						align="right"
						width="120"
					>
						<template #default="props">
							{{ formatNumberToDecimal(props.row.ordenes_compras_productos_cantidad_proveedor) }}
						</template>
					</el-table-column>

					<el-table-column
						prop="rubro"
						label="PU"
						align="right"
						width="120"
					>
						<template #default="props">
							{{ formatNumberToMount(props.row.ordenes_compras_productos_precio_pu) }}
						</template>
					</el-table-column>

					<el-table-column
						prop="rubro"
						label="PNG"
						align="right"
						width="120"
					>
						<template #default="props">
							{{ formatNumberToMount(props.row.ordenes_compras_productos_precio_png) }}
						</template>
					</el-table-column>
				</el-table>
			</div>
		</modal>
	</div>
</template>

<style></style>
