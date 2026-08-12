export default function AmbientLighting({ color, accentColor, intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.25 * intensity} color={color} />
      <pointLight
        position={[5, 5, 5]}
        intensity={1.2 * intensity}
        color={accentColor}
        distance={20}
      />
      <pointLight
        position={[-5, -3, -3]}
        intensity={0.6 * intensity}
        color={color}
        distance={15}
      />
      <directionalLight
        position={[0, 5, 2]}
        intensity={0.4 * intensity}
        color="#ffffff"
      />
    </>
  );
}
