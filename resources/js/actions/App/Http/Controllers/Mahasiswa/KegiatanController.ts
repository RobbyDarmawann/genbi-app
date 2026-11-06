import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kegiatan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:29
 * @route '/kegiatan'
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
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
 */
export const show = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kegiatan/{kegiatan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
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
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
 */
show.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
 */
show.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
 */
    const showForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
 */
        showForm.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:127
 * @route '/kegiatan/{kegiatan}'
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
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:276
 * @route '/kegiatan/{kegiatan}/daftar'
 */
export const daftar = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: daftar.url(args, options),
    method: 'post',
})

daftar.definition = {
    methods: ["post"],
    url: '/kegiatan/{kegiatan}/daftar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:276
 * @route '/kegiatan/{kegiatan}/daftar'
 */
daftar.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return daftar.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:276
 * @route '/kegiatan/{kegiatan}/daftar'
 */
daftar.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: daftar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:276
 * @route '/kegiatan/{kegiatan}/daftar'
 */
    const daftarForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: daftar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:276
 * @route '/kegiatan/{kegiatan}/daftar'
 */
        daftarForm.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: daftar.url(args, options),
            method: 'post',
        })
    
    daftar.form = daftarForm
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:289
 * @route '/kegiatan/{kegiatan}/batal'
 */
export const batal = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: batal.url(args, options),
    method: 'delete',
})

batal.definition = {
    methods: ["delete"],
    url: '/kegiatan/{kegiatan}/batal',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:289
 * @route '/kegiatan/{kegiatan}/batal'
 */
batal.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return batal.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:289
 * @route '/kegiatan/{kegiatan}/batal'
 */
batal.delete = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: batal.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:289
 * @route '/kegiatan/{kegiatan}/batal'
 */
    const batalForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:289
 * @route '/kegiatan/{kegiatan}/batal'
 */
        batalForm.delete = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    batal.form = batalForm
const KegiatanController = { index, show, daftar, batal }

export default KegiatanController