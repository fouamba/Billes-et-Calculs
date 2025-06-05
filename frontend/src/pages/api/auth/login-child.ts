// Endpoint POST /api/auth/login-child
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Authentification simplifiée par code/pseudo (mock)
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code requis' });
  }
  // TODO: Vérifier le code dans la base de données
  return res.status(200).json({ success: true, userId: 'mock-user-id' });
}
