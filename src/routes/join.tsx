import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Link2, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BrandHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/session";
import { joinTerminal } from "@/lib/terminal.functions";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Existing Terminal — Terminal Workspace" },
      {
        name: "description",
        content: "Enter the terminal username and password shared by your friend to join their workspace.",
      },
      { property: "og:title", content: "Join Existing Terminal — Terminal Workspace" },
      {
        property: "og:description",
        content: "Connect to a terminal already created by your friend or classmate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const navigate = useNavigate();
  const join = useServerFn(joinTerminal);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const result = await join({ data: { username, password, displayName } });
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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8">
      <BrandHeader subtitle="Terminal Access" />

      <div className="flex flex-1 flex-col justify-center">
        <Link
          to="/"
          className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
            <Link2 className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Join Existing Terminal</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter the credentials of the terminal you were invited to.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Terminal username</Label>
              <Input
                id="username"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="student01"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Terminal password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Your display name (optional)</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Riya"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-4">
                <p className="flex items-start gap-2 text-sm font-medium text-destructive">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="submit" size="sm" variant="secondary" disabled={pending}>
                    Try Again
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/create">Create New Terminal</Link>
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Verifying credentials..." : "Connect to terminal"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
