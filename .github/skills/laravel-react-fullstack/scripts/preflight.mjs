#!/usr/bin/env node
/**
 * Compact fact sheet for a Laravel + React repo (read-only, zero dependencies, no network).
 * Usage: node preflight.mjs [projectDir]
 * Replaces ~10 discovery commands with ~40 lines of output. Of the .env files it reads only
 * APP_ENV and APP_DEBUG, and it never prints any other value.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const at = (...parts) => join(root, ...parts);
const text = (file) => (existsSync(at(file)) ? readFileSync(at(file), 'utf8') : null);
const json = (file) => {
    try {
        return JSON.parse(text(file) ?? 'null');
    } catch {
        return null;
    }
};
const sh = (cmd, args) => {
    try {
        return execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15_000 }).trim();
    } catch {
        return null;
    }
};
const ls = (dir) => {
    try {
        return readdirSync(at(dir));
    } catch {
        return [];
    }
};

function files(dir, keep = () => true) {
    const found = [];
    const walk = (current) => {
        for (const name of ls(current)) {
            const rel = join(current, name);
            let info;
            try {
                info = statSync(at(rel));
            } catch {
                continue;
            }
            if (info.isDirectory()) {
                if (!['node_modules', 'vendor'].includes(name)) walk(rel);
            } else if (keep(rel)) {
                found.push(rel);
            }
        }
    };
    walk(dir);
    return found;
}

// ---- dependencies -------------------------------------------------------------------------
const composer = json('composer.json') ?? {};
const lock = json('composer.lock');
const locked = new Map([...(lock?.packages ?? []), ...(lock?.['packages-dev'] ?? [])].map((p) => [p.name, String(p.version).replace(/^v/, '')]));
const phpDeps = { ...composer.require, ...composer['require-dev'] };
const pkg = json('package.json') ?? {};
const npmLock = json('package-lock.json');
const jsDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const npmVersion = (name) => npmLock?.packages?.[`node_modules/${name}`]?.version;

const versions = (names, deps, resolver) =>
    names
        .filter((name) => name in deps)
        .map((name) => {
            const exact = resolver(name);
            return exact ? `${name} ${exact}` : `${name} ${deps[name]}(c)`;
        })
        .join(', ') || '-';

const jsLock = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb'].find((f) => existsSync(at(f)));
const out = [];
const flags = [];

out.push(`project: ${basename(root)} | git: ${sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']) ?? 'none'} (${(sh('git', ['status', '--porcelain']) ?? '').split('\n').filter(Boolean).length} changed)`);
out.push(`runtime: php ${sh('php', ['-r', 'echo PHP_VERSION;']) ?? 'not found'} | node ${process.version} | composer.lock ${lock ? 'yes' : 'NO'} | js lock ${jsLock ?? 'NO'}`);
out.push(
    'php: ' +
        versions(
            ['laravel/framework', 'inertiajs/inertia-laravel', 'laravel/fortify', 'laravel/sanctum', 'laravel/wayfinder', 'laravel/boost', 'laravel/pao', 'laravel/horizon', 'laravel/pulse', 'laravel/telescope', 'spatie/laravel-permission', 'pestphp/pest', 'phpunit/phpunit', 'laravel/pint', 'larastan/larastan', 'roave/security-advisories'],
            phpDeps,
            (name) => locked.get(name),
        ),
);
out.push(
    'js: ' +
        versions(
            ['react', '@inertiajs/react', 'vite', 'vite-plus', 'tailwindcss', 'typescript', 'lucide-react', 'sonner', '@tanstack/react-table', '@tanstack/react-query', 'axios', 'zod', 'react-hook-form', '@playwright/test', 'vitest', 'eslint', 'prettier'],
            jsDeps,
            npmVersion,
        ) +
        '   ((c) = constraint only, not locked/installed)',
);
out.push(`composer scripts: ${Object.keys(composer.scripts ?? {}).filter((k) => !/^(pre|post)-/.test(k)).join(' ') || '-'}`);
out.push(`npm scripts: ${Object.keys(pkg.scripts ?? {}).join(' ') || '-'}`);

// ---- structure & conventions --------------------------------------------------------------
const count = (dir, ext = '.php') => files(dir, (f) => f.endsWith(ext)).length;
const uiNames = ls('resources/js/components/ui').map((f) => f.replace(/\.[^.]+$/, ''));
out.push(
    `structure: Actions ${count('app/Actions')} | Controllers ${count('app/Http/Controllers')} | Requests ${count('app/Http/Requests')} | Models ${count('app/Models')} | Policies ${count('app/Policies')} | tests Feature ${count('tests/Feature')} Unit ${count('tests/Unit')} | pages ${count('resources/js/pages', '.tsx')} | components ${count('resources/js/components', '.tsx')}`,
);
out.push(`ui components installed: ${uiNames.join(' ') || '-'}`);

const generated = /^resources\/js\/(actions|routes|wayfinder|components\/ui)\//;
const jsFiles = files('resources/js', (f) => /\.(tsx?|jsx?)$/.test(f)).map((f) => f.split('\\').join('/')).filter((f) => !generated.test(f));
const kebab = jsFiles.filter((f) => /^[a-z0-9]+(-[a-z0-9]+)*(\.d)?\.(tsx?|jsx?)$/.test(basename(f))).length;
const tsconfig = text('tsconfig.json') ?? '';
out.push(
    `conventions: tests=${'pestphp/pest' in phpDeps ? 'Pest' : 'PHPUnit'} | js files kebab-case ${jsFiles.length ? Math.round((kebab / jsFiles.length) * 100) : 0}% of ${jsFiles.length} | ts strict ${/"strict"\s*:\s*true/.test(tsconfig) ? 'yes' : 'no/unknown'} | alias @/ ${/"@\/\*"/.test(tsconfig) ? 'yes' : 'no/unknown'} | React Compiler ${'babel-plugin-react-compiler' in jsDeps ? 'yes' : 'no'}`,
);

// ---- environment (values only for APP_ENV / APP_DEBUG) ------------------------------------
const envLines = [];
for (const file of ['.env', '.env.production']) {
    const content = text(file);
    if (content === null) continue;
    const get = (key) => content.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '?';
    const [env, debug] = [get('APP_ENV'), get('APP_DEBUG')];
    envLines.push(`${file}: APP_ENV=${env} APP_DEBUG=${debug}`);
    if (env === 'production' && debug === 'true') flags.push(`${file}: APP_DEBUG=true in production`);
}
out.push(`env: ${envLines.join(' | ') || 'no .env file'}`);
const ai = ['AGENTS.md', 'CLAUDE.md', '.ai', '.claude/skills', '.cursor/rules', '.github/copilot-instructions.md'].filter((f) => existsSync(at(f)));
out.push(`agent files: ${ai.join(', ') || 'none'}`);

// ---- flags ---------------------------------------------------------------------------------
if (!lock) flags.push('composer.lock missing (builds are not reproducible)');
if (!jsLock) flags.push('no JS lockfile (use npm ci / pnpm install --frozen-lockfile in CI)');
if ((sh('git', ['ls-files', '.env', '.env.production']) ?? '') !== '') flags.push('.env file is tracked by git');
if (!/ignore-scripts\s*=\s*true/.test(text('.npmrc') ?? '')) flags.push('.npmrc lacks ignore-scripts=true (supply-chain hardening)');
const major = (version) => Number(String(version ?? '').match(/\d+/)?.[0]);
const laravel = major(locked.get('laravel/framework') ?? phpDeps['laravel/framework']);
if (laravel && laravel < 12) flags.push(`laravel/framework ${laravel}.x is end-of-life`);
const [inertiaPhp, inertiaJs] = [major(locked.get('inertiajs/inertia-laravel') ?? phpDeps['inertiajs/inertia-laravel']), major(npmVersion('@inertiajs/react') ?? jsDeps['@inertiajs/react'])];
if (inertiaPhp && inertiaJs && inertiaPhp !== inertiaJs) flags.push(`Inertia major mismatch: inertia-laravel ${inertiaPhp} vs @inertiajs/react ${inertiaJs}`);
if (major(jsDeps.tailwindcss) === 3 || existsSync(at('tailwind.config.js'))) flags.push('Tailwind 3 setup detected: v4 class renames in responsive-ui-ux do not apply as written');
if (jsDeps.axios && inertiaJs >= 3) flags.push('axios is a dependency but Inertia 3 does not bundle it: confirm it is still needed (useHttp / router replace most uses)');
if (count('tests/Feature') + count('tests/Unit') === 0) flags.push('no PHP tests found');

console.log(out.join('\n'));
if (flags.length) console.log('\n! ' + flags.join('\n! '));
