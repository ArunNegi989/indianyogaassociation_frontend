import type { Metadata } from "next";
import { Playfair_Display, Lato, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/context/AuthContext";

// ✅ Headings font
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// ✅ Body font
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
});

// ✅ Alt body font (Poppins) — variable name fix kiya
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
});

// ✅ Menu font
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      <head>
       
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>

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