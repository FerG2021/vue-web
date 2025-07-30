export default {
	sections: [
		{
			name: 'Provisiones',
			icon: 'assignment',
			route: '/presupuestacion',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Borradores',
			icon: 'assignment_late',
			route: '/borrador',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Órdenes de compra',
			icon: 'receipt',
			route: '/ordencompra',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Transferencias',
			icon: 'move_up',
			route: '/transferencia',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Planes',
			icon: 'note_alt',
			route: '/plan',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Productos',
			icon: 'inventory_2',
			route: '/producto',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Proveedores',
			icon: 'local_shipping',
			route: '/proveedor',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		},
		{
			name: 'Rubros',
			icon: 'sell',
			route: '/rubro',
			allowedRoles: [
				1,
				3,
				4,
				5
			]
		},
		{
			name: 'Usuarios',
			icon: 'group',
			route: '/usuarios',
			allowedRoles: [1, 3]
		},
		{
			name: 'Mi cuenta',
			icon: 'account_circle',
			route: '/mi-cuenta',
			allowedRoles: [
				1,
				3,
				4,
				5,
				6
			]
		}
	]
};