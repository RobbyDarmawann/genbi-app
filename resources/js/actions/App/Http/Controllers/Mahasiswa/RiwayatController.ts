import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
    const kehadiranForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kehadiran.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
        kehadiranForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kehadiran.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::kehadiran
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:16
 * @route '/kehadiran'
 */
        kehadiranForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kehadiran.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kehadiran.form = kehadiranForm
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
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
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
poin.url = (options?: RouteQueryOptions) => {
    return poin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
poin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: poin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
poin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: poin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
    const poinForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: poin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
        poinForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: poin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\RiwayatController::poin
 * @see app/Http/Controllers/Mahasiswa/RiwayatController.php:54
 * @route '/poin/riwayat'
 */
        poinForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: poin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    poin.form = poinForm
const RiwayatController = { kehadiran, poin }

export default RiwayatController