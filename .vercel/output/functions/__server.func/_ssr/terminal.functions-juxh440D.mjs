import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-Dx12ulSr2.mjs";
import { a as sessionSchema, i as messageSchema, n as fileLinkSchema, o as uploadSchema, r as joinSchema, s as usernameSchema, t as createSchema } from "./terminal.schemas-BU5-cy6k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terminal.functions-juxh440D.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var checkUsername_createServerFn_handler = createServerRpc({
	id: "c5acbbab1cec499e7cf8b3b7aa471ac86c46d57c93ba653d12f2c1baf554ec5a",
	name: "checkUsername",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => checkUsername.__executeServer(opts));
var checkUsername = createServerFn({ method: "POST" }).validator((data) => usernameSchema.parse(data)).handler(checkUsername_createServerFn_handler, async ({ data }) => {
	const { findTerminalByUsername } = await import("./localStorage.server-DgrQmuv2.mjs");
	return { available: !await findTerminalByUsername(data.username) };
});
var createTerminal_createServerFn_handler = createServerRpc({
	id: "9b91162663cc5ec825d2c54259bcbf31453ea8e96c61e4b41b5b125839b167da",
	name: "createTerminal",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => createTerminal.__executeServer(opts));
var createTerminal = createServerFn({ method: "POST" }).validator((data) => createSchema.parse(data)).handler(createTerminal_createServerFn_handler, async ({ data }) => {
	const { hashPassword, validatePassword } = await import("./terminal.server-4wrJick0.mjs");
	if (data.password !== data.confirmPassword) return {
		ok: false,
		code: "password",
		message: "Passwords do not match."
	};
	const errors = validatePassword(data.password);
	if (errors.length > 0) return {
		ok: false,
		code: "password",
		message: errors[0]
	};
	const { findTerminalByUsername, insertTerminal, insertMember, insertMessage } = await import("./localStorage.server-DgrQmuv2.mjs");
	if (await findTerminalByUsername(data.username)) return {
		ok: false,
		code: "username_taken",
		message: "Username already exists. Please choose another username or join your existing terminal."
	};
	const password_hash = await hashPassword(data.password);
	const terminal = await insertTerminal({
		name: data.terminalName,
		owner_username: data.username,
		password_hash
	});
	const displayName = data.displayName?.trim() || data.username;
	const member = await insertMember({
		terminal_id: terminal.id,
		display_name: displayName,
		is_owner: true
	});
	await insertMessage({
		terminal_id: terminal.id,
		author: "system",
		body: `${displayName} created the terminal "${terminal.name}".`
	});
	return {
		ok: true,
		session: {
			terminalId: terminal.id,
			memberId: member.id,
			terminalName: terminal.name,
			displayName,
			ownerUsername: terminal.owner_username,
			isOwner: true
		}
	};
});
var joinTerminal_createServerFn_handler = createServerRpc({
	id: "684970459c3bab56e26e3a286c51b82f7e6e689928305136f07fd3383bdee2d6",
	name: "joinTerminal",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => joinTerminal.__executeServer(opts));
var joinTerminal = createServerFn({ method: "POST" }).validator((data) => joinSchema.parse(data)).handler(joinTerminal_createServerFn_handler, async ({ data }) => {
	const { verifyPassword } = await import("./terminal.server-4wrJick0.mjs");
	const { findTerminalByUsername, insertMember, insertMessage } = await import("./localStorage.server-DgrQmuv2.mjs");
	const terminal = await findTerminalByUsername(data.username);
	const valid = terminal ? await verifyPassword(data.password, terminal.password_hash) : false;
	if (!terminal || !valid) return {
		ok: false,
		message: "Terminal not found or credentials are incorrect."
	};
	const displayName = data.displayName?.trim() || `Guest-${Math.floor(1e3 + Math.random() * 9e3)}`;
	const member = await insertMember({
		terminal_id: terminal.id,
		display_name: displayName,
		is_owner: false
	});
	await insertMessage({
		terminal_id: terminal.id,
		author: "system",
		body: `${displayName} connected to the terminal.`
	});
	return {
		ok: true,
		session: {
			terminalId: terminal.id,
			memberId: member.id,
			terminalName: terminal.name,
			displayName,
			ownerUsername: terminal.owner_username,
			isOwner: false
		}
	};
});
var getWorkspace_createServerFn_handler = createServerRpc({
	id: "a2abf8955df2c906a8e16eeb597b0a6073331f8bc2ee46e34dac8d6082c5b1ef",
	name: "getWorkspace",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => getWorkspace.__executeServer(opts));
var getWorkspace = createServerFn({ method: "POST" }).validator((data) => sessionSchema.parse(data)).handler(getWorkspace_createServerFn_handler, async ({ data }) => {
	const { requireMember } = await import("./terminal.server-4wrJick0.mjs");
	await requireMember(data.terminalId, data.memberId);
	const { getWorkspaceData, updateMemberLastSeen } = await import("./localStorage.server-DgrQmuv2.mjs");
	await updateMemberLastSeen(data.memberId);
	const { terminal, members, messages, files } = await getWorkspaceData(data.terminalId);
	const cutoff = Date.now() - 6e4;
	return {
		terminal,
		members: (members ?? []).map((m) => ({
			id: m.id,
			display_name: m.display_name,
			is_owner: m.is_owner,
			online: new Date(m.last_seen).getTime() > cutoff
		})),
		messages: messages ?? [],
		files: files ?? []
	};
});
var sendMessage_createServerFn_handler = createServerRpc({
	id: "668e7730614860de66eb3fafb28aac78a0b124c41daeb1befb93e008f6cd75a0",
	name: "sendMessage",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).validator((data) => messageSchema.parse(data)).handler(sendMessage_createServerFn_handler, async ({ data }) => {
	const { requireMember } = await import("./terminal.server-4wrJick0.mjs");
	const member = await requireMember(data.terminalId, data.memberId);
	const { insertMessage } = await import("./localStorage.server-DgrQmuv2.mjs");
	await insertMessage({
		terminal_id: data.terminalId,
		author: member.display_name,
		body: data.body
	});
	return { ok: true };
});
var uploadTerminalFile_createServerFn_handler = createServerRpc({
	id: "53f831094dc8a4df789ce9be5d81d4d01fe07d41b2eeb58632424c37b40bb88c",
	name: "uploadTerminalFile",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => uploadTerminalFile.__executeServer(opts));
var uploadTerminalFile = createServerFn({ method: "POST" }).validator((data) => uploadSchema.parse(data)).handler(uploadTerminalFile_createServerFn_handler, async ({ data }) => {
	const { requireMember } = await import("./terminal.server-4wrJick0.mjs");
	const member = await requireMember(data.terminalId, data.memberId);
	const binary = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
	if (binary.byteLength > 10485760) return {
		ok: false,
		message: "Files must be 10MB or smaller."
	};
	const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
	const { saveUploadFile, addFileRecord, insertMessage } = await import("./localStorage.server-DgrQmuv2.mjs");
	const { publicPath } = await saveUploadFile(data.terminalId, safeName, binary);
	await addFileRecord({
		terminal_id: data.terminalId,
		uploader: member.display_name,
		file_name: data.fileName,
		file_size: binary.byteLength,
		mime_type: data.mimeType,
		storage_path: publicPath
	});
	await insertMessage({
		terminal_id: data.terminalId,
		author: "system",
		body: `${member.display_name} uploaded ${data.fileName}.`
	});
	return { ok: true };
});
var getFileLink_createServerFn_handler = createServerRpc({
	id: "e887e6095bb83e32625d308d61d4cb0ab56438980a3691359eb79646790bec50",
	name: "getFileLink",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => getFileLink.__executeServer(opts));
var getFileLink = createServerFn({ method: "POST" }).validator((data) => fileLinkSchema.parse(data)).handler(getFileLink_createServerFn_handler, async ({ data }) => {
	const { requireMember } = await import("./terminal.server-4wrJick0.mjs");
	await requireMember(data.terminalId, data.memberId);
	const { getWorkspaceData } = await import("./localStorage.server-DgrQmuv2.mjs");
	const { files } = await getWorkspaceData(data.terminalId);
	const file = (files ?? []).find((f) => f.id === data.fileId && f.terminal_id === data.terminalId);
	if (!file) return {
		ok: false,
		url: null
	};
	return {
		ok: true,
		url: file.storage_path
	};
});
var leaveTerminal_createServerFn_handler = createServerRpc({
	id: "2cbaca56aaba4ac68569dffeaacb4d28a933109c07065b85a06c40b7c9ad442c",
	name: "leaveTerminal",
	filename: "src/lib/terminal.functions.ts"
}, (opts) => leaveTerminal.__executeServer(opts));
var leaveTerminal = createServerFn({ method: "POST" }).validator((data) => sessionSchema.parse(data)).handler(leaveTerminal_createServerFn_handler, async ({ data }) => {
	const { requireMember, getMember } = await import("./terminal.server-4wrJick0.mjs");
	const member = await requireMember(data.terminalId, data.memberId);
	const { deleteMember, insertMessage } = await import("./localStorage.server-DgrQmuv2.mjs");
	if (member) {
		await insertMessage({
			terminal_id: data.terminalId,
			author: "system",
			body: `${member.display_name} disconnected.`
		});
		await deleteMember(data.memberId);
	}
	return { ok: true };
});
//#endregion
export { checkUsername_createServerFn_handler, createTerminal_createServerFn_handler, getFileLink_createServerFn_handler, getWorkspace_createServerFn_handler, joinTerminal_createServerFn_handler, leaveTerminal_createServerFn_handler, sendMessage_createServerFn_handler, uploadTerminalFile_createServerFn_handler };
