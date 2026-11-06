import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
export const index = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kegiatan/{kegiatan}/peserta',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
index.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
index.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
index.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
    const indexForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
        indexForm.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::index
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:26
 * @route '/admin/kegiatan/{kegiatan}/peserta'
 */
        indexForm.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::changeRole
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
export const changeRole = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: changeRole.url(args, options),
    method: 'patch',
})

changeRole.definition = {
    methods: ["patch"],
    url: '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::changeRole
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
changeRole.url = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    kegiatan: args[0],
                    pendaftaran: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kegiatan: typeof args.kegiatan === 'object'
                ? args.kegiatan.id
                : args.kegiatan,
                                pendaftaran: typeof args.pendaftaran === 'object'
                ? args.pendaftaran.id
                : args.pendaftaran,
                }

    return changeRole.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{pendaftaran}', parsedArgs.pendaftaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::changeRole
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
changeRole.patch = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: changeRole.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::changeRole
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
    const changeRoleForm = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: changeRole.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::changeRole
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
        changeRoleForm.patch = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: changeRole.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    changeRole.form = changeRoleForm
/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::cancel
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
export const cancel = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

cancel.definition = {
    methods: ["delete"],
    url: '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::cancel
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
cancel.url = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    kegiatan: args[0],
                    pendaftaran: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kegiatan: typeof args.kegiatan === 'object'
                ? args.kegiatan.id
                : args.kegiatan,
                                pendaftaran: typeof args.pendaftaran === 'object'
                ? args.pendaftaran.id
                : args.pendaftaran,
                }

    return cancel.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{pendaftaran}', parsedArgs.pendaftaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::cancel
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
cancel.delete = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::cancel
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
    const cancelForm = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::cancel
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
        cancelForm.delete = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
const PesertaKegiatanController = { index, changeRole, cancel }

export default PesertaKegiatanController