import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FE-SCADA Dashboard",
  description: "Industrial SCADA monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
