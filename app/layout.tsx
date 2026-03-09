import '../styles/globals.css';
import type { Metadata } from "next";
import Script from "next/script";
import { Libre_Franklin } from "next/font/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://triviamoji.com";
const siteName = "Triviamoji";
const description =
  "Triviamoji is an emoji trivia game with thousands of puzzles across movies, TV, books, songs, landmarks, and more.";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-main",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "Triviamoji",
    "emoji trivia",
    "emoji quiz",
    "emoji guessing game",
    "emoji puzzle game",
    "online trivia game",
  ],
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/images/triviamoji_og.jpg",
        width: 1200,
        height: 630,
        alt: "Triviamoji preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/images/triviamoji_og.jpg"],
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <meta name="theme-color" content="#fff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              description,
            }),
          }}
        />
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8259590562391591"
          crossOrigin="anonymous"
        />
        <Script id="tagManager" async src="https://www.googletagmanager.com/gtag/js?id=G-0ELFHP6WM4" />
        <Script
          id="settingGoogleSettings"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
      
                gtag('config', 'G-0ELFHP6WM4');
            `,
          }}
        />
      </head>
      <body className={`${libreFranklin.variable} w-full`}>{children}</body>
    </html>
  );
}
