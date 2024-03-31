import type { Metadata } from "next";
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
          src="https://umami-production-9fe7.up.railway.app/script.js"
          data-website-id="3bb05bc8-9b50-4ed9-9a15-313979906ae2"
        ></Script>
      </head>
      <body className={classNames(inter.className, "bg-slate-100")}>
        {children}
      </body>
    </html>
  );
}
