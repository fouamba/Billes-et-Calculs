'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  // States pour l'identification et les niveaux
  const [studentName, setStudentName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'disconnected'|'pending'|'connected'>('disconnected');
  const [levelButtonsEnabled, setLevelButtonsEnabled] = useState(false);
  const [connectBtnText, setConnectBtnText] = useState("Se connecter");
  const studentInputRef = useRef<HTMLInputElement>(null);

  // Gestion de l'input élève
  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    setStudentName(name);
    if (name.length >= 2) {
      setStatus('pending');
    } else {
      setStatus('disconnected');
    }
  };

  // Connexion élève
  const connectStudent = () => {
    if (studentName.length >= 2) {
      setIsConnected(true);
      setStatus('connected');
      setConnectBtnText("Changer d'élève");
      setLevelButtonsEnabled(true);
    }
  };

  // Déconnexion élève
  const disconnectStudent = () => {
    setIsConnected(false);
    setStudentName('');
    setStatus('disconnected');
    setConnectBtnText("Se connecter");
    setLevelButtonsEnabled(false);
    setTimeout(() => {
      studentInputRef.current?.focus();
    }, 200);
  };

  // Gestion du bouton connexion
  const handleConnectBtn = () => {
    if (isConnected) disconnectStudent();
    else connectStudent();
  };

  // Navigation
  const showStudentSelector = () => {
    if (isConnected) {
      alert(`🎮 Élève connecté : ${studentName}\nTu peux maintenant choisir un niveau !`);
    } else {
      alert("🎮 Identifie-toi d&apos;abord dans la carte &apos;Identification Élève&apos; pour commencer !");
      studentInputRef.current?.focus();
    }
  };
  const showProgress = () => {
    if (isConnected) {
      alert(`📊 Progrès de ${studentName}\n\nNiveau 1: En cours\nNiveau 2: Non débloqué\nNiveau 3: Non débloqué\n\n(Dashboard détaillé à développer)`);
    } else {
      alert("📊 Identifie-toi d&apos;abord pour voir tes progrès !");
    }
  };
  const showHelp = () => {
    alert(`❓ Aide - Billes & Calculs\n\n1. 👤 Identifie-toi en tapant ton prénom\n2. 🎯 Choisis un niveau adapté à ton âge\n3. 🎲 Manipule les billes pour apprendre\n4. 📊 Suis tes progrès au fil du temps\n\nGuide interactif complet à créer !`);
  };
  const startLevel = (level: 1|2|3) => {
    if (!isConnected) {
      alert("🔒 Identifie-toi d&apos;abord pour jouer !");
      studentInputRef.current?.focus();
      return;
    }
    const levelNames = {1: 'Manipulation', 2: 'Schématisation', 3: 'Abstraction'};
    alert(`🚀 Lancement du Niveau ${level} - ${levelNames[level]}\n\nÉlève : ${studentName}\nInterface 3D Three.js à intégrer\n\nPrépare-toi pour une aventure mathématique !`);
  };

  // Animation d'entrée progressive
  useEffect(() => {
    // Focus auto sur l'input au chargement
    setTimeout(() => {
      studentInputRef.current?.focus();
    }, 800);
  }, []);

  // Animation des billes flottantes dans le header
  useEffect(() => {
    const header = document.querySelector('.header');
    if (!header) return;
    for (let i = 0; i < 5; i++) {
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][i]};
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
        opacity: 0.6;
        z-index: 1;
      `;
      header.appendChild(element);
    }
    // Animation CSS
    const style = document.createElement('style');
    style.textContent += `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      // Nettoyage
      document.querySelectorAll('.header > div').forEach(el => el.remove());
      style.remove();
    };
  }, []);

  // Gestion du style du status
  let statusClass = 'student-status disconnected';
  let statusText = '🔒 Non identifié';
  if (status === 'pending') {
    statusText = `👋 Salut ${studentName} !`;
    statusClass = 'student-status';
  } else if (status === 'connected') {
    statusText = `✅ Connecté : ${studentName}`;
    statusClass = 'student-status connected';
  }

  return (
    <>
      {/* Header avec logo et titre */}
      <header className="header w-full bg-white/80">
        <div className="sound-wave"></div>
        <div className="header-content flex items-center w-full max-w-none ml-0 pl-8">
          <div className="logo-section flex items-center">
            <div className="logo flex items-center justify-center bg-white rounded-lg shadow p-0" style={{ width: '246px', height: '60px' }}>
              <Image src="/ceredis.png" alt="Logo CEREDIS" width={236} height={57} className="object-contain" style={{ margin: 0, padding: 0, width: '236px', height: '57px' }} />
            </div>
            <div>
              <h1 className="app-title">Billes & Calculs</h1>
              <p className="subtitle">Apprendre les mathématiques en manipulant</p>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <button className="nav-btn" onClick={showStudentSelector}>🚀 Commencer à jouer</button>
          <button className="nav-btn secondary" onClick={showProgress}>📊 Voir mes progrès</button>
          <button className="nav-btn secondary" onClick={showHelp}>❓ Aide</button>
        </div>
      </nav>
      {/* Contenu principal */}
      <main className="main-container">
        {/* Section d'accueil */}
        <section className="welcome-section fade-in">
          <h2 className="welcome-title">Bienvenue dans l&apos;aventure des mathématiques ! 🌟</h2>
          <p className="welcome-text">
            Découvre les additions et soustractions en manipulant des billes colorées dans un univers 3D magique. Progresse à ton rythme à travers 3 niveaux passionnants et deviens un champion des calculs&nbsp;!
          </p>
        </section>
        {/* Cartes des niveaux et identification élève */}
        <section className="level-cards fade-in">
          {/* Carte d'identification élève */}
          <div className="level-card student-card">
            <div className="level-icon">👤</div>
            <h3 className="level-title">Identification Élève</h3>
            <p className="level-description">
              Identifie-toi pour sauvegarder tes progrès et accéder à tes niveaux personnalisés !
            </p>
            <div className="student-form">
              <input
                type="text"
                className="student-input"
                ref={studentInputRef}
                placeholder="Tape ton prénom ici..."
                value={studentName}
                onChange={handleStudentInput}
                maxLength={30}
                autoComplete="off"
              />
              <div className={status === 'pending' ? 'student-status student-status--pending' : statusClass}>
                {statusText}
              </div>
            </div>
            <button
              className="start-btn student-btn"
              onClick={handleConnectBtn}
              disabled={status === 'disconnected'}
            >
              {connectBtnText}
            </button>
          </div>
          {/* Niveau 1 */}
          <div className="level-card level-1">
            <div className="level-icon">🎲</div>
            <h3 className="level-title">Niveau 1 - Manipulation</h3>
            <p className="level-description">
              Apprends en manipulant directement les billes colorées. Découvre les secrets de l&apos;addition et de la soustraction !
            </p>
            <ul className="level-features">
              <li>Manipule des billes rouges et bleues</li>
              <li>Nombres de 1 à 5</li>
              <li>Environnement 3D interactif</li>
              <li>Apprentissage par la découverte</li>
            </ul>
            <button
              className={`start-btn${!levelButtonsEnabled ? ' opacity-60' : ' opacity-100'}`}
              onClick={() => startLevel(1)}
              disabled={!levelButtonsEnabled}
            >
              Commencer le Niveau 1
            </button>
          </div>
          {/* Niveau 2 */}
          <div className="level-card level-2">
            <div className="level-icon">📝</div>
            <h3 className="level-title">Niveau 2 - Schématisation</h3>
            <p className="level-description">
              Dessine et représente tes stratégies ! Crée des schémas pour expliquer tes raisonnements mathématiques.
            </p>
            <ul className="level-features">
              <li>Outils de dessin intégrés</li>
              <li>Nombres de 1 à 10</li>
              <li>Création de diagrammes</li>
              <li>Expression de la pensée</li>
            </ul>
            <button
              className={`start-btn${!levelButtonsEnabled ? ' opacity-60' : ' opacity-100'}`}
              onClick={() => startLevel(2)}
              disabled={!levelButtonsEnabled}
            >
              Commencer le Niveau 2
            </button>
          </div>
          {/* Niveau 3 */}
          <div className="level-card level-3">
            <div className="level-icon">🧮</div>
            <h3 className="level-title">Niveau 3 - Abstraction</h3>
            <p className="level-description">
              Maîtrise les équations formelles ! Résous des problèmes avec des symboles mathématiques comme un vrai mathématicien.
            </p>
            <ul className="level-features">
              <li>Équations formelles (a + b = c)</li>
              <li>Nombres de 1 à 20</li>
              <li>Calcul mental avancé</li>
              <li>Validation par manipulation</li>
            </ul>
            <button
              className={`start-btn${!levelButtonsEnabled ? ' opacity-60' : ' opacity-100'}`}
              onClick={() => startLevel(3)}
              disabled={!levelButtonsEnabled}
            >
              Commencer le Niveau 3
            </button>
          </div>
        </section>
      </main>
      {/* Carrousel des partenaires */}
      <section className="partners-section">
        <h3 className="partners-title">Nos Partenaires et Sponsors</h3>
        <div className="partners-carousel">
          <div className="partners-track">
            {/* Logos partenaires */}
            <div className="partner-item"><div className="partner-logo">🏫</div><div className="partner-name">École Primaire<br/>Les Tilleuls</div></div>
            <div className="partner-item"><div className="partner-logo">🎓</div><div className="partner-name">Université<br/>Paris-Saclay</div></div>
            <div className="partner-item"><div className="partner-logo">🔬</div><div className="partner-name">CNRS<br/>Recherche</div></div>
            <div className="partner-item"><div className="partner-logo">💡</div><div className="partner-name">Innovation<br/>Pédagogique</div></div>
            <div className="partner-item"><div className="partner-logo">🌟</div><div className="partner-name">Fondation<br/>Éducation</div></div>
            <div className="partner-item"><div className="partner-logo">🚀</div><div className="partner-name">Tech For<br/>Education</div></div>
            {/* Duplication pour effet de défilement continu */}
            <div className="partner-item"><div className="partner-logo">🏫</div><div className="partner-name">École Primaire<br/>Les Tilleuls</div></div>
            <div className="partner-item"><div className="partner-logo">🎓</div><div className="partner-name">Université<br/>Paris-Saclay</div></div>
            <div className="partner-item"><div className="partner-logo">🔬</div><div className="partner-name">CNRS<br/>Recherche</div></div>
            <div className="partner-item"><div className="partner-logo">💡</div><div className="partner-name">Innovation<br/>Pédagogique</div></div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2025 Billes & Calculs - Projet pédagogique innovant</p>
          <div className="footer-links">
            <a href="#about">À propos</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Confidentialité</a>
            <a href="#support">Support</a>
          </div>
          <p className="footer-text">Développé avec ❤️ pour l&apos;éducation des enfants</p>
        </div>
      </footer>
    </>
  );
}
