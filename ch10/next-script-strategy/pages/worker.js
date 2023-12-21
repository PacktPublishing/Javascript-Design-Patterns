import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Worker() {
  return (
    <>
      <Head>
        <title>Next.js Script Strategy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          href="data:image/x-icon;,"
          type="image/x-icon"
        />
        <style>{`
          h1 {
            font-size: 24px;
          }
        `}</style>
      </Head>
      <h1>Next.js Script "worker" experimental Strategy</h1>
      <Script src="/analytics.js" strategy="worker" />
      <Script src="/lazyOnload.js" strategy="lazyOnload" />
      <Script src="/afterInteractive.js" strategy="afterInteractive" />
      <Script src="/beforeInteractive.js" strategy="beforeInteractive" />
    </>
  );
}
