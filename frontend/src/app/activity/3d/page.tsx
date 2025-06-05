// Page Next.js pour l'activité 3D
'use client';
import React, { useState } from 'react';
import GamePage from '@/components/game/GameScene3D/GamePage';

export default function Activity3DPage() {
  // Pour la démo, on simule un élève connecté
  const [showGame, setShowGame] = useState(true);
  const studentName = 'Élève';

  if (!showGame) {
    // Redirection ou retour à l'accueil (à adapter selon votre logique)
    return <div className="flex flex-col items-center justify-center min-h-screen">Accueil du jeu AddLearn</div>;
  }

  return <GamePage studentName={studentName} onExit={() => setShowGame(false)} />;
}
