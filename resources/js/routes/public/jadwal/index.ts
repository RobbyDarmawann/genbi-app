import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\JadwalController::show
 * @see app/Http/Controllers/Public/JadwalController.php:54
 * @route '/jadwal/{kegiatan}'
 */
export const show = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/jadwal/{kegiatan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\JadwalController::show
 * @see app/Http/Controllers/Public/JadwalController.php:54
 * @route '/jadwal/{kegiatan}'
 */
show.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kegiatan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kegiatan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kegiatan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kegiatan: typeof args.kegiatan === 'object'
                ? args.kegiatan.id
                : args.kegiatan,
                }

    return show.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\JadwalController::show
 * @see app/Http/Controllers/Public/JadwalController.php:54
 * @route '/jadwal/{kegiatan}'
 */
show.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\JadwalController::show
 * @see app/Http/Controllers/Public/JadwalController.php:54
 * @route '/jadwal/{kegiatan}'
 */
show.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const jadwal = {
    show: Object.assign(show, show),
}

export default jadwal