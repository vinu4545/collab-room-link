import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { f as Link2, g as ArrowRight, i as Sparkles, s as Plus } from "../_libs/lucide-react.mjs";
import { n as ThemeToggle } from "./router-BEG1uDmb.mjs";
import { t as BrandHeader } from "./brand-DGxqtOla.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DisGlxG7.js
var import_jsx_runtime = require_jsx_runtime();
function Welcome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandHeader, { action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-1 flex-col justify-center py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), "Work together without repeatedly logging into separate platforms"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl",
							children: ["Welcome to the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gradient-text",
								children: "Workspace"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base text-muted-foreground",
							children: "Choose how you want to continue."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/join",
						className: "choice-card choice-card-hover group flex flex-col gap-4 p-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-foreground",
								children: "Join Existing Terminal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Connect with your friend and continue working together in the terminal they already created."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary",
								children: ["Enter credentials", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/create",
						className: "choice-card choice-card-hover group flex flex-col gap-4 p-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-foreground",
								children: "Create New Terminal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Start a new workspace for your practical, files and collaboration — then share the access with friends."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary",
								children: ["Set it up", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "pb-4 text-xs text-muted-foreground",
				children: "Create a room → Share access → Collaborate → Upload → Chat → Finish"
			})
		]
	});
}
//#endregion
export { Welcome as component };
