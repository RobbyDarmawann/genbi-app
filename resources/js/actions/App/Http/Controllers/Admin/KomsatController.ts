import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/komsat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\KomsatController::index
 * @see app/Http/Controllers/Admin/KomsatController.php:22
 * @route '/admin/komsat'
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
/**
* @see \App\Http\Controllers\Admin\KomsatController::store
 * @see app/Http/Controllers/Admin/KomsatController.php:66
 * @route '/admin/komsat'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/komsat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KomsatController::store
 * @see app/Http/Controllers/Admin/KomsatController.php:66
 * @route '/admin/komsat'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KomsatController::store
 * @see app/Http/Controllers/Admin/KomsatController.php:66
 * @route '/admin/komsat'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\KomsatController::store
 * @see app/Http/Controllers/Admin/KomsatController.php:66
 * @route '/admin/komsat'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KomsatController::store
 * @see app/Http/Controllers/Admin/KomsatController.php:66
 * @route '/admin/komsat'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
export const update = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/komsat/{komsat}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
update.url = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { komsat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { komsat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    komsat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        komsat: typeof args.komsat === 'object'
                ? args.komsat.id
                : args.komsat,
                }

    return update.definition.url
            .replace('{komsat}', parsedArgs.komsat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
update.put = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
update.patch = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
    const updateForm = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
        updateForm.put = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\KomsatController::update
 * @see app/Http/Controllers/Admin/KomsatController.php:80
 * @route '/admin/komsat/{komsat}'
 */
        updateForm.patch = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\KomsatController::destroy
 * @see app/Http/Controllers/Admin/KomsatController.php:112
 * @route '/admin/komsat/{komsat}'
 */
export const destroy = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/komsat/{komsat}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\KomsatController::destroy
 * @see app/Http/Controllers/Admin/KomsatController.php:112
 * @route '/admin/komsat/{komsat}'
 */
destroy.url = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { komsat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { komsat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    komsat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        komsat: typeof args.komsat === 'object'
                ? args.komsat.id
                : args.komsat,
                }

    return destroy.definition.url
            .replace('{komsat}', parsedArgs.komsat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KomsatController::destroy
 * @see app/Http/Controllers/Admin/KomsatController.php:112
 * @route '/admin/komsat/{komsat}'
 */
destroy.delete = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\KomsatController::destroy
 * @see app/Http/Controllers/Admin/KomsatController.php:112
 * @route '/admin/komsat/{komsat}'
 */
    const destroyForm = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KomsatController::destroy
 * @see app/Http/Controllers/Admin/KomsatController.php:112
 * @route '/admin/komsat/{komsat}'
 */
        destroyForm.delete = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\KomsatController::toggleAktif
 * @see app/Http/Controllers/Admin/KomsatController.php:94
 * @route '/admin/komsat/{komsat}/aktif'
 */
export const toggleAktif = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

toggleAktif.definition = {
    methods: ["patch"],
    url: '/admin/komsat/{komsat}/aktif',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\KomsatController::toggleAktif
 * @see app/Http/Controllers/Admin/KomsatController.php:94
 * @route '/admin/komsat/{komsat}/aktif'
 */
toggleAktif.url = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { komsat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { komsat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    komsat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        komsat: typeof args.komsat === 'object'
                ? args.komsat.id
                : args.komsat,
                }

    return toggleAktif.definition.url
            .replace('{komsat}', parsedArgs.komsat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KomsatController::toggleAktif
 * @see app/Http/Controllers/Admin/KomsatController.php:94
 * @route '/admin/komsat/{komsat}/aktif'
 */
toggleAktif.patch = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\KomsatController::toggleAktif
 * @see app/Http/Controllers/Admin/KomsatController.php:94
 * @route '/admin/komsat/{komsat}/aktif'
 */
    const toggleAktifForm = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAktif.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KomsatController::toggleAktif
 * @see app/Http/Controllers/Admin/KomsatController.php:94
 * @route '/admin/komsat/{komsat}/aktif'
 */
        toggleAktifForm.patch = (args: { komsat: number | { id: number } } | [komsat: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAktif.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleAktif.form = toggleAktifForm
const KomsatController = { index, store, update, destroy, toggleAktif }

export default KomsatController