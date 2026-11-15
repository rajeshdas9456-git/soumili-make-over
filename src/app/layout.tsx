import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Soumili's Makeover | Beauty • Elegance • Perfection",
  description: "Official website of Soumili's Makeover - Luxury bridal makeup artist offering bespoke wedding makeovers, Temptu Airbrush artistry, HD bridal looks, receptions, and destination weddings.",
  keywords: "Soumili's Makeover, luxury bridal makeup artist, bridal makeup, HD bridal makeover, airbrush bridal makeup, wedding beauty Soumili",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Soumili's Makeover | Beauty • Elegance • Perfection",
    description: "Transforming your special day into an eternal masterpiece with luxury bridal makeup and couture artistry.",
    images: ['/favicon.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white text-brandBlack selection:bg-brandLightPink selection:text-brandPink-700">
        {children}
      </body>
    </html>
  );
}
