// Endpoint POST /api/sessions/3d/:id/activity-result
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // TODO: Enregistrer le résultat d'une activité 3D pour la session donnée
  return res.status(200).json({ success: true });
}
