import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\KepengurusanController::reorder
 * @see app/Http/Controllers/Admin/KepengurusanController.php:176
 * @route '/admin/kepengurusan/{kepengurusan}/reorder'
 */
export const reorder = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reorder.url(args, options),
    method: 'patch',
})

reorder.definition = {
    methods: ["patch"],
    url: '/admin/kepengurusan/{kepengurusan}/reorder',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::reorder
 * @see app/Http/Controllers/Admin/KepengurusanController.php:176
 * @route '/admin/kepengurusan/{kepengurusan}/reorder'
 */
reorder.url = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kepengurusan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kepengurusan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kepengurusan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kepengurusan: typeof args.kepengurusan === 'object'
                ? args.kepengurusan.id
                : args.kepengurusan,
                }

    return reorder.definition.url
            .replace('{kepengurusan}', parsedArgs.kepengurusan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::reorder
 * @see app/Http/Controllers/Admin/KepengurusanController.php:176
 * @route '/admin/kepengurusan/{kepengurusan}/reorder'
 */
reorder.patch = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reorder.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\KepengurusanController::reorder
 * @see app/Http/Controllers/Admin/KepengurusanController.php:176
 * @route '/admin/kepengurusan/{kepengurusan}/reorder'
 */
    const reorderForm = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::reorder
 * @see app/Http/Controllers/Admin/KepengurusanController.php:176
 * @route '/admin/kepengurusan/{kepengurusan}/reorder'
 */
        reorderForm.patch = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reorder.form = reorderForm
/**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::index
 * @see app/Http/Controllers/Admin/KepengurusanController.php:25
 * @route '/admin/kepengurusan'
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
* @see \App\Http\Controllers\Admin\KepengurusanController::store
 * @see app/Http/Controllers/Admin/KepengurusanController.php:148
 * @route '/admin/kepengurusan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/kepengurusan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::store
 * @see app/Http/Controllers/Admin/KepengurusanController.php:148
 * @route '/admin/kepengurusan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::store
 * @see app/Http/Controllers/Admin/KepengurusanController.php:148
 * @route '/admin/kepengurusan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\KepengurusanController::store
 * @see app/Http/Controllers/Admin/KepengurusanController.php:148
 * @route '/admin/kepengurusan'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::store
 * @see app/Http/Controllers/Admin/KepengurusanController.php:148
 * @route '/admin/kepengurusan'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
export const update = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/kepengurusan/{kepengurusan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
update.url = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kepengurusan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kepengurusan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kepengurusan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kepengurusan: typeof args.kepengurusan === 'object'
                ? args.kepengurusan.id
                : args.kepengurusan,
                }

    return update.definition.url
            .replace('{kepengurusan}', parsedArgs.kepengurusan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
update.put = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
update.patch = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
    const updateForm = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
        updateForm.put = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::update
 * @see app/Http/Controllers/Admin/KepengurusanController.php:162
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
        updateForm.patch = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\KepengurusanController::destroy
 * @see app/Http/Controllers/Admin/KepengurusanController.php:190
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
export const destroy = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/kepengurusan/{kepengurusan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::destroy
 * @see app/Http/Controllers/Admin/KepengurusanController.php:190
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
destroy.url = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kepengurusan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kepengurusan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kepengurusan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kepengurusan: typeof args.kepengurusan === 'object'
                ? args.kepengurusan.id
                : args.kepengurusan,
                }

    return destroy.definition.url
            .replace('{kepengurusan}', parsedArgs.kepengurusan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KepengurusanController::destroy
 * @see app/Http/Controllers/Admin/KepengurusanController.php:190
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
destroy.delete = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\KepengurusanController::destroy
 * @see app/Http/Controllers/Admin/KepengurusanController.php:190
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
    const destroyForm = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KepengurusanController::destroy
 * @see app/Http/Controllers/Admin/KepengurusanController.php:190
 * @route '/admin/kepengurusan/{kepengurusan}'
 */
        destroyForm.delete = (args: { kepengurusan: number | { id: number } } | [kepengurusan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const kepengurusan = {
    reorder: Object.assign(reorder, reorder),
index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default kepengurusan