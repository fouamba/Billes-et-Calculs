import React, { useState, useEffect } from 'react';
import ClassroomScene from '@/components/three/ClassroomScene';
import { SpeechService } from '@/utils/SpeechService';

// Types d'activité (à compléter selon le cahier des charges)
export type ActivityPhase = 'counting' | 'questioning' | 'verification';

export interface Activity3DConfig {
  type: 'composition' | 'decomposition';
  red: number;
  blue: number;
  total: number;
}

function generateActivity(type: 'composition' | 'decomposition', min = 2, max = 7): Activity3DConfig {
  if (type === 'composition') {
    const red = Math.floor(Math.random() * (max - min + 1)) + min;
    const blue = Math.floor(Math.random() * (max - min + 1)) + min;
    return { type, red, blue, total: red + blue };
  } else {
    const total = Math.floor(Math.random() * (max - min + 1)) + min + 2;
    const red = Math.floor(Math.random() * (total - 1)) + 1;
    const blue = total - red;
    return { type, red, blue, total };
  }
}

// Ajout d'un système adaptatif de difficulté
function getNextRange(successRate: number, currentRange: [number, number]): [number, number] {
  if (successRate >= 0.8 && currentRange[1] < 10) {
    // Augmenter la difficulté
    return [currentRange[0] + 1, currentRange[1] + 1];
  } else if (successRate < 0.5 && currentRange[0] > 1) {
    // Diminuer la difficulté
    return [currentRange[0] - 1, currentRange[1] - 1];
  }
  return currentRange;
}

// Sélection d'une voix féminine française pour la synthèse vocale
function speakWithFemaleVoice(text: string, options?: { rate?: number; pitch?: number; volume?: number; onEnd?: () => void }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  let selectedVoice = null;
  const voices = synth.getVoices();
  // Privilégier une voix féminine française
  selectedVoice = voices.find(v => v.lang.startsWith('fr') && v.name.toLowerCase().includes('fem'))
    || voices.find(v => v.lang.startsWith('fr') && v.gender === 'female')
    || voices.find(v => v.lang.startsWith('fr'))
    || voices[0];
  const utter = new window.SpeechSynthesisUtterance(text);
  if (selectedVoice) utter.voice = selectedVoice;
  if (options?.rate) utter.rate = options.rate;
  if (options?.pitch) utter.pitch = options.pitch;
  if (options?.volume) utter.volume = options.volume;
  utter.lang = 'fr-FR';
  if (options?.onEnd) utter.onend = options.onEnd;
  synth.speak(utter);
}

