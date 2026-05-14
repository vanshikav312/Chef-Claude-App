import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Chef Claude — AI Recipe Generator",
  description:
    "Reduce food waste by generating premium AI-powered recipes from ingredients you already have.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fafaf9]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
