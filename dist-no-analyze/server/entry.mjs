;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ac14e069-79a7-49bf-9020-94ed6641db20",e._sentryDebugIdIdentifier="sentry-dbid-ac14e069-79a7-49bf-9020-94ed6641db20")}catch(e){}}();import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DaIA0YlC.mjs';
import { manifest } from './manifest_C7duidl4.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/change-password.astro.mjs');
const _page3 = () => import('./pages/admin/debug-cookies.astro.mjs');
const _page4 = () => import('./pages/admin/draws/create.astro.mjs');
const _page5 = () => import('./pages/admin/draws/_id_/edit.astro.mjs');
const _page6 = () => import('./pages/admin/draws.astro.mjs');
const _page7 = () => import('./pages/admin/health.astro.mjs');
const _page8 = () => import('./pages/admin/imports/upload.astro.mjs');
const _page9 = () => import('./pages/admin/imports.astro.mjs');
const _page10 = () => import('./pages/admin/layout.astro.mjs');
const _page11 = () => import('./pages/admin/login.astro.mjs');
const _page12 = () => import('./pages/api/deploy-hook.astro.mjs');
const _page13 = () => import('./pages/api/search/exact.astro.mjs');
const _page14 = () => import('./pages/buscar.astro.mjs');
const _page15 = () => import('./pages/robots.txt.astro.mjs');
const _page16 = () => import('./pages/sitemap.xml.astro.mjs');
const _page17 = () => import('./pages/sorteos/_officialnumber_.astro.mjs');
const _page18 = () => import('./pages/sorteos.astro.mjs');
const _page19 = () => import('./pages/test-fixtures/filedropzone-visual.astro.mjs');
const _page20 = () => import('./pages/test-fixtures/importhistorytable-visual.astro.mjs');
const _page21 = () => import('./pages/test-fixtures/importpreviewtable-visual.astro.mjs');
const _page22 = () => import('./pages/test-fixtures/importprogress-visual.astro.mjs');
const _page23 = () => import('./pages/test-fixtures/progress-visual.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/change-password.astro", _page2],
    ["src/pages/admin/debug-cookies.astro", _page3],
    ["src/pages/admin/draws/create.astro", _page4],
    ["src/pages/admin/draws/[id]/edit.astro", _page5],
    ["src/pages/admin/draws/index.astro", _page6],
    ["src/pages/admin/health.astro", _page7],
    ["src/pages/admin/imports/upload.astro", _page8],
    ["src/pages/admin/imports/index.astro", _page9],
    ["src/pages/admin/layout.astro", _page10],
    ["src/pages/admin/login.astro", _page11],
    ["src/pages/api/deploy-hook.ts", _page12],
    ["src/pages/api/search/exact.ts", _page13],
    ["src/pages/buscar.astro", _page14],
    ["src/pages/robots.txt.ts", _page15],
    ["src/pages/sitemap.xml.ts", _page16],
    ["src/pages/sorteos/[officialNumber].astro", _page17],
    ["src/pages/sorteos/index.astro", _page18],
    ["src/pages/test-fixtures/FileDropzone-visual.astro", _page19],
    ["src/pages/test-fixtures/ImportHistoryTable-visual.astro", _page20],
    ["src/pages/test-fixtures/ImportPreviewTable-visual.astro", _page21],
    ["src/pages/test-fixtures/ImportProgress-visual.astro", _page22],
    ["src/pages/test-fixtures/Progress-visual.astro", _page23],
    ["src/pages/index.astro", _page24]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///D:/Desarrollo/quini6_frontend/dist-no-analyze/client/",
    "server": "file:///D:/Desarrollo/quini6_frontend/dist-no-analyze/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
