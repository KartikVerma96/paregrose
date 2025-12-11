import { Inter } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import ReduxProvider from "@/components/ReduxProvider";
import SessionInitializer from "@/components/SessionInitializer";
import { AlertProvider } from "@/contexts/AlertContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import DynamicTitle from "@/components/DynamicTitle";
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = generateMetadata;

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
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
