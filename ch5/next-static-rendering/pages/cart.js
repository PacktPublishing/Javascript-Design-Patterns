import { runWithHttpRecording } from '@/../../utils';
import Head from 'next/head';
import React from 'react';

export default function CartPage({ cart, productsById }) {
  return (
    <>
      <Head>
        <title>Cart Page</title>
      </Head>
      <div>
        <ul>
          {cart.products.map((product) => {
            return (
              <li key={product.productId}>
                {product.quantity} x {productsById[product.productId]?.title}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
export async function getServerSideProps({ query }) {
  const { cartId = 1 } = query;
  return runWithHttpRecording(`ch5-cart-page-${cartId}`, async () => {
    /** @type {import('@/../../fakestoreapi').Cart} */
    const cart = await fetch(`https://fakestoreapi.com/carts/${cartId}`).then(
      (res) => res.json(),
    );
    /** @type {Record<number, import('@/../../fakestoreapi').Product>} */
    const productsById = (
      await Promise.all(
        cart.products.map(async (product) => {
          return await fetch(
            `https://fakestoreapi.com/products/${product.productId}`,
          ).then((res) => res.json());
        }),
      )
    ).reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
    return {
      props: {
        cart,
        productsById,
      },
    };
  });
}
