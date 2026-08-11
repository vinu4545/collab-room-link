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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("terminals")
      .select("id")
      .ilike("owner_username", data.username)
      .maybeSingle();
    return { available: !row };
  });

export const createTerminal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { hashPassword, validatePassword } = await import("./terminal.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.password !== data.confirmPassword) {
      return { ok: false as const, code: "password" as const, message: "Passwords do not match." };
    }
    const errors = validatePassword(data.password);
    if (errors.length > 0) {
      return { ok: false as const, code: "password" as const, message: errors[0]! };
    }

    const { data: existing } = await supabaseAdmin
      .from("terminals")
      .select("id")
      .ilike("owner_username", data.username)
      .maybeSingle();
    if (existing) {
      return {
        ok: false as const,
        code: "username_taken" as const,
        message:
          "Username already exists. Please choose another username or join your existing terminal.",
      };
    }

    const password_hash = await hashPassword(data.password);
    const { data: terminal, error } = await supabaseAdmin
      .from("terminals")
      .insert({ name: data.terminalName, owner_username: data.username, password_hash })
      .select("id, name, owner_username")
      .single();

    if (error || !terminal) {
      if (error?.code === "23505") {
        return {
          ok: false as const,
          code: "username_taken" as const,
          message:
            "Username already exists. Please choose another username or join your existing terminal.",
        };
      }
      return {
        ok: false as const,
        code: "error" as const,
        message: "Could not create the terminal. Please try again.",
      };
    }

    const displayName = data.displayName?.trim() || data.username;
    const { data: member } = await supabaseAdmin
      .from("terminal_members")
      .insert({ terminal_id: terminal.id, display_name: displayName, is_owner: true })
      .select("id")
      .single();

    await supabaseAdmin.from("terminal_messages").insert({
      terminal_id: terminal.id,
      author: "system",
      body: `${displayName} created the terminal "${terminal.name}".`,
    });

    return {
      ok: true as const,
      session: {
        terminalId: terminal.id,
        memberId: member!.id,
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: terminal } = await supabaseAdmin
      .from("terminals")
      .select("id, name, owner_username, password_hash")
      .ilike("owner_username", data.username)
      .maybeSingle();

    const valid = terminal ? await verifyPassword(data.password, terminal.password_hash) : false;
    if (!terminal || !valid) {
      return { ok: false as const, message: "Terminal not found or credentials are incorrect." };
    }

    const displayName =
      data.displayName?.trim() || `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: member } = await supabaseAdmin
      .from("terminal_members")
      .insert({ terminal_id: terminal.id, display_name: displayName, is_owner: false })
      .select("id")
      .single();

    await supabaseAdmin.from("terminal_messages").insert({
      terminal_id: terminal.id,
      author: "system",
      body: `${displayName} connected to the terminal.`,
    });

    return {
      ok: true as const,
      session: {
        terminalId: terminal.id,
        memberId: member!.id,
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
    const { supabaseAdmin } = await requireMember(data.terminalId, data.memberId);
    await supabaseAdmin
      .from("terminal_members")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", data.memberId);

    const [terminal, members, messages, files] = await Promise.all([
      supabaseAdmin
        .from("terminals")
        .select("id, name, owner_username, created_at")
        .eq("id", data.terminalId)
        .single(),
      supabaseAdmin
        .from("terminal_members")
        .select("id, display_name, is_owner, last_seen")
        .eq("terminal_id", data.terminalId)
        .order("created_at"),
      supabaseAdmin
        .from("terminal_messages")
        .select("id, author, body, created_at")
        .eq("terminal_id", data.terminalId)
        .order("created_at")
        .limit(300),
      supabaseAdmin
        .from("terminal_files")
        .select("id, uploader, file_name, file_size, mime_type, created_at")
        .eq("terminal_id", data.terminalId)
        .order("created_at", { ascending: false }),
    ]);

    const cutoff = Date.now() - 60_000;
    return {
      terminal: terminal.data,
      members: (members.data ?? []).map((m) => ({
        id: m.id,
        display_name: m.display_name,
        is_owner: m.is_owner,
        online: new Date(m.last_seen).getTime() > cutoff,
      })),
      messages: messages.data ?? [],
      files: files.data ?? [],
    };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => messageSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    const { supabaseAdmin, member } = await requireMember(data.terminalId, data.memberId);
    await supabaseAdmin.from("terminal_messages").insert({
      terminal_id: data.terminalId,
      author: member.display_name,
      body: data.body,
    });
    return { ok: true as const };
  });

export const uploadTerminalFile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    const { supabaseAdmin, member } = await requireMember(data.terminalId, data.memberId);

    const binary = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
    if (binary.byteLength > 10 * 1024 * 1024) {
      return { ok: false as const, message: "Files must be 10MB or smaller." };
    }
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${data.terminalId}/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabaseAdmin.storage
      .from("terminal-files")
      .upload(path, binary, { contentType: data.mimeType, upsert: false });
    if (error) return { ok: false as const, message: "Upload failed. Please try again." };

    await supabaseAdmin.from("terminal_files").insert({
      terminal_id: data.terminalId,
      uploader: member.display_name,
      file_name: data.fileName,
      file_size: binary.byteLength,
      mime_type: data.mimeType,
      storage_path: path,
    });
    await supabaseAdmin.from("terminal_messages").insert({
      terminal_id: data.terminalId,
      author: "system",
      body: `${member.display_name} uploaded ${data.fileName}.`,
    });
    return { ok: true as const };
  });

export const getFileLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => fileLinkSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    const { supabaseAdmin } = await requireMember(data.terminalId, data.memberId);
    const { data: file } = await supabaseAdmin
      .from("terminal_files")
      .select("storage_path")
      .eq("id", data.fileId)
      .eq("terminal_id", data.terminalId)
      .maybeSingle();
    if (!file) return { ok: false as const, url: null };
    const { data: signed } = await supabaseAdmin.storage
      .from("terminal-files")
      .createSignedUrl(file.storage_path, 600);
    return { ok: true as const, url: signed?.signedUrl ?? null };
  });

export const leaveTerminal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sessionSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireMember } = await import("./terminal.server");
    const { supabaseAdmin, member } = await requireMember(data.terminalId, data.memberId);
    await supabaseAdmin.from("terminal_messages").insert({
      terminal_id: data.terminalId,
      author: "system",
      body: `${member.display_name} disconnected.`,
    });
    await supabaseAdmin.from("terminal_members").delete().eq("id", data.memberId);
    return { ok: true as const };
  });
