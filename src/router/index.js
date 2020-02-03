import Vue from 'vue'
import Router from 'vue-router'
import provinceList from '@/components/ProvinceList'
import provinceChart from '@/components/ProvinceChart'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: 'home' },
        { path: '/list', name: 'list', component: provinceList },
        { path: '/detail', name: 'detail', component: provinceChart }
    ]
})
