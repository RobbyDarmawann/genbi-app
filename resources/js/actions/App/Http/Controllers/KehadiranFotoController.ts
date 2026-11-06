import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
const KehadiranFotoController = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KehadiranFotoController.url(args, options),
    method: 'get',
})

KehadiranFotoController.definition = {
    methods: ["get","head"],
    url: '/kehadiran/{kehadiran}/foto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
KehadiranFotoController.url = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return KehadiranFotoController.definition.url
            .replace('{kehadiran}', parsedArgs.kehadiran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
KehadiranFotoController.get = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: KehadiranFotoController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KehadiranFotoController::__invoke
 * @see app/Http/Controllers/KehadiranFotoController.php:12
 * @route '/kehadiran/{kehadiran}/foto'
 */
KehadiranFotoController.head = (args: { kehadiran: number | { id: number } } | [kehadiran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: KehadiranFotoController.url(args, options),
    method: 'head',
})
export default KehadiranFotoController