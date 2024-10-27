import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI助農：芒果品質辨識",
  description: "利用影像辨識技術進行芒果品質區分",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
