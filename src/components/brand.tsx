import logo from "@/assets/logo.png.asset.json";

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-2xl bg-foreground p-2"
      style={{ width: size, height: size }}
    >
      <img src={logo.url} alt="Terminal workspace logo" className="h-full w-full object-contain" />
    </span>
  );
}

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Logo />
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-[0.28em] text-foreground uppercase">
          Prosperity
        </p>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {subtitle ?? "Terminal Workspace"}
        </p>
      </div>
    </div>
  );
}
