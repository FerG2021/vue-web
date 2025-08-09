<script>
import { ElMessage } from 'element-plus';

export default {
	name: 'ModificarProveedorModal',
	emits: ['actualizarTabla'],
	data() {
		return {
			form: {
				nombre: null,
				precio: null,
				stock: null,
				unidadMedida: null,
				idUnidadMedida: null,
				categoria: null,
				idCategoria: null,
				mail: null
			},
			id: null,
			articulos: [],
			loading: false,
			loadingBtnGuardar: false,
			mailApi: null
		};
	},

	methods: {
		abrir(id) {
			this.loading = true;
			this.id = null;
			this.id = id;

			this.$refs.modal.abrir();

			// limpio los campos
			this.form.nombre = null;
			this.form.precio = null;
			this.form.stock = null;
			this.form.unidadMedida = null;
			this.form.idUnidadMedida = null;
			this.form.categoria = null;
			this.form.idCategoria = null;
			this.form.mail = null;
			this.mailApi = null;

			this.getDatos();
			this.categoriaObtenerTodosSelect();
			this.unidadMedidaObtenerTodosSelect();
		},
		cerrar() {
			this.$refs.modal.cerrar();
		},
		async getDatos() {
			await this.axios.get("/api/proveedor/obtenerDatos/" + this.id)
				.then(response => {
					const respuestaApi = response.data;

					if (respuestaApi != null) {
						this.form.mail = respuestaApi.proveedor_email;
						this.mailApi = respuestaApi.proveedor_email;
						this.loading = false;
					} else {
						this.cerrar();
					}
				});
		},
		async categoriaObtenerTodosSelect() {
			await this.axios.get(this.base_url + "/api/categoria/obtenerTodosSelectt")
				.then(response => {
					this.categoriasSelect = response.data;
				});
		},
		async unidadMedidaObtenerTodosSelect() {
			await this.axios.get(this.base_url + "/unidad-medida/obtenerTodosSelect")
				.then(response => {
					this.unidadMedidaSelect = response.data;
				});
		},
		cambiarValorIDUnMed() {
			this.form.idUnidadMedida = this.form.unidadMedida;
		},
		cambiarValorIDCategoria() {
			this.form.idCategoria = this.form.categoria;
		},
		onSubmit() {
			if (this.mailApi == this.form.mail) {
				ElMessage({
					type: 'error',
					message: 'El mail ingresado y el que se encuentra guardado son iguales'
				});
			} else {
				this.loadingBtnGuardar = true;
				let params = {
					id: this.id,
					email: this.form.mail
				};
				this.axios.post("/api/proveedor/actualizar", params)
					.then(response => {
						if (response.data.code == 400) {
							let erroresMostrar = "// ";
							let erorres = Object.values(response.data.data);

							erorres.forEach((elemento) => {
								erroresMostrar = erroresMostrar + " " + elemento + " //";
							});

							ElMessage({
								type: 'error',
								grouping: true,
								message: erroresMostrar,
								duration: 5000
							});
						} else {
							ElMessage({
								type: 'success',
								message: '¡Mail modificado con éxito!'
							});
							this.$emit('actualizarTabla');
							this.cerrar();
						}

						this.loadingBtnGuardar = false;
					})
					.catch(error => {
						console.log(error);
					});
			}
		},
		deshabilitarBtnGuardar() {
			if (this.form.nombre == null ||
            this.form.nombre == "" ||
            this.form.precio == null ||
            this.form.precio == 0 ||
            this.form.precio == "" ||
            this.form.stock == null ||
            this.form.stock == 0 ||
            this.form.stock == "")
			{
				return true;
			} else {
				return false;
			}
		}
	}
};
</script>

<template>
	<div>
		<modal
			ref="modal"
			titulo="Modificar mail del proveedor"
			:impedir-close="impedirClose"
		>
			<el-form
				v-loading="loading"
				label-width="120px"
				:rules="formRules"
			>
				<el-form-item
					label="Mail"
					prop="nombre"
				>
					<el-input v-model="form.mail" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button
					type="primary"
					:loading="loadingBtnGuardar"
					@click="onSubmit()"
				>
					Guardar
				</el-button>
			</template>
		</modal>
	</div>
</template>

<style>

</style>