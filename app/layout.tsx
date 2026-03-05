import { Inter } from "next/font/google";
import "./globals.css";
import classNames from "classnames";
import { Analytics } from "./Analytics";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Analytics />
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
