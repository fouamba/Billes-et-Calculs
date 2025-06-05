// Endpoint GET /api/speech/voices
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Renvoyer la liste des voix disponibles (mock, car côté client)
  return res.status(200).json({ voices: [] });
}
