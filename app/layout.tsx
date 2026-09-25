import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://0xRaiven.github.io"),
  title: {
    default: "r41n // Portfolio & Knowledge Base",
    template: "%s // r41n",
  },
  description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  keywords: [
    "Cybersecurity",
    "Offensive Security",
    "Red Team",
    "Cloud Security",
    "Vulnerability Research",
    "r41n",
    "0xraiven",
  ],
  authors: [{ name: "r41n", url: "https://0xRaiven.github.io" }],
  creator: "r41n",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://0xRaiven.github.io",
    siteName: "r41n Knowledge Base",
    title: "r41n // Portfolio & Knowledge Base",
    description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  },
  twitter: {
    card: "summary_large_image",
    title: "r41n // Portfolio & Knowledge Base",
    description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

import Script from "next/script";
import { Providers } from "@/providers";
import { AsciiBootLoader } from "@/components/animation/AsciiBootLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Pixel&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full overflow-hidden bg-bg text-text-primary antialiased font-sans">
        <Script
          id="theme-boot-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme') || 'dark';
                  var resolved = stored;
                  if (stored === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  var doc = document.documentElement;
                  doc.classList.remove('dark', 'light');
                  doc.classList.add(resolved);
                  doc.setAttribute('data-theme', resolved);
                  doc.setAttribute('data-mode', stored);

                  // Synchronous bootloader gating to eliminate Flash of Unbooted Content (FOUC)
                  var pathname = window.location.pathname;
                  var isKeystatic = pathname.startsWith('/keystat');
                  var urlParams = new URLSearchParams(window.location.search);
                  var forceBoot = urlParams.get('boot') === 'true' || urlParams.get('reboot') === 'true';
                  var alreadyBooted = sessionStorage.getItem('r41n_booted');
                  if ((forceBoot || !alreadyBooted) && !isKeystatic) {
                    doc.classList.add('booting-active');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>
          <AsciiBootLoader />
          <div id="page-content-wrapper" className="h-full w-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

