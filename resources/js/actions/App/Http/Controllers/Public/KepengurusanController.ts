import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
const KepengurusanController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KepengurusanController.url(options),
    method: 'get',
})

KepengurusanController.definition = {
    methods: ["get","head"],
    url: '/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
KepengurusanController.url = (options?: RouteQueryOptions) => {
    return KepengurusanController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
KepengurusanController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KepengurusanController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
KepengurusanController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: KepengurusanController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\KepengurusanController::mahasiswa
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
export const mahasiswa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mahasiswa.url(options),
    method: 'get',
})

mahasiswa.definition = {
    methods: ["get","head"],
    url: '/mahasiswa/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\KepengurusanController::mahasiswa
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
mahasiswa.url = (options?: RouteQueryOptions) => {
    return mahasiswa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\KepengurusanController::mahasiswa
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
mahasiswa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mahasiswa.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\KepengurusanController::mahasiswa
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
mahasiswa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mahasiswa.url(options),
    method: 'head',
})
KepengurusanController.mahasiswa = mahasiswa

export default KepengurusanController