import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientSessionProvider from "@/components/ClientSessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Paregrose",
  description: "Paregrose ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <ClientSessionProvider>
        <Navbar />

        {/* Main content expands */}
        <main className="flex-grow">{children}</main>

        <Footer />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
