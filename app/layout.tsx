import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavHeader } from "@/components/ui/nav-header";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from 'sonner';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Val.ai",
  description: "Transform your photos into beautiful AI-generated cartoon art. Create magical animated versions of your special moments.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <NavHeader />
            <main className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col gap-20 max-w-5xl p-3 w-full mx-auto">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
                <p>
                  Powered by{" "}
                  <a
                    href="https://github.com/val-ai"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    val.ai
                  </a>
                </p>
         
              </footer>
            </main>
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
