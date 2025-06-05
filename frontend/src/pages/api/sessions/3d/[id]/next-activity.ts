// Endpoint GET /api/sessions/3d/:id/next-activity
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Retourner la prochaine activité 3D à réaliser pour la session donnée
  return res.status(200).json({ activity: null });
}
