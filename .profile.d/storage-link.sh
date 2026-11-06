#!/usr/bin/env bash

if [ ! -L public/storage ]; then
    php artisan storage:link || ln -snf ../storage/app/public public/storage
fi
