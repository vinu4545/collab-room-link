import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "local-db.json");

type DB = {
    terminals: any[];
    members: any[];
    messages: any[];
    files: any[];
};

async function readDB(): Promise<DB> {
    try {
        const raw = await fs.readFile(DB_PATH, "utf-8");
        return JSON.parse(raw) as DB;
    } catch (e) {
        const initial: DB = { terminals: [], members: [], messages: [], files: [] };
        await writeDB(initial);
        return initial;
    }
}

async function writeDB(db: DB) {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function ciEq(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase();
}

function uuid() {
    try {
        // @ts-ignore
        return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    } catch {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
}

export async function findTerminalByUsername(username: string) {
    const db = await readDB();
    return db.terminals.find((t) => ciEq(t.owner_username, username)) ?? null;
}

export async function insertTerminal({ name, owner_username, password_hash }: any) {
    const db = await readDB();
    const id = uuid();
    const terminal = { id, name, owner_username, password_hash, created_at: new Date().toISOString() };
    db.terminals.push(terminal);
    await writeDB(db);
    return terminal;
}

export async function insertMember({ terminal_id, display_name, is_owner }: any) {
    const db = await readDB();
    const id = uuid();
    const member = { id, terminal_id, display_name, is_owner, last_seen: new Date().toISOString(), created_at: new Date().toISOString() };
    db.members.push(member);
    await writeDB(db);
    return member;
}

export async function insertMessage({ terminal_id, author, body }: any) {
    const db = await readDB();
    const id = uuid();
    const message = { id, terminal_id, author, body, created_at: new Date().toISOString() };
    db.messages.push(message);
    await writeDB(db);
    return message;
}

export async function getWorkspaceData(terminalId: string) {
    const db = await readDB();
    const terminal = db.terminals.find((t) => t.id === terminalId) ?? null;
    const members = db.members.filter((m) => m.terminal_id === terminalId);
    const messages = db.messages.filter((m) => m.terminal_id === terminalId).slice(-300);
    const files = db.files.filter((f) => f.terminal_id === terminalId);
    return { terminal, members, messages, files } as const;
}

export async function getMember(terminalId: string, memberId: string) {
    const db = await readDB();
    return db.members.find((m) => m.terminal_id === terminalId && m.id === memberId) ?? null;
}

export async function updateMemberLastSeen(memberId: string) {
    const db = await readDB();
    const member = db.members.find((m) => m.id === memberId);
    if (member) {
        member.last_seen = new Date().toISOString();
        await writeDB(db);
    }
}

export async function addFileRecord({ terminal_id, uploader, file_name, file_size, mime_type, storage_path }: any) {
    const db = await readDB();
    const id = uuid();
    const rec = { id, terminal_id, uploader, file_name, file_size, mime_type, storage_path, created_at: new Date().toISOString() };
    db.files.push(rec);
    await writeDB(db);
    return rec;
}

export async function deleteMember(memberId: string) {
    const db = await readDB();
    const idx = db.members.findIndex((m) => m.id === memberId);
    if (idx !== -1) {
        db.members.splice(idx, 1);
        await writeDB(db);
    }
}

export async function saveUploadFile(terminalId: string, safeName: string, binary: Uint8Array) {
    const uploadsDir = path.join(__dirname, "..", "public", "uploads", terminalId);
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `${uuid()}-${safeName}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, Buffer.from(binary));
    const publicPath = `/uploads/${terminalId}/${filename}`;
    return { path: filePath, publicPath };
}
