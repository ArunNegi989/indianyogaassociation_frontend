import type { Metadata } from "next";
import {
  Playfair_Display,
  Lato,
  Poppins,
  Montserrat,
} from "next/font/google";

import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/context/AuthContext";

// Headings font
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal"],
  display: "swap",
});

// Body font
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

// Alt body font (below-fold use ke liye — preload false theek hai)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal"],
  display: "swap",
  preload: false,
});

// Menu font — FIXED: preload true, kyunki h1-h6 isi se render hote hain (above-fold)
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Rishikesh - Best Yoga School in Rishikesh",
  description:
    "Top Yoga Teacher Training in Rishikesh for USA & Europe students. 200-Hour YTT with Ayurveda, meditation & spiritual immersion in the birthplace of yoga.",
  alternates: {
    canonical: "https://www.indianyogaassociation.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${lato.variable} ${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}