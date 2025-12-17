import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Products Showcase",
  description: "Showcase of various products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
