import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::review
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:175
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
export const review = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::review
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:175
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
review.url = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    kegiatan: args[0],
                    kehadiran: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kegiatan: typeof args.kegiatan === 'object'
                ? args.kegiatan.id
                : args.kegiatan,
                                kehadiran: typeof args.kehadiran === 'object'
                ? args.kehadiran.id
                : args.kehadiran,
                }

    return review.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{kehadiran}', parsedArgs.kehadiran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::review
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:175
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
review.post = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})
const kehadiran = {
    review: Object.assign(review, review),
}

export default kehadiran