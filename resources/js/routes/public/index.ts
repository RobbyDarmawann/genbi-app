import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import jadwalE4a04c from './jadwal'
/**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
export const jadwal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwal.url(options),
    method: 'get',
})

jadwal.definition = {
    methods: ["get","head"],
    url: '/jadwal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
jadwal.url = (options?: RouteQueryOptions) => {
    return jadwal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
jadwal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
jadwal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jadwal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
    const jadwalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: jadwal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
        jadwalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jadwal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\JadwalController::jadwal
 * @see app/Http/Controllers/Public/JadwalController.php:14
 * @route '/jadwal'
 */
        jadwalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jadwal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    jadwal.form = jadwalForm
/**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
export const statistik = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistik.url(options),
    method: 'get',
})

statistik.definition = {
    methods: ["get","head"],
    url: '/statistik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
statistik.url = (options?: RouteQueryOptions) => {
    return statistik.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
statistik.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistik.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
statistik.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistik.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
    const statistikForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: statistik.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
        statistikForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistik.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\StatistikController::statistik
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
        statistikForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistik.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    statistik.form = statistikForm
/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
export const kepengurusan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kepengurusan.url(options),
    method: 'get',
})

kepengurusan.definition = {
    methods: ["get","head"],
    url: '/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
kepengurusan.url = (options?: RouteQueryOptions) => {
    return kepengurusan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
kepengurusan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kepengurusan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
kepengurusan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kepengurusan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
    const kepengurusanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kepengurusan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
        kepengurusanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kepengurusan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\KepengurusanController::__invoke
 * @see app/Http/Controllers/Public/KepengurusanController.php:15
 * @route '/kepengurusan'
 */
        kepengurusanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kepengurusan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kepengurusan.form = kepengurusanForm
const publicMethod = {
    jadwal: Object.assign(jadwal, jadwalE4a04c),
statistik: Object.assign(statistik, statistik),
kepengurusan: Object.assign(kepengurusan, kepengurusan),
}

export default publicMethod