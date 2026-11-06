import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/rekap',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/rekap/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})
const RekapController = { index, exportMethod, export: exportMethod }

export default RekapController