import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as createTerminal, d as saveSession, m as useServerFn, n as Input, t as Button } from "./terminal.functions-CtgZzAu-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ArrowLeft, a as ShieldAlert, d as LoaderCircle, h as Check, s as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as ThemeToggle } from "./router-BEG1uDmb.mjs";
import { t as BrandHeader } from "./brand-DGxqtOla.mjs";
import { t as Label } from "./label-DZ_y2bWR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-DLgC_wUe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Rule({ met, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: `flex items-center gap-2 text-xs ${met ? "text-success" : "text-muted-foreground"}`,
		children: [met ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), label]
	});
}
function CreatePage() {
	const navigate = useNavigate();
	const create = useServerFn(createTerminal);
	const [username, setUsername] = (0, import_react.useState)("");
	const [terminalName, setTerminalName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)(null);
	const [usernameError, setUsernameError] = (0, import_react.useState)(null);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const rules = (0, import_react.useMemo)(() => ({
		length: password.length >= 6,
		upper: /[A-Z]/.test(password),
		numeric: /[0-9]/.test(password)
	}), [password]);
	const matches = confirmPassword.length > 0 && password === confirmPassword;
	const canSubmit = username.trim().length >= 3 && terminalName.trim().length >= 2 && rules.length && rules.upper && rules.numeric && matches && status === null;
	async function onSubmit(event) {
		event.preventDefault();
		if (status !== null) return;
		setUsernameError(null);
		setFormError(null);
		const fail = (message) => {
			setFormError(message);
			toast.error(message);
		};
		if (!rules.length) return fail("Password must contain at least 6 characters.");
		if (!rules.upper) return fail("Password must contain at least one uppercase character.");
		if (!rules.numeric) return fail("Password must contain at least one numeric value.");
		if (!matches) return fail("Passwords do not match.");
		setStatus("checking");
		try {
			setTimeout(() => setStatus((s) => s === "checking" ? "creating" : s), 400);
			const result = await create({ data: {
				username,
				password,
				confirmPassword,
				terminalName
			} });
			if (!result.ok) {
				if (result.code === "username_taken") setUsernameError(result.message);
				else setFormError(result.message);
				toast.error(result.message);
				return;
			}
			saveSession(result.session);
			toast.success("Terminal created successfully.");
			await navigate({ to: "/workspace" });
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setStatus(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandHeader, {
			subtitle: "New Terminal",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-center py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-5 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-semibold text-foreground",
						children: "Create New Terminal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "Your username and password become the access credentials you share with friends."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "username",
										children: "Username"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "username",
										value: username,
										autoComplete: "username",
										onChange: (e) => {
											setUsername(e.target.value);
											setUsernameError(null);
										},
										placeholder: "student01",
										required: true
									}),
									usernameError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-destructive/30 bg-destructive/8 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-start gap-2 text-sm font-medium text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), usernameError]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "sm",
												variant: "secondary",
												onClick: () => {
													setUsername("");
													setUsernameError(null);
													document.getElementById("username")?.focus();
												},
												children: "Choose Another Username"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "outline",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/join",
													children: "Join Existing Terminal"
												})
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "terminalName",
									children: "Terminal name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "terminalName",
									value: terminalName,
									onChange: (e) => setTerminalName(e.target.value),
									placeholder: "Practical-01",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: "new-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-secondary/60 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-foreground",
											children: "Password requirements"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-2 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
													met: rules.length,
													label: "At least 6 characters"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
													met: rules.upper,
													label: "One uppercase character"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
													met: rules.numeric,
													label: "One numeric value"
												})
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "confirmPassword",
										children: "Confirm password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "confirmPassword",
										type: "password",
										autoComplete: "new-password",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										placeholder: "••••••••",
										required: true
									}),
									confirmPassword.length > 0 && !matches && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-destructive",
										children: "Passwords do not match."
									})
								]
							}),
							formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-destructive",
								children: formError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full",
								disabled: !canSubmit,
								children: [status !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), status === "checking" ? "Checking username..." : status === "creating" ? "Creating terminal..." : "Create terminal"]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { CreatePage as component };
