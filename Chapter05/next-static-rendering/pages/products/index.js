import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function ProductIndexPage({ products }) {
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => {
            // @todo turn this into a card component using
            // product.image as well
            return (
              <li key={product.id}>
                <Link
                  href={{
                    pathname: '/products/[id]',
                    query: { id: product.id },
                  }}
                >
                  {product.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { runWithHttpRecording } = await import('../../../../utils');
  return runWithHttpRecording(`ch5-get-products`, async () => {
    /**
     * @type {Array<import('@/../../fakestoreapi').Product>}
     */
    const products = await fetch('https://fakestoreapi.com/products').then(
      (res) => res.json(),
    );
    return {
      props: {
        products,
      },
    };
  });
}
