import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/koreksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::index
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:20
 * @route '/koreksi'
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
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/koreksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\KoreksiController::store
 * @see app/Http/Controllers/Mahasiswa/KoreksiController.php:53
 * @route '/koreksi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const koreksi = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default koreksi