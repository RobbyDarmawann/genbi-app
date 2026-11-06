import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
export const bukti = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bukti.url(args, options),
    method: 'get',
})

bukti.definition = {
    methods: ["get","head"],
    url: '/koreksi/{koreksi}/bukti',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
bukti.url = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { koreksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { koreksi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    koreksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        koreksi: typeof args.koreksi === 'object'
                ? args.koreksi.id
                : args.koreksi,
                }

    return bukti.definition.url
            .replace('{koreksi}', parsedArgs.koreksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
bukti.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bukti.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
bukti.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bukti.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
    const buktiForm = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bukti.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
        buktiForm.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bukti.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
        buktiForm.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bukti.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bukti.form = buktiForm
const koreksi = {
    bukti: Object.assign(bukti, bukti),
}

export default koreksi