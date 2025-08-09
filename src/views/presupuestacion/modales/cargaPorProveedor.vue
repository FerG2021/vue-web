<script>
import { ElMessage } from "element-plus";

export default {
	name: 'ModalCargaPorProveedor',
	data() {
		return {
			idProveedor: null,
			idPresupuestacion: null,
			arrayInformacionParaCarga: [],
			datosGenerales: null,
			datosProductos: [],
			datosProveedor: null,
			arrayInformacionParaCarga: [],
			arrayProductosDesdeAPI: [],

			loadingDatosProveedor: false,
			loadingArrayInformacionParaCarga: false,

			totalPP: 0,
			precioFlete: null,
			facturaA: null,
			montoIVA: 0,
			disabledEmiteFactura: true,
			arrayCondicionesPago: [],
			condicionpago: null,
			descuentosyBonificaciones: null,
			totalHomogeneo: null,
			loadingBtnGuardar: false,
			diaPago: null,
			diaPagoSinFormatear: null,

			opcionesFacturaA: [{
				value: '1',
				label: 'Si'
			},
			{
				value: '0',
				label: 'No'
			}]

		};
	},

	methods: {
		abrir(idProveedor, idPresupuestacion) {
			this.loadingDatosProveedor = true;
			this.loadingArrayInformacionParaCarga = true;

			this.idProveedor = null;
			this.idProveedor = idProveedor;

			this.idPresupuestacion = null;
			this.idPresupuestacion = idPresupuestacion;

			this.arrayInformacionParaCarga = [];
			this.datosGenerales = null;
			this.datosProductos = [];
			this.datosProveedor = null;
			this.arrayInformacionParaCarga = [];
			this.arrayProductosDesdeAPI = [];

			this.totalPP = 0;
			this.precioFlete = null;
			this.facturaA = null;
			this.montoIVA = 0;
			this.disabledEmiteFactura = true;

			this.arrayCondicionesPago = [];
			this.condicionpago = null;
			this.descuentosyBonificaciones = null;
			this.totalHomogeneo = null;
			this.diaPago = null;
			this.diaPagoSinFormatear = null;

			this.loadingBtnGuardar = false;

			this.$refs.modal.abrir();

			this.getCondicionesPago();
			this.getDatos();
		},

		cerrar() {
			this.$refs.modal.cerrar();
		},

		async getDatos() {
			await this.axios
				.get("/api/presupuestacion/obtenerDatos/" + this.idPresupuestacion)
				.then((response) => {
					const respuestaApi = response;

					if (respuestaApi != null) {
						this.datosGenerales = respuestaApi.data;

						this.datosProductos = respuestaApi.data.productos;
						let proveedoresApi = [];
						proveedoresApi = respuestaApi.data.proveedores;

						proveedoresApi.forEach((elemento) => {
							if (this.idProveedor == elemento.proveedor_id) {
								let fila = {
									presupuestacion_id: elemento.presupuestacion_id,
									presupuestacion_plan_id: elemento.presupuestacion_plan_id,
									presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id,
									proveedor_id: elemento.proveedor_id,
									proveedor_mail: elemento.proveedor_mail,
									proveedor_nombre: elemento.proveedor_nombre,
									proveedor_rubro_id: elemento.proveedor_rubro_id
								};

								this.datosProveedor = fila;
							}
						});
						this.loadingDatosProveedor = false;

						this.mostrarInformacionParaCargar();
					} else {
						this.cerrar();
					}
				});
		},

		async getCondicionesPago() {
			await this.axios
				.get("/api/condicionpago/obtenerTodos")
				.then((response) => {
					const respuestaApi = response;

					this.arrayCondicionesPago = respuestaApi.data;
				});
		},

		mostrarInformacionParaCargar() {
			this.datosProductos.forEach((ele) => {
				let fila = {
					presupuestacion_productos_proveedores_id: 0,
					presupuestacion_plan_id: this.datosGenerales.presupuestacion_plan_id,
					presupuestacion_id: this.datosGenerales.presupuestacion_id,
					presupuestacion_producto_id: ele.productoPresupuestacion.presupuestacion_producto_id,
					presupuestacion_rubro_id: this.datosGenerales.presupuestacion_rubro_id,
					presupuestacion_rubro_nombre: this.datosGenerales.presupuestacion_rubro_nombre,
					proveedor_id: this.datosProveedor.proveedor_id,
					proveedor_nombre: this.datosProveedor.proveedor_nombre,
					proveedor_mail: this.datosProveedor.proveedor_mail,
					producto_id: ele.productoPresupuestacion.producto_id,
					producto_nombre: ele.productoPresupuestacion.producto_nombre,
					producto_cantidad_a_comprar: ele.productoPresupuestacion.producto_cantidad_a_comprar,
					producto_cantidad_real_a_comprar: ele.productoPresupuestacion.producto_cantidad_real_a_comprar,
					precio_png: ele.productoPresupuestacion.precio_png,
					factor: 1,
					cantidad_proveedor: ele.productoPresupuestacion.producto_cantidad_real_a_comprar,
					// iva: ele.productoPresupuestacion.iva,
					iva: 21,
					total_iva: null,
					precio_pu: ele.productoPresupuestacion.precio_pu,
					precio_pp: ele.productoPresupuestacion.precio_pp,
					unidad_medida: ele.producto.producto_unidad,
					observaciones: ele.productoPresupuestacion.producto_observaciones,
					ya_agregado: 0
				};

				this.arrayInformacionParaCarga.push(fila);
			});

			this.completarArrayConProductosAgregados();
		},

		// luego busco los productos que ya tengo creados y los reemplazo en el array
		async completarArrayConProductosAgregados() {
			let params = {
				idPresupuestacion: this.idPresupuestacion,
				idProveedor: this.idProveedor
			};
			await this.axios.post("/api/presupuestacionproductosproveedor/obtenerTodosDatos", params)
				.then(response => {
					this.arrayProductosDesdeAPI = response.data.productoProveedor;

					//  total PP
					this.totalPP = response.data.presupuestacionProveedorDB.proveedor_monto_totalPP;

					// precio Flete
					this.precioFlete = response.data.presupuestacionProveedorDB.proveedor_monto_flete;

					// factura A
					if (response.data.presupuestacionProveedorDB.proveedor_factura_A == 1) {
						this.facturaA = "Si";
					} else {
						this.facturaA = "No";
					}

					// monto factura A
					if (response.data.presupuestacionProveedorDB.proveedor_monto_factura_A == null) {
						this.montoIVA = 0;
					} else {
						this.montoIVA = response.data.presupuestacionProveedorDB.proveedor_monto_factura_A;
					}

					// Forma de pago
					this.arrayCondicionesPago.forEach((elemento) => {
						if (elemento.condicionpago_id == response.data.presupuestacionProveedorDB.proveedor_forma_de_pago) {
							this.condicionpago = elemento.condicionpago_nombre;
						}
					});

					// descuento y bonificacion
					this.descuentosyBonificaciones = response.data.presupuestacionProveedorDB.proveedor_monto_descuentos_bonificaciones;

					// total homogeneo
					this.totalHomogeneo = response.data.presupuestacionProveedorDB.proveedor_monto_total_homogeneo;
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
						//
						elemento.producto_id = ele.producto_id;

						elemento.producto_nombre = ele.producto_nombre;

						elemento.producto_cantidad_real_a_comprar = ele.producto_cantidad_a_comprar;

						elemento.factor = ele.factor;

						elemento.cantidad_proveedor = ele.cantidad_proveedor;

						elemento.precio_png = ele.precio_png;

						elemento.iva = ele.iva;

						elemento.total_iva = ele.total_iva;

						elemento.precio_pu = ele.precio_pu;

						elemento.precio_pp = ele.precio_pp;

						elemento.ya_agregado = 1;
					}
				});
			});

			this.loadingArrayInformacionParaCarga = false;
		},

		getSummaries(param) {
			const tabla = this.$refs.tablaComparativa;
			const { columns, data } = param;
			const sums = [];
			let ind = 8;
			sums[ind] = 0;
			let num = 0;

			this.arrayInformacionParaCarga.forEach((elemento, index) => {
				if (index == 0) {
					sums[index] = 'Total';
				}

				num = Number(sums[ind]) + Number(elemento.total_iva);
				sums[ind] = num.toFixed(2);
			});

			return sums;
		},

		cambiarCantidadProveedor(props) {
			this.arrayInformacionParaCarga[props.$index].cantidad_proveedor = this.arrayInformacionParaCarga[props.$index].producto_cantidad_real_a_comprar * this.arrayInformacionParaCarga[props.$index].factor;

			this.calcularPrecioPP(props);
		},

		calcularPrecioPP(props) {
			if (this.arrayInformacionParaCarga[props.$index].iva != null &&
        this.arrayInformacionParaCarga[props.$index].precio_png != null
			) {
				// calculo pu
				let iva = parseFloat(this.arrayInformacionParaCarga[props.$index].iva);
				let porcentaje = iva * 0.01;
				let precioParcial = parseFloat(porcentaje * this.arrayInformacionParaCarga[props.$index].precio_png);

				this.arrayInformacionParaCarga[props.$index].total_iva = precioParcial.toFixed(2);

				let precio_png = parseFloat(this.arrayInformacionParaCarga[props.$index].precio_png);
				let precio_pu = (precio_png + precioParcial).toFixed(2);

				this.arrayInformacionParaCarga[props.$index].precio_pu = precio_pu;

				this.arrayInformacionParaCarga[props.$index].precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pu * this.arrayInformacionParaCarga[props.$index].cantidad_proveedor;

				let precio_pp = this.arrayInformacionParaCarga[props.$index].precio_pp;

				this.arrayInformacionParaCarga[props.$index].precio_pp = precio_pp.toFixed(2);
				this.sumarPP(props);

				this.calcularMontoIVA(props);
			}
		},

		calcularMontoIVA(props) {
		},

		sumarPP(props) {
			this.totalPP = 0;
			this.arrayInformacionParaCarga.forEach((elemento) => {
				if (elemento.precio_pp != null) {
					this.totalPP = this.totalPP + parseFloat(elemento.precio_pp);
				}
			});

			let total = this.totalPP.toFixed(2);
			this.totalPP = total;

			this.calcularTotalHomegeno();
		},

		cambiarDisabledEmiteFactura() {
			if (this.facturaA == 0 || this.facturaA === "No") {
				this.disabledEmiteFactura = false;
			} else {
				if (this.facturaA == 1 || this.facturaA == "Si") {
					this.disabledEmiteFactura = true;
					this.montoIVA = 0;
					this.calcularTotalHomegeno();
				}
			}
		},

		calcularTotalHomegeno() {
			let totalHomogeneoVar = parseFloat(this.totalPP) + parseFloat(this.precioFlete) + parseFloat(this.descuentosyBonificaciones) + parseFloat(this.montoIVA);

			this.totalHomogeneo = totalHomogeneoVar.toFixed(2);
		},

		cambiaCondicionPago() {
			let date = null;
			date = new Date();
			let nuevoDate = Date();
			nuevoDate = date.setDate(date.getDate() + 180);

			// 0 - 180
			if (this.condicionpago == 39) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 180));
				this.diaPago = nuevoDate;
			}

			// 0 -30
			if (this.condicionpago == 26) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30));
				this.diaPago = nuevoDate;
			}

			// 0 - 30 - 60
			if (this.condicionpago == 25) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60));
				this.diaPago = nuevoDate;
			}

			// 0 - 45
			if (this.condicionpago == 30) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45));
				this.diaPago = nuevoDate;
			}

			// 0 - 10
			if (this.condicionpago == 17) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 10));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 10);
				this.diaPago = nuevoDate;
			}

			// 15 - 20
			if (this.condicionpago == 20) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 20));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 20);
				this.diaPago = nuevoDate;
			}

			// 15 - 30
			if (this.condicionpago == 18) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 30);
				this.diaPago = nuevoDate;
			}

			// 15 - 30 - 45 - 60 - 75
			if (this.condicionpago == 34) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 75));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 75);
				this.diaPago = nuevoDate;
			}

			// 15 - 45 - 75
			if (this.condicionpago == 24) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 75));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 75);
				this.diaPago = nuevoDate;
			}

			// 20 - 45
			if (this.condicionpago == 19) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 75);
				this.diaPago = nuevoDate;
			}

			// 30
			if (this.condicionpago == 22) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 30));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 30);
				this.diaPago = nuevoDate;
			}

			// 30 - 60
			if (this.condicionpago == 10) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 60);
				this.diaPago = nuevoDate;
			}

			// 45
			if (this.condicionpago == 27) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 45));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 45);
				this.diaPago = nuevoDate;
			}

			// 45 - 60
			if (this.condicionpago == 16) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 60);
				this.diaPago = nuevoDate;
			}

			// 45 - 60 - 75 - 105
			if (this.condicionpago == 36) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 105));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 105);
				this.diaPago = nuevoDate;
			}

			// 45 - 60 - 90
			if (this.condicionpago == 14) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 90);
				this.diaPago = nuevoDate;
			}

			// 60
			if (this.condicionpago == 28) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 60);
				this.diaPago = nuevoDate;
			}

			// 60 - 90
			if (this.condicionpago == 37) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 90);
				this.diaPago = nuevoDate;
			}

			// 60 - 90 - 120
			if (this.condicionpago == 38) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 120));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 120);
				this.diaPago = nuevoDate;
			}

			// 90
			if (this.condicionpago == 12) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 90);
				this.diaPago = nuevoDate;
			}

			// 1
			if (this.condicionpago == 23) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 1));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 1);
				this.diaPago = nuevoDate;
			}

			// 0 - 30 - 60
			if (this.condicionpago == 32) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 60));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 60);
				this.diaPago = nuevoDate;
			}

			// 0 - 30 - 60 - 90
			if (this.condicionpago == 33) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 90);
				this.diaPago = nuevoDate;
			}

			// 30 - 70
			if (this.condicionpago == 35) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 70));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 70);
				this.diaPago = nuevoDate;
			}

			// 90
			if (this.condicionpago == 29) {
				let nuevoDate = this.formatearFecha(date.setDate(date.getDate() + 90));
				this.diaPagoSinFormatear = date.setDate(date.getDate() + 90);
				this.diaPago = nuevoDate;
			}

			if (this.condicionpago != 39 &&
          this.condicionpago != 26 &&
          this.condicionpago != 25 &&
          this.condicionpago != 30 &&
          this.condicionpago != 17 &&
          this.condicionpago != 20 &&
          this.condicionpago != 18 &&
          this.condicionpago != 34 &&
          this.condicionpago != 24 &&
          this.condicionpago != 19 &&
          this.condicionpago != 22 &&
          this.condicionpago != 10 &&
          this.condicionpago != 27 &&
          this.condicionpago != 16 &&
          this.condicionpago != 36 &&
          this.condicionpago != 14 &&
          this.condicionpago != 28 &&
          this.condicionpago != 37 &&
          this.condicionpago != 38 &&
          this.condicionpago != 12 &&
          this.condicionpago != 23 &&
          this.condicionpago != 32 &&
          this.condicionpago != 33 &&
          this.condicionpago != 35 &&
          this.condicionpago != 29
			) {
				this.diaPago = null;
			}
		},

		formatearFecha(fecha) {
			let fecha1 = new Date(fecha);
			this.diaPagoSinFormatear = fecha1.getUTCDate();
			let fecha2 = fecha1.toLocaleDateString();

			return fecha2;
		},

		async onSubmit() {
			if (this.condicionpago == null) {
				ElMessage({
					type: 'error',
					message: '¡Se debe seleccionar forma de pago!'
				});
			} else {
				this.loadingBtnGuardar = true;
				let params = {
					idProveedor: this.idProveedor,
					idPresupuestacion: this.idPresupuestacion,
					totalPP: this.totalPP,
					precioFlete: this.precioFlete,
					proveedor_monto_factura_A: this.montoIVA,
					descuentosyBonificaciones: this.descuentosyBonificaciones,
					totalHomogeneo: this.totalHomogeneo,
					arrProductosProveedores: JSON.stringify(this.arrayInformacionParaCarga)
				};

				this.opcionesFacturaA.forEach((ele) => {
					if (this.facturaA == ele.value || this.facturaA == ele.label) {
						params.facturaA = ele.value;
					}
				});

				this.arrayCondicionesPago.forEach((elemento) => {
					if (this.condicionpago === elemento.condicionpago_nombre || this.condicionpago === elemento.condicionpago_id
					) {
						params.condicionpago = elemento.condicionpago_id;
					}
				});

				await this.axios.post("/api/presupuestacionproductosproveedor/crear", params)
					.then(response => {
						console.log(response);

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
		},

		classChecker({ row, column }) {
			if (column.property == "pp") {
			}
		}

	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Carga de los productos según proveedor"
			:impedir-close="impedirClose"
			width="90%"
		>
			<div v-loading="loadingDatosProveedor">
				<div v-if="datosProveedor">
					<el-descriptions
						title="Datos del proveedor"
						:column="3"
						border
					>
						<el-descriptions-item
							label="Proveedor"
							label-align="center"
							align="center"
						>
							<b>{{ datosProveedor.proveedor_nombre }}</b>
						</el-descriptions-item>

						<el-descriptions-item
							label="Mail"
							label-align="center"
							align="center"
						>
							{{ datosProveedor.proveedor_mail }}
						</el-descriptions-item>
					</el-descriptions>
				</div>
			</div>
			<div v-loading="loadingArrayInformacionParaCarga">
				<div
					v-if="arrayInformacionParaCarga"
					style="margin-top: 20px"
				>
					<el-table
						:data="arrayInformacionParaCarga"
						stripe
						style="width: 100%; margin-top: 15px"
						:cell-class-name="classChecker"
						:summary-method="getSummaries"
						show-summary
					>
						<el-table-column
							prop="nombre"
							label="Nombre"
							min-width="150"
						>
							<template #default="props">
								{{ props.row.producto_nombre }}
							</template>
						</el-table-column>

						<el-table-column
							prop="rubro"
							label="Rubro"
						>
							<template #default="props">
								{{ props.row.presupuestacion_rubro_nombre }}
							</template>
						</el-table-column>

						<el-table-column
							prop="unidadMedida"
							label="U. M."
						>
							<template #default="props">
								{{ props.row.unidad_medida }}
							</template>
						</el-table-column>

						<el-table-column
							prop="cantidad"
							label="Cantidad"
						>
							<template #default="props">
								{{ props.row.producto_cantidad_real_a_comprar }}
							</template>
						</el-table-column>

						<el-table-column
							prop="observaciones"
							label="Observaciones"
						>
							<template #default="props">
								{{ props.row.observaciones }}
							</template>
						</el-table-column>

						<el-table-column
							prop="factor"
							label="Factor"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.factor"
									:controls="false"
									style="width: 100%"
									@change="cambiarCantidadProveedor(props)"
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="cantidadProveedor"
							label="Cant. prov."
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.cantidad_proveedor"
									:controls="false"
									style="width: 100%"
									disabled
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="png"
							label="PNG"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.precio_png"
									:controls="false"
									style="width: 100%"
									@change="calcularPrecioPP(props)"
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="iva"
							label="IVA"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.iva"
									:controls="false"
									style="width: 100%"
									@change="calcularPrecioPP(props)"
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="montoIva"
							label="Total IVA"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.total_iva"
									:controls="false"
									style="width: 100%"
									disabled
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="pu"
							label="PU"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.precio_pu"
									:controls="false"
									style="width: 100%"
									disabled
								/>
							</template>
						</el-table-column>

						<el-table-column
							prop="pp"
							label="PP"
							align="center"
						>
							<template #default="props">
								<el-input-number
									v-model="props.row.precio_pp"
									:controls="false"
									style="width: 100%"
									disabled
								/>
							</template>
						</el-table-column>
					</el-table>

					<el-row
						:gutter="10"
						style="margin-top: 15px"
					>
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="6" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3">
							<span style="text-align: center">Total PP</span>
							<el-input-number
								v-model="totalPP"
								:controls="false"
								style="width: 100%"
								disabled
								@change="calcularTotalHomegeno()"
							/>
						</el-col>
					</el-row>

					<el-row
						:gutter="10"
						style="margin-top: 10px"
					>
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="6">
							<span>Forma de pago</span>
							<el-select
								v-model="condicionpago"
								placeholder="Forma de pago"
								style="width: 100%"
								filterable
								@change="cambiaCondicionPago()"
							>
								<el-option
									v-for="item in arrayCondicionesPago"
									:key="item.condicionpago_id"
									:label="item.condicionpago_nombre"
									:value="item.condicionpago_id"
								/>
							</el-select>
						</el-col>

						<el-col :span="3">
							<span>¿Factura A?</span>
							<el-select
								v-model="facturaA"
								placeholder="Seleccione"
								style="width: 100%"
								@change="cambiarDisabledEmiteFactura()"
							>
								<el-option
									v-for="item in opcionesFacturaA"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-col>
						<!-- {{facturaA}} -->
						<el-col :span="3">
							<span style="text-align: center">Monto desc. x IVA</span>
							<el-input-number
								v-model="montoIVA"
								:controls="false"
								style="width: 100%"
								:disabled="disabledEmiteFactura"
								@change="calcularTotalHomegeno()"
							/>
						</el-col>
					</el-row>

					<el-row
						:gutter="10"
						style="margin-top: 10px"
					>
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="6" />
						<el-col :span="3" />
						<el-col :span="3">
							<span style="text-align: center">Flete</span>
							<el-input-number
								v-model="precioFlete"
								:controls="false"
								style="width: 100%"
								:min="0"
								@change="calcularTotalHomegeno()"
							/>
						</el-col>
					</el-row>

					<el-row
						:gutter="10"
						style="margin-top: 10px"
					>
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="6" />
						<el-col :span="3" />
						<el-col :span="3">
							<span style="text-align: center">Desc. y bonif. (num. neg.)</span>
							<el-input-number
								v-model="descuentosyBonificaciones"
								:controls="false"
								style="width: 100%"
								:max="0"
								@change="calcularTotalHomegeno()"
							/>
						</el-col>
					</el-row>

					<el-row
						:gutter="10"
						style="margin-top: 10px"
					>
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="3" />
						<el-col :span="6" />
						<el-col :span="3" />
						<el-col :span="3">
							<span style="text-align: center">Total</span>
							<el-input-number
								v-model="totalHomogeneo"
								:controls="false"
								style="width: 100%"
								:min="0"
								disabled
							/>
						</el-col>
					</el-row>
				</div>

				<div class="contenedorBtnSiguienteAtras">
					<el-button
						v-if="
							$store.state.user.tipo_usuario == 1 ||
								$store.state.user.tipo_usuario == 5 "
						type="primary"
						class="btnSiguiente"
						:loading="loadingBtnGuardar"
						@click="onSubmit()"
					>
						Guardar
					</el-button>
				</div>
			</div>
		</modal>
	</div>
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
