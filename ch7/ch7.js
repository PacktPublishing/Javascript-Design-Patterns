'use strict';

import { runWithHttpRecording } from '../utils.js';
import assert from 'node:assert/strict';
import { Timing } from '@pollyjs/core';
import jwt_decode from 'jwt-decode';
// Makes this browser-compatible, but needs --experimental-network-imports
// import jwt_decode from 'https://esm.sh/jwt-decode@3.1.2';

/**
 * Internal util, not an example, used to ensure fakestoreapi responses
 * work the way they're supposed to with regards to JWTs etc.
 */
async function _checkJwtSubsMatchesUserId() {
  const users = await fetch('https://fakestoreapi.com/users').then((res) =>
    res.json(),
  );

  const usersToCheck = users.slice(0, 4);

  const authFetchData = await Promise.all(
    usersToCheck.map((user) => {
      const { username, password } = user;
      return fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((authData) => ({ token: authData.token, user }));
    }),
  );

  authFetchData.forEach(({ token, user }) => {
    const { sub } = jwt_decode(token);
    console.assert(
      sub === user.id,
      `Sub=${sub} did not match user.id=${user.id}`,
    );
  });
}

await _checkJwtSubsMatchesUserId();

async function sequentialOperations() {
  function fetchAuthUserThenCartsPromiseThen(username, password) {
    return fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        const parsedValues = jwt_decode(responseData.token);
        const userId = parsedValues.sub;
        return userId;
      })
      .then((userId) =>
        fetch(`https://fakestoreapi.com/carts/user/${userId}?sort=desc`),
      )
      .then((res) => res.json());
  }

  const username = 'kevinryan';
  // we should never hardcode values like this.
  // @todo, switch this to a UI-based example?
  const password = 'kev02937@';

  const userCartsDataPromiseThen = await fetchAuthUserThenCartsPromiseThen(
    username,
    password,
  );
  assert.deepEqual(userCartsDataPromiseThen, [
    {
      __v: 0,
      date: '2020-01-01T00:00:00.000Z',
      id: 4,
      products: [
        {
          productId: 1,
          quantity: 4,
        },
      ],
      userId: 3,
    },
    {
      __v: 0,
      date: '2020-03-01T00:00:00.000Z',
      id: 5,
      products: [
        {
          productId: 7,
          quantity: 1,
        },
        {
          productId: 8,
          quantity: 1,
        },
      ],
      userId: 3,
    },
  ]);

  async function fetchAuthUserThenCartsAsyncAwait(username, password) {
    const authResponse = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const authData = await authResponse.json();
    const parsedValues = jwt_decode(authData.token);
    const userId = parsedValues.sub;
    const userCartsResponse = await fetch(
      `https://fakestoreapi.com/carts/user/${userId}?sort=desc`,
    );
    const userCartsResponseData = await userCartsResponse.json();
    return userCartsResponseData;
  }

  const userCartsDataAsyncAwait = await fetchAuthUserThenCartsAsyncAwait(
    username,
    password,
  );
  assert.deepEqual(userCartsDataAsyncAwait, userCartsDataPromiseThen);
}

await runWithHttpRecording(
  'chapter-7-fakestoreapi-sequential',
  sequentialOperations,
);

