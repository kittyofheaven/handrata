"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavPill } from "@/components/nav-pill";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  // `/projects/archive` should keep the Projects pill lit, so anything below a
  // section counts as being in that section — but "/" would prefix-match every
  // route, so it has to be exact.
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex justify-center px-6 pt-[47px]">
      <nav
        aria-label="Main"
        className="flex items-center gap-[24px] sm:gap-[61px]"
      >
        {links.map(({ href, label }) => (
          <NavPill key={href} asChild filled={isActive(pathname, href)}>
            <Link
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
            >
              {label}
            </Link>
          </NavPill>
        ))}
      </nav>
    </header>
  );
}
