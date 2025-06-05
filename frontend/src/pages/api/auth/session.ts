// Endpoint GET /api/auth/session
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Retourner les infos de session utilisateur (mock)
  return res.status(200).json({ authenticated: true, user: { id: 'mock-user-id', role: 'STUDENT' } });
}
