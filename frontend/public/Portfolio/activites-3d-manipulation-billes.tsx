import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { Volume2, VolumeX, Home, RotateCcw, Check, X } from 'lucide-react';

// Types TypeScript pour les activités 3D
interface MarbleData {
  id: string;
  position: [number, number, number];
  color: 'red' | 'blue';
  isVisible: boolean;
  isClickable: boolean;
  isHighlighted: boolean;
  clickCount: number;
}

interface ActivitySession {
  id: string;
  type: 'composition' | 'decomposition';
  marbleConfiguration: {
    red: number;
    blue: number;
    total: number;
  };
  currentPhase: 'counting' | 'input' | 'questioning' | 'verification';
  responses: {
    redCount?: number;
    blueCount?: number;
    totalCount?: number;
    finalAnswer?: number;
  };
  isCompleted: boolean;
  isCorrect?: boolean;
  startTime: number;
  interactions: ActivityInteraction[];
}

interface ActivityInteraction {
  timestamp: number;
  action: 'MARBLE_CLICK' | 'NUMBER_INPUT' | 'VALIDATION' | 'PHASE_TRANSITION';
  marbleId?: string;
  value?: number;
  phase?: string;
}

interface TeacherState {
  currentExpression: 'neutral' | 'encouraging' | 'questioning' | 'celebrating';
  currentDialogue: string;
  isAnimating: boolean;
}

interface GameSession {
  sessionId: string;
  studentName: string;
  currentActivityIndex: number;
  activities: ActivitySession[];
  score: {
    correct: number;
    total: number;
  };
  startTime: number;
}

// Composant Bille 3D
const Marble3D: React.FC<{
  marble: MarbleData;
  onClick: (marbleId: string) => void;
}> = ({ marble, onClick }) => {
  const meshRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Animation de flottement subtile
      meshRef.current.position.y = marble.position[1] + Math.sin(state.clock.elapsedTime * 2 + parseFloat(marble.id)) * 0.02;
      
      // Animation de mise en évidence
      if (marble.isHighlighted) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      } else {
        meshRef.current.scale.setScalar(isHovered ? 1.1 : 1);
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
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={marble.color === 'red' ? '#EF4444' : '#3B82F6'}
        metalness={0.3}
        roughness={0.2}
        transparent={marble.clickCount > 0}
        opacity={marble.clickCount > 0 ? 0.7 : 1}
      />
      {marble.isHighlighted && (
        <pointLight
          color={marble.color === 'red' ? '#FFB3B3' : '#B3D4FF'}
          intensity={0.5}
          distance={0.5}
        />
      )}
    </Sphere>
  );
};

// Composant Carton pour cacher les billes
const HidingBox: React.FC<{
  isVisible: boolean;
  position: [number, number, number];
}> = ({ isVisible, position }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (!isVisible) return null;

  return (
    <Box
      ref={meshRef}
      args={[1.2, 0.6, 0.8]}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#8B7355" roughness={0.8} />
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ?
      </Text>
    </Box>
  );
};

// Composant Personnage Enseignant 3D (simplifié)
const VirtualTeacher: React.FC<{
  teacherState: TeacherState;
}> = ({ teacherState }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Animation de respiration
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.y = breathe;
      
      // Animation d'expression
      if (teacherState.isAnimating) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
  });

  const getTeacherColor = () => {
    switch (teacherState.currentExpression) {
      case 'encouraging': return '#4ADE80';
      case 'questioning': return '#60A5FA';
      case 'celebrating': return '#FBBF24';
      default: return '#8B7355';
    }
  };

  return (
    <group position={[-2, 0, 0]}>
      {/* Corps du personnage */}
      <Box
        ref={meshRef}
        args={[0.4, 0.8, 0.3]}
        position={[0, 0.4, 0]}
        castShadow
      >
        <meshStandardMaterial color={getTeacherColor()} />
      </Box>
      
      {/* Tête */}
      <Sphere args={[0.25, 32, 32]} position={[0, 1, 0]} castShadow>
        <meshStandardMaterial color="#FFE4B5" />
      </Sphere>
      
      {/* Yeux */}
      <Sphere args={[0.03, 16, 16]} position={[-0.08, 1.05, 0.2]}>
        <meshBasicMaterial color="black" />
      </Sphere>
      <Sphere args={[0.03, 16, 16]} position={[0.08, 1.05, 0.2]}>
        <meshBasicMaterial color="black" />
      </Sphere>
      
      {/* Bulle de dialogue */}
      {teacherState.currentDialogue && (
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.08}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {teacherState.currentDialogue}
        </Text>
      )}
    </group>
  );
};

