import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { ProductModel } from '../3d/ProductModel';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { Product } from '../../types';

interface ProductViewerProps {
  product: Product;
  onClose: () => void;
}

export function ProductViewer({ product, onClose }: ProductViewerProps) {
  const { language, addToCart, viewMode } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const name = language === 'en' ? product.name : product.name_fr;
  const description = language === 'en' ? product.description : product.description_fr;
  const categoryName = language === 'en' ? product.category?.name : product.category?.name_fr;

  const translations = {
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      price: 'Price',
      category: 'Category',
      stock: 'In Stock',
      outOfStock: 'Out of Stock',
      description: 'Description',
      view3D: '3D View',
      specifications: 'Specifications',
    },
    fr: {
      addToCart: 'Ajouter au panier',
      quantity: 'Quantité',
      price: 'Prix',
      category: 'Catégorie',
      stock: 'En stock',
      outOfStock: 'Rupture de stock',
      description: 'Description',
      view3D: 'Vue 3D',
      specifications: 'Caractéristiques',
    }
  };

  const t = translations[language];

  const handleAddToCart = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product, quantity);
    setLoading(false);
    onClose();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 3D Viewer / Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {viewMode === '3d' && product.model_url ? (
          <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <Environment preset="studio" />
            
            <ProductModel 
              product={product}
              position={[0, 0, 0]}
              scale={1.5}
            />
            
            <OrbitControls 
              enableZoom={true}
              enablePan={false}
              minDistance={2}
              maxDistance={5}
            />
          </Canvas>
        ) : (
          <img
            src={product.image_url}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/images/placeholder-product.jpg';
            }}
          />
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl font-bold text-blue-600">
              {product.price.toLocaleString()} FCFA
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} ${t.stock}` : t.outOfStock}
            </span>
          </div>

          {categoryName && (
            <p className="text-gray-600 mb-4">
              <span className="font-medium">{t.category}:</span> {categoryName}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">{t.description}</h3>
          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-medium">{t.quantity}:</span>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="px-4 py-2 font-medium min-w-12 text-center">
                {quantity}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              loading={loading}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{t.addToCart}</span>
            </Button>

            <div className="text-center text-sm text-gray-600">
              Total: {(product.price * quantity).toLocaleString()} FCFA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}