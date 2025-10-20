import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Million Good Thoughts",
  description: "Uplifting lines for heavy days.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "A Million Good Thoughts",
    description: "Click for a thought that lifts you up.",
    type: "website",
    url: "https://example.com",
  },
  twitter: {
    card: "summary",
    title: "A Million Good Thoughts",
    description: "Click for a thought that lifts you up."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
