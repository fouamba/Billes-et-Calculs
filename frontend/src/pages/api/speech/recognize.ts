// Endpoint POST /api/speech/recognize
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Intégrer la reconnaissance vocale côté client (ici, renvoyer la consigne)
  const { expectedResponses } = req.body;
  // La reconnaissance réelle se fait côté client (Web Speech API)
  return res.status(200).json({ expectedResponses });
}
