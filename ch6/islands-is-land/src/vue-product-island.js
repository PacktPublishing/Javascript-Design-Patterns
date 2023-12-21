// this 'vue' import is aliased to `vue/dist/vue.esm-bundler.js`
// the default vue build doesn't have the template compiler included
import { createApp } from 'vue';
import { resetClientSidePolly } from './polly-entrypoint.js';

createApp({
  async mounted() {
    this.loading = true;
    resetClientSidePolly(`ch6-is-lands-product-${this.productId}`);
    const product = await fetch(
      `https://fakestoreapi.com/products/${this.productId}`,
    ).then((res) => res.json());
    this.product = product;
    this.loading = false;

    document.dispatchEvent(
      new CustomEvent('product-category-load', {
        detail: {
          category: this.product.category,
        },
      }),
    );
    resetClientSidePolly(`ch6-is-lands-product-${this.productId}`);
  },
  data: () => ({
    productId:
      new URLSearchParams(window.location.search).get('productId') || '1',
    loading: true,
    product: {},
  }),
}).mount('#vue-product-island');
