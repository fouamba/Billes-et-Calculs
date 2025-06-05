// Endpoint POST /api/auth/login-teacher
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Authentification enseignant/chercheur par email/mot de passe (mock)
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  // TODO: Vérifier les identifiants dans la base de données
  return res.status(200).json({ success: true, userId: 'mock-teacher-id' });
}
