import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { f as sendMessage, l as leaveTerminal, m as useServerFn, n as Input, o as getFileLink, p as uploadTerminalFile, r as clearSession, s as getWorkspace, t as Button, u as readSession } from "./terminal.functions-pwRqEwsX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Paperclip, d as LoaderCircle, m as Download, n as Users, o as Send, p as FileText, u as LogOut } from "../_libs/lucide-react.mjs";
import { n as ThemeToggle } from "./router-1AR1Yh9r.mjs";
import { t as BrandHeader } from "./brand-DGxqtOla.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-CvYq45C6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function WorkspacePage() {
	const navigate = useNavigate();
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const stored = readSession();
		if (!stored) {
			navigate({ to: "/" });
			return;
		}
		setSession(stored);
	}, [navigate]);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, { session });
}
function Workspace({ session }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const fetchWorkspace = useServerFn(getWorkspace);
	const postMessage = useServerFn(sendMessage);
	const uploadFile = useServerFn(uploadTerminalFile);
	const fileLink = useServerFn(getFileLink);
	const disconnect = useServerFn(leaveTerminal);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const fileInput = (0, import_react.useRef)(null);
	const scroller = (0, import_react.useRef)(null);
	const ident = {
		terminalId: session.terminalId,
		memberId: session.memberId
	};
	const { data, isError } = useQuery({
		queryKey: [
			"workspace",
			session.terminalId,
			session.memberId
		],
		queryFn: () => fetchWorkspace({ data: ident }),
		refetchInterval: 3e3
	});
	(0, import_react.useEffect)(() => {
		if (isError) {
			clearSession();
			toast.error("Your terminal session ended.");
			navigate({ to: "/" });
		}
	}, [isError, navigate]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [data?.messages.length]);
	const send = useMutation({
		mutationFn: (body) => postMessage({ data: {
			...ident,
			body
		} }),
		onSuccess: () => {
			setDraft("");
			queryClient.invalidateQueries({ queryKey: ["workspace"] });
		},
		onError: () => toast.error("Message could not be sent.")
	});
	async function onUpload(file) {
		if (file.size > 10485760) {
			toast.error("Files must be 10MB or smaller.");
			return;
		}
		setUploading(true);
		try {
			const buffer = new Uint8Array(await file.arrayBuffer());
			let binary = "";
			for (let i = 0; i < buffer.length; i += 8192) binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
			const result = await uploadFile({ data: {
				...ident,
				fileName: file.name,
				mimeType: file.type || "application/octet-stream",
				content: btoa(binary)
			} });
			if (!result.ok) toast.error(result.message);
			else {
				toast.success(`${file.name} shared with the terminal.`);
				queryClient.invalidateQueries({ queryKey: ["workspace"] });
			}
		} catch {
			toast.error("Upload failed. Please try again.");
		} finally {
			setUploading(false);
			if (fileInput.current) fileInput.current.value = "";
		}
	}
	async function openFile(fileId) {
		const result = await fileLink({ data: {
			...ident,
			fileId
		} });
		if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
		else toast.error("File is not available.");
	}
	async function onLeave() {
		try {
			await disconnect({ data: ident });
		} finally {
			clearSession();
			navigate({ to: "/" });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "glass-card flex flex-wrap items-center justify-between gap-4 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandHeader, { subtitle: session.terminalName })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-success" }),
							"Connected to ",
							session.terminalName
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onLeave,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Leave"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid flex-1 gap-5 lg:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-card flex min-h-[60vh] flex-col p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Shared chat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scroller,
						className: "mt-4 flex-1 space-y-3 overflow-y-auto pr-1",
						children: (data?.messages ?? []).map((message) => message.author === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: message.body
						}, message.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${message.author === session.displayName ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.author === session.displayName ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold opacity-70",
									children: message.author
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 whitespace-pre-wrap break-words",
									children: message.body
								})]
							})
						}, message.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex items-center gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							if (draft.trim().length > 0 && !send.isPending) send.mutate(draft.trim());
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInput,
								type: "file",
								className: "hidden",
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) onUpload(file);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								disabled: uploading,
								onClick: () => fileInput.current?.click(),
								"aria-label": "Upload a file",
								children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft,
								onChange: (event) => setDraft(event.target.value),
								placeholder: "Share a message, note or practical data..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "icon",
								disabled: send.isPending || draft.trim() === "",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Connected users"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: (data?.members ?? []).map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${member.online ? "bg-success" : "bg-border"}` }),
									member.display_name,
									member.is_owner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground",
										children: "owner"
									})
								]
							}, member.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card flex-1 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Shared files"]
						}), (data?.files ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "No files yet. Use the clip icon to share PDFs and documents."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: (data?.files ?? []).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 rounded-xl border border-border bg-card/70 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium text-foreground",
										children: file.file_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											formatSize(file.file_size),
											" · ",
											file.uploader
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => void openFile(file.id),
									"aria-label": `Open ${file.file_name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
								})]
							}, file.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Share these credentials so friends can join: username",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: session.ownerUsername
								}),
								" and the terminal password."
							]
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { WorkspacePage as component };
