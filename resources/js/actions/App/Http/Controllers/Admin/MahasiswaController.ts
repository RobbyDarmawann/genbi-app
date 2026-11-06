import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/mahasiswa',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::index
 * @see app/Http/Controllers/Admin/MahasiswaController.php:29
 * @route '/admin/mahasiswa'
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
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/mahasiswa/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::create
 * @see app/Http/Controllers/Admin/MahasiswaController.php:75
 * @route '/admin/mahasiswa/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::store
 * @see app/Http/Controllers/Admin/MahasiswaController.php:82
 * @route '/admin/mahasiswa'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/mahasiswa',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::store
 * @see app/Http/Controllers/Admin/MahasiswaController.php:82
 * @route '/admin/mahasiswa'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::store
 * @see app/Http/Controllers/Admin/MahasiswaController.php:82
 * @route '/admin/mahasiswa'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::store
 * @see app/Http/Controllers/Admin/MahasiswaController.php:82
 * @route '/admin/mahasiswa'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::store
 * @see app/Http/Controllers/Admin/MahasiswaController.php:82
 * @route '/admin/mahasiswa'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
export const show = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/mahasiswa/{mahasiswa}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
show.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return show.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
show.get = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
show.head = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
    const showForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
        showForm.get = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::show
 * @see app/Http/Controllers/Admin/MahasiswaController.php:96
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
        showForm.head = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
export const edit = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/mahasiswa/{mahasiswa}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
edit.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return edit.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
edit.get = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
edit.head = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
    const editForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
        editForm.get = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::edit
 * @see app/Http/Controllers/Admin/MahasiswaController.php:124
 * @route '/admin/mahasiswa/{mahasiswa}/edit'
 */
        editForm.head = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
export const update = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/mahasiswa/{mahasiswa}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
update.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return update.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
update.put = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
update.patch = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
    const updateForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
        updateForm.put = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::update
 * @see app/Http/Controllers/Admin/MahasiswaController.php:138
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
        updateForm.patch = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\MahasiswaController::destroy
 * @see app/Http/Controllers/Admin/MahasiswaController.php:184
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
export const destroy = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/mahasiswa/{mahasiswa}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::destroy
 * @see app/Http/Controllers/Admin/MahasiswaController.php:184
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
destroy.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return destroy.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::destroy
 * @see app/Http/Controllers/Admin/MahasiswaController.php:184
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
destroy.delete = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::destroy
 * @see app/Http/Controllers/Admin/MahasiswaController.php:184
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
    const destroyForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::destroy
 * @see app/Http/Controllers/Admin/MahasiswaController.php:184
 * @route '/admin/mahasiswa/{mahasiswa}'
 */
        destroyForm.delete = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\MahasiswaController::resetPassword
 * @see app/Http/Controllers/Admin/MahasiswaController.php:152
 * @route '/admin/mahasiswa/{mahasiswa}/reset-password'
 */
export const resetPassword = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/admin/mahasiswa/{mahasiswa}/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::resetPassword
 * @see app/Http/Controllers/Admin/MahasiswaController.php:152
 * @route '/admin/mahasiswa/{mahasiswa}/reset-password'
 */
resetPassword.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return resetPassword.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::resetPassword
 * @see app/Http/Controllers/Admin/MahasiswaController.php:152
 * @route '/admin/mahasiswa/{mahasiswa}/reset-password'
 */
resetPassword.post = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::resetPassword
 * @see app/Http/Controllers/Admin/MahasiswaController.php:152
 * @route '/admin/mahasiswa/{mahasiswa}/reset-password'
 */
    const resetPasswordForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::resetPassword
 * @see app/Http/Controllers/Admin/MahasiswaController.php:152
 * @route '/admin/mahasiswa/{mahasiswa}/reset-password'
 */
        resetPasswordForm.post = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(args, options),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
/**
* @see \App\Http\Controllers\Admin\MahasiswaController::toggleAktif
 * @see app/Http/Controllers/Admin/MahasiswaController.php:166
 * @route '/admin/mahasiswa/{mahasiswa}/aktif'
 */
export const toggleAktif = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

toggleAktif.definition = {
    methods: ["patch"],
    url: '/admin/mahasiswa/{mahasiswa}/aktif',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::toggleAktif
 * @see app/Http/Controllers/Admin/MahasiswaController.php:166
 * @route '/admin/mahasiswa/{mahasiswa}/aktif'
 */
toggleAktif.url = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mahasiswa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mahasiswa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mahasiswa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mahasiswa: typeof args.mahasiswa === 'object'
                ? args.mahasiswa.id
                : args.mahasiswa,
                }

    return toggleAktif.definition.url
            .replace('{mahasiswa}', parsedArgs.mahasiswa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MahasiswaController::toggleAktif
 * @see app/Http/Controllers/Admin/MahasiswaController.php:166
 * @route '/admin/mahasiswa/{mahasiswa}/aktif'
 */
toggleAktif.patch = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAktif.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\MahasiswaController::toggleAktif
 * @see app/Http/Controllers/Admin/MahasiswaController.php:166
 * @route '/admin/mahasiswa/{mahasiswa}/aktif'
 */
    const toggleAktifForm = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAktif.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MahasiswaController::toggleAktif
 * @see app/Http/Controllers/Admin/MahasiswaController.php:166
 * @route '/admin/mahasiswa/{mahasiswa}/aktif'
 */
        toggleAktifForm.patch = (args: { mahasiswa: number | { id: number } } | [mahasiswa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAktif.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleAktif.form = toggleAktifForm
const MahasiswaController = { index, create, store, show, edit, update, destroy, resetPassword, toggleAktif }

export default MahasiswaController