import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\StatistikController::index
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/statistik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\StatistikController::index
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\StatistikController::index
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\StatistikController::index
 * @see app/Http/Controllers/Public/StatistikController.php:18
 * @route '/statistik'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const StatistikController = { index }

export default StatistikController