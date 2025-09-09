import { useRef, useState, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import type { Product } from '../../types';
import * as THREE from 'three';

interface ProductModelProps {
  product: Product;
  position?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// Setup DRACO loader for compression
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

function Model3D({ product, scale = 1, ...props }: ProductModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load 3D model if available, otherwise use placeholder
  let gltf = null;
  try {
    if (product.model_url) {
      gltf = useLoader(GLTFLoader, product.model_url);
    }
  } catch (error) {
    console.warn(`Failed to load 3D model for ${product.name}:`, error);
  }

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.02 : 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + product.id.length) * 0.05;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
    props.onPointerOver?.();
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
    props.onPointerOut?.();
  };

  // If we have a 3D model, use it
  if (gltf) {
    return (
      <group
        ref={meshRef}
        {...props}
        scale={scale}
        onClick={props.onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={gltf.scene} />
      </group>
    );
  }

  // Fallback to geometric shapes based on category
  const getPlaceholderGeometry = () => {
    const categoryName = product.category?.name?.toLowerCase() || '';
    
    if (categoryName.includes('electronics')) {
      return <boxGeometry args={[0.8, 0.5, 0.3]} />;
    } else if (categoryName.includes('fashion')) {
      return <cylinderGeometry args={[0.3, 0.4, 0.8, 6]} />;
    } else if (categoryName.includes('home')) {
      return <sphereGeometry args={[0.4, 8, 6]} />;
    }
    
    return <boxGeometry args={[0.6, 0.6, 0.6]} />;
  };

  const getPlaceholderColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const index = product.id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <group
      ref={meshRef}
      {...props}
      scale={scale}
      onClick={props.onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh castShadow receiveShadow>
        {getPlaceholderGeometry()}
        <meshStandardMaterial 
          color={getPlaceholderColor()} 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glow effect when hovered */}
      {hovered && (
        <mesh scale={1.2}>
          {getPlaceholderGeometry()}
          <meshBasicMaterial 
            color={getPlaceholderColor()} 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

export function ProductModel(props: ProductModelProps) {
  return (
    <Suspense fallback={<PlaceholderModel {...props} />}>
      <Model3D {...props} />
    </Suspense>
  );
}

function PlaceholderModel({ product, scale = 1, ...props }: ProductModelProps) {
  return (
    <mesh {...props} scale={scale}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
}