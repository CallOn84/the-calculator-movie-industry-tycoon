//src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import GitHubLink from "@/components/GitHubLink";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DonateButton from "@/components/Buttons/DonateButton";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.calcmovietycoon.com/'),
  title: 'The Calculator for Movie Industry Tycoon',
  description: 'Calculate movie affinities for The Executive: Movie Industry Tycoon. Optimize your film production strategy with our advanced calculator.',
  keywords: 'movie industry, tycoon, calculator, film production, affinity, strategy',
  openGraph: {
    siteName: 'Movie Industry Calculator',
    url: 'https://www.calcmovietycoon.com/',
    title: 'The Calculator for Movie Industry Tycoon',
    description: 'Optimize your film production strategy with our advanced calculator for The Executive: Movie Industry Tycoon.',
    images: [
      {
        url: '/og-image.webp',
        width: 650,
        height: 365,
        alt: 'The Calculator for Movie Industry Tycoon'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Calculator for Movie Industry Tycoon',
    description: 'Optimize your film production strategy with our advanced calculator for The Executive: Movie Industry Tycoon.',
    images: ['/og-image.webp'],
    site: '@GoblinzPub'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <GoogleTagManager />
        <MicrosoftClarity />
        <link rel="canonical" href="https://www.calcmovietycoon.com/" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Calculator Tycoon" />
      </head>
      <body className={inter.className}>
        {/* Skip link para navegação por teclado */}
        <a href="#main-content" className="skip-link absolute top-[-40px] left-0 bg-blue-600 text-white p-2 z-50 focus:top-0">
          Skip to main content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <header className="flex justify-end items-center p-4 space-x-4">
              <DonateButton />
              <LanguageSelector />
              <ThemeToggle />
              <GitHubLink />
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
