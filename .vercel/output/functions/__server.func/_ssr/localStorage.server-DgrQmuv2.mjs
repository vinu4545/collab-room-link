import { promises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
//#region node_modules/.nitro/vite/services/ssr/assets/localStorage.server-DgrQmuv2.js
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DB_PATH = path.join(__dirname, "local-db.json");
async function readDB() {
	try {
		const raw = await promises.readFile(DB_PATH, "utf-8");
		return JSON.parse(raw);
	} catch (e) {
		const initial = {
			terminals: [],
			members: [],
			messages: [],
			files: []
		};
		await writeDB(initial);
		return initial;
	}
}
async function writeDB(db) {
	await promises.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
function ciEq(a, b) {
	return a.toLowerCase() === b.toLowerCase();
}
function uuid() {
	try {
		return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	} catch {
		return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	}
}
async function findTerminalByUsername(username) {
	return (await readDB()).terminals.find((t) => ciEq(t.owner_username, username)) ?? null;
}
async function insertTerminal({ name, owner_username, password_hash }) {
	const db = await readDB();
	const terminal = {
		id: uuid(),
		name,
		owner_username,
		password_hash,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	db.terminals.push(terminal);
	await writeDB(db);
	return terminal;
}
async function insertMember({ terminal_id, display_name, is_owner }) {
	const db = await readDB();
	const member = {
		id: uuid(),
		terminal_id,
		display_name,
		is_owner,
		last_seen: (/* @__PURE__ */ new Date()).toISOString(),
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	db.members.push(member);
	await writeDB(db);
	return member;
}
async function insertMessage({ terminal_id, author, body }) {
	const db = await readDB();
	const message = {
		id: uuid(),
		terminal_id,
		author,
		body,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	db.messages.push(message);
	await writeDB(db);
	return message;
}
async function getWorkspaceData(terminalId) {
	const db = await readDB();
	return {
		terminal: db.terminals.find((t) => t.id === terminalId) ?? null,
		members: db.members.filter((m) => m.terminal_id === terminalId),
		messages: db.messages.filter((m) => m.terminal_id === terminalId).slice(-300),
		files: db.files.filter((f) => f.terminal_id === terminalId)
	};
}
async function getMember(terminalId, memberId) {
	return (await readDB()).members.find((m) => m.terminal_id === terminalId && m.id === memberId) ?? null;
}
async function updateMemberLastSeen(memberId) {
	const db = await readDB();
	const member = db.members.find((m) => m.id === memberId);
	if (member) {
		member.last_seen = (/* @__PURE__ */ new Date()).toISOString();
		await writeDB(db);
	}
}
async function addFileRecord({ terminal_id, uploader, file_name, file_size, mime_type, storage_path }) {
	const db = await readDB();
	const rec = {
		id: uuid(),
		terminal_id,
		uploader,
		file_name,
		file_size,
		mime_type,
		storage_path,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	db.files.push(rec);
	await writeDB(db);
	return rec;
}
async function deleteMember(memberId) {
	const db = await readDB();
	const idx = db.members.findIndex((m) => m.id === memberId);
	if (idx !== -1) {
		db.members.splice(idx, 1);
		await writeDB(db);
	}
}
async function saveUploadFile(terminalId, safeName, binary) {
	const uploadsDir = path.join(__dirname, "..", "public", "uploads", terminalId);
	await promises.mkdir(uploadsDir, { recursive: true });
	const filename = `${uuid()}-${safeName}`;
	const filePath = path.join(uploadsDir, filename);
	await promises.writeFile(filePath, Buffer.from(binary));
	return {
		path: filePath,
		publicPath: `/uploads/${terminalId}/${filename}`
	};
}
//#endregion
export { addFileRecord, deleteMember, findTerminalByUsername, getMember, getWorkspaceData, insertMember, insertMessage, insertTerminal, saveUploadFile, updateMemberLastSeen };
