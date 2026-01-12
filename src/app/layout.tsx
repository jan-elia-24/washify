import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Washify - Mobile Car Wash Booking",
  description: "Book professional mobile car wash services at your location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}