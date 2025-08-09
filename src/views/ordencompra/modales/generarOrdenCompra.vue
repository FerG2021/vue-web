<script>
import modalOrdenCompraAdelantada from './ordenCompraAdelantada.vue';
import modalOrdenCompraNormal from './ordenCompraNormal.vue';

export default {
	components: {
		modalOrdenCompraNormal,
		modalOrdenCompraAdelantada
	},
	emits: ['actualizar-tabla'],
	data() {
		return {
			id: null,
			loadingDatos: false,
			datos: null
		};
	},
	methods: {
		abrir(id) {
			this.loadingDatos = true;
			this.id = null;
			this.id = id;
			this.datos = null;

			this.$refs.modal.abrir();

			// limpio los campos
			this.getDatos();
		},
		cerrarDesdeCreada() {
			this.$emit("actualizar-tabla");
			this.$refs.modal.cerrar();
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
						this.datos = respuestaApi.data;
						this.loadingDatos = false;
					} else {
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
			titulo="Generar orden de compra"
			:impedir-close="impedirClose"
		>
			<div v-loading="loadingDatos">
				<h3 style="text-align: center">
					Seleccione el tipo de orden de compra que desea generar
				</h3>

				<div style="display: flex; margin-top: 20px">
					<div style="margin: auto">
						<el-button
							type="primary"
							@click="$refs.modalOrdenCompraNormal.abrir(datos)"
						>
							Orden de compra normal
						</el-button>

						<el-button
							type="primary"
							@click="$refs.modalOrdenCompraAdelantada.abrir(datos)"
						>
							Orden de compra adelantada
						</el-button>
					</div>
				</div>
			</div>
		</modal>
	</div>

	<modal-orden-compra-normal
		ref="modalOrdenCompraNormal"
		@ordenCreada="cerrarDesdeCreada"
	/>

	<modal-orden-compra-adelantada
		ref="modalOrdenCompraAdelantada"
		@ordenCreada="cerrarDesdeCreada"
	/>
</template>
