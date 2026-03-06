"use client";

import Script from "next/script";

export function Analytics() {
  if (typeof window !== "undefined" && !window.location.hostname.endsWith("goleary.com")) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
