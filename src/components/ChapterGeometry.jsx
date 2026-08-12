import { useMemo } from 'react';
import * as THREE from 'three';

const geometries = {
  pyramid: new THREE.ConeGeometry(1.2, 2, 4),
  sphere: new THREE.SphereGeometry(1.2, 32, 32),
  torus: new THREE.TorusGeometry(0.9, 0.35, 16, 64),
  icosahedron: new THREE.IcosahedronGeometry(1.2, 1),
  box: new THREE.BoxGeometry(1.5, 1.5, 1.5),
  torusKnot: new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16),
  dodecahedron: new THREE.DodecahedronGeometry(1.1, 1),
  octahedron: new THREE.OctahedronGeometry(1.2, 0),
};

const geometryKeys = Object.keys(geometries);

export function getGeometry(key) {
  return geometries[key] || geometries.icosahedron;
}

export default function ChapterGeometry({ geometryKey, color, accentColor, scrollProgress, rotationSpeed = 0.3 }) {
  const geometry = useMemo(() => getGeometry(geometryKey), [geometryKey]);

  const meshRef = { current: null };
  const wireRef = { current: null };
  const ringRef = { current: null };

  // Pre-compute ring positions
  const ringPositions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const radius = 2.2;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.4;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  // Use pulse from scroll + time in Scene3D useFrame
  // This component is wrapped in a group that rotates

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          emissive={accentColor}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef} geometry={geometry} scale={[1.15, 1.15, 1.15]}>
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting ring */}
      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ringPositions, 3]}
            count={200}
            array={ringPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={accentColor}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}
