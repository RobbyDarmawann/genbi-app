import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import peserta from './peserta'
import kehadiran from './kehadiran'
/**
* @see \App\Http\Controllers\Admin\KegiatanController::index
 * @see app/Http/Controllers/Admin/KegiatanController.php:27
 * @route '/admin/kegiatan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::index
 * @see app/Http/Controllers/Admin/KegiatanController.php:27
 * @route '/admin/kegiatan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::index
 * @see app/Http/Controllers/Admin/KegiatanController.php:27
 * @route '/admin/kegiatan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KegiatanController::index
 * @see app/Http/Controllers/Admin/KegiatanController.php:27
 * @route '/admin/kegiatan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::create
 * @see app/Http/Controllers/Admin/KegiatanController.php:84
 * @route '/admin/kegiatan/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::create
 * @see app/Http/Controllers/Admin/KegiatanController.php:84
 * @route '/admin/kegiatan/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::create
 * @see app/Http/Controllers/Admin/KegiatanController.php:84
 * @route '/admin/kegiatan/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KegiatanController::create
 * @see app/Http/Controllers/Admin/KegiatanController.php:84
 * @route '/admin/kegiatan/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::store
 * @see app/Http/Controllers/Admin/KegiatanController.php:91
 * @route '/admin/kegiatan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/kegiatan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::store
 * @see app/Http/Controllers/Admin/KegiatanController.php:91
 * @route '/admin/kegiatan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::store
 * @see app/Http/Controllers/Admin/KegiatanController.php:91
 * @route '/admin/kegiatan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::show
 * @see app/Http/Controllers/Admin/KegiatanController.php:101
 * @route '/admin/kegiatan/{kegiatan}'
 */
export const show = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/{kegiatan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::show
 * @see app/Http/Controllers/Admin/KegiatanController.php:101
 * @route '/admin/kegiatan/{kegiatan}'
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
* @see \App\Http\Controllers\Admin\KegiatanController::show
 * @see app/Http/Controllers/Admin/KegiatanController.php:101
 * @route '/admin/kegiatan/{kegiatan}'
 */
show.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KegiatanController::show
 * @see app/Http/Controllers/Admin/KegiatanController.php:101
 * @route '/admin/kegiatan/{kegiatan}'
 */
show.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::edit
 * @see app/Http/Controllers/Admin/KegiatanController.php:116
 * @route '/admin/kegiatan/{kegiatan}/edit'
 */
export const edit = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/{kegiatan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::edit
 * @see app/Http/Controllers/Admin/KegiatanController.php:116
 * @route '/admin/kegiatan/{kegiatan}/edit'
 */
edit.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::edit
 * @see app/Http/Controllers/Admin/KegiatanController.php:116
 * @route '/admin/kegiatan/{kegiatan}/edit'
 */
edit.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KegiatanController::edit
 * @see app/Http/Controllers/Admin/KegiatanController.php:116
 * @route '/admin/kegiatan/{kegiatan}/edit'
 */
edit.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::update
 * @see app/Http/Controllers/Admin/KegiatanController.php:128
 * @route '/admin/kegiatan/{kegiatan}'
 */
export const update = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/kegiatan/{kegiatan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::update
 * @see app/Http/Controllers/Admin/KegiatanController.php:128
 * @route '/admin/kegiatan/{kegiatan}'
 */
update.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::update
 * @see app/Http/Controllers/Admin/KegiatanController.php:128
 * @route '/admin/kegiatan/{kegiatan}'
 */
update.put = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\KegiatanController::update
 * @see app/Http/Controllers/Admin/KegiatanController.php:128
 * @route '/admin/kegiatan/{kegiatan}'
 */
update.patch = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\KegiatanController::updateStatus
 * @see app/Http/Controllers/Admin/KegiatanController.php:138
 * @route '/admin/kegiatan/{kegiatan}/status'
 */
export const updateStatus = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/admin/kegiatan/{kegiatan}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\KegiatanController::updateStatus
 * @see app/Http/Controllers/Admin/KegiatanController.php:138
 * @route '/admin/kegiatan/{kegiatan}/status'
 */
updateStatus.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KegiatanController::updateStatus
 * @see app/Http/Controllers/Admin/KegiatanController.php:138
 * @route '/admin/kegiatan/{kegiatan}/status'
 */
updateStatus.patch = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::monitoring
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
export const monitoring = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoring.url(args, options),
    method: 'get',
})

monitoring.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/{kegiatan}/monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::monitoring
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
monitoring.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return monitoring.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::monitoring
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
monitoring.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoring.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::monitoring
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:71
 * @route '/admin/kegiatan/{kegiatan}/monitoring'
 */
monitoring.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monitoring.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MonitoringKegiatanController::lock
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:203
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
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:203
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
 * @see app/Http/Controllers/Admin/MonitoringKegiatanController.php:203
 * @route '/admin/kegiatan/{kegiatan}/kunci'
 */
lock.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(args, options),
    method: 'post',
})
const kegiatan = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
updateStatus: Object.assign(updateStatus, updateStatus),
peserta: Object.assign(peserta, peserta),
monitoring: Object.assign(monitoring, monitoring),
kehadiran: Object.assign(kehadiran, kehadiran),
lock: Object.assign(lock, lock),
}

export default kegiatan