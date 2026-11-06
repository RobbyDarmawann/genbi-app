import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import kegiatan from './kegiatan'
import mahasiswa from './mahasiswa'
import periode from './periode'
import komsat from './komsat'
import divisi from './divisi'
import kehadiran from './kehadiran'
import koreksi from './koreksi'
import rekap from './rekap'
import kepengurusan from './kepengurusan'
/**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/DashboardController.php:19
 * @route '/admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
kegiatan: Object.assign(kegiatan, kegiatan),
mahasiswa: Object.assign(mahasiswa, mahasiswa),
periode: Object.assign(periode, periode),
komsat: Object.assign(komsat, komsat),
divisi: Object.assign(divisi, divisi),
kehadiran: Object.assign(kehadiran, kehadiran),
koreksi: Object.assign(koreksi, koreksi),
rekap: Object.assign(rekap, rekap),
kepengurusan: Object.assign(kepengurusan, kepengurusan),
}

export default admin