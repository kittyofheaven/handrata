import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const commitMono = localFont({
  src: [
    {
      path: "./fonts/commit-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/commit-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-commit-mono",
  display: "swap",
});

// Only used for the HH monogram in the footer, which the design sets in
// Major Mono Display at 70px with heavy negative tracking.
const majorMono = localFont({
  src: "./fonts/major-mono-display-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-major-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hazel Handrata — Software Engineer",
  description:
    "I build clean, minimal, and practical websites with a focus on performance, maintainable code, and smooth user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${commitMono.variable} ${majorMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
