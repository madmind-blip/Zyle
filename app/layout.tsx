import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'ZYLE — Curated Modern Artifacts',
  description: 'Engineered Living. Elevated Essentials. Direct atelier fulfillment for luxury watches, smart audio, apparel combos, and wardrobe essentials.',
  openGraph: {
    title: 'ZYLE — Curated Modern Artifacts',
    description: 'Engineered Living. Elevated Essentials. Direct atelier fulfillment for luxury watches, smart audio, apparel combos, and wardrobe essentials.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZYLE — Curated Modern Artifacts',
    description: 'Engineered Living. Elevated Essentials. Direct atelier fulfillment for luxury watches, smart audio, apparel combos, and wardrobe essentials.',
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
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/hoz7yea.css?v=5" />
      </head>
      <body className="bg-[#FAF9F5] text-stone-900 antialiased overflow-x-hidden">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
