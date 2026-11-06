import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DivisiController::index
 * @see app/Http/Controllers/Admin/DivisiController.php:23
 * @route '/admin/divisi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/divisi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DivisiController::index
 * @see app/Http/Controllers/Admin/DivisiController.php:23
 * @route '/admin/divisi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisiController::index
 * @see app/Http/Controllers/Admin/DivisiController.php:23
 * @route '/admin/divisi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DivisiController::index
 * @see app/Http/Controllers/Admin/DivisiController.php:23
 * @route '/admin/divisi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DivisiController::store
 * @see app/Http/Controllers/Admin/DivisiController.php:76
 * @route '/admin/divisi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/divisi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DivisiController::store
 * @see app/Http/Controllers/Admin/DivisiController.php:76
 * @route '/admin/divisi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisiController::store
 * @see app/Http/Controllers/Admin/DivisiController.php:76
 * @route '/admin/divisi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DivisiController::update
 * @see app/Http/Controllers/Admin/DivisiController.php:90
 * @route '/admin/divisi/{divisi}'
 */
export const update = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/divisi/{divisi}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DivisiController::update
 * @see app/Http/Controllers/Admin/DivisiController.php:90
 * @route '/admin/divisi/{divisi}'
 */
update.url = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { divisi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { divisi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    divisi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        divisi: typeof args.divisi === 'object'
                ? args.divisi.id
                : args.divisi,
                }

    return update.definition.url
            .replace('{divisi}', parsedArgs.divisi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisiController::update
 * @see app/Http/Controllers/Admin/DivisiController.php:90
 * @route '/admin/divisi/{divisi}'
 */
update.put = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\DivisiController::update
 * @see app/Http/Controllers/Admin/DivisiController.php:90
 * @route '/admin/divisi/{divisi}'
 */
update.patch = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\DivisiController::destroy
 * @see app/Http/Controllers/Admin/DivisiController.php:122
 * @route '/admin/divisi/{divisi}'
 */
export const destroy = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/divisi/{divisi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DivisiController::destroy
 * @see app/Http/Controllers/Admin/DivisiController.php:122
 * @route '/admin/divisi/{divisi}'
 */
destroy.url = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { divisi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { divisi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    divisi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        divisi: typeof args.divisi === 'object'
                ? args.divisi.id
                : args.divisi,
                }

    return destroy.definition.url
            .replace('{divisi}', parsedArgs.divisi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisiController::destroy
 * @see app/Http/Controllers/Admin/DivisiController.php:122
 * @route '/admin/divisi/{divisi}'
 */
destroy.delete = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\DivisiController::toggleAktif
 * @see app/Http/Controllers/Admin/DivisiController.php:104
 * @route '/admin/divisi/{divisi}/aktif'
 */
export const toggleAktif = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

toggleAktif.definition = {
    methods: ["patch"],
    url: '/admin/divisi/{divisi}/aktif',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\DivisiController::toggleAktif
 * @see app/Http/Controllers/Admin/DivisiController.php:104
 * @route '/admin/divisi/{divisi}/aktif'
 */
toggleAktif.url = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { divisi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { divisi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    divisi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        divisi: typeof args.divisi === 'object'
                ? args.divisi.id
                : args.divisi,
                }

    return toggleAktif.definition.url
            .replace('{divisi}', parsedArgs.divisi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisiController::toggleAktif
 * @see app/Http/Controllers/Admin/DivisiController.php:104
 * @route '/admin/divisi/{divisi}/aktif'
 */
toggleAktif.patch = (args: { divisi: number | { id: number } } | [divisi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})
const DivisiController = { index, store, update, destroy, toggleAktif }

export default DivisiController