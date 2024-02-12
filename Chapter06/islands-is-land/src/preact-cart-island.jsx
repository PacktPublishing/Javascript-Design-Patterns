import { resetClientSidePolly } from './polly-entrypoint';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function CartContents(props) {
  const { cart, productsById } = props;
  return (
    <ul>
      {cart.products.map((product) => {
        const lineItemQueryParams = new URLSearchParams([
          ['productId', product.productId],
          ['cartId', cart.id],
        ]);
        const fullProductInformation = productsById[product.productId];
        return (
          <li key={product.productId} className="cart-item-product">
            {
              <a href={'?' + lineItemQueryParams.toString()}>
                {fullProductInformation?.title}
              </a>
            }
            <span className="cart-item-product-quantity">
              {' '}
              x {product.quantity}
            </span>
            <span className="cart-item-product-price">
              Price:
              {(
                product.quantity * fullProductInformation?.price
              ).toLocaleString(navigator.language, {
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
            .toLocaleString(navigator.language, {
              style: 'currency',
              currency: 'EUR',
            })}
        </strong>
      </li>
    </ul>
  );
}

function CartContainer(props) {
  const cartId = props.id ?? 1;
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cartContents, setCartContents] = useState({
    cart: null,
    productsById: null,
  });
  useEffect(async () => {
    resetClientSidePolly(`ch6-is-lands-cart-${cartId}`);
    setIsLoading(true);
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
    /** @type {Record<number, import('../../../../fakestoreapi').Product>} */
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

    setCartContents({
      cart,
      productsById,
    });
    setIsLoading(false);

    resetClientSidePolly(`ch6-is-lands-cart-${cartId}`, 'STOP');
  }, [cartId]);

  const cartItemCount = cartContents?.cart?.products?.length;

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        My Cart {cartItemCount !== undefined ? <>({cartItemCount})</> : ''}
      </button>
      {open && isLoading && <div>Loading...</div>}
      {open && !isLoading && cartContents.cart && cartContents.productsById && (
        <CartContents
          cart={cartContents.cart}
          productsById={cartContents.productsById}
        />
      )}
    </div>
  );
}

const appContainer = document.querySelector('#preact-cart-island');
render(
  <CartContainer
    id={new URLSearchParams(window.location.search).get('cartId')}
  />,
  appContainer,
  appContainer,
);
