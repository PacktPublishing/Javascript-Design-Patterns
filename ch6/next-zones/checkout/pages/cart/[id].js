import { runWithHttpRecording } from '@/../../../utils';
import Head from 'next/head';
import React from 'react';
import '../../../../islands-is-land/reset.css';

function CartContents(props) {
  const { cart, productsById } = props;
  return (
    <ul>
      {cart.products.map((product) => {
        const fullProductInformation = productsById[product.productId];
        return (
          <li key={product.productId} className="cart-item-product">
            <h3 className="cart-item-product-name">
              {fullProductInformation?.title}
            </h3>
            <span className="cart-item-product-quantity">
              {' '}
              x {product.quantity}
            </span>
            <span className="cart-item-product-price">
              Price:
              {(
                product.quantity * fullProductInformation?.price
              ).toLocaleString('en', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </li>
        );
      })}
      <li className="cart-item-product">
        <strong className="cart-item-product-price">
          Total:
          {cart.products
            .reduce((acc, curr) => {
              const fullProductInformation = productsById[curr.productId];
              return acc + curr.quantity * fullProductInformation.price;
            }, 0)
            .toLocaleString('en', {
              style: 'currency',
              currency: 'EUR',
            })}
        </strong>
      </li>
    </ul>
  );
}

export default function GetCartPage({ id, cart, productsById }) {
  return (
    <>
      <Head>
        <title>GetCartPage (Checkout zone)</title>
        <meta name="description" content="GetCartPage (Checkout zone)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>GetCartPage (Checkout zone)</h1>
        <CartContents cart={cart} productsById={productsById} />
        <style jsx global>
          {`
            main {
              max-width: 720px;
              margin: auto;
            }
            .cart-item-product {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .cart-item-product-name {
              flex: 5;
            }

            .cart-item-product-quantity {
              margin-left: 0.5rem;
              flex: 1;
            }

            .cart-item-product-price {
              margin-left: auto;
              display: flex;
            }
          `}
        </style>
      </main>
    </>
  );
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const cartId = params.id;

  return runWithHttpRecording(`ch6-next-zones-${cartId}`, async () => {
    /** @type {import('@/../../../fakestoreapi').Cart | null} */
    const cart = await fetch(`https://fakestoreapi.com/carts/${cartId}`).then(
      (res) => res.json(),
    );
    if (!cart?.products) {
      return {
        props: {
          id: cartId,
        },
      };
    }
    /** @type {Record<number, import('@/../../../fakestoreapi').Product>} */
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
        id: cartId,
        cart,
        productsById,
      },
    };
  });
}