async function parallelOperations() {
  function fetchCartPromiseThen(cartId = '1') {
    return fetch(`https://fakestoreapi.com/carts/${cartId}`)
      .then((res) => res.json())
      .then((cart) => {
        const productUrls = cart.products.map(
          (p) => `https://fakestoreapi.com/products/${p.productId}`,
        );
        return Promise.all([
          { cart },
          ...productUrls.map((url) => fetch(url).then((res) => res.json())),
        ]);
      })
      .then(([prev, ...products]) => {
        return {
          ...prev,
          products,
        };
      });
  }

  const cartDataFromPromiseThen = await fetchCartPromiseThen('1');

  assert.deepEqual(cartDataFromPromiseThen.cart, {
    __v: 0,
    date: '2020-03-02T00:00:00.000Z',
    id: 1,
    products: [
      {
        productId: 1,
        quantity: 4,
      },
      {
        productId: 2,
        quantity: 1,
      },
      {
        productId: 3,
        quantity: 6,
      },
    ],
    userId: 1,
  });
  assert.deepEqual(cartDataFromPromiseThen.products[0], {
    category: "men's clothing",
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    id: 1,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    price: 109.95,
    rating: {
      count: 120,
      rate: 3.9,
    },
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  });
  assert.deepEqual(cartDataFromPromiseThen.products[1], {
    category: "men's clothing",
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
    id: 2,
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    price: 22.3,
    rating: {
      count: 259,
      rate: 4.1,
    },
    title: 'Mens Casual Premium Slim Fit T-Shirts ',
  });
  assert.deepEqual(cartDataFromPromiseThen.products[2], {
    category: "men's clothing",
    description:
      'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
    id: 3,
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    price: 55.99,
    rating: {
      count: 500,
      rate: 4.7,
    },
    title: 'Mens Cotton Jacket',
  });

  function fetchCartFunctionVariable() {
    let loadedCart = null;
    return Promise.resolve({ id: 1 })
      .then((cart) => {
        loadedCart = cart;
        const productUrls = [];
        return Promise.all(productUrls.map(() => {}));
      })
      .then((products) => ({
        cart: loadedCart,
        products,
      }));
  }

  assert.deepEqual(await fetchCartFunctionVariable(), {
    cart: { id: 1 },
    products: [],
  });

  async function fetchCartAsyncAwait(cartId = '1') {
    const cart = await fetch(`https://fakestoreapi.com/carts/${cartId}`).then(
      (res) => res.json(),
    );
    const productUrls = cart.products.map(
      (p) => `https://fakestoreapi.com/products/${p.productId}`,
    );
    const products = await Promise.all(
      productUrls.map((url) => fetch(url).then((res) => res.json())),
    );

    return {
      cart,
      products,
    };
  }

  const cartDataFromAsyncAwait = await fetchCartAsyncAwait('1');

  assert.deepEqual(cartDataFromPromiseThen.cart, cartDataFromAsyncAwait.cart);
  assert.deepEqual(
    cartDataFromPromiseThen.products,
    cartDataFromAsyncAwait.products,
  );
}
await runWithHttpRecording('chapter-7-fakestoreapi', parallelOperations);

async function cancellationAndTimeouts() {
  function fetchWithCancel(url) {
    const abortController = new AbortController();

    const response = fetch(url, { signal: abortController.signal })
      .then((res) => res.json())
      .catch((err) => {
        if (err.name === 'AbortError') return 'Aborted';
        throw err;
      });
    return {
      response,
      cancel: () => abortController.abort(),
    };
  }

  const fetchProduct1 = fetchWithCancel('https://fakestoreapi.com/products/1');
  const fetchProduct2 = fetchWithCancel('https://fakestoreapi.com/products/2');

  fetchProduct1.cancel();
  assert.deepEqual(await fetchProduct1.response, 'Aborted');
  assert.deepEqual(await fetchProduct2.response, {
    category: "men's clothing",
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
    id: 2,
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    price: 22.3,
    rating: {
      count: 259,
      rate: 4.1,
    },
    title: 'Mens Casual Premium Slim Fit T-Shirts ',
  });

  async function fetchWithTimeout(url, timeout = 500) {
    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, timeout);
    return fetch(url, { signal: abortController.signal });
  }

  const timedoutFetchShouldSucceedData = await fetchWithTimeout(
    'https://fakestoreapi.com/products/1',
    500,
  )
    .then((res) => res.json())
    .catch((error) => {
      if (error.name === 'AbortError') {
        return 'Aborted';
      }
      throw error;
    });

  console.assert(
    timedoutFetchShouldSucceedData.id === 1,
    'fetchWithTimeout with 500ms timeout should have succeeded',
  );

  const timedoutFetchShouldAbort = await fetchWithTimeout(
    'https://fakestoreapi.com/products/1',
    10,
  )
    .then((res) => res.json())
    .catch((error) => {
      if (error.name === 'AbortError') {
        return 'Aborted';
      }
      throw error;
    });

  console.assert(
    timedoutFetchShouldAbort === 'Aborted',
    'fetchWithTimeout with 10ms timeout should have aborted but did not',
  );
}

async function noPollyFetchCancellation() {
  const c = new AbortController();
  const resPromise = fetch('https://fakestoreapi.com/products/1', {
    signal: c.signal,
  });

  c.abort();
  const output = await resPromise.then((res) => res.json()).catch((err) => err);
  console.assert(output.name === 'AbortError', 'Promise should abort');
  console.assert(output instanceof Error, 'Abort error should be an error');
  console.assert(
    output instanceof DOMException,
    'Abort error should be a DOMException',
  );
}

await noPollyFetchCancellation();

await runWithHttpRecording(
  'chapter-7-fakestoreapi-cancellation',
  cancellationAndTimeouts,
  { timing: Timing.fixed(100) },
);

