// Endpoint POST /api/r-studio/analyze
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Envoyer les données à RStudio pour analyse (mock)
  const { data } = req.body;
  return res.status(200).json({ analysisId: 'mock-analysis-id' });
}