// Composant Plateau de jeu
const GameTable: React.FC = () => {
  return (
    <Plane
      args={[4, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
    >
      <meshStandardMaterial color="#D4A574" roughness={0.8} />
    </Plane>
  );
};

// Composant principal de la scène 3D
const Scene3D: React.FC<{
  currentActivity: ActivitySession;
  onMarbleClick: (marbleId: string) => void;
  teacherState: TeacherState;
}> = ({ currentActivity, onMarbleClick, teacherState }) => {
  const [marbles, setMarbles] = useState<MarbleData[]>([]);

  // Générer les billes selon la configuration
  useEffect(() => {
    const newMarbles: MarbleData[] = [];
    const { red, blue } = currentActivity.marbleConfiguration;
    
    // Billes rouges
    for (let i = 0; i < red; i++) {
      newMarbles.push({
        id: `red-${i}`,
        position: [
          -1.5 + (i % 3) * 0.4,
          0.08,
          -0.5 + Math.floor(i / 3) * 0.3
        ],
        color: 'red',
        isVisible: currentActivity.currentPhase !== 'questioning',
        isClickable: currentActivity.currentPhase === 'counting',
        isHighlighted: false,
        clickCount: 0
      });
    }
    
    // Billes bleues
    for (let i = 0; i < blue; i++) {
      newMarbles.push({
        id: `blue-${i}`,
        position: [
          0.5 + (i % 3) * 0.4,
          0.08,
          -0.5 + Math.floor(i / 3) * 0.3
        ],
        color: 'blue',
        isVisible: currentActivity.currentPhase !== 'questioning',
        isClickable: currentActivity.currentPhase === 'counting',
        isHighlighted: false,
        clickCount: 0
      });
    }
    
    setMarbles(newMarbles);
  }, [currentActivity]);

  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} />

      {/* Plateau de jeu */}
      <GameTable />

      {/* Billes */}
      {marbles.map((marble) => (
        <Marble3D
          key={marble.id}
          marble={marble}
          onClick={onMarbleClick}
        />
      ))}

      {/* Carton pour cacher les billes */}
      <HidingBox
        isVisible={currentActivity.currentPhase === 'questioning'}
        position={[0, 0.3, 0]}
      />

      {/* Personnage enseignant */}
      <VirtualTeacher teacherState={teacherState} />

      {/* Contrôles de caméra */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={false}
      />
    </>
  );
};

// Composant Interface utilisateur
const ActivityUI: React.FC<{
  currentActivity: ActivitySession;
  teacherState: TeacherState;
  onNumberInput: (value: number, type: 'red' | 'blue' | 'total' | 'final') => void;
  onValidate: () => void;
  onNextPhase: () => void;
  gameSession: GameSession;
}> = ({ currentActivity, teacherState, onNumberInput, onValidate, onNextPhase, gameSession }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'red' | 'blue' | 'total' | 'final'>('red');

  const getCurrentInstruction = () => {
    const { type, currentPhase } = currentActivity;
    
    switch (currentPhase) {
      case 'counting':
        if (type === 'composition') {
          if (!currentActivity.responses.redCount) {
            setInputType('red');
            return "Compte les billes rouges et écris le nombre";
          } else if (!currentActivity.responses.blueCount) {
            setInputType('blue');
            return "Maintenant compte les billes bleues";
          }
        } else {
          if (!currentActivity.responses.totalCount) {
            setInputType('total');
            return "Compte toutes les billes et écris le nombre total";
          } else if (!currentActivity.responses.redCount) {
            setInputType('red');
            return "Maintenant compte seulement les billes rouges";
          }
        }
        break;
      case 'questioning':
        setInputType('final');
        if (type === 'composition') {
          return `Tu as compté ${currentActivity.responses.redCount} billes rouges et ${currentActivity.responses.blueCount} billes bleues. Combien cela fait-il en tout ?`;
        } else {
          return `Tu as compté ${currentActivity.responses.totalCount} billes en tout, et parmi elles ${currentActivity.responses.redCount} billes rouges. Combien y a-t-il de billes bleues ?`;
        }
      case 'verification':
        return "Regarde si tu avais raison !";
    }
    return "";
  };

  const handleSubmit = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 0) {
      onNumberInput(value, inputType);
      setInputValue('');
    }
  };

  const canProceed = () => {
    const { type, currentPhase, responses } = currentActivity;
    
    if (currentPhase === 'counting') {
      if (type === 'composition') {
        return responses.redCount !== undefined && responses.blueCount !== undefined;
      } else {
        return responses.totalCount !== undefined && responses.redCount !== undefined;
      }
    } else if (currentPhase === 'questioning') {
      return responses.finalAnswer !== undefined;
    }
    return false;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Interface en haut */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-800">
                Activité {gameSession.currentActivityIndex + 1}/5
              </h2>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-800">
                  {currentActivity.type === 'composition' ? 'Addition' : 'Soustraction'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-lg font-bold text-blue-600">
                {gameSession.score.correct}/{gameSession.score.total}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-medium text-center">
              {getCurrentInstruction()}
            </p>
          </div>

          {(currentActivity.currentPhase === 'counting' || currentActivity.currentPhase === 'questioning') && (
            <div className="flex items-center space-x-4 justify-center">
              <input
                type="number"
                min="0"
                max="20"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tape le nombre"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Valider
              </button>
            </div>
          )}

          {canProceed() && currentActivity.currentPhase !== 'verification' && (
            <div className="text-center mt-4">
              <button
                onClick={onNextPhase}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Résultats de comptage */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-2">Tes réponses :</h3>
          <div className="space-y-1 text-sm">
            {currentActivity.responses.redCount !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Billes rouges : {currentActivity.responses.redCount}</span>
              </div>
            )}
            {currentActivity.responses.blueCount !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Billes bleues : {currentActivity.responses.blueCount}</span>
              </div>
            )}
            {currentActivity.responses.totalCount !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Total : {currentActivity.responses.totalCount}</span>
              </div>
            )}
            {currentActivity.responses.finalAnswer !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Réponse finale : {currentActivity.responses.finalAnswer}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback de vérification */}
      {currentActivity.currentPhase === 'verification' && currentActivity.isCompleted && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              currentActivity.isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {currentActivity.isCorrect ? (
                <Check className="text-white" size={32} />
              ) : (
                <X className="text-white" size={32} />
              )}
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              currentActivity.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentActivity.isCorrect ? 'Bravo !' : 'Essaie encore !'}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentActivity.isCorrect 
                ? 'Tu as trouvé la bonne réponse !' 
                : 'Ce n\'est pas grave, continue à apprendre !'
              }
            </p>
            <button
              onClick={onNextPhase}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Activité suivante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal des activités 3D
