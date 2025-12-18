import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yvonne fête ses 60 ans – Marrakech · 15 janvier 2026",
  description: "Invitation privée à célébrer les 60 ans d'Yvonne à Marrakech, du 12 au 18 janvier 2026",
  keywords: ["anniversaire", "60 ans", "Marrakech", "Yvonne", "invitation"],
  openGraph: {
    title: "Yvonne fête ses 60 ans – Marrakech",
    description: "Une semaine magique sous le soleil du Maroc",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
