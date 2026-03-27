import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomocna Polska",
  description: "Łączymy sąsiadów, którzy potrzebują pomocy, z tymi, którzy chcą pomagać.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
