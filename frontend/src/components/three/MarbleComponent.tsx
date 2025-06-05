import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useXAPITracking } from '@/hooks/useXAPITracking';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { Vector3 } from 'three';
import { MarbleInteraction } from '@/types/analytics';

interface MarbleProps {
  position: Vector3;
  color: 'red' | 'blue';
  isClickable?: boolean;
  isHighlighted?: boolean;
  marbleId: string;
  onClick?: (id: string) => void;
}

export const MarbleComponent = ({
  position,
  color,
  isClickable = true,
  isHighlighted = false,
  marbleId,
  onClick
}: MarbleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { trackMarbleInteraction } = useXAPITracking();
  const [clickStart, setClickStart] = useState<number>(0);
  const analyticsStore = useAnalyticsStore();

  // Animation avec react-spring
  const { scale } = useSpring({
    scale: isHighlighted ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  // Suivi des interactions
  const handlePointerDown = () => {
    if (!isClickable) return;
    setClickStart(Date.now());
  };

  const handlePointerUp = async () => {
    if (!isClickable || !meshRef.current) return;

    const duration = Date.now() - clickStart;
    const worldPosition = meshRef.current.getWorldPosition(new Vector3());

    // Tracking xAPI de l'interaction
    const interaction: MarbleInteraction = {
      marbleId,
      color,
      position: worldPosition,
      duration,
      interactionType: 'click'
    };

    await trackMarbleInteraction(interaction);
    analyticsStore.actions.updateLastActivity();

    // Estimation de la charge cognitive basée sur le temps de réponse
    const cognitiveLoad = Math.min(duration / 5000, 1); // Max 5 secondes
    analyticsStore.actions.setCognitiveLoad(cognitiveLoad);

    if (onClick) onClick(marbleId);
  };

  // Animation continue subtile
  useFrame((state) => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.01;
      const hoverHeight = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.position.y = position.y + hoverHeight;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={color === 'red' ? '#EF4444' : '#3B82F6'}
        roughness={0.1}
        metalness={0.8}
      />
    </animated.mesh>
  );
};