const Activities3D: React.FC<{
  studentName: string;
  onExit: () => void;
}> = ({ studentName, onExit }) => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teacherState, setTeacherState] = useState<TeacherState>({
    currentExpression: 'neutral',
    currentDialogue: 'Bonjour ! Prêt à jouer avec les billes ?',
    isAnimating: false
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialiser une session de jeu
  useEffect(() => {
    const newSession: GameSession = {
      sessionId: `session_${Date.now()}`,
      studentName,
      currentActivityIndex: 0,
      activities: generateActivities(),
      score: { correct: 0, total: 0 },
      startTime: Date.now()
    };
    setGameSession(newSession);
  }, [studentName]);

  // Générer 5 activités aléatoirement
  const generateActivities = (): ActivitySession[] => {
    const activities: ActivitySession[] = [];
    
    for (let i = 0; i < 5; i++) {
      const type = Math.random() > 0.5 ? 'composition' : 'decomposition';
      const red = Math.floor(Math.random() * 5) + 1; // 1-5
      const blue = Math.floor(Math.random() * 5) + 1; // 1-5
      
      activities.push({
        id: `activity_${i}`,
        type,
        marbleConfiguration: {
          red,
          blue,
          total: red + blue
        },
        currentPhase: 'counting',
        responses: {},
        isCompleted: false,
        startTime: Date.now(),
        interactions: []
      });
    }
    
    return activities;
  };

  const getCurrentActivity = (): ActivitySession | null => {
    if (!gameSession || gameSession.currentActivityIndex >= gameSession.activities.length) {
      return null;
    }
    return gameSession.activities[gameSession.currentActivityIndex];
  };

  const handleMarbleClick = (marbleId: string) => {
    const currentActivity = getCurrentActivity();
    if (!currentActivity || currentActivity.currentPhase !== 'counting') return;

    // Enregistrer l'interaction
    const interaction: ActivityInteraction = {
      timestamp: Date.now(),
      action: 'MARBLE_CLICK',
      marbleId
    };

    setGameSession(prev => {
      if (!prev) return prev;
      const updatedActivities = [...prev.activities];
      updatedActivities[prev.currentActivityIndex].interactions.push(interaction);
      
      return {
        ...prev,
        activities: updatedActivities
      };
    });
  };

  const handleNumberInput = (value: number, type: 'red' | 'blue' | 'total' | 'final') => {
    if (!gameSession) return;

    setGameSession(prev => {
      if (!prev) return prev;
      
      const updatedActivities = [...prev.activities];
      const currentActivity = updatedActivities[prev.currentActivityIndex];
      
      // Enregistrer la réponse
      if (type === 'final') {
        currentActivity.responses.finalAnswer = value;
      } else {
        currentActivity.responses[`${type}Count`] = value;
      }
      
      // Enregistrer l'interaction
      currentActivity.interactions.push({
        timestamp: Date.now(),
        action: 'NUMBER_INPUT',
        value
      });
      
      return {
        ...prev,
        activities: updatedActivities
      };
    });

    // Mettre à jour l'état du professeur
    setTeacherState({
      currentExpression: 'encouraging',
      currentDialogue: 'Très bien ! Continue comme ça.',
      isAnimating: true
    });
  };

  const handleValidate = () => {
    // Logique de validation sera implémentée
  };

  const handleNextPhase = () => {
    if (!gameSession) return;

    const currentActivity = getCurrentActivity();
    if (!currentActivity) return;

    setGameSession(prev => {
      if (!prev) return prev;
      
      const updatedActivities = [...prev.activities];
      const activity = updatedActivities[prev.currentActivityIndex];
      
      if (activity.currentPhase === 'counting') {
        activity.currentPhase = 'questioning';
        setTeacherState({
          currentExpression: 'questioning',
          currentDialogue: 'Maintenant, réfléchis bien à la question...',
          isAnimating: true
        });
      } else if (activity.currentPhase === 'questioning') {
        activity.currentPhase = 'verification';
        
        // Vérifier la réponse
        const { type, responses, marbleConfiguration } = activity;
        let isCorrect = false;
        
        if (type === 'composition') {
          isCorrect = responses.finalAnswer === marbleConfiguration.total;
        } else {
          isCorrect = responses.finalAnswer === marbleConfiguration.blue;
        }
        
        activity.isCorrect = isCorrect;
        activity.isCompleted = true;
        
        if (isCorrect) {
          prev.score.correct += 1;
        }
        prev.score.total += 1;
        
        setTeacherState({
          currentExpression: isCorrect ? 'celebrating' : 'encouraging',
          currentDialogue: isCorrect ? 'Fantastique ! Tu as trouvé !' : 'Pas grave, tu feras mieux la prochaine fois !',
          isAnimating: true
        });
      } else if (activity.currentPhase === 'verification') {
        // Passer à l'activité suivante
        if (prev.currentActivityIndex < prev.activities.length - 1) {
          return {
            ...prev,
            currentActivityIndex: prev.currentActivityIndex + 1,
            activities: updatedActivities
          };
        } else {
          // Session terminée
          alert(`Session terminée ! Score : ${prev.score.correct}/${prev.score.total}`);
          onExit();
        }
      }
      
      return {
        ...prev,
        activities: updatedActivities
      };
    });
  };

  const currentActivity = getCurrentActivity();

  if (!gameSession || !currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Préparation de tes activités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Contrôles en haut à droite */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/90 transition-colors"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button
          onClick={() => {
            if (confirm('Veux-tu vraiment quitter l\'activité ?')) {
              onExit();
            }
          }}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/90 transition-colors"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Scène 3D */}
      <Canvas
        camera={{ position: [0, 3, 4], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Scene3D
            currentActivity={currentActivity}
            onMarbleClick={handleMarbleClick}
            teacherState={teacherState}
          />
        </Suspense>
      </Canvas>

      {/* Interface utilisateur overlay */}
      <ActivityUI
        currentActivity={currentActivity}
        teacherState={teacherState}
        onNumberInput={handleNumberInput}
        onValidate={handleValidate}
        onNextPhase={handleNextPhase}
        gameSession={gameSession}
      />
    </div>
  );
};

export default Activities3D;