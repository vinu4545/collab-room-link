import { createServerFn } from "@tanstack/react-start";

import {
  createSchema,
  fileLinkSchema,
  joinSchema,
  messageSchema,
  sessionSchema,
  uploadSchema,
  usernameSchema,
  type TerminalSession,
} from "./terminal.schemas";

export const checkUsername = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => usernameSchema.parse(data))
  .handler(async ({ data }) => {
    // Supabase check (commented out for local JSON storage)
    // const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // const { data: row } = await supabaseAdmin
    //   .from("terminals")
    //   .select("id")
    //   .ilike("owner_username", data.username)
    //   .maybeSingle();
    // return { available: !row };

    const { findTerminalByUsername } = await import("./localStorage.server");
    const row = await findTerminalByUsername(data.username);
    return { available: !row };
  });

export const createTerminal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { hashPassword, validatePassword } = await import("./terminal.server");
    // const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.password !== data.confirmPassword) {
      return { ok: false as const, code: "password" as const, message: "Passwords do not match." };
    }
    const errors = validatePassword(data.password);
    if (errors.length > 0) {
      return { ok: false as const, code: "password" as const, message: errors[0]! };
    }

    // Supabase check commented out; use local JSON instead
    const { findTerminalByUsername, insertTerminal, insertMember, insertMessage } = await import(
      "./localStorage.server"
    );
    const existing = await findTerminalByUsername(data.username);
    if (existing) {
      return {
        ok: false as const,
        code: "username_taken" as const,
        message:
          "Username already exists. Please choose another username or join your existing terminal.",
      };
    }

    const password_hash = await hashPassword(data.password);
    const terminal = await insertTerminal({ name: data.terminalName, owner_username: data.username, password_hash });
    if (!terminal) {
      return { ok: false as const, code: "error" as const, message: "Could not create the terminal. Please try again." };
    }
    const displayName = data.displayName?.trim() || data.username;
    const member = await insertMember({ terminal_id: terminal.id, display_name: displayName, is_owner: true });
    await insertMessage({ terminal_id: terminal.id, author: "system", body: `${displayName} created the terminal "${terminal.name}".` });

    return {
      ok: true as const,
      session: {
        terminalId: terminal.id,
        memberId: member.id,
        terminalName: terminal.name,
        displayName,
        ownerUsername: terminal.owner_username,
        isOwner: true,
      } satisfies TerminalSession,
    };
  });

export const joinTerminal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => joinSchema.parse(data))
  .handler(async ({ data }) => {
    const { verifyPassword } = await import("./terminal.server");
    // Use local JSON storage instead of Supabase for now
    const { findTerminalByUsername, insertMember, insertMessage } = await import("./localStorage.server");
    const terminal = await findTerminalByUsername(data.username);
    const valid = terminal ? await verifyPassword(data.password, terminal.password_hash) : false;
    if (!terminal || !valid) {
      return { ok: false as const, message: "Terminal not found or credentials are incorrect." };
    }
    const displayName = data.displayName?.trim() || `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    const member = await insertMember({ terminal_id: terminal.id, display_name: displayName, is_owner: false });
    await insertMessage({ terminal_id: terminal.id, author: "system", body: `${displayName} connected to the terminal.` });
    return {
      ok: true as const,
      session: {
        terminalId: terminal.id,
        memberId: member.id,
        terminalName: terminal.name,
        displayName,
        ownerUsername: terminal.owner_username,
        isOwner: false,
      } satisfies TerminalSession,
    };
  });

export const getWorkspace = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sessionSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    await requireMember(data.terminalId, data.memberId);
    const { getWorkspaceData, updateMemberLastSeen } = await import("./localStorage.server");
    await updateMemberLastSeen(data.memberId);
    const { terminal, members, messages, files } = await getWorkspaceData(data.terminalId);
    const cutoff = Date.now() - 60_000;
    return {
      terminal,
      members: (members ?? []).map((m) => ({
        id: m.id,
        display_name: m.display_name,
        is_owner: m.is_owner,
        online: new Date(m.last_seen).getTime() > cutoff,
      })),
      messages: messages ?? [],
      files: files ?? [],
    };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => messageSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    await requireMember(data.terminalId, data.memberId);
    const { getMember, insertMessage } = await import("./localStorage.server");
    const member = await getMember(data.terminalId, data.memberId);
    if (!member) return { ok: false as const, message: "Member not found" };
    await insertMessage({ terminal_id: data.terminalId, author: member.display_name, body: data.body });
    return { ok: true as const };
  });

export const uploadTerminalFile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    const { supabaseAdmin, member } = await requireMember(data.terminalId, data.memberId).catch(() => ({} as any));
    // Use local storage for files
    const binary = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
    if (binary.byteLength > 10 * 1024 * 1024) {
      return { ok: false as const, message: "Files must be 10MB or smaller." };
    }
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const { saveUploadFile, addFileRecord, getMember, insertMessage } = await import("./localStorage.server");
    const memberRec = await getMember(data.terminalId, data.memberId);
    const { publicPath } = await saveUploadFile(data.terminalId, safeName, binary);
    await addFileRecord({ terminal_id: data.terminalId, uploader: memberRec?.display_name ?? "unknown", file_name: data.fileName, file_size: binary.byteLength, mime_type: data.mimeType, storage_path: publicPath });
    await insertMessage({ terminal_id: data.terminalId, author: "system", body: `${memberRec?.display_name ?? "Someone"} uploaded ${data.fileName}.` });
    return { ok: true as const };
  });

export const getFileLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => fileLinkSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    await requireMember(data.terminalId, data.memberId);
    const { getWorkspaceData } = await import("./localStorage.server");
    const { files } = await getWorkspaceData(data.terminalId);
    const file = (files ?? []).find((f: any) => f.id === data.fileId && f.terminal_id === data.terminalId);
    if (!file) return { ok: false as const, url: null };
    // file.storage_path holds the publicPath
    return { ok: true as const, url: file.storage_path };
  });

export const leaveTerminal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sessionSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    await requireMember(data.terminalId, data.memberId);
    const { getMember, deleteMember, insertMessage } = await import("./localStorage.server");
    const member = await getMember(data.terminalId, data.memberId);
    if (member) {
      await insertMessage({ terminal_id: data.terminalId, author: "system", body: `${member.display_name} disconnected.` });
      await deleteMember(data.memberId);
    }
    return { ok: true as const };
  });
