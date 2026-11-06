import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
export const show = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/{kegiatan}/monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
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
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
show.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
show.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
    const showForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
        showForm.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::show
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
        showForm.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::reviewAttendance
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:173
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
export const reviewAttendance = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewAttendance.url(args, options),
    method: 'post',
})

reviewAttendance.definition = {
    methods: ["post"],
    url: '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::reviewAttendance
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:173
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
reviewAttendance.url = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return reviewAttendance.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{kehadiran}', parsedArgs.kehadiran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::reviewAttendance
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:173
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
reviewAttendance.post = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewAttendance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::reviewAttendance
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:173
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
    const reviewAttendanceForm = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reviewAttendance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::reviewAttendance
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:173
 * @route '/admin/kegiatan/{kegiatan}/kehadiran/{kehadiran}/review'
 */
        reviewAttendanceForm.post = (args: { kegiatan: number | { id: number }, kehadiran: number | { id: number } } | [kegiatan: number | { id: number }, kehadiran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reviewAttendance.url(args, options),
            method: 'post',
        })
    
    reviewAttendance.form = reviewAttendanceForm
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:201
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
export const lock = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(args, options),
    method: 'post',
})

lock.definition = {
    methods: ["post"],
    url: '/admin/kegiatan/{kegiatan}/kunci',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:201
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
lock.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return lock.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:201
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
lock.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:201
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
    const lockForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: lock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:201
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
        lockForm.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: lock.url(args, options),
            method: 'post',
        })
    
    lock.form = lockForm
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kehadiran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::index
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:29
 * @route '/admin/kehadiran'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const MonitoringKegiatanController = { show, reviewAttendance, lock, index }

export default MonitoringKegiatanController