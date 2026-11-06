import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
export const form = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/kegiatan/{kegiatan}/absen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
form.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return form.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
form.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
form.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
    const formForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: form.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
        formForm.get = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: form.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::form
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:22
 * @route '/kegiatan/{kegiatan}/absen'
 */
        formForm.head = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: form.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    form.form = formForm
/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::submit
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:100
 * @route '/kegiatan/{kegiatan}/absen'
 */
export const submit = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/kegiatan/{kegiatan}/absen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::submit
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:100
 * @route '/kegiatan/{kegiatan}/absen'
 */
submit.url = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{kegiatan}', parsedArgs.kegiatan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::submit
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:100
 * @route '/kegiatan/{kegiatan}/absen'
 */
submit.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::submit
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:100
 * @route '/kegiatan/{kegiatan}/absen'
 */
    const submitForm = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Mahasiswa\AbsensiController::submit
 * @see app/Http/Controllers/Mahasiswa/AbsensiController.php:100
 * @route '/kegiatan/{kegiatan}/absen'
 */
        submitForm.post = (args: { kegiatan: number | { id: number } } | [kegiatan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
const absensi = {
    form: Object.assign(form, form),
submit: Object.assign(submit, submit),
}

export default absensi