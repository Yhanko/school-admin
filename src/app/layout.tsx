import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Yhanko Educa • School Admin",
  description: "A melhor gestão para a tua instituição de ensino",
  icons: {
    icon: [
      { url: "/yhankoIMG.svg", type: "image/svg+xml" },
      { url: "/yhankoIMG.png", type: "image/png" },
    ],
    shortcut: "/yhankoIMG.png",
    apple: "/yhankoIMG.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
