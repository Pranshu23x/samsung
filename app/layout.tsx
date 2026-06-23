import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#22C55E",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster theme="light" richColors closeButton />
        <ExitModal />
        <HeartsModal />
        <PracticeModal />
        {children}
        <div className="fixed bottom-2 right-4 text-xs text-muted-foreground/40 select-none pointer-events-none z-50">
          Made By Pranshu
        </div>
      </body>
    </html>
  );
}
