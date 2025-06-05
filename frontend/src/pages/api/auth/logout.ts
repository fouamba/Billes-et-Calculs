// Endpoint POST /api/auth/logout
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Invalider la session côté serveur
  return res.status(200).json({ success: true });
}
