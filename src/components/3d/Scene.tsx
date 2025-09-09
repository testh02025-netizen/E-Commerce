import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import { ProductShelf } from './ProductShelf';
import { Cart3D } from './Cart3D';
import { LoadingSpinner3D } from './LoadingSpinner3D';
import { useStore } from '../../store/useStore';
import type { Product } from '../../types';

interface SceneProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  cameraPosition?: [number, number, number];
  showCart?: boolean;
}

export function Scene({ 
  products, 
  onProductClick, 
  cameraPosition = [0, 2, 8],
  showCart = true 
}: SceneProps) {
  const { language, getCartItemCount } = useStore();
  const controlsRef = useRef<any>();

  const handleProductClick = (product: Product) => {
    onProductClick(product);
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<LoadingSpinner3D />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.2} />

          {/* Environment */}
          <Environment preset="warehouse" />
          
          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>

          {/* Contact shadows for better ground connection */}
          <ContactShadows
            opacity={0.4}
            scale={30}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />

          {/* Welcome Text */}
          <Text
            position={[0, 4, -5]}
            fontSize={1}
            color="#2563eb"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {language === 'en' ? 'Welcome to 3D Shopping' : 'Bienvenue au Shopping 3D'}
          </Text>

          {/* Product Shelves */}
          <ProductShelf 
            products={products} 
            onProductClick={handleProductClick}
          />

          {/* 3D Cart */}
          {showCart && getCartItemCount() > 0 && (
            <Cart3D position={[6, 1, 2]} />
          )}

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}