import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\HomeController::__invoke
 * @see app/Http/Controllers/Public/HomeController.php:16
 * @route '/'
 */
const HomeController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HomeController.url(options),
    method: 'get',
})

HomeController.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\HomeController::__invoke
 * @see app/Http/Controllers/Public/HomeController.php:16
 * @route '/'
 */
HomeController.url = (options?: RouteQueryOptions) => {
    return HomeController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\HomeController::__invoke
 * @see app/Http/Controllers/Public/HomeController.php:16
 * @route '/'
 */
HomeController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HomeController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\HomeController::__invoke
 * @see app/Http/Controllers/Public/HomeController.php:16
 * @route '/'
 */
HomeController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HomeController.url(options),
    method: 'head',
})
export default HomeController