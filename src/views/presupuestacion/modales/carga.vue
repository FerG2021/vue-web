<script>
import { ElMessage } from "element-plus";

import { sortByField } from '../../../utils/utils';
import i18n from '../presupuestacioni18n';

import ModalCargaPorProveedor from './cargaPorProveedor.vue';

export default {
	name: 'CargaModal',
	components: { ModalCargaPorProveedor },
	data() {
		return {
			id: null,
			loading: false,
			loadingProductos: false,
			loadingProveedores: false,
			loadingInformacionParaCarga: false,
			datos: null,
			datosProductos: [],
			datosProveedores: [],

			arrayInformacionParaCarga: [],
			arrayProductosDesdeAPI: [],

			// nueva seccion
			active: 0

		};
	},
	computed: {
		importantInformation() {
			return i18n.IMPORTANT_INFORMATION;
		},
		importantInformationDescription() {
			return i18n.IMPORTANT_INFORMATION_DESCRIPTION;
		}
	},
	methods: {
		abrir(id) {
			this.active = 0;
			this.loading = true;
			this.loadingProductos = true;
			this.loadingProveedores = true;
			this.loadingInformacionParaCarga = true;
			this.id = null;
			this.id = id;
			this.datos = null;
			this.datosProductos = [];
			this.datosProveedores = [];
			this.arrayInformacionParaCarga = [];
			this.arrayProductosDesdeAPI = [];

			this.$refs.modal.abrir();

			// limpio los campos
			this.getDatos();
		},
		cerrar() {
			this.$refs.modal.cerrar();
		},
		async getDatos() {
			await this.axios
				.get("/api/presupuestacion/obtenerDatos/" + this.id)
				.then((response) => {
					const respuestaApi = response;

					if (respuestaApi != null) {
						this.datos = respuestaApi.data;
						this.loading = false;
						this.datosProductos = respuestaApi.data.productos;
						this.loadingProductos = false;
						this.datosProveedores = sortByField(respuestaApi.data.proveedores, 'proveedor_nombre') ;
						this.loadingProveedores = false;

						this.mostrarInformacionParaCargar();
					} else {
						this.cerrar();
					}
				});
		},
		// primero genero el array con todos los productos de la presupuestacion
		mostrarInformacionParaCargar() {
			this.datosProveedores.forEach((elemento) => {
				this.datosProductos.forEach((ele) => {
					let fila = {
						presupuestacion_productos_proveedores_id: 0,
						presupuestacion_plan_id: this.datos.presupuestacion_plan_id,
						presupuestacion_id: this.datos.presupuestacion_id,
						presupuestacion_producto_id: ele.presupuestacion_producto_id,
						presupuestacion_rubro_id: this.datos.presupuestacion_rubro_id,
						presupuestacion_rubro_nombre: this.datos.presupuestacion_rubro_nombre,
						proveedor_id: elemento.proveedor_id,
						proveedor_nombre: elemento.proveedor_nombre,
						proveedor_mail: elemento.proveedor_mail,
						producto_id: ele.producto_id,
						producto_nombre: ele.producto_nombre,
						producto_cantidad_real_a_comprar: ele.producto_cantidad_real_a_comprar,
						precio_png: 0,
						iva: 0,
						precio_pu: 0,
						precio_pp: 0,
						ya_agregado: 0
					};

					this.arrayInformacionParaCarga.push(fila);
				});
			});

			this.completarArrayConProductosAgregados();
		},
		// luego busco los productos que ya tengo creados y los reemplazo en el array
		async completarArrayConProductosAgregados() {
			await this.axios.get("/api/presupuestacionproductosproveedor/obtenerTodosProveedor/" + this.id)
				.then(response => {
					this.arrayProductosDesdeAPI = response.data;
				});

			this.arrayInformacionParaCarga.forEach((elemento) => {
				this.arrayProductosDesdeAPI.forEach((ele) => {
					if (elemento.presupuestacion_producto_id == ele.presupuestacion_producto_id && elemento.proveedor_id == ele.proveedor_id) {
						elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id,

						elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id;

						elemento.presupuestacion_producto_id = ele.presupuestacion_producto_id;

						elemento.presupuestacion_id = ele.presupuestacion_id;

						elemento.presupuestacion_plan_id = ele.presupuestacion_plan_id;

						elemento.presupuestacion_rubro_id = ele.presupuestacion_rubro_id;

						elemento.presupuestacion_rubro_nombre = ele.presupuestacion_rubro_nombre;

						elemento.proveedor_id = ele.proveedor_id;

						elemento.proveedor_nombre = ele.proveedor_nombre;

						elemento.proveedor_mail = ele.proveedor_mail;

						elemento.producto_id = ele.producto_id;

						elemento.producto_nombre = ele.producto_nombre;

						elemento.producto_cantidad_real_a_comprar = ele.producto_cantidad_a_comprar;

						elemento.precio_png = ele.precio_png;

						elemento.iva = ele.iva;

						elemento.precio_pu = ele.precio_pu;

						elemento.precio_pp = ele.precio_pp;

						elemento.ya_agregado = 1;
					}
				});
			});

			this.loadingInformacionParaCarga = false;
		},
		async onSubmit() {
			let params = { arrProductosProveedores: JSON.stringify(this.arrayInformacionParaCarga) };

			await this.axios.post("/api/presupuestacionproductosproveedor/crear", params)
				.then(response => {
					if (response) {
						ElMessage({
							type: 'success',
							message: '¡Carga realizada con éxito!'
						});
						// this.$emit('actualizarTabla')
						this.cerrar();
					}
				});
		}
	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Proveedores"
			:impedir-close="impedirClose"
			width="70%"
		>
			<div v-loading="loadingInformacionParaCarga">
				<el-alert
					:title="importantInformation"
					type="warning"
					:description="importantInformationDescription"
					show-icon
					:closable="false"
				/>

				<el-table
					:data="datosProveedores"
					stripe
					style="width: 100%"
				>
					<el-table-column
						prop="proveedor_id"
						label="ID"
						width="100px"
					/>

					<el-table-column
						prop="proveedor_nombre"
						label="Nombre"
					/>

					<el-table-column
						label="Cargar"
						prop="cargar"
						header-align="right"
						align="right"
						width="90px"
					>
						<template #default="props">
							<el-button
								type="primary"
								circle
								@click="$refs.modalCargaPorProveedor.abrir(props.row.proveedor_id, props.row.presupuestacion_id)"
							>
								<span class="material-icons">inventory_2</span>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</modal>
	</div>

	<modal-carga-por-proveedor
		ref="modalCargaPorProveedor"
	/>
</template>

<style scoped>
  .contenedorBtnSiguienteAtras {
    display: flex;
    width: 100%;
    margin-top: 10px;
  }

  .btnSiguiente {
    margin: auto;
    margin-right: 10px;
  }

</style>
