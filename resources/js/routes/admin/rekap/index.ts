import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\RekapController::index
 * @see app/Http/Controllers/Admin/RekapController.php:20
 * @route '/admin/rekap'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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

    /**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\RekapController::exportMethod
 * @see app/Http/Controllers/Admin/RekapController.php:49
 * @route '/admin/rekap/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const rekap = {
    index: Object.assign(index, index),
export: Object.assign(exportMethod, exportMethod),
}

export default rekap