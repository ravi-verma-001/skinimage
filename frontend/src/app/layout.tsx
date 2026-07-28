import type { Metadata } from "next";
import { Inter, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingAnalyzer } from "@/components/FloatingAnalyzer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skinimage | Premium Science-Backed Luxury Skincare",
  description: "Formulated for maximum results, minimum irritation. We design luxury skincare backed by clinical science and powered by bio-active botanicals.",
  keywords: ["skincare", "serum", "cleanser", "moisturizer", "luxury skincare", "clean beauty"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "Skinimage | Science-Backed Luxury Skincare",
    description: "Experience the ultimate collection of premium, dermatologist-formulated skincare solutions.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-stone-850">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Skinimage",
                "url": "https://skinimage.in",
                "logo": "https://skinimage.in/skinimagelogo.png",
                "sameAs": [
                  "https://www.instagram.com/skinimage",
                  "https://www.facebook.com/skinimage"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Skinimage",
                "url": "https://skinimage.in",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://skinimage.in/shop?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3H7K6B41H1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3H7K6B41H1');
          `}
        </Script>

        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <FloatingAnalyzer />
            <Toaster position="bottom-right" toastOptions={{
              duration: 3500,
              style: {
                background: '#222',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
              }
            }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
