import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Juvo Template",
  description: "Juvo MVP Template",
  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body>
        <div className="flex flex-col min-h-screen px-8 sm:px-12 lg:px-20 xl:px-32 2xl:px-48">
          <Header />
          <main className="flex-grow relative isolate">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
