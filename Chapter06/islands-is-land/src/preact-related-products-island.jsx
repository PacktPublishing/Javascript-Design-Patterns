import { resetClientSidePolly } from './polly-entrypoint';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export function RelatedProducts({ selectedProductId, category, from }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(async () => {
    resetClientSidePolly(`related-products-${encodeURIComponent(category)}`);
    const productsInCategory = await fetch(
      `https://fakestoreapi.com/products/category/${encodeURIComponent(
        category,
      )}`,
    ).then((res) => res.json());

    resetClientSidePolly(`related-products-${category}`, 'STOP');

    const topRelatedProductsByRating = productsInCategory
      .filter((el) => {
        return el.id !== parseInt(selectedProductId, 10);
      })
      .sort((a, b) => b.rating.rate - a.rating.rate);

    setRelatedProducts(topRelatedProductsByRating.slice(0, 3));
  }, [selectedProductId, category]);

  return (
    <div>
      <h3>Related Products (from {from})</h3>
      <ul class="related-product-card-row">
        {relatedProducts.map((product) => {
          const productSearchParams = new URLSearchParams([
            ['productId', product.id],
          ]);
          const currentCartId = new URLSearchParams(window.location.search).get(
            'cartId',
          );
          if (currentCartId) {
            productSearchParams.set('cartId', currentCartId);
          }
          return (
            <li class="related-product-card">
              <a href={'?' + productSearchParams.toString()}>
                <h4>{product.title}</h4>
                <p>
                  {product.price.toLocaleString(navigator.language, {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
                <img height="100px" src={product.image} />
                <p>
                  {product.rating.rate}/5.0 ({product.rating.count})
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function mountRelatedProductsIsland(
  relatedProductsIslandContainer,
  category,
  selectedProductId,
  from,
) {
  if (category && selectedProductId) {
    render(
      <RelatedProducts
        category={category}
        selectedProductId={selectedProductId}
        from={from}
      />,
      relatedProductsIslandContainer,
      relatedProductsIslandContainer,
    );
  }
}
