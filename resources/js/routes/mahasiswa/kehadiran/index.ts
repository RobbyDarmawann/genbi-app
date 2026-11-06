import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::index
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kehadiran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::index
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::index
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::index
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const kehadiran = {
    index: Object.assign(index, index),
}

export default kehadiran