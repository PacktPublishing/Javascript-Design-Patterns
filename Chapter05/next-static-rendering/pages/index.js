import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Index() {
  return (
    <>
      <Head>
        <title>Next Static Rendering - Automatic Static Generation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ul>
          <li>
            <Link href="/products">Products Page (SSG)</Link>
          </li>
          <li>
            <Link href="/cart">Cart Page (SSR)</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
