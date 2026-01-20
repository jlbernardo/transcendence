import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import AuthGate from "./auth-gate";

const pixel = localFont({
  src: "../public/PixelFont.ttf",
})

export const metadata: Metadata = {
  title: "Girl Pong",
  description: "ft_transcendence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixel.className} antialiased text-lg`}
      >
        {/* <AuthGate> */}
          {children}
        {/* </AuthGate> */}
        <Footer />
      </body>
    </html>
  );
}
