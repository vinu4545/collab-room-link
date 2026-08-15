import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Link2, Plus, Sparkles } from "lucide-react";

import { BrandHeader } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terminal Workspace — Create or Join a Study Terminal" },
      {
        name: "description",
        content:
          "Create a private terminal or join a friend's terminal to chat, share PDFs and practical files instantly.",
      },
      { property: "og:title", content: "Terminal Workspace — Create or Join a Study Terminal" },
      {
        property: "og:description",
        content: "Work together without repeatedly logging into separate platforms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8">
      <BrandHeader action={<ThemeToggle />} />

      <section className="flex flex-1 flex-col justify-center py-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Work together without repeatedly logging into separate platforms
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Welcome to the <span className="gradient-text">Workspace</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Choose how you want to continue.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Link
            to="/join"
            className="choice-card choice-card-hover group flex flex-col gap-4 p-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110">
              <Link2 className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Join Existing Terminal</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Connect with your friend and continue working together in the terminal they already
                created.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Enter credentials
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/create"
            className="choice-card choice-card-hover group flex flex-col gap-4 p-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
              <Plus className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create New Terminal</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new workspace for your practical, files and collaboration — then share the
                access with friends.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Set it up
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      <footer className="pb-4 text-xs text-muted-foreground">
        Create a room → Share access → Collaborate → Upload → Chat → Finish
      </footer>
    </main>
  );
}
