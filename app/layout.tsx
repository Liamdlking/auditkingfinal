import "@/styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Audit King",
  description: "Audit and Inspection platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
