import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/koreksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/koreksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const KoreksiController = { index, store }

export default KoreksiController