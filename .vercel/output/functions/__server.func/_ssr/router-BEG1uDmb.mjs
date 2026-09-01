import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as __exportAll } from "./server-Dx12ulSr.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { l as Moon, r as Sun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BEG1uDmb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D_NG67n4.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var THEME_STORAGE_KEY = "terminal-theme";
/**
* Runs before hydration so the correct theme class is on <html> immediately.
* Prevents a flash of the wrong theme.
*/
var themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="light"||s==="dark"?s:(m?"dark":"light");var e=document.documentElement;e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;}catch(e){}})();`;
var ThemeContext = (0, import_react.createContext)({
	theme: "light",
	setTheme: () => {},
	toggleTheme: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
		setThemeState(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
		document.documentElement.style.colorScheme = initial;
	}, []);
	const setTheme = (0, import_react.useCallback)((next) => {
		setThemeState(next);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {}
		const root = document.documentElement;
		root.classList.add("theme-transition");
		root.classList.toggle("dark", next === "dark");
		root.style.colorScheme = next;
		window.setTimeout(() => root.classList.remove("theme-transition"), 340);
	}, []);
	const toggleTheme = (0, import_react.useCallback)(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			setTheme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
function ThemeToggle({ className = "" }) {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggleTheme,
		"aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
		title: isDark ? "Switch to light mode" : "Switch to dark mode",
		className: `group relative inline-flex h-10 w-[4.5rem] items-center rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur transition-colors duration-300 hover:border-primary/45 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-1 left-1 h-8 w-8 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out",
				style: { transform: isDark ? "translateX(2.05rem)" : "translateX(0)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative z-10 flex h-8 w-8 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: `h-4 w-4 transition-colors duration-300 ${isDark ? "text-muted-foreground" : "text-primary-foreground"}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative z-10 flex h-8 w-8 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: `h-4 w-4 transition-colors duration-300 ${isDark ? "text-primary-foreground" : "text-muted-foreground"}` })
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Terminal Workspace" },
			{
				name: "description",
				content: "Create or join a private terminal to chat and share practical files instantly."
			},
			{
				property: "og:title",
				content: "Terminal Workspace"
			},
			{
				property: "og:description",
				content: "Create or join a private terminal to chat and share practical files instantly."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/png",
			href: "/favicon.png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedToaster, {})] })
	});
}
function ThemedToaster() {
	const { theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		position: "top-center",
		richColors: true,
		theme,
		closeButton: true
	});
}
var $$splitComponentImporter$3 = () => import("./routes-DisGlxG7.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Terminal Workspace — Create or Join a Study Terminal" },
		{
			name: "description",
			content: "Create a private terminal or join a friend's terminal to chat, share PDFs and practical files instantly."
		},
		{
			property: "og:title",
			content: "Terminal Workspace — Create or Join a Study Terminal"
		},
		{
			property: "og:description",
			content: "Work together without repeatedly logging into separate platforms."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./create-DLgC_wUe.mjs");
var Route$2 = createFileRoute("/create")({
	head: () => ({ meta: [
		{ title: "Create New Terminal — Terminal Workspace" },
		{
			name: "description",
			content: "Create your own private terminal for practical files, chat and collaboration."
		},
		{
			property: "og:title",
			content: "Create New Terminal — Terminal Workspace"
		},
		{
			property: "og:description",
			content: "Start a new workspace and share the access with your classmates."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./join-DSVBACg5.mjs");
var Route$1 = createFileRoute("/join")({
	head: () => ({ meta: [
		{ title: "Join Existing Terminal — Terminal Workspace" },
		{
			name: "description",
			content: "Enter the terminal username and password shared by your friend to join their workspace."
		},
		{
			property: "og:title",
			content: "Join Existing Terminal — Terminal Workspace"
		},
		{
			property: "og:description",
			content: "Connect to a terminal already created by your friend or classmate."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./workspace-PcXRa7-N.mjs");
var Route = createFileRoute("/workspace")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Shared Workspace — Terminal Workspace" },
		{
			name: "description",
			content: "Chat, upload PDFs and share practical files with everyone connected to your terminal."
		},
		{
			property: "og:title",
			content: "Shared Workspace — Terminal Workspace"
		},
		{
			property: "og:description",
			content: "A lightweight room for college practical work: chat, files and shared data."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	CreateRoute: Route$2.update({
		id: "/create",
		path: "/create",
		getParentRoute: () => Route$4
	}),
	JoinRoute: Route$1.update({
		id: "/join",
		path: "/join",
		getParentRoute: () => Route$4
	}),
	WorkspaceRoute: Route.update({
		id: "/workspace",
		path: "/workspace",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { ThemeToggle as n, router_exports as t };
