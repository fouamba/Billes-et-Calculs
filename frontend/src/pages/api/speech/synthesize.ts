// Endpoint POST /api/speech/synthesize
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Intégrer la synthèse vocale côté client (ici, renvoyer le texte à synthétiser)
  const { text, options } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Texte requis' });
  }
  // La synthèse réelle se fait côté client (Web Speech API)
  return res.status(200).json({ text, options });
}
