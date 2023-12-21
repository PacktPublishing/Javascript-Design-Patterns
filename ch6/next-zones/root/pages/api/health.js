/**
 * @type {import('next').NextApiHandler<{ status: 'UP' | 'DOWN' }>}
 */
export default function handler(_req, res) {
  return res.status(200).json({ status: 'UP' });
}
