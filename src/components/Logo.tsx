import { cn } from "@/lib/utils";

/** Waslni mark: a location pin whose body is a curving road, with motion lines. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="currentColor" />
      <path
        d="M24 10c-6.6 0-12 5.1-12 11.5C12 30 24 39 24 39s12-9 12-17.5C36 15.1 30.6 10 24 10Z"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 29c2-4 6-6 8-10" stroke="var(--primary-foreground)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2.5 3" fill="none" />
      <circle cx="24" cy="21" r="3" fill="var(--primary-foreground)" />
    </svg>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={light ? "text-primary-foreground/15" : "text-primary"} />
      <span className={cn("text-2xl font-extrabold tracking-tight", light ? "text-primary-foreground" : "text-primary")}>
        Waslni
      </span>
    </div>
  );
}
