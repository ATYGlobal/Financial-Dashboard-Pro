import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: { default: "Financial Dashboard Pro", template: "%s | FinPRO" },
  description: "Control financiero personal basado en escenarios",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "FinPRO" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-dvh bg-[#f6f7f9]">
          <Sidebar />
          <main className="flex-1 min-w-0 pb-24 md:pb-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}