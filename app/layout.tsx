import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Mona_Sans } from "next/font/google";
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

const keywords = [
  "Segment",
  "IA",
  "Educación Superior",
  "Segment ai",
  "Segment ia",
  "Ingenieria de sistemas",
  "Computación",
  "Matemáticas",
  "Física",
  "Biología",
  "Facyt ai",
  "ia de facyt",
  "Ingenieria",
  "Química",
  "Computer science",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Mathematics",
  "AI",
  "Education",
  "Segment ia facyt",
  "Segment ai facyt",
  "facyt",
  "FACYT",
  "Chat de ia",
  "IA chat",
  "ai assistant",
  "gemini",
  "chat-gpt",
  "Llama",
];
const description =
  "Segment es un asistente de IA especializado en enseñar ciencias de la educación superior tales como computación, matemáticas, física, biología, ingeniería y química";
export const metadata: Metadata = {
  title: "Segment",
  description: description,
  authors: {
    name: "Samuel Nelo",
    url: "https://samuel-nelo-portfolio.vercel.app",
  },
  keywords: keywords,
  openGraph: {
    title: "Segment",
    description: description,

    type: "website",
    locale: "es_VE",
    siteName: "Segment",
    url: "https://segment-ai.vercel.app",
    images: [
      {
        url: "segment-logo+label.jpg",
        width: 1600,
        height: 900,
        alt: "Segment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Segment",
    description: description,
    images: ["segment-logo+label.jpg"],
  },
  category: "IA tool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.className} ${monaSans.className} h-full antialiased dark overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
