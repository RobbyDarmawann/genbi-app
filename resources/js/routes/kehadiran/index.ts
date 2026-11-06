import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
export const foto = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: foto.url(args, options),
    method: 'get',
})

foto.definition = {
    methods: ["get","head"],
    url: '/kehadiran/{kehadiran}/foto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
foto.url = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kehadiran: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kehadiran: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kehadiran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kehadiran: typeof args.kehadiran === 'object'
                ? args.kehadiran.id
                : args.kehadiran,
                }

    return foto.definition.url
            .replace('{kehadiran}', parsedArgs.kehadiran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
foto.get = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: foto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
foto.head = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: foto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
    const fotoForm = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: foto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
        fotoForm.get = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: foto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
        fotoForm.head = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: foto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    foto.form = fotoForm
const kehadiran = {
    foto: Object.assign(foto, foto),
}

export default kehadiran