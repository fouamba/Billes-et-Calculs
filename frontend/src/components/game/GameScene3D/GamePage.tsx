// Composant GamePage intégré dans l'organisation Next.js
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane, Text } from '@react-three/drei';
import { Home, Volume2, VolumeX, Trophy } from 'lucide-react';

// Types pour le jeu
interface MarbleData {
  id: string;
  position: [number, number, number];
  color: 'red' | 'blue';
  isVisible: boolean;
  isClickable: boolean;
  clickCount: number;
}

interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  currentActivity: {
    type: 'composition' | 'decomposition';
    phase: 'counting_red' | 'counting_blue' | 'counting_total' | 'questioning' | 'verification';
    marbles: {
      red: number;
      blue: number;
    };
    responses: {
      redCount?: number;
      blueCount?: number;
      totalCount?: number;
      finalAnswer?: number;
    };
    correctAnswer: number;
  };
  sessionCode: string;
}

// Composant Bille 3D
const Marble3D: React.FC<{
  marble: MarbleData;
  onClick: (id: string) => void;
}> = ({ marble, onClick }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && marble.isVisible) {
      // Animation de flottement
      meshRef.current.position.y = marble.position[1] + Math.sin(state.clock.elapsedTime * 2 + parseFloat(marble.id.split('-')[1] || '0')) * 0.02;
      
      // Animation au clic
      if (marble.clickCount > 0) {
        meshRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
      }
    }
  });

  if (!marble.isVisible) return null;

  return (
    <Sphere
      ref={meshRef}
      args={[0.08, 32, 32]}
      position={marble.position}
      onClick={() => marble.isClickable && onClick(marble.id)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={marble.color === 'red' ? '#DC2626' : '#2563EB'}
        metalness={0.3}
        roughness={0.2}
        transparent={marble.clickCount > 0}
        opacity={marble.clickCount > 0 ? 0.6 : 1}
      />
    </Sphere>
  );
};

