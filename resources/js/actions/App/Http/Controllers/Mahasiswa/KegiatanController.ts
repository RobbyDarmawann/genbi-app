import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:30
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:30
 * @route '/kegiatan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:30
 * @route '/kegiatan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::index
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:30
 * @route '/kegiatan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:167
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:167
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:167
 * @route '/kegiatan/{kegiatan}'
 */
show.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::show
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:167
 * @route '/kegiatan/{kegiatan}'
 */
show.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::daftar
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:339
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:339
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:339
 * @route '/kegiatan/{kegiatan}/daftar'
 */
daftar.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: daftar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Mahasiswa\KegiatanController::batal
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:352
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:352
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
 * @see app/Http/Controllers/Mahasiswa/KegiatanController.php:352
 * @route '/kegiatan/{kegiatan}/batal'
 */
batal.delete = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: batal.url(args, options),
    method: 'delete',
})
const KegiatanController = { index, show, daftar, batal }

export default KegiatanController