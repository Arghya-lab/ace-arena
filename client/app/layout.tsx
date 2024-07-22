import { AudioProvider } from "@/components/providers/AudioProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import TopNavbar from "@/components/TopNavbar";
import { Toaster } from "@/components/ui/toaster";
import { mavinPro, patuaOne, raleway } from "@/font";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import Head from "next/head";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ace Arena",
  description: "A card playing game.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/apple-touch-icon.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          ></link>
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg"
            color="#5bbad5"
          ></link>
          <meta name="msapplication-TileColor" content="#2b5797"></meta>
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <body
          className={`${mavinPro.variable} ${patuaOne.variable} ${raleway.variable} font-sans`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AudioProvider>
              <SocketProvider>
                <TopNavbar />
                <main className="relative h-[calc(100dvh-56px)] min-h-[560px] overflow-hidden">
                  {children}
                </main>
                <Toaster />
              </SocketProvider>
            </AudioProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
