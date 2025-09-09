import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function LoadingSpinner3D() {
  const spinnerRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.y += 0.05;
      spinnerRef.current.rotation.x += 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={spinnerRef}>
        {/* Outer ring */}
        <mesh>
          <torusGeometry args={[2, 0.2, 8, 16]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        
        {/* Inner ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.5, 0.15, 8, 16]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        
        {/* Center sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        Loading 3D Experience...
      </Text>
    </group>
  );
}