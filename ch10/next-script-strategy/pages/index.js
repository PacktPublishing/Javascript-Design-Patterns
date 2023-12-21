import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Index() {
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
      <h1>Next.js Script Strategy</h1>
      <Script>{`console.log('inline script 1');`}</Script>
      <Script src="/lazyOnload.js" strategy="lazyOnload" />
      <Script src="/afterInteractive.js" strategy="afterInteractive" />
      <Script src="/beforeInteractive.js" strategy="beforeInteractive" />
      <Script
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `console.log('inline script 2');`,
        }}
      ></Script>
    </>
  );
}