async function throttleDebounceBatch() {
  function throttle(fn, timeout) {
    let isThrottled = false;
    let lastCallArgs = null;
    return (...args) => {
      if (isThrottled) {
        lastCallArgs = args;
        return;
      }
      setTimeout(() => {
        isThrottled = false;
        return fn(...lastCallArgs);
      }, timeout);

      isThrottled = true;
      return fn(...args);
    };
  }

  function timeout(ms = 0) {
    return new Promise((r) => setTimeout(r, ms));
  }

  let messages = [];
  const storeMessage = (message) => {
    messages.push(message);
  };

  messages = [];
  const throttledStoreMessage = throttle(storeMessage, 1);

  throttledStoreMessage('throttle-1');
  throttledStoreMessage('throttle-2');
  throttledStoreMessage('throttle-3');
  throttledStoreMessage('throttle-4');
  throttledStoreMessage('throttle-5');
  throttledStoreMessage('throttle-6');
  throttledStoreMessage('throttle-7');
  throttledStoreMessage('throttle-8');
  throttledStoreMessage('throttle-9');
  throttledStoreMessage('throttle-10');

  await timeout();
  assert.deepEqual(messages, ['throttle-1', 'throttle-10']);

  messages = [];

  throttledStoreMessage('throttle-1');
  throttledStoreMessage('throttle-2');
  throttledStoreMessage('throttle-3');
  throttledStoreMessage('throttle-4');
  throttledStoreMessage('throttle-5');
  await timeout();
  throttledStoreMessage('throttle-6');
  throttledStoreMessage('throttle-7');
  throttledStoreMessage('throttle-8');
  throttledStoreMessage('throttle-9');
  throttledStoreMessage('throttle-10');

  assert.deepEqual(messages, ['throttle-1', 'throttle-5', 'throttle-6']);
  await timeout();
  assert.deepEqual(messages, [
    'throttle-1',
    'throttle-5',
    'throttle-6',
    'throttle-10',
  ]);

  function debounce(fn, timeout) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        fn(...args);
      }, timeout);
    };
  }

  messages = [];
  const debouncedStoredMessage = debounce(storeMessage, 1);
  debouncedStoredMessage('debounce-1');
  debouncedStoredMessage('debounce-2');
  debouncedStoredMessage('debounce-3');
  debouncedStoredMessage('debounce-4');
  debouncedStoredMessage('debounce-5');
  debouncedStoredMessage('debounce-6');
  debouncedStoredMessage('debounce-7');
  debouncedStoredMessage('debounce-8');
  debouncedStoredMessage('debounce-9');
  debouncedStoredMessage('debounce-10');

  assert.deepEqual(messages, []);
  await timeout();
  assert.deepEqual(messages, ['debounce-10']);

  messages = [];
  debouncedStoredMessage('debounce-1');
  debouncedStoredMessage('debounce-2');
  debouncedStoredMessage('debounce-3');
  debouncedStoredMessage('debounce-4');
  debouncedStoredMessage('debounce-5');
  await timeout();
  debouncedStoredMessage('debounce-6');
  debouncedStoredMessage('debounce-7');
  debouncedStoredMessage('debounce-8');
  debouncedStoredMessage('debounce-9');
  debouncedStoredMessage('debounce-10');

  assert.deepEqual(messages, ['debounce-5']);
  await timeout();
  assert.deepEqual(messages, ['debounce-5', 'debounce-10']);

  /**
   *
   * @param {Array<T>} inputArray
   * @param {number} batchSize
   * @returns {Array<Array<T>>}
   */
  function batch(inputArray, batchSize) {
    const batchCount = Math.ceil(inputArray.length / batchSize);
    const batches = Array.from({ length: batchCount });
    return batches.map((_, batchNumber) => {
      return inputArray.slice(
        batchNumber * batchSize,
        (batchNumber + 1) * batchSize,
      );
    });
    // return Array.from({ length: batchCount }, (_, batchNumber) => {
    //   return inputArray.slice(
    //     batchNumber * batchSize,
    //     (batchNumber + 1) * batchSize
    //   );
    // });
  }

  assert.deepEqual(batch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4), [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11],
  ]);
  assert.deepEqual(batch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3), [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11],
  ]);

  const numberResolverBatches = batch(
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    2,
  );

  console.assert(numberResolverBatches.length === 2);
  console.assert(numberResolverBatches[0].length === 2);
  console.assert(numberResolverBatches[1].length === 1);

  async function resolveBatches(batchedPromises) {
    const flattenedBatchOutput = [];
    for (const batch of batchedPromises) {
      const resolved = await Promise.all(batch);
      flattenedBatchOutput.push(...resolved);
    }
    return flattenedBatchOutput;
  }
  const batchOutput = await resolveBatches(numberResolverBatches);
  assert.deepEqual(batchOutput, [1, 2, 3]);
}

await throttleDebounceBatch();
