// Endpoint GET /api/adaptive/recommended-numbers
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Retourner la plage de nombres recommandée pour l'utilisateur
  const { userId } = req.query;
  return res.status(200).json({ range: [1, 5] });
}
