import { Inter } from "next/font/google";
import "./globals.css";
import classNames from "classnames";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E9X1JWQ75Z"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E9X1JWQ75Z');
          `}
        </Script>
        <Script
          async
          src="https://umami-production-9fe7.up.railway.app/script.js"
          data-website-id="3bb05bc8-9b50-4ed9-9a15-313979906ae2"
        />
        <Script
          defer
          data-site-id="goleary.com"
          src="https://assets.onedollarstats.com/tracker.js"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Gabe O&apos;Leary</title>
      </head>
      <body className={classNames(inter.className, "bg-slate-100")}>
        {children}
      </body>
    </html>
  );
}
