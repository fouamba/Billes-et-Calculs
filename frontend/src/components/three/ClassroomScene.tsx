import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import MarbleComponent from './MarbleComponent';
import TeacherAvatar from './TeacherAvatar';
import './ClassroomScene.css';

// Squelette du composant ClassroomScene pour la 3D
export default function ClassroomScene({ marbles, teacherState, currentPhase, onMarbleClick, onPhaseComplete }: any) {
  return (
    <div className="scene3d-container w-full h-full">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        {/* Lumière principale */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        {/* Plateau en bois */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, 0.15, 2]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
        {/* Billes visibles */}
        {marbles.visible.map((b: any, i: number) => (
          <MarbleComponent key={b.id} {...b} />
        ))}
        {/* Carton magique */}
        {marbles.hidden.length > 0 && (
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.2, 0.6, 0.8]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
        )}
        {/* Avatar enseignant 3D (chargé dès que le modèle sera dispo) */}
        <Suspense fallback={<Html center>Chargement avatar...</Html>}>
          <TeacherAvatar teacherState={teacherState} />
        </Suspense>
        {/* Contrôles de caméra adaptés enfants */}
        <OrbitControls enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2} maxDistance={6} minDistance={4} />
        {/* Environnement HDRI doux (optionnel) */}
        <Environment preset="sunset" background={false} />
      </Canvas>
    </div>
  );
};
