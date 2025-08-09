<script>
import { formatDate, formatNumberToDecimal, sortByField } from '../../../utils/utils';

export default {
	name: 'ModalDetalleBorrador',
	data() {
		return {
			id: null,
			loading: false,
			loadingProductos: false,
			loadingProveedores: false,
			datos: null,
			datosProductos: [],
			datosProveedores: []
		};
	},
	methods: {
		abrir(id) {
			this.loading = true;
			this.loadingProductos = true;
			this.loadingProveedores = true;
			this.id = null;
			this.id = id;
			this.datos = null;
			this.datosProductos = [];
			this.datosProveedores = [];
			this.datosProveedores = [];

			this.$refs.modal.abrir();

			// limpio los campos
			this.getDatos();
		},
		cerrar() {
			this.$refs.modal.cerrar();
		},
		async getDatos() {
			await this.axios
				.get("/api/borradorpresupuestacion/obtenerDatos/" + this.id)
				.then((response) => {
					const respuestaApi = response;

					if (respuestaApi != null) {
						this.datos = respuestaApi.data;
						this.loading = false;

						this.datosProductos = respuestaApi.data.productos;

						this.loadingProductos = false;

						this.datosProveedores = sortByField(respuestaApi.data.proveedores.map(item => ({
							...item.proveedor,
							...item.rubro
						})), 'borrador_proveedor_nombre') ;

						this.loadingProveedores = false;
					} else {
						this.cerrar();
					}
				});
		},
		formatearFecha(fecha) {
			return formatDate(fecha);
		},
		formatNumberToDecimal(number) {
			return formatNumberToDecimal(number);
		}
	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Detalle del borrador"
			:impedir-close="impedirClose"
			width="80%"
		>
			<el-descriptions
				v-loading="loading"
				title="Información del borrador"
				direction="vertical"
				:column="3"
				:size="size"
				border
			>
				<div v-if="datos != null">
					<el-descriptions-item label="Nro. presupuestación">
						{{ datos.borrador_presupuestacion_id }}
					</el-descriptions-item>

					<el-descriptions-item label="Fecha de creación">
						{{ formatearFecha(datos.borrador_presupuesto_fecha_creacion) }}
					</el-descriptions-item>

					<el-descriptions-item label="Plan">
						{{ datos.borrador_presupuestacion_plan_nombre }}
					</el-descriptions-item>

					<el-descriptions-item label="Incio de presupuestación">
						{{ formatearFecha(datos.borrador_presupuestacion_fecha_incio) }}
					</el-descriptions-item>

					<el-descriptions-item label="Fin de presupuestación">
						{{ formatearFecha(datos.borrador_presupuestacion_fecha_fin) }}
					</el-descriptions-item>
				</div>
			</el-descriptions>

			<h3 style="margin-top: 15px">
				<b>Productos</b>
			</h3>
			<div v-if="datosProductos">
				<el-table
					v-loading="loadingProductos"
					:data="datosProductos"
					stripe
					style="width: 100%"
				>
					<el-table-column
						prop="nombre"
						label="Nombre"
					>
						<template #default="props">
							<span>{{ props.row.productoPresupuestacion.borrador_producto_nombre }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="nombre"
						label="Rubro"
					>
						<template #default="props">
							<span>{{ props.row.productoPresupuestacion.borrador_producto_rubro_nombre }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="nombre"
						label="Unidad"
						width="100"
					>
						<template #default="props">
							<span>{{ props.row.producto.producto_unidad }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="cantidad"
						label="Cantidad a comprar"
						width="200"
						align="right"
					>
						<template #default="props">
							<span>{{ formatNumberToDecimal(props.row.productoPresupuestacion.borrador_producto_cantidad_real_a_comprar) }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="cantidad"
						label="Observaciones"
						width="300"
					>
						<template #default="props">
							<span>{{ props.row.productoPresupuestacion.borrador_producto_observaciones }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<h3 style="margin-top: 15px">
				<b>Proveedores</b>
			</h3>

			<div v-if="datosProveedores">
				<el-table
					v-loading="loadingProductos"
					:data="datosProveedores"
					stripe
					style="width: 100%"
				>
					<el-table-column
						prop="nombre"
						label="Nombre"
					>
						<template #default="props">
							<span>{{ props.row.borrador_proveedor_nombre }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="nombre"
						label="Rubro"
					>
						<template #default="props">
							<span>{{ props.row.rubro_nombre }}</span>
						</template>
					</el-table-column>

					<el-table-column
						prop="nombre"
						label="Mail"
					>
						<template #default="props">
							<span>{{ props.row.borrador_proveedor_mail }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</modal>
	</div>
</template>

<style></style>
