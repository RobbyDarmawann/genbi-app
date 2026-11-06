import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import biodata from './biodata'
import kegiatan from './kegiatan'
import absensi from './absensi'
import kehadiran from './kehadiran'
import poin from './poin'
import koreksi from './koreksi'
import kepengurusan from './kepengurusan'
/**
* @see \App\Http\Controllers\Mahasiswa\DashboardController::dashboard
 * @see app/Http/Controllers/Mahasiswa/DashboardController.php:23
 * @route '/mahasiswa/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/mahasiswa/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\DashboardController::dashboard
 * @see app/Http/Controllers/Mahasiswa/DashboardController.php:23
 * @route '/mahasiswa/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\DashboardController::dashboard
 * @see app/Http/Controllers/Mahasiswa/DashboardController.php:23
 * @route '/mahasiswa/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\DashboardController::dashboard
 * @see app/Http/Controllers/Mahasiswa/DashboardController.php:23
 * @route '/mahasiswa/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const mahasiswa = {
    dashboard: Object.assign(dashboard, dashboard),
biodata: Object.assign(biodata, biodata),
kegiatan: Object.assign(kegiatan, kegiatan),
absensi: Object.assign(absensi, absensi),
kehadiran: Object.assign(kehadiran, kehadiran),
poin: Object.assign(poin, poin),
koreksi: Object.assign(koreksi, koreksi),
kepengurusan: Object.assign(kepengurusan, kepengurusan),
}

export default mahasiswa