import type { Metadata } from "next";
import { Playfair_Display, Lato, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/context/AuthContext";

// ✅ Headings font — sirf jo weights actually use ho rahe hain unhe rakho
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"], // 4 se 2 kiya — check karo 400/500 kahin use to nahi ho rahe
  style: ["normal"],
});

// ✅ Body font
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"], // 300 hata diya (light weight rarely visible/used)
  style: ["normal"],
});

// ✅ Alt body font (Poppins)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"], // 5 se 2 kiya
  style: ["normal"],
});

// ✅ Menu font
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"], // 3 se 1 kiya
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