import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mahasiswa/kepengurusan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\KepengurusanController::index
 * @see app/Http/Controllers/Public/KepengurusanController.php:20
 * @route '/mahasiswa/kepengurusan'
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
const kepengurusan = {
    index: Object.assign(index, index),
}

export default kepengurusan