import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export function AnimatedBackground() {
  const { colorTheme } = useStore();
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const getThemeColor = () => {
    const colors = {
      blue: new THREE.Color('#3b82f6'),
      green: new THREE.Color('#10b981'),
      purple: new THREE.Color('#8b5cf6'),
      orange: new THREE.Color('#f59e0b'),
      red: new THREE.Color('#ef4444'),
    };
    return colors[colorTheme];
  };

  // Create floating particles
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    const color = getThemeColor();
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      particlesRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2) * 15,
            Math.cos(i * 3) * 8 + 5,
            Math.cos(i * 2) * 15
          ]}
          rotation={[i * 0.5, i * 0.3, i * 0.7]}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={getThemeColor()}
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      ))}
      
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Rotating rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`ring-${i}`}
          position={[0, 2 + i * 2, -10]}
          rotation={[Math.PI / 2, 0, i * Math.PI / 3]}
        >
          <torusGeometry args={[3 + i, 0.1, 8, 32]} />
          <meshStandardMaterial
            color={getThemeColor()}
            transparent
            opacity={0.2}
            emissive={getThemeColor()}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}