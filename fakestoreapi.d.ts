/**
 * @example
 * ```js
 * {
 *   id: 1,
 *   title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
 *   price: 109.95,
 *   description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
 *   category: "men's clothing",
 *   image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
 *   rating: { rate: 3.9, count: 120 }
 * }
 * ```
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
/**
 * @example
 * ```json
 * {
 *   "id": 2,
 *   "userId": 1,
 *   "date": "2020-01-02T00:00:00.000Z",
 *   "products":[
 *     { "productId": 2, "quantity": 4 },
 *     { "productId": 1, "quantity": 10 },
 *     { "productId": 5, "quantity": 2 }
 *   ],
 *   "__v": 0
 * }
 * ```
 */
export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
  __v: number;
}
