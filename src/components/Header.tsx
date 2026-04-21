"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Heart,
  Home,
  BarChart3,
  GitCompareArrows,
  Sun,
  Moon,
} from "lucide-react";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { useThemeStore } from "@/lib/store/useThemeStore";

const NAV_LINKS = [
  { href: "/", label: "Search", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export function Header() {
  const pathname = usePathname();
  const { favorites, compareList } = useTrialStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 shadow-sm transition-transform group-hover:scale-105">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold leading-none text-slate-900 dark:text-white">
              Clinical Trial Tracker
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Explore &amp; understand clinical research
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            const badge =
              href === "/favorites" && favorites.length > 0
                ? favorites.length
                : href === "/compare" && compareList.length > 0
                  ? compareList.length
                  : null;

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                {badge != null && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                      href === "/favorites" ? "bg-rose-500" : "bg-sky-600"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="ml-1 rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* External link */}
          <a
            href="https://clinicaltrials.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hidden rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-700 dark:hover:text-white sm:inline-flex"
          >
            ClinicalTrials.gov ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
