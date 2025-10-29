import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Group } from 'three';

const ANIMATION_MAP = {
  idle: [
    'Standing_Idle',
    'Standing_Idle_01',
    'Standing_Idle_02',
    'Standing_Idle_03',
    'Standing_Idle_04',
    'Standing_Idle_05',
  ],
  instructions: [
    'Talking_Instructions_01',
    'Talking_Instructions_02',
    'Talking_Instructions_03',
  ],
  encourage: [
    'Talking_Encourage_01',
    'Talking_Encourage_02',
    'Talking_Encourage_04',
    'Talking_Encourage_05',
  ],
  dance: [
    'Dance_01',
    'Dance_02',
    'Dance_03',
    'Dance_04',
    'Dance_05',
  ],
} as const;

type TeacherState = {
  expression?: 'celebrating' | 'encouraging' | 'talking';
};

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface TeacherAvatarProps {
  teacherState?: TeacherState;
}

// Squelette du composant TeacherAvatar pour la 3D
export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ teacherState }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF('/models/teacher.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    let animKey = 'idle';
    if (teacherState?.expression === 'celebrating') animKey = 'dance';
    else if (teacherState?.expression === 'encouraging') animKey = 'encourage';
    else if (teacherState?.expression === 'talking') animKey = 'instructions';
    // Par défaut : idle
    const animList = ANIMATION_MAP[animKey as keyof typeof ANIMATION_MAP];
    const animName = pickRandom(animList);
    // Stop all, play one
    Object.values(actions ?? {}).forEach(action => action?.stop?.());
    const selectedAction = actions?.[animName];
    selectedAction?.reset()?.fadeIn(0.2)?.play();
  }, [teacherState, actions]);

  return (
    <group ref={group} position={[1.8, 0.1, 0]} scale={[0.7, 0.7, 0.7]}>
      <primitive object={scene} />
    </group>
  );
};

export default TeacherAvatar;
