// Endpoint GET /api/analytics/3d-interactions
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Retourner les traces d'interactions 3D pour une session
  const { sessionId } = req.query;
  return res.status(200).json({ traces: [] });
}
