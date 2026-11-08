;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1c189137-e2e9-4f77-8c9a-3c30cca97de0",e._sentryDebugIdIdentifier="sentry-dbid-1c189137-e2e9-4f77-8c9a-3c30cca97de0")}catch(e){}}();import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  request.headers.get("authorization");
  {
    console.error("VERCEL_DEPLOY_HOOK_SECRET not configured");
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
