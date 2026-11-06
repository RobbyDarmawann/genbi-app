import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::riwayat
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
export const riwayat = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayat.url(options),
    method: 'get',
})

riwayat.definition = {
    methods: ["get","head"],
    url: '/poin/riwayat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::riwayat
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
riwayat.url = (options?: RouteQueryOptions) => {
    return riwayat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::riwayat
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
riwayat.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayat.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::riwayat
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
riwayat.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riwayat.url(options),
    method: 'head',
})
const poin = {
    riwayat: Object.assign(riwayat, riwayat),
}

export default poin