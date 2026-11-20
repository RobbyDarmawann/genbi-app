import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/lokasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::index
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:22
 * @route '/admin/lokasi'
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
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::store
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:63
 * @route '/admin/lokasi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/lokasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::store
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:63
 * @route '/admin/lokasi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::store
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:63
 * @route '/admin/lokasi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::store
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:63
 * @route '/admin/lokasi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::store
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:63
 * @route '/admin/lokasi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
export const update = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/lokasi/{lokasi}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
update.url = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lokasi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lokasi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lokasi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lokasi: typeof args.lokasi === 'object'
                ? args.lokasi.id
                : args.lokasi,
                }

    return update.definition.url
            .replace('{lokasi}', parsedArgs.lokasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
update.put = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
update.patch = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
    const updateForm = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
        updateForm.put = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::update
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:77
 * @route '/admin/lokasi/{lokasi}'
 */
        updateForm.patch = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::destroy
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:109
 * @route '/admin/lokasi/{lokasi}'
 */
export const destroy = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/lokasi/{lokasi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::destroy
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:109
 * @route '/admin/lokasi/{lokasi}'
 */
destroy.url = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lokasi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lokasi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lokasi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lokasi: typeof args.lokasi === 'object'
                ? args.lokasi.id
                : args.lokasi,
                }

    return destroy.definition.url
            .replace('{lokasi}', parsedArgs.lokasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::destroy
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:109
 * @route '/admin/lokasi/{lokasi}'
 */
destroy.delete = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::destroy
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:109
 * @route '/admin/lokasi/{lokasi}'
 */
    const destroyForm = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::destroy
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:109
 * @route '/admin/lokasi/{lokasi}'
 */
        destroyForm.delete = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::toggleAktif
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:91
 * @route '/admin/lokasi/{lokasi}/aktif'
 */
export const toggleAktif = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

toggleAktif.definition = {
    methods: ["patch"],
    url: '/admin/lokasi/{lokasi}/aktif',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::toggleAktif
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:91
 * @route '/admin/lokasi/{lokasi}/aktif'
 */
toggleAktif.url = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lokasi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lokasi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lokasi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lokasi: typeof args.lokasi === 'object'
                ? args.lokasi.id
                : args.lokasi,
                }

    return toggleAktif.definition.url
            .replace('{lokasi}', parsedArgs.lokasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::toggleAktif
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:91
 * @route '/admin/lokasi/{lokasi}/aktif'
 */
toggleAktif.patch = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::toggleAktif
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:91
 * @route '/admin/lokasi/{lokasi}/aktif'
 */
    const toggleAktifForm = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAktif.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\LokasiKegiatanController::toggleAktif
 * @see app/Http/Controllers/Admin/LokasiKegiatanController.php:91
 * @route '/admin/lokasi/{lokasi}/aktif'
 */
        toggleAktifForm.patch = (args: { lokasi: string | number | { id: string | number } } | [lokasi: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAktif.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleAktif.form = toggleAktifForm
const lokasi = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggleAktif: Object.assign(toggleAktif, toggleAktif),
}

export default lokasi