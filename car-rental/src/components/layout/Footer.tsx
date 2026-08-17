import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/fleet", label: "Browse fleet" },
      { href: "/locations", label: "Locations" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/support", label: "Contact support" },
      { href: "/account", label: "Manage a booking" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-display text-xl font-extrabold tracking-tight">DRIV</span>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Same-day car rental for the city. Reserve in a minute, pick up in ten.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-muted transition-colors duration-150 hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} DRIV. All rights reserved.</span>
          <span>Downtown &middot; Midtown &middot; Airport</span>
        </div>
      </div>
    </footer>
  );
}
