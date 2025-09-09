import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { useStore } from '../../store/useStore';
import type { Product } from '../../types';
import * as THREE from 'three';

interface ProductShelfProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function ProductShelf({ products, onProductClick }: ProductShelfProps) {
  const { language } = useStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Gentle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  // Create shelf structure
  const shelfCount = Math.ceil(products.length / 3);
  const shelves = [];

  for (let i = 0; i < shelfCount; i++) {
    const shelfProducts = products.slice(i * 3, (i + 1) * 3);
    const yPos = 2 - i * 2;

    shelves.push(
      <group key={`shelf-${i}`} position={[0, yPos, 0]}>
        {/* Shelf surface */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 3]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>

        {/* Shelf back */}
        <mesh position={[0, 0.5, -1.4]} receiveShadow>
          <boxGeometry args={[8, 1, 0.2]} />
          <meshStandardMaterial color="#654321" />
        </mesh>

        {/* Products on shelf */}
        {shelfProducts.map((product, idx) => {
          const xPos = (idx - 1) * 2.5;
          return (
            <group key={product.id} position={[xPos, 0, 0]}>
              <ProductModel
                product={product}
                position={[0, 0, 0]}
                scale={hoveredProduct === product.id ? 1.1 : 1}
                onClick={() => onProductClick(product)}
                onPointerOver={() => setHoveredProduct(product.id)}
                onPointerOut={() => setHoveredProduct(null)}
              />
              
              {/* Product label */}
              <Text
                position={[0, -0.5, 0]}
                fontSize={0.15}
                color="#333"
                anchorX="center"
                anchorY="middle"
                maxWidth={2}
              >
                {language === 'en' ? product.name : product.name_fr}
                {'\n'}
                {product.price.toLocaleString()} FCFA
              </Text>
            </group>
          );
        })}

        {/* Shelf label */}
        <Text
          position={[-4, 1, -1.2]}
          fontSize={0.3}
          color="#2563eb"
          anchorX="left"
          anchorY="middle"
        >
          {language === 'en' ? `Shelf ${i + 1}` : `Étagère ${i + 1}`}
        </Text>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {shelves}
      
      {/* Main shelf structure */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 4]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </group>
  );
}