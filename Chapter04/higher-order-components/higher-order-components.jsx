// @ts-check
import React from 'react';

const location = {
  href: window.location.href,
  origin: window.location.origin,
};

export function withLocation(Component) {
  return (props) => {
    return <Component location={location} {...props} />;
  };
}

import { HttpClientConsumer } from '../context';
import { BasketItemsClassical } from '../coupled';

export function withHttpClient(Component) {
  return (props) => (
    <HttpClientConsumer>
      {(httpClient) => <Component {...props} httpClient={httpClient} />}
    </HttpClientConsumer>
  );
}

export const ConnectedBasketItemsClassical =
  withHttpClient(BasketItemsClassical);
