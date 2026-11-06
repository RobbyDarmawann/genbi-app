import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mahasiswa/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const kepengurusan = {
    index: Object.assign(index, index),
}

export default kepengurusan