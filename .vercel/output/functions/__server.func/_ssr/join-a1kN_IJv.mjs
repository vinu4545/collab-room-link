import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { c as joinTerminal, d as saveSession, m as useServerFn, n as Input, t as Button } from "./terminal.functions-pwRqEwsX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ArrowLeft, a as ShieldAlert, d as LoaderCircle, f as Link2 } from "../_libs/lucide-react.mjs";
import { n as ThemeToggle } from "./router-1AR1Yh9r.mjs";
import { t as BrandHeader } from "./brand-DGxqtOla.mjs";
import { t as Label } from "./label-DLuSUO64.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-a1kN_IJv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	const navigate = useNavigate();
	const join = useServerFn(joinTerminal);
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		if (pending) return;
		setError(null);
		setPending(true);
		try {
			const result = await join({ data: {
				username,
				password,
				displayName
			} });
			if (!result.ok) {
				setError(result.message);
				toast.error(result.message);
				setPassword("");
				return;
			}
			saveSession(result.session);
			toast.success(`Connected to ${result.session.terminalName}`);
			await navigate({ to: "/workspace" });
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandHeader, {
			subtitle: "Terminal Access",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-5 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-semibold text-foreground",
						children: "Join Existing Terminal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "Enter the credentials of the terminal you were invited to."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "username",
									children: "Terminal username"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "username",
									value: username,
									autoComplete: "username",
									onChange: (e) => setUsername(e.target.value),
									placeholder: "student01",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Terminal password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: "current-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "displayName",
									children: "Your display name (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "displayName",
									value: displayName,
									onChange: (e) => setDisplayName(e.target.value),
									placeholder: "Riya"
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-destructive/30 bg-destructive/8 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-2 text-sm font-medium text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), error]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										variant: "secondary",
										disabled: pending,
										children: "Try Again"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/create",
											children: "Create New Terminal"
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full",
								disabled: pending,
								children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), pending ? "Verifying credentials..." : "Connect to terminal"]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { JoinPage as component };
