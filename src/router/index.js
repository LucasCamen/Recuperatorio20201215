import { createWebHistory, createRouter } from 'vue-router'

import Formulario from '../components/Formulario.vue'

const routes = [
    { path: '/', name: 'Home', component: Formulario },
    { path: '/formulario', name: 'Formulario', component: Formulario },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router


