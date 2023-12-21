import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <div>
        <Link href={'/products'}>Back</Link>
        <h2>{product.title}</h2>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { runWithHttpRecording } = await import('../../../../utils');
  return runWithHttpRecording(`ch5-get-product-${params.id}`, async () => {
    const product = await fetch(
      `https://fakestoreapi.com/products/${params.id}`,
    ).then((res) => res.json());
    return {
      props: {
        product,
      },
    };
  });
}

export async function getStaticPaths() {
  const { runWithHttpRecording } = await import('../../../../utils');
  return runWithHttpRecording(`ch5-get-products`, async () => {
    const products = await fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((json) => json);

    const paths = products.map((product) => ({
      params: { id: String(product.id) },
      // why String(), to avoid
      // `Error: A required parameter (id) was not provided as a string received number in getStaticPaths for /products/[id]`
    }));

    return { paths, fallback: false };
  });
}
