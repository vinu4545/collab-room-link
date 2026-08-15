import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-DGxqtOla.js
var import_jsx_runtime = require_jsx_runtime();
var logo_png_asset_default = {
	version: 1,
	asset_id: "5e62689f-85f2-4376-9377-0711eecc5844",
	project_id: "0ba3b46c-9eb8-4918-b408-7a3fceebb56b",
	url: "/__l5e/assets-v1/5e62689f-85f2-4376-9377-0711eecc5844/logo.png",
	r2_key: "a/v1/0ba3b46c-9eb8-4918-b408-7a3fceebb56b/5e62689f-85f2-4376-9377-0711eecc5844/logo.png",
	original_filename: "logo.png",
	size: 135594,
	content_type: "image/png",
	created_at: "2026-08-11T22:49:44Z"
};
function Logo({ size = 44 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center justify-center rounded-2xl bg-logo-tile p-2 shadow-sm ring-1 ring-border",
		style: {
			width: size,
			height: size
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo_png_asset_default.url,
			alt: "Terminal workspace logo",
			className: "h-full w-full object-contain"
		})
	});
}
function BrandHeader({ subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-3 ${action ? "w-full" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "leading-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-[0.28em] text-foreground uppercase",
					children: "Prosperity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-muted-foreground uppercase",
					children: subtitle ?? "Terminal Workspace"
				})]
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ml-auto flex items-center gap-2",
				children: action
			}) : null
		]
	});
}
//#endregion
export { BrandHeader as t };
