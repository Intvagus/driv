import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

const links = [
  { href: "/fleet", label: "Fleet" },
  { href: "/locations", label: "Locations" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/support", label: "Support" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="focus-ring font-display text-xl font-extrabold tracking-tight">
          DRIV
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring text-sm text-muted transition-colors duration-150 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="focus-ring hidden text-sm text-muted transition-colors duration-150 hover:text-text sm:block"
          >
            Sign in
          </Link>
          <LinkButton href="/fleet" className="px-4 py-2.5 text-sm">
            Reserve a car
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
