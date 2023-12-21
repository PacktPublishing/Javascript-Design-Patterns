import React from 'react';
import Head from 'next/head';
import '../../../islands-is-land/reset.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Homepage (Root zone)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Root</h1>
      </main>
    </>
  );
}
