import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { D as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as Slot } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-BuxZqWsF2.mjs";
import { a as sessionSchema, i as messageSchema, n as fileLinkSchema, o as uploadSchema, r as joinSchema, s as usernameSchema, t as createSchema } from "./terminal.schemas-BU5-cy6k.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terminal.functions-pwRqEwsX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var KEY = "terminal-session";
function saveSession(session) {
	localStorage.setItem(KEY, JSON.stringify(session));
}
function readSession() {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function clearSession() {
	localStorage.removeItem(KEY);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "POST" }).validator((data) => usernameSchema.parse(data)).handler(createSsrRpc("c5acbbab1cec499e7cf8b3b7aa471ac86c46d57c93ba653d12f2c1baf554ec5a"));
var createTerminal = createServerFn({ method: "POST" }).validator((data) => createSchema.parse(data)).handler(createSsrRpc("9b91162663cc5ec825d2c54259bcbf31453ea8e96c61e4b41b5b125839b167da"));
var joinTerminal = createServerFn({ method: "POST" }).validator((data) => joinSchema.parse(data)).handler(createSsrRpc("684970459c3bab56e26e3a286c51b82f7e6e689928305136f07fd3383bdee2d6"));
var getWorkspace = createServerFn({ method: "POST" }).validator((data) => sessionSchema.parse(data)).handler(createSsrRpc("a2abf8955df2c906a8e16eeb597b0a6073331f8bc2ee46e34dac8d6082c5b1ef"));
var sendMessage = createServerFn({ method: "POST" }).validator((data) => messageSchema.parse(data)).handler(createSsrRpc("668e7730614860de66eb3fafb28aac78a0b124c41daeb1befb93e008f6cd75a0"));
var uploadTerminalFile = createServerFn({ method: "POST" }).validator((data) => uploadSchema.parse(data)).handler(createSsrRpc("53f831094dc8a4df789ce9be5d81d4d01fe07d41b2eeb58632424c37b40bb88c"));
var getFileLink = createServerFn({ method: "POST" }).validator((data) => fileLinkSchema.parse(data)).handler(createSsrRpc("e887e6095bb83e32625d308d61d4cb0ab56438980a3691359eb79646790bec50"));
var leaveTerminal = createServerFn({ method: "POST" }).validator((data) => sessionSchema.parse(data)).handler(createSsrRpc("2cbaca56aaba4ac68569dffeaacb4d28a933109c07065b85a06c40b7c9ad442c"));
//#endregion
export { createTerminal as a, joinTerminal as c, saveSession as d, sendMessage as f, cn as i, leaveTerminal as l, useServerFn as m, Input as n, getFileLink as o, uploadTerminalFile as p, clearSession as r, getWorkspace as s, Button as t, readSession as u };
