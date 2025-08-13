import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
	{
		path: '/login',
		component: () => import('../views/login/index.vue'),
		isVisibleInDashboard: false,
		isVisibleInSidebar: false
	},
	{
		path: '/',
		component: () => import('../views/home/index.vue'),
		isVisibleInDashboard: false,
		name: 'Home',
		icon: 'home',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/presupuestacion',
		component: () => import('../views/presupuestacion/index.vue'),
		name: 'Provisiones',
		icon: 'assignment',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/borrador',
		component: () => import('../views/borrador/index.vue'),
		name: 'Borradores',
		icon: 'assignment_late',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/ordencompra',
		component: () => import('../views/ordencompra/index.vue'),
		name: 'Órdenes de compra',
		icon: 'receipt',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/transferencia',
		component: () => import('../views/transferencia/index.vue'),
		name: 'Transferencias',
		icon: 'move_up',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/cargaproveedores',
		component: () => import('../views/cargaproveedores/index.vue'),
		isVisibleInDashboard: false,
		allowedRoles: [2]
	},
	{
		path: '/plan',
		component: () => import('../views/plan/index.vue'),
		name: 'Planes',
		icon: 'note_alt',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/producto',
		component: () => import('../views/producto/index.vue'),
		name: 'Productos',
		icon: 'inventory_2',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/proveedor',
		component: () => import('../views/proveedor/index.vue'),
		name: 'Proveedores',
		icon: 'local_shipping',
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/rubro',
		component: () => import('../views/rubro/index.vue'),
		name: 'Rubros',
		icon: 'sell',
		allowedRoles: [
			1,
			3,
			4,
			5
		]
	},
	{
		path: '/usuarios',
		component: () => import('../views/usuarios/index.vue'),
		name: 'Usuarios',
		icon: 'group',
		allowedRoles: [1, 3]
	},
	{
		path: '/mi-cuenta',
		component: () => import('../views/miCuenta/index.vue'),
		name: 'Mi cuenta',
		icon: 'account_circle',
		isVisibleInSidebar: false,
		allowedRoles: [
			1,
			3,
			4,
			5,
			6
		]
	},
	{
		path: '/categoria',
		component: () => import('../views/categoria/index.vue'),
		isVisibleInSidebar: false,
		isVisibleInDashboard: false
	},
	{
		path: '/unidad-medida',
		component: () => import('../views/unidadMedida/index.vue'),
		isVisibleInSidebar: false,
		isVisibleInDashboard: false
	},
	{
		path: '/contacto',
		component: () => import('../views/contacto/index.vue'),
		isVisibleInSidebar: false,
		isVisibleInDashboard: false
	},
	{
		path: '/configuracion',
		component: () => import('../views/configuracion/index.vue'),
		isVisibleInSidebar: false,
		isVisibleInDashboard: false
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;