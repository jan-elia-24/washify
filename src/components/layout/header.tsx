"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Hem" },
  { href: "/book", label: "Boka" },
  { href: "/booking", label: "Mina Bokningar" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all group-hover:from-primary/80 group-hover:to-primary/40">
              Washify
            </span>
          </Link>
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative py-2",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}