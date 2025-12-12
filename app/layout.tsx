import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import UserInfo from "@/components/UserInfo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sayso",
  description:
    "Sayso es un CMS educativo diseñado para que instituciones capturen, organicen y destaquen testimonios reales de estudiantes, padres y docentes. Con herramientas intuitivas para recolectar testimonios en texto, imagen o video, gestión colaborativa, métricas de impacto y videos de éxito, Sayso ayuda a fortalecer la confianza institucional, mejorar la matrícula y mostrar el verdadero valor de tu propuesta educativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
