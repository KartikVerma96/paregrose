import { Inter } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import ReduxProvider from "@/components/ReduxProvider";
import SessionInitializer from "@/components/SessionInitializer";
import { AlertProvider } from "@/contexts/AlertContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import DynamicTitle from "@/components/DynamicTitle";
import { generateMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = generateMetadata;

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
              <DynamicTitle />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </ClientSessionProvider>
          </AlertProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