// Composant Plateau de jeu
const GamePlatform: React.FC = () => {
  return (
    <group>
      {/* Plateau principal */}
      <Box args={[3, 0.1, 2]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color="#9CA3AF" />
      </Box>
      {/* Base du plateau */}
      <Plane
        args={[4, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.11, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#F3F4F6" />
      </Plane>
    </group>
  );
};

// Composant Scène 3D du plateau
const PlatformScene: React.FC<{
  marbles: MarbleData[];
  onMarbleClick: (id: string) => void;
}> = ({ marbles, onMarbleClick }) => {
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 2, 0]} intensity={0.4} />

      {/* Plateau */}
      <GamePlatform />

      {/* Billes */}
      {marbles.map((marble) => (
        <Marble3D
          key={marble.id}
          marble={marble}
          onClick={onMarbleClick}
        />
      ))}

      {/* Contrôles de caméra */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

// Composant Avatar 3D simplifié
const TeacherAvatar: React.FC<{
  expression: 'neutral' | 'encouraging' | 'questioning';
}> = ({ expression }) => {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Animation de respiration
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.scale.y = breathe;
      
      // Léger balancement
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const getColor = () => {
    switch (expression) {
      case 'encouraging': return '#10B981';
      case 'questioning': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Corps */}
      <Box args={[0.6, 1.2, 0.4]} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color={getColor()} />
      </Box>
      
      {/* Tête */}
      <Sphere args={[0.35, 32, 32]} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#FBBF24" />
      </Sphere>
      
      {/* Cheveux */}
      <Sphere args={[0.38, 32, 32]} position={[0, 1.65, -0.1]} castShadow>
        <meshStandardMaterial color="#92400E" />
      </Sphere>
      
      {/* Yeux */}
      <Sphere args={[0.04, 16, 16]} position={[-0.12, 1.55, 0.25]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.04, 16, 16]} position={[0.12, 1.55, 0.25]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Bras */}
      <Box args={[0.15, 0.8, 0.15]} position={[-0.45, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#FBBF24" />
      </Box>
      <Box args={[0.15, 0.8, 0.15]} position={[0.45, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#FBBF24" />
      </Box>
      
      {/* Jambes */}
      <Box args={[0.18, 0.8, 0.18]} position={[-0.2, -0.4, 0]} castShadow>
        <meshStandardMaterial color="#1F2937" />
      </Box>
      <Box args={[0.18, 0.8, 0.18]} position={[0.2, -0.4, 0]} castShadow>
        <meshStandardMaterial color="#1F2937" />
      </Box>
    </group>
  );
};

// Composant Scène du personnage
const TeacherScene: React.FC<{
  expression: 'neutral' | 'encouraging' | 'questioning';
}> = ({ expression }) => {
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={0.8}
        castShadow
      />
      <pointLight position={[0, 2, 1]} intensity={0.3} color="#FBBF24" />

      {/* Sol */}
      <Plane
        args={[3, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.8, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#E5E7EB" />
      </Plane>

      {/* Personnage */}
      <TeacherAvatar expression={expression} />

      {/* Contrôles de caméra */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={[0, 0.5, 0]}
      />
    </>
  );
};

// Composant principal de la page du jeu
const GamePage: React.FC<{
  studentName: string;
  onExit: () => void;
}> = ({ studentName, onExit }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 1,
    totalQuestions: 5,
    score: 0,
    maxScore: 5,
    currentActivity: {
      type: 'composition',
      phase: 'counting_red',
      marbles: { red: 1, blue: 2 },
      responses: {},
      correctAnswer: 3
    },
    sessionCode: '00000'
  });

  const [marbles, setMarbles] = useState<MarbleData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [teacherExpression, setTeacherExpression] = useState<'neutral' | 'encouraging' | 'questioning'>('neutral');

  // Générer les billes selon la configuration
  useEffect(() => {
    const newMarbles: MarbleData[] = [];
    const { red, blue } = gameState.currentActivity.marbles;
    
    // Billes rouges
    for (let i = 0; i < red; i++) {
      newMarbles.push({
        id: `red-${i}`,
        position: [
          -1 + (i % 3) * 0.4,
          0.08,
          -0.3 + Math.floor(i / 3) * 0.3
        ],
        color: 'red',
        isVisible: true,
        isClickable: gameState.currentActivity.phase.includes('counting'),
        clickCount: 0
      });
    }
    
    // Billes bleues
    for (let i = 0; i < blue; i++) {
      newMarbles.push({
        id: `blue-${i}`,
        position: [
          0.2 + (i % 3) * 0.4,
          0.08,
          -0.3 + Math.floor(i / 3) * 0.3
        ],
        color: 'blue',
        isVisible: true,
        isClickable: gameState.currentActivity.phase.includes('counting'),
        clickCount: 0
      });
    }
    
    setMarbles(newMarbles);
  }, [gameState.currentActivity]);

  // Gestion du clic sur les billes
  const handleMarbleClick = (marbleId: string) => {
    setMarbles(prev => 
      prev.map(marble => 
        marble.id === marbleId 
          ? { ...marble, clickCount: marble.clickCount + 1 }
          : marble
      )
    );
    
    setTeacherExpression('encouraging');
    setTimeout(() => setTeacherExpression('neutral'), 2000);
  };

  // Gestion de la validation des réponses
  const handleValidation = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || value < 0) return;

    setGameState(prev => {
      const newState = { ...prev };
      const activity = newState.currentActivity;
      
      // Enregistrer la réponse selon la phase
      if (activity.phase === 'counting_red') {
        activity.responses.redCount = value;
        if (activity.type === 'composition') {
          activity.phase = 'counting_blue';
          setTeacherExpression('encouraging');
        } else {
          activity.phase = 'questioning';
          setTeacherExpression('questioning');
        }
      } else if (activity.phase === 'counting_blue') {
        activity.responses.blueCount = value;
        activity.phase = 'questioning';
        setTeacherExpression('questioning');
      } else if (activity.phase === 'counting_total') {
        activity.responses.totalCount = value;
        activity.phase = 'counting_red';
        setTeacherExpression('neutral');
      } else if (activity.phase === 'questioning') {
        activity.responses.finalAnswer = value;
        
        // Vérifier la réponse
        const isCorrect = value === activity.correctAnswer;
        if (isCorrect) {
          newState.score += 1;
          setTeacherExpression('encouraging');
        }
        
        // Passer à la question suivante ou terminer
        if (newState.currentQuestion < newState.totalQuestions) {
          newState.currentQuestion += 1;
          // Générer nouvelle activité
          generateNewActivity(newState);
        } else {
          // Session terminée
          alert(`Session terminée ! Score final : ${newState.score}/${newState.maxScore}`);
        }
      }
      
      return newState;
    });
    
    setInputValue('');
  };

  // Générer une nouvelle activité
  const generateNewActivity = (state: GameState) => {
    const type = Math.random() > 0.5 ? 'composition' : 'decomposition';
    const red = Math.floor(Math.random() * 4) + 1; // 1-4
    const blue = Math.floor(Math.random() * 4) + 1; // 1-4
    
    state.currentActivity = {
      type,
      phase: type === 'composition' ? 'counting_red' : 'counting_total',
      marbles: { red, blue },
      responses: {},
      correctAnswer: type === 'composition' ? red + blue : blue
    };
  };

  // Obtenir l'instruction actuelle
  const getCurrentInstruction = () => {
    const { phase, type, responses, marbles } = gameState.currentActivity;
    
    switch (phase) {
      case 'counting_red':
        return "Compte les billes rouges et écris le nombre que tu vas trouver.";
      case 'counting_blue':
        return "Compte les billes bleues et écris le nombre que tu vas trouver.";
      case 'counting_total':
        return "Compte toutes les billes et écris le nombre que tu vas trouver.";
      case 'questioning':
        if (type === 'composition') {
          return `Tu as compté ${responses.redCount} billes rouges et ${responses.blueCount} billes bleues. Combien cela fait-il en tout ?`;
        } else {
          return `Tu as compté ${responses.totalCount} billes en tout, et parmi elles ${responses.redCount} billes rouges. Combien y a-t-il de billes bleues ?`;
        }
      default:
        return "Suis les instructions pour résoudre le problème.";
    }
  };

  // Obtenir le label du champ de saisie
  const getInputLabel = () => {
    const { phase } = gameState.currentActivity;
    
    switch (phase) {
      case 'counting_red':
        return "Nombre de billes rouges:";
      case 'counting_blue':
        return "Nombre de billes bleues:";
      case 'counting_total':
        return "Nombre total de billes:";
      case 'questioning':
        return "Ta réponse:";
      default:
        return "Réponse:";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-100">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded text-white flex items-center justify-center text-sm font-bold">
                  C
                </div>
                <span className="text-xl font-bold text-gray-800">CEREDIS</span>
              </div>
              <nav className="hidden md:flex space-x-6 text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer">Accueil</span>
                <span className="hover:text-blue-600 cursor-pointer">Numération</span>
                <span className="text-blue-600 font-medium">Calcul écrit</span>
                <span className="hover:text-blue-600 cursor-pointer">Calcul mental</span>
                <span className="hover:text-blue-600 cursor-pointer flex items-center">
                  <Trophy size={16} className="mr-1" />
                  Récompenses
                </span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                title="Activer/désactiver le son"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                title="Retour à l'accueil"
                onClick={onExit}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Titre de la section */}
      <div className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold">
            Résoudre des situations-problèmes de type additif
          </h1>
        </div>
      </div>

      {/* Sélecteurs Module/Niveau */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div>
              <span className="text-sm text-gray-600 block mb-2">Module</span>
              <div className="flex space-x-2">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium" title="Sélectionner le module 1">Module 1</button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" title="Sélectionner le module 2">Module 2</button>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div>
              <span className="text-sm text-gray-600 block mb-2">Niveau</span>
              <div className="flex space-x-2">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium" title="Sélectionner le niveau 1">Niveau 1</button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" title="Sélectionner le niveau 2">Niveau 2</button>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale du jeu */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Module 1 - Niveau 1
              <div className="ml-4 bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                <Trophy className="text-yellow-600 mr-1" size={16} />
                <span className="text-sm font-medium text-yellow-800">{gameState.sessionCode}</span>
              </div>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section gauche - Plateau et contrôles */}
            <div className="space-y-6">
              {/* Barre de progression */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600">Progression</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 dynamic-progress-bar"
                    data-progress={gameState.currentQuestion / gameState.totalQuestions}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {gameState.currentQuestion} / {gameState.totalQuestions}
                </span>
              </div>

              {/* Plateau 3D */}
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 h-[400px]">
                <Canvas
                  camera={{ position: [0, 2, 3], fov: 50 }}
                  shadows
                  className="w-full h-full rounded-lg"
                >
                  <Suspense fallback={null}>
                    <PlatformScene
                      marbles={marbles}
                      onMarbleClick={handleMarbleClick}
                    />
                  </Suspense>
                </Canvas>
              </div>

              {/* Compteurs et contrôles */}
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-600">
                  Question: {gameState.currentQuestion}/{gameState.totalQuestions}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Score: {gameState.score}/{gameState.maxScore}
                </div>
              </div>

              {/* Zone de saisie */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getInputLabel()}
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="?"
                    onKeyPress={(e) => e.key === 'Enter' && handleValidation()}
                  />
                  <button
                    onClick={handleValidation}
                    disabled={!inputValue}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    title="Valider la réponse"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>

            {/* Section droite - Bulle de dialogue et personnage */}
            <div className="space-y-6">
              {/* Bulle de dialogue */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 relative">
                <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-blue-200"></div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {getCurrentInstruction()}
                </p>
              </div>

              {/* Personnage 3D */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 h-[400px]">
                <Canvas
                  camera={{ position: [0, 0, 2.5], fov: 50 }}
                  shadows
                  className="w-full h-full rounded-lg"
                >
                  <Suspense fallback={null}>
                    <TeacherScene expression={teacherExpression} />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-4">© 2025 CEREDIS - Renouveau Pédagogique</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-blue-600">Mentions légales</a>
              <a href="#" className="hover:text-blue-600">Politique de confidentialité</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GamePage;
