import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from 'react';
// import {StrictMode} from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Old School Game",
  description: "Step back in time with Old School Game, where classic games meet modern-day brain training! Sharpen your mind and have fun with nostalgic games, all designed to boost your cognitive power and keep your brain in top shape.l",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Old School Game",
  },
  openGraph:{
    type: "website",
    url: "https://oldschoolgame.vercel.app/",
    title: "Old School Game",
    description: "Step back in time with Old School Game, where classic games meet modern-day brain training! Sharpen your mind and have fun with nostalgic games, all designed to boost your cognitive power and keep your brain in top shape.",
    siteName: "Old School Game",
    images: [{   url: "/oldschoolgame.webp",   }],
  },
  twitter:{
    card: "summary_large_image",
    site: "https://oldschoolgame.vercel.app/",
    creator: "Old School Game",
    description:"Step back in time with Old School Game, where classic games meet modern-day brain training! Sharpen your mind and have fun with nostalgic games, all designed to boost your cognitive power and keep your brain in top shape.",
    images: "/oldschoolgame.webp"
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' }
    ]
  }
};

export function generateViewport() {
  return {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
  }
}

export default function RootLayout( {
  children,
}: Readonly <{
  children: React.ReactNode;
}> ) {

  console.log("Reloaded Layout Page...")

    return (
    <html lang="en">
    <head>
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
      <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Old School Game" />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>

    {/*<StrictMode>*/}
    <main>

      <Navbar/>

      {children}
      <div className="paperOverlay"></div>

      <Footer/>
    </main>
    {/*</StrictMode>*/}

    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                  console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
            });
          }
        `,
      }}
    />

    </body>
    </html>
    );
}

