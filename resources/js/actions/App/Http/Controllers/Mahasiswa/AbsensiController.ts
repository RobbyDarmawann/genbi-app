import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
export const create = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kegiatan/{kegiatan}/absen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
create.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
create.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
create.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
    const createForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
        createForm.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::create
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
        createForm.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::store
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:102
 * @route '/kegiatan/{kegiatan}/absen'
 */
export const store = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kegiatan/{kegiatan}/absen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::store
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:102
 * @route '/kegiatan/{kegiatan}/absen'
 */
store.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::store
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:102
 * @route '/kegiatan/{kegiatan}/absen'
 */
store.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::store
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:102
 * @route '/kegiatan/{kegiatan}/absen'
 */
    const storeForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::store
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:102
 * @route '/kegiatan/{kegiatan}/absen'
 */
        storeForm.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const AbsensiController = { create, store }

export default AbsensiController