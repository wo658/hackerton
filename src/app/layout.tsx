import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ambition",
  description: "A new idea starts here.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
