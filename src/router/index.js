import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('../views/login/index.vue')
        },
        {
            path: '/',
            component: () => import('../views/home/index.vue')
        },
        {
            path: '/presupuestacion',
            component: () => import('../views/presupuestacion/index.vue')
        },
        {
            path: '/borrador',
            component: () => import('../views/borrador/index.vue')
        },
        {
            path: '/ordencompra',
            component: () => import('../views/ordencompra/index.vue')
        },
        {
            path: '/transferencia',
            component: () => import('../views/transferencia/index.vue')
        },
        {
            path: '/plan',
            component: () => import('../views/plan/index.vue')
        },
        {
            path: '/producto',
            component: () => import('../views/producto/index.vue')
        },
        {
            path: '/categoria',
            component: () => import('../views/categoria/index.vue')
        },
        {
            path: '/unidad-medida',
            component: () => import('../views/unidadMedida/index.vue')
        },
        {
            path: '/proveedor',
            component: () => import('../views/proveedor/index.vue')
        },
        {
            path: '/cargaproveedores',
            component: () => import('../views/cargaproveedores/index.vue')
        },
        {
            path: '/rubro',
            component: () => import('../views/rubro/index.vue')
        },
        {
            path: '/usuarios',
            component: () => import('../views/usuarios/index.vue')
        },        
        {
            path: '/contacto',
            component: () => import('../views/contacto/index.vue')
        },
        {
            path: '/configuracion',
            component: () => import('../views/configuracion/index.vue')
        },
        {
            path: '/mi-cuenta',
            component: () => import('../views/miCuenta/index.vue')
        },
    ]
})

export default router