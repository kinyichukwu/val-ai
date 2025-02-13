import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Github } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Val.ai",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground bg-gradient-to-b from-background to-primary/5">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <header className="w-full flex items-center justify-between border-b px-4 max-w-5xl mx-auto text-center text-xs gap-4 py-2">
              <h1 className="text-2xl font-bold">
                val
                <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                  .ai
                </span>
              </h1>
              <a
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500 transition-colors"
              >
                <Github size={24} />
              </a>
            </header>

            <div className="flex-1 flex flex-col gap-20 max-w-5xl p-3 w-full mx-auto">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
              <p>
                Powered by{" "}
                <a
                  href=""
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  love
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
