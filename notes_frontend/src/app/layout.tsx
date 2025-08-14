import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes",
  description: "A minimal and modern personal notes application.",
  applicationName: "Notes",
  keywords: ["notes", "personal", "editor", "nextjs", "local"],
  authors: [{ name: "Notes App" }],
  icons: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
