import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/koreksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\KoreksiController::index
 * @see app/Http/Controllers/Admin/KoreksiController.php:19
 * @route '/admin/koreksi'
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
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
export const show = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/koreksi/{koreksi}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
show.url = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { koreksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { koreksi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    koreksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        koreksi: typeof args.koreksi === 'object'
                ? args.koreksi.id
                : args.koreksi,
                }

    return show.definition.url
            .replace('{koreksi}', parsedArgs.koreksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
show.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
show.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
    const showForm = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
        showForm.get = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\KoreksiController::show
 * @see app/Http/Controllers/Admin/KoreksiController.php:59
 * @route '/admin/koreksi/{koreksi}'
 */
        showForm.head = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\KoreksiController::decide
 * @see app/Http/Controllers/Admin/KoreksiController.php:83
 * @route '/admin/koreksi/{koreksi}/keputusan'
 */
export const decide = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

decide.definition = {
    methods: ["post"],
    url: '/admin/koreksi/{koreksi}/keputusan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KoreksiController::decide
 * @see app/Http/Controllers/Admin/KoreksiController.php:83
 * @route '/admin/koreksi/{koreksi}/keputusan'
 */
decide.url = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { koreksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { koreksi: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    koreksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        koreksi: typeof args.koreksi === 'object'
                ? args.koreksi.id
                : args.koreksi,
                }

    return decide.definition.url
            .replace('{koreksi}', parsedArgs.koreksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KoreksiController::decide
 * @see app/Http/Controllers/Admin/KoreksiController.php:83
 * @route '/admin/koreksi/{koreksi}/keputusan'
 */
decide.post = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\KoreksiController::decide
 * @see app/Http/Controllers/Admin/KoreksiController.php:83
 * @route '/admin/koreksi/{koreksi}/keputusan'
 */
    const decideForm = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: decide.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KoreksiController::decide
 * @see app/Http/Controllers/Admin/KoreksiController.php:83
 * @route '/admin/koreksi/{koreksi}/keputusan'
 */
        decideForm.post = (args: { koreksi: number | { id: number } } | [koreksi: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: decide.url(args, options),
            method: 'post',
        })
    
    decide.form = decideForm
const KoreksiController = { index, show, decide }

export default KoreksiController