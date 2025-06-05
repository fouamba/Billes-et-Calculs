// Endpoint POST /api/sessions/3d/start
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Créer une nouvelle session 3D pour l'utilisateur
  return res.status(200).json({ sessionId: 'mock-session-id' });
}
