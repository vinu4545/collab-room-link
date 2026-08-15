import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  FileText,
  LogOut,
  Paperclip,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { BrandHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSession, readSession } from "@/lib/session";
import type { TerminalSession } from "@/lib/terminal.schemas";
import {
  getFileLink,
  getWorkspace,
  leaveTerminal,
  sendMessage,
  uploadTerminalFile,
} from "@/lib/terminal.functions";

export const Route = createFileRoute("/workspace")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Shared Workspace — Terminal Workspace" },
      {
        name: "description",
        content: "Chat, upload PDFs and share practical files with everyone connected to your terminal.",
      },
      { property: "og:title", content: "Shared Workspace — Terminal Workspace" },
      {
        property: "og:description",
        content: "A lightweight room for college practical work: chat, files and shared data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspacePage,
});

type WsMessage = { id: string; author: string; body: string; created_at: string };
type WsMember = { id: string; display_name: string; is_owner: boolean; online: boolean };
type WsFile = { id: string; uploader: string; file_name: string; file_size: number };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function WorkspacePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<TerminalSession | null>(null);

  useEffect(() => {
    const stored = readSession();
    if (!stored) {
      void navigate({ to: "/" });
      return;
    }
    setSession(stored);
  }, [navigate]);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  return <Workspace session={session} />;
}

function Workspace({ session }: { session: TerminalSession }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchWorkspace = useServerFn(getWorkspace);
  const postMessage = useServerFn(sendMessage);
  const uploadFile = useServerFn(uploadTerminalFile);
  const fileLink = useServerFn(getFileLink);
  const disconnect = useServerFn(leaveTerminal);

  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const ident = { terminalId: session.terminalId, memberId: session.memberId };

  const { data, isError } = useQuery({
    queryKey: ["workspace", session.terminalId, session.memberId],
    queryFn: () => fetchWorkspace({ data: ident }),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (isError) {
      clearSession();
      toast.error("Your terminal session ended.");
      void navigate({ to: "/" });
    }
  }, [isError, navigate]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages.length]);

  const send = useMutation({
    mutationFn: (body: string) => postMessage({ data: { ...ident, body } }),
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
    onError: () => toast.error("Message could not be sent."),
  });

  async function onUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Files must be 10MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (let i = 0; i < buffer.length; i += 8192) {
        binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
      }
      const result = await uploadFile({
        data: {
          ...ident,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          content: btoa(binary),
        },
      });
      if (!result.ok) toast.error(result.message);
      else {
        toast.success(`${file.name} shared with the terminal.`);
        void queryClient.invalidateQueries({ queryKey: ["workspace"] });
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function openFile(fileId: string) {
    const result = await fileLink({ data: { ...ident, fileId } });
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
    else toast.error("File is not available.");
  }

  async function onLeave() {
    try {
      await disconnect({ data: ident });
    } finally {
      clearSession();
      void navigate({ to: "/" });
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6">
      <header className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <BrandHeader subtitle={session.terminalName} />
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success" />
            Connected to {session.terminalName}
          </span>
          <Button variant="outline" size="sm" onClick={onLeave}>
            <LogOut className="h-4 w-4" /> Leave
          </Button>
        </div>
      </header>

      <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_320px]">
        <section className="glass-card flex min-h-[60vh] flex-col p-5">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Shared chat
          </h2>
          <div ref={scroller} className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {((data?.messages ?? []) as WsMessage[]).map((message) =>
              message.author === "system" ? (
                <p key={message.id} className="text-center text-xs text-muted-foreground">
                  {message.body}
                </p>
              ) : (
                <div
                  key={message.id}
                  className={`flex ${message.author === session.displayName ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      message.author === session.displayName
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-[11px] font-semibold opacity-70">{message.author}</p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words">{message.body}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim().length > 0 && !send.isPending) send.mutate(draft.trim());
            }}
          >
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUpload(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
              aria-label="Upload a file"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Share a message, note or practical data..."
            />
            <Button type="submit" size="icon" disabled={send.isPending || draft.trim() === ""}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <aside className="flex flex-col gap-5">
          <div className="glass-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              <Users className="h-4 w-4" /> Connected users
            </h2>
            <ul className="mt-3 space-y-2">
              {((data?.members ?? []) as WsMember[]).map((member) => (
                <li key={member.id} className="flex items-center gap-2 text-sm text-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${member.online ? "bg-success" : "bg-border"}`}
                  />
                  {member.display_name}
                  {member.is_owner && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                      owner
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card flex-1 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              <FileText className="h-4 w-4" /> Shared files
            </h2>
            {(data?.files ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No files yet. Use the clip icon to share PDFs and documents.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {((data?.files ?? []) as WsFile[]).map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card/70 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(file.file_size)} · {file.uploader}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void openFile(file.id)}
                      aria-label={`Open ${file.file_name}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground">
              Share these credentials so friends can join: username{" "}
              <span className="font-semibold text-foreground">{session.ownerUsername}</span> and the
              terminal password.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
