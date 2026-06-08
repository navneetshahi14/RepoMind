import { type Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RepoMind - AI-Powered Multi-Source RAG Platform",
    template: "%s | RepoMind",
  },
  description:
    "Chat with your PDFs, GitHub repositories, and documents using AI. Built with FastAPI, Qdrant, and Ollama.",
  keywords: [
    "AI",
    "RAG",
    "Chat with PDF",
    "Chat with GitHub",
    "Vector Database",
    "Qdrant",
    "Ollama",
    "FastAPI",
    "Next.js",
  ],
  authors: [{ name: "RepoMind" }],
  creator: "RepoMind",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://repomind.ai",
    title: "RepoMind - AI-Powered Multi-Source RAG Platform",
    description: "Chat with your documents and code repositories using AI.",
    siteName: "RepoMind",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoMind - AI-Powered Multi-Source RAG Platform",
    description: "Chat with your documents and code repositories using AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
