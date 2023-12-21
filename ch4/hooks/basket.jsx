// @ts-check
import React, { useState, useEffect } from 'react';
import { useHttpClient } from '../context';

export function BasketItemsHooks({ basketId, httpClient }) {
  const [basketSession, setBasketSession] = useState({});
  useEffect(() => {
    httpClient
      .get(`https://fakestoreapi.com/carts/${basketId}`)
      .then((session) => setBasketSession(session));
  }, []);
  return <pre>{JSON.stringify(basketSession, null, 2)}</pre>;
}

export function BasketItemsHooksUseContext({ basketId }) {
  const httpClient = useHttpClient();
  const [basketSession, setBasketSession] = useState({});
  const [basketState, setBasketState] = useState('INITIAL');
  useEffect(() => {
    setBasketState('LOADING');
    // @ts-expect-error
    httpClient
      .get(`https://fakestoreapi.com/carts/${basketId}`)
      .then((session) => {
        return Promise.all([
          session,
          Promise.all(
            session.products.map((product) =>
              // @ts-expect-error
              httpClient.get(
                `https://fakestoreapi.com/products/${product.productId}`,
              ),
            ),
          ),
        ]);
      })
      .then(([session, products]) => {
        setBasketState('LOADED');
        setBasketSession({
          ...session,
          products: session.products.map((product) => ({
            ...product,
            productDetails: products.find((p) => p.id === product.productId),
          })),
        });
      });
  }, []);
  return (
    <div>
      <h2>Basket</h2>
      {basketState === 'INITIAL' || basketState === 'LOADING'
        ? 'Loading...'
        : null}
      {basketState === 'LOADED' ? (
        <>
          <ul>
            {basketSession?.products?.map((product) => {
              return (
                <li>
                  <img
                    src={product.productDetails.image}
                    width="50"
                    height="50"
                    style={{ objectFit: 'contain' }}
                  />
                  Name: {product.productDetails.title}
                  <br />
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(product.productDetails.price)}
                  <br />x{product.quantity}
                </li>
              );
            })}
          </ul>
          Total:{' '}
          {basketSession?.products?.reduce(
            (acc, curr) =>
              acc + curr.quantity * curr.productDetails.price * 100,
            0,
          )}
        </>
      ) : null}
    </div>
  );
}

/**
 * @param {import("../coupled").BasketProps} props
 */
export function BasketHooks({ basketId, httpClient }) {
  return (
    <form>
      <fieldset>
        <label>Hooks</label>
        <BasketItemsHooks basketId={basketId} httpClient={httpClient} />
      </fieldset>
    </form>
  );
}
