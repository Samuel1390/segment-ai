import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Mona_Sans } from "next/font/google";
import Header from "./components/Header";
import ThemeProvider from "./components/context/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${monaSans.className} h-full antialiased dark overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