export default function Activity3DManager() {
  const [range, setRange] = useState<[number, number]>([2, 7]);
  const [activities, setActivities] = useState<Activity3DConfig[] | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<ActivityPhase>('counting');
  const [teacherState, setTeacherState] = useState({ expression: 'neutral', animation: 'Idle' });
  const [inputValue, setInputValue] = useState('');
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [successes, setSuccesses] = useState(0);
  const [trace, setTrace] = useState<any[]>([]);

  // Génération des activités uniquement côté client
  useEffect(() => {
    setActivities([
      generateActivity('composition', range[0], range[1]),
      generateActivity('decomposition', range[0], range[1]),
      generateActivity('composition', range[0], range[1]),
      generateActivity('decomposition', range[0], range[1]),
      generateActivity('composition', range[0], range[1]),
    ]);
    setCurrentIdx(0);
    setScore(0);
    setSuccesses(0);
    setPhase('counting');
    setUserAnswer(null);
    setFeedback(null);
    setInputValue('');
    setTeacherState({ expression: 'neutral', animation: 'Idle' });
    setFinished(false);
    setTrace([]);
  }, [range]);

  if (!activities) {
    return <div className="w-full max-w-3xl h-[480px] flex items-center justify-center bg-white rounded-lg shadow-lg">Préparation de l'activité...</div>;
  }
  const activity = activities[currentIdx];

  // Gestion du passage de phase (à compléter)
  const handleNextPhase = () => {
    if (phase === 'counting') setPhase('questioning');
    else if (phase === 'questioning') setPhase('verification');
    else {
      // Vérification terminée, passer à l'activité suivante ou terminer
      if (currentIdx < activities.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setPhase('counting');
        setUserAnswer(null);
        setFeedback(null);
        setInputValue('');
        setTeacherState({ expression: 'neutral', animation: 'Idle' });
      } else {
        // Calcul du taux de réussite
        const successRate = successes / activities.length;
        const newRange = getNextRange(successRate, range);
        setRange(newRange);
        // Générer une nouvelle série d'activités avec la nouvelle difficulté
        setActivities([
          generateActivity('composition', newRange[0], newRange[1]),
          generateActivity('decomposition', newRange[0], newRange[1]),
          generateActivity('composition', newRange[0], newRange[1]),
          generateActivity('decomposition', newRange[0], newRange[1]),
          generateActivity('composition', newRange[0], newRange[1]),
        ]);
        setCurrentIdx(0);
        setScore(0);
        setSuccesses(0);
        setPhase('counting');
        setUserAnswer(null);
        setFeedback(null);
        setInputValue('');
        setTeacherState({ expression: 'neutral', animation: 'Idle' });
        setFinished(false);
      }
    }
  };

  // Gestion de la saisie utilisateur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Validation de la réponse utilisateur
  const handleValidate = () => {
    const answer = parseInt(inputValue);
    if (!isNaN(answer)) {
      setUserAnswer(answer);
      if (phase === 'questioning') {
        let correct = false;
        let feedbackText = '';
        let teacherAnim = 'encouraging';
        if (activity.type === 'composition') {
          correct = answer === activity.total;
        } else {
          correct = answer === activity.blue;
        }
        if (correct) {
          feedbackText = 'Bravo ! Bonne réponse.';
          teacherAnim = 'celebrating';
          setFeedback(feedbackText);
          setTeacherState({ expression: teacherAnim, animation: 'Dance' });
          setScore(s => s + 1);
          setSuccesses(s => s + 1);
        } else {
          feedbackText = 'Essaie encore !';
          teacherAnim = 'encouraging';
          setFeedback(feedbackText);
          setTeacherState({ expression: teacherAnim, animation: 'Encourage' });
        }
        // Synthèse vocale féminine du feedback
        speakWithFemaleVoice(feedbackText, { rate: 1, pitch: 1.1 });
        // Tracer la réponse
        setTrace(t => [...t, {
          activityIdx: currentIdx,
          type: activity.type,
          red: activity.red,
          blue: activity.blue,
          total: activity.total,
          userAnswer: answer,
          correct,
          phase,
          timestamp: Date.now()
        }]);
      }
    }
  };

  // Préparation des billes pour la scène 3D
  const marbles = {
    visible: phase !== 'questioning'
      ? [
          ...Array(activity.red).fill(0).map((_, i) => ({ id: `r${i}`, position: [-0.5 + i * 0.2, 0.15, 0], color: 'red', isHighlighted: false })),
          ...Array(activity.blue).fill(0).map((_, i) => ({ id: `b${i}`, position: [0.5 + i * 0.2, 0.15, 0], color: 'blue', isHighlighted: false })),
        ]
      : [],
    hidden: phase === 'questioning' ? [{ id: 'carton', position: [0, 0.3, 0] }] : [],
  };

  if (finished) {
    return (
      <div className="w-full max-w-3xl h-[480px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-4">Session terminée !</div>
        <div className="text-lg mb-2">Score : {score} / {activities.length}</div>
        <div className="text-base mb-2">Difficulté actuelle : {range[0]} à {range[1]} billes</div>
        <div className="text-sm text-gray-500 mb-4">Traces (JSON) :
          <pre className="bg-gray-100 p-2 rounded max-h-32 overflow-auto text-xs">{JSON.stringify(trace, null, 2)}</pre>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => window.location.reload()}>Rejouer</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl h-[480px] bg-gray-100 rounded-lg shadow-lg p-2 relative">
      <div className="absolute top-4 left-4 text-blue-700 font-bold">
        {activity.type === 'composition' ? 'Addition (composition)' : 'Soustraction (décomposition)'}<br/>
        Difficulté : {range[0]} à {range[1]} billes
      </div>
      <div className="absolute top-4 right-4 text-blue-700 font-bold">Exercice {currentIdx + 1} / {activities.length} | Score : {score}</div>
      <ClassroomScene
        marbles={marbles}
        teacherState={teacherState}
        currentPhase={phase}
        onMarbleClick={() => {}}
        onPhaseComplete={handleNextPhase}
      />
      <div className="absolute bottom-4 left-4 bg-white/90 rounded p-4 shadow min-w-[260px]">
        {phase === 'questioning' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 text-lg"
              placeholder="Ta réponse"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleValidate}>
              Valider
            </button>
          </div>
        )}
        {feedback && <div className={`mt-2 font-bold ${feedback.startsWith('Bravo') ? 'text-green-700' : 'text-orange-700'}`}>{feedback}</div>}
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleNextPhase}>
          {phase === 'verification' ? (currentIdx < activities.length - 1 ? 'Exercice suivant' : 'Nouvelle série adaptée') : 'Passer à la phase suivante'}
        </button>
        <button className="mt-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setFinished(true)}>
          Quitter
        </button>
      </div>
    </div>
  );
}
