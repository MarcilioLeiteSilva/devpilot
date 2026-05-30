import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevPilot AI - Agent Orchestration Platform",
  description: "SaaS platform for coordinating software engineering AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
