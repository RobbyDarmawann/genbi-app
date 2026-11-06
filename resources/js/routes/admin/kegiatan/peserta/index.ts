import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::ubahPeran
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
export const ubahPeran = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ubahPeran.url(args, options),
    method: 'patch',
})

ubahPeran.definition = {
    methods: ["patch"],
    url: '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::ubahPeran
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
ubahPeran.url = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return ubahPeran.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{pendaftaran}', parsedArgs.pendaftaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::ubahPeran
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
ubahPeran.patch = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ubahPeran.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::ubahPeran
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
    const ubahPeranForm = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ubahPeran.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::ubahPeran
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:122
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}/peran'
 */
        ubahPeranForm.patch = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ubahPeran.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    ubahPeran.form = ubahPeranForm
/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::batal
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
export const batal = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: batal.url(args, options),
    method: 'delete',
})

batal.definition = {
    methods: ["delete"],
    url: '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::batal
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
batal.url = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return batal.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace('{pendaftaran}', parsedArgs.pendaftaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::batal
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
batal.delete = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: batal.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::batal
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
    const batalForm = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PesertaKegiatanController::batal
 * @see app/Http/Controllers/Admin/PesertaKegiatanController.php:134
 * @route '/admin/kegiatan/{kegiatan}/peserta/{pendaftaran}'
 */
        batalForm.delete = (args: { kegiatan: number | { id: number }, pendaftaran: number | { id: number } } | [kegiatan: number | { id: number }, pendaftaran: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    batal.form = batalForm
const peserta = {
    index: Object.assign(index, index),
ubahPeran: Object.assign(ubahPeran, ubahPeran),
batal: Object.assign(batal, batal),
}

export default peserta