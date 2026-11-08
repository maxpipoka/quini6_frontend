;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4535fbea-e717-4f01-9936-52770002c5e3",e._sentryDebugIdIdentifier="sentry-dbid-4535fbea-e717-4f01-9936-52770002c5e3")}catch(e){}}();import { g as getApiClient } from '../../../chunks/client_DTLLHpdZ.mjs';
import { E as ExactSearchRequestSchema } from '../../../chunks/schemas_BWmv8V5v.mjs';
import '../../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const validationResult = ExactSearchRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: validationResult.error.errors.map((e) => e.message).join(", "),
          error: "Bad Request",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          path: "/api/search/exact",
          requestId: crypto.randomUUID()
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const apiClient = getApiClient();
    const result = await apiClient.searchExactCombination(validationResult.data.numbers);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Search API error:", error);
    const apiError = error;
    const requestId = apiError.requestId ?? crypto.randomUUID();
    const statusCode = apiError.statusCode ?? 500;
    const message = apiError.message ?? "Error interno del servidor";
    return new Response(
      JSON.stringify({
        statusCode,
        message,
        error: statusCode >= 500 ? "Internal Server Error" : "Bad Request",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        path: "/api/search/exact",
        requestId
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
