import { n as createCsrfMiddleware, r as createMiddleware } from "./server-DGdO6ilc.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-B5f350eY.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	try {
		if (!{
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/",
			"VITE_SUPABASE_PROJECT_ID": "rgjnmyafehqmwawqipit",
			"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_lvxLGTrDEj4dVlPyKnTVxw_wxL6tWrs",
			"VITE_SUPABASE_URL": "https://rgjnmyafehqmwawqipit.supabase.co"
		}["VITE_SUPABASE_PUBLISHABLE_KEY"]) return next({ headers: {} });
		const { supabase } = await import("./client-Dk1QnQZF.mjs");
		const { data } = await supabase.auth.getSession();
		const token = data.session?.access_token;
		return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
	} catch {
		return next({ headers: {} });
	}
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware: [errorMiddleware, csrfMiddleware]
}));
//#endregion
export { startInstance };
