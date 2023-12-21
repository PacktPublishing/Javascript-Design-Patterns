import { runWithHttpRecording } from '@/../../../utils';
/**
 * @type {import('next').NextApiHandler<{ matches: Array<object>, count: number }>}
 */
export default async function handler(req, res) {
  /**
   * @type {Array<import('@/../../../fakestoreapi').Product>}
   */
  const allProducts = await runWithHttpRecording(
    'ch6-zones-search',
    async () => {
      const products = await fetch('https://fakestoreapi.com/products').then(
        (res) => res.json(),
      );
      return products;
    },
  );
  const { q } = req.query;
  const searchQuery = Array.isArray(q) ? q[0] : q;
  const matches = allProducts.filter(
    (product) =>
      product.title.includes(searchQuery) ||
      product.description.includes(searchQuery) ||
      product.category.includes(searchQuery),
  );
  return res.status(200).json({ matches, count: matches.length });
}
