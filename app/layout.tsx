import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { AlertProvider } from "@/components/providers/AlertProvider";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Mafi Restaurant & Meeting Hall | Luxury Dining in Adama, Ethiopia",
  description: "Experience Adama's premier luxury dining and professional event venue. We offer 5 premium meeting halls for corporate events, workshops, and celebrations.",
  keywords: ["Mafi Restaurant", "Meeting Hall Adama", "Luxury Dining Ethiopia", "Event Venue Adama", "Corporate Meetings"],
  authors: [{ name: "Mafi Restaurant" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    title: "Mafi Restaurant & Meeting Hall - Adama",
    description: "Exquisite cuisine and elegant meeting spaces in the heart of Adama.",
    siteName: "Mafi Restaurant",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Mafi Restaurant & Luxury Meeting Hall in Adama",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schema Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "EventVenue"],
    "name": "Mafi Restaurant & Meeting Hall",
    "image": `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.webp`,
    "@id": process.env.NEXT_PUBLIC_SITE_URL,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "telephone": "+251 945 184 545",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "H & H Building, 2nd Floor, Nazreth, G7VC+V47, ኣዳማ (Adama), Ethiopia",
      "addressLocality": "Adama",
      "addressCountry": "ET"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 8.5466,
      "longitude": 39.2652
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "22:00"
    },
    "menu": `${process.env.NEXT_PUBLIC_SITE_URL}/#menu`,
    "servesCuisine": "International, Ethiopian",
  };

  return (
    <html lang="en">
      <body className={montserrat.className}>
        {/* Injecting the JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
