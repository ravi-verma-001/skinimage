import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextSkin | Premium Science-Backed Luxury Skincare",
  description: "Formulated for maximum results, minimum irritation. We design luxury skincare backed by clinical science and powered by bio-active botanicals.",
  keywords: ["skincare", "serum", "cleanser", "moisturizer", "luxury skincare", "clean beauty"],
  openGraph: {
    title: "NextSkin | Science-Backed Luxury Skincare",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-stone-800">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
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
