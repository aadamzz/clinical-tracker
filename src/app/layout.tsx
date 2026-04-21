import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinical Trial Tracker — Explore & Understand Clinical Research",
  description:
    "Search, explore, and understand clinical trials with AI-powered plain-language summaries. Built with data from ClinicalTrials.gov.",
  keywords: [
    "clinical trials",
    "medical research",
    "drug development",
    "ClinicalTrials.gov",
    "healthcare",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-900 dark:text-slate-100 transition-colors" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-6">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-xs text-slate-400">
                  Data sourced from{" "}
                  <a
                    href="https://clinicaltrials.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-500 hover:text-sky-600"
                  >
                    ClinicalTrials.gov
                  </a>
                  {" "}— a U.S. National Library of Medicine resource
                </p>
                <p className="text-xs text-slate-400">
                  AI summaries are for informational purposes only. Always consult your healthcare provider.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
