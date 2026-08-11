import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Loader2, Plus, ShieldAlert, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BrandHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/session";
import { createTerminal } from "@/lib/terminal.functions";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create New Terminal — Terminal Workspace" },
      {
        name: "description",
        content: "Create your own private terminal for practical files, chat and collaboration.",
      },
      { property: "og:title", content: "Create New Terminal — Terminal Workspace" },
      {
        property: "og:description",
        content: "Start a new workspace and share the access with your classmates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

function Rule({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs ${met ? "text-success" : "text-muted-foreground"}`}
    >
      {met ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      {label}
    </li>
  );
}

function CreatePage() {
  const navigate = useNavigate();
  const create = useServerFn(createTerminal);
  const [username, setUsername] = useState("");
  const [terminalName, setTerminalName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<null | "checking" | "creating">(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const rules = useMemo(
    () => ({
      length: password.length >= 6,
      upper: /[A-Z]/.test(password),
      numeric: /[0-9]/.test(password),
    }),
    [password],
  );
  const matches = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit =
    username.trim().length >= 3 &&
    terminalName.trim().length >= 2 &&
    rules.length &&
    rules.upper &&
    rules.numeric &&
    matches &&
    status === null;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status !== null) return;
    setUsernameError(null);
    setFormError(null);

    const fail = (message: string) => {
      setFormError(message);
      toast.error(message);
    };

    if (!rules.length) return fail("Password must contain at least 6 characters.");
    if (!rules.upper) return fail("Password must contain at least one uppercase character.");
    if (!rules.numeric) return fail("Password must contain at least one numeric value.");
    if (!matches) return fail("Passwords do not match.");


    setStatus("checking");
    try {
      setTimeout(() => setStatus((s) => (s === "checking" ? "creating" : s)), 400);
      const result = await create({
        data: { username, password, confirmPassword, terminalName },
      });
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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8">
      <BrandHeader subtitle="New Terminal" />

      <div className="flex flex-1 flex-col justify-center py-8">
        <Link
          to="/"
          className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Create New Terminal</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your username and password become the access credentials you share with friends.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(null);
                }}
                placeholder="student01"
                required
              />
              {usernameError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3">
                  <p className="flex items-start gap-2 text-sm font-medium text-destructive">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {usernameError}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setUsername("");
                        setUsernameError(null);
                        document.getElementById("username")?.focus();
                      }}
                    >
                      Choose Another Username
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/join">Join Existing Terminal</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="terminalName">Terminal name</Label>
              <Input
                id="terminalName"
                value={terminalName}
                onChange={(e) => setTerminalName(e.target.value)}
                placeholder="Practical-01"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="rounded-xl border border-border bg-secondary/60 p-3">
                <p className="text-xs font-medium text-foreground">Password requirements</p>
                <ul className="mt-2 space-y-1">
                  <Rule met={rules.length} label="At least 6 characters" />
                  <Rule met={rules.upper} label="One uppercase character" />
                  <Rule met={rules.numeric} label="One numeric value" />
                </ul>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {confirmPassword.length > 0 && !matches && (
                <p className="text-xs font-medium text-destructive">Passwords do not match.</p>
              )}
            </div>

            {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {status !== null && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "checking"
                ? "Checking username..."
                : status === "creating"
                  ? "Creating terminal..."
                  : "Create terminal"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
