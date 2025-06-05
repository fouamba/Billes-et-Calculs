// Endpoint GET /api/r-studio/results
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Retourner les résultats d'analyse RStudio (mock)
  const { analysisId } = req.query;
  return res.status(200).json({ results: null });
}
