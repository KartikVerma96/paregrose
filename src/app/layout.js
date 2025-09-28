import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import ReduxProvider from "@/components/ReduxProvider";
import SessionInitializer from "@/components/SessionInitializer";
import { AlertProvider } from "@/contexts/AlertContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Paregrose - Premium Ethnic Wear & Fashion",
    template: "%s | Paregrose"
  },
  description: "Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women. Shop the latest collection of designer ethnic wear with free shipping and easy returns.",
  keywords: [
    "ethnic wear",
    "sarees",
    "lehengas", 
    "gowns",
    "traditional wear",
    "women fashion",
    "indian wear",
    "party wear",
    "festive wear",
    "designer clothes"
  ],
  authors: [{ name: "Paregrose" }],
  creator: "Paregrose",
  publisher: "Paregrose",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paregrose.com',
    title: 'Paregrose - Premium Ethnic Wear & Fashion',
    description: 'Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women.',
    siteName: 'Paregrose',
    images: [
      {
        url: '/images/paregrose_logo.png',
        width: 1200,
        height: 630,
        alt: 'Paregrose - Premium Ethnic Wear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paregrose - Premium Ethnic Wear & Fashion',
    description: 'Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women.',
    images: ['/images/paregrose_logo.png'],
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
  alternates: {
    canonical: 'https://paregrose.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <ReduxProvider>
          <AlertProvider>
            <ClientSessionProvider>
              <SessionInitializer />
              <Navbar />

              {/* Main content expands */}
              <main className="flex-grow">{children}</main>

              <Footer />
            </ClientSessionProvider>
          </AlertProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
