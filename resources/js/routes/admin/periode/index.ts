import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PeriodeController::index
 * @see app/Http/Controllers/Admin/PeriodeController.php:22
 * @route '/admin/periode'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/periode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PeriodeController::index
 * @see app/Http/Controllers/Admin/PeriodeController.php:22
 * @route '/admin/periode'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PeriodeController::index
 * @see app/Http/Controllers/Admin/PeriodeController.php:22
 * @route '/admin/periode'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PeriodeController::index
 * @see app/Http/Controllers/Admin/PeriodeController.php:22
 * @route '/admin/periode'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PeriodeController::store
 * @see app/Http/Controllers/Admin/PeriodeController.php:55
 * @route '/admin/periode'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/periode',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PeriodeController::store
 * @see app/Http/Controllers/Admin/PeriodeController.php:55
 * @route '/admin/periode'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PeriodeController::store
 * @see app/Http/Controllers/Admin/PeriodeController.php:55
 * @route '/admin/periode'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PeriodeController::update
 * @see app/Http/Controllers/Admin/PeriodeController.php:69
 * @route '/admin/periode/{periode}'
 */
export const update = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/periode/{periode}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\PeriodeController::update
 * @see app/Http/Controllers/Admin/PeriodeController.php:69
 * @route '/admin/periode/{periode}'
 */
update.url = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { periode: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { periode: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    periode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        periode: typeof args.periode === 'object'
                ? args.periode.id
                : args.periode,
                }

    return update.definition.url
            .replace('{periode}', parsedArgs.periode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PeriodeController::update
 * @see app/Http/Controllers/Admin/PeriodeController.php:69
 * @route '/admin/periode/{periode}'
 */
update.put = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\PeriodeController::update
 * @see app/Http/Controllers/Admin/PeriodeController.php:69
 * @route '/admin/periode/{periode}'
 */
update.patch = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PeriodeController::destroy
 * @see app/Http/Controllers/Admin/PeriodeController.php:101
 * @route '/admin/periode/{periode}'
 */
export const destroy = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/periode/{periode}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PeriodeController::destroy
 * @see app/Http/Controllers/Admin/PeriodeController.php:101
 * @route '/admin/periode/{periode}'
 */
destroy.url = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { periode: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { periode: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    periode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        periode: typeof args.periode === 'object'
                ? args.periode.id
                : args.periode,
                }

    return destroy.definition.url
            .replace('{periode}', parsedArgs.periode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PeriodeController::destroy
 * @see app/Http/Controllers/Admin/PeriodeController.php:101
 * @route '/admin/periode/{periode}'
 */
destroy.delete = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PeriodeController::toggleAktif
 * @see app/Http/Controllers/Admin/PeriodeController.php:83
 * @route '/admin/periode/{periode}/aktif'
 */
export const toggleAktif = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

toggleAktif.definition = {
    methods: ["patch"],
    url: '/admin/periode/{periode}/aktif',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PeriodeController::toggleAktif
 * @see app/Http/Controllers/Admin/PeriodeController.php:83
 * @route '/admin/periode/{periode}/aktif'
 */
toggleAktif.url = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { periode: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { periode: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    periode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        periode: typeof args.periode === 'object'
                ? args.periode.id
                : args.periode,
                }

    return toggleAktif.definition.url
            .replace('{periode}', parsedArgs.periode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PeriodeController::toggleAktif
 * @see app/Http/Controllers/Admin/PeriodeController.php:83
 * @route '/admin/periode/{periode}/aktif'
 */
toggleAktif.patch = (args: { periode: number | { id: number } } | [periode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})
const periode = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggleAktif: Object.assign(toggleAktif, toggleAktif),
}

export default periode