// Endpoint PUT /api/sessions/3d/:id/complete
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Finaliser la session 3D et calculer les scores/badges
  return res.status(200).json({ success: true });
}
