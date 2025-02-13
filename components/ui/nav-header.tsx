"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, Github, X } from "lucide-react";
import { useState } from "react";

export function NavHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">
            val
            <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              .ai
            </span>
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com/yourusername/yourrepo"
            target="_blank"
            rel="noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            <Github size={24} />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Generate
          </Link>
          <Link
            href="/all-avatars"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/all-avatars"
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            All Avatars
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex flex-col text-sm font-medium p-4">
              <Link
                href="/"
                className={cn(
                  "py-2 transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Generate
              </Link>
              <Link
                href="/all-avatars"
                className={cn(
                  "py-2 transition-colors hover:text-foreground/80",
                  pathname === "/all-avatars"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                All Avatars
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
