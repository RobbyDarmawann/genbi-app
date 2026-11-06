import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::edit
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:15
 * @route '/settings/biodata'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/biodata',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::edit
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:15
 * @route '/settings/biodata'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::edit
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:15
 * @route '/settings/biodata'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::edit
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:15
 * @route '/settings/biodata'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::update
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:51
 * @route '/settings/biodata'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/biodata',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::update
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:51
 * @route '/settings/biodata'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\BiodataController::update
 * @see app/Http/Controllers/Mahasiswa/BiodataController.php:51
 * @route '/settings/biodata'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})
const biodata = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default biodata