// Endpoint POST /api/r-studio/export-results
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Exporter les résultats d'analyse RStudio (mock)
  const { data } = req.body;
  return res.status(200).json({ exported: true });
}
