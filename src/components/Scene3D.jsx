import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import ParticleField from './ParticleField.jsx';
import ChapterGeometry from './ChapterGeometry.jsx';
import AmbientLighting from './AmbientLighting.jsx';

function SceneContent({ chapter, scrollProgress }) {
  const groupRef = useRef();
  const ringRef = useRef();

  useFrame((_state, delta) => {
    if (groupRef.current) {
      const baseSpeed = 0.3;
      groupRef.current.rotation.y += delta * baseSpeed;
      groupRef.current.rotation.x += delta * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
  });

  const { theme = 'dawn', color = '#f4a261', accentColor = '#e76f51', geometry = 'sphere' } = chapter;

  // Fog colors mapped to themes
  const fogColors = {
    dawn: '#1a0e05',
    pyramid: '#1a1408',
    duality: '#051210',
    multiplicity: '#120506',
    trap: '#0a0d0f',
    flight: '#141008',
    practices: '#051210',
    horizon: '#1a0e05',
    library: '#0a0d0f',
  };

  const fogColor = fogColors[theme] || '#0a0a0a';

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 8, 25]} />

      <AmbientLighting color={color} accentColor={accentColor} />

      <group ref={groupRef} position={[4, 0.5, 0]}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <ChapterGeometry
            geometryKey={geometry}
            color={color}
            accentColor={accentColor}
            scrollProgress={scrollProgress}
          />
        </Float>
      </group>

      <group ref={ringRef}>
        {/* Second outer ring */}
      </group>

      <ParticleField color={color} />
      <Environment preset="night" />
    </>
  );
}

export default function Scene3D({ chapter, scrollProgress }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent chapter={chapter} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
