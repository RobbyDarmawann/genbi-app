import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
export const kehadiran = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kehadiran.url(options),
    method: 'get',
})

kehadiran.definition = {
    methods: ["get","head"],
    url: '/kehadiran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
kehadiran.url = (options?: RouteQueryOptions) => {
    return kehadiran.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
kehadiran.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kehadiran.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
kehadiran.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kehadiran.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
export const poin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: poin.url(options),
    method: 'get',
})

poin.definition = {
    methods: ["get","head"],
    url: '/poin/riwayat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
poin.url = (options?: RouteQueryOptions) => {
    return poin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
poin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: poin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:55
 * @route '/poin/riwayat'
 */
poin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: poin.url(options),
    method: 'head',
})
const RiwayatController = { kehadiran, poin }

export default RiwayatController