import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
const KoreksiBuktiController = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KoreksiBuktiController.url(args, options),
    method: 'get',
})

KoreksiBuktiController.definition = {
    methods: ["get","head"],
    url: '/koreksi/{koreksi}/bukti',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
KoreksiBuktiController.url = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return KoreksiBuktiController.definition.url
            .replace('{koreksi}', parsedArgs.koreksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
KoreksiBuktiController.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KoreksiBuktiController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
KoreksiBuktiController.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: KoreksiBuktiController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
    const KoreksiBuktiControllerForm = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: KoreksiBuktiController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
        KoreksiBuktiControllerForm.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: KoreksiBuktiController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KoreksiBuktiController::__invoke
 * @see app/Http/Controllers/KoreksiBuktiController.php:12
 * @route '/koreksi/{koreksi}/bukti'
 */
        KoreksiBuktiControllerForm.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: KoreksiBuktiController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    KoreksiBuktiController.form = KoreksiBuktiControllerForm
export default KoreksiBuktiController