// Endpoint POST /api/adaptive/adjust-difficulty
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Adapter la difficulté selon les résultats utilisateur
  const { userId, lastResult } = req.body;
  // Logique d'adaptation à implémenter
  return res.status(200).json({ newRange: [1, 5] });
}
