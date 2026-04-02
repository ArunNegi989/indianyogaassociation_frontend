"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/auth");

  const hideLayout = isAdmin || isAuth;

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <WhatsappButton />}
      {!hideLayout && <Footer />}
    </>
  );
}
