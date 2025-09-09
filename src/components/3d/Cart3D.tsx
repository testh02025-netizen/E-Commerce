import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface Cart3DProps {
  position: [number, number, number];
  onCartClick?: () => void;
}

export function Cart3D({ position, onCartClick }: Cart3DProps) {
  const { getCartItemCount, language } = useStore();
  const cartRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const itemCount = getCartItemCount();

  useFrame((state) => {
    if (cartRef.current) {
      cartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      cartRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onCartClick?.();
  };

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  if (itemCount === 0) return null;

  return (
    <group
      ref={cartRef}
      position={position}
      scale={hovered ? 1.1 : 1}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Cart Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          roughness={0.3}
          metalness={0.7}
          emissive={hovered ? "#1e40af" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Cart Handle */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <torusGeometry args={[0.3, 0.05, 8, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Item count badge */}
      <mesh position={[0.4, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Count text */}
      <Text
        position={[0.4, 0.4, 0.16]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {itemCount > 99 ? '99+' : itemCount.toString()}
      </Text>

      {/* Cart label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {language === 'en' ? 'Shopping Cart' : 'Panier'}
      </Text>

      {/* Floating particles effect */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 2) * 0.8, 
          Math.cos(i * 3) * 0.3, 
          Math.sin(i * 4) * 0.5
        ]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}