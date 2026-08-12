import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ color, count = 600, spread = 20 }) {
  const pointsRef = useRef();
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.75;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos };
  }, [count, spread]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      if (pos[i * 3 + 1] > spread * 0.375) pos[i * 3 + 1] = -spread * 0.375;
      if (pos[i * 3 + 1] < -spread * 0.375) pos[i * 3 + 1] = spread * 0.375;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
