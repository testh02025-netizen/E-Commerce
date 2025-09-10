import type { Product, Category } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Electronics',
    name_fr: 'Électronique',
    description: 'Smartphones, laptops, tablets, accessories',
    description_fr: 'Smartphones, ordinateurs portables, tablettes, accessoires',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat_fashion',
    name: 'Fashion & Clothing',
    name_fr: 'Mode et Vêtements',
    description: 'Clothing, shoes, accessories, jewelry',
    description_fr: 'Vêtements, chaussures, accessoires, bijoux',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat_home',
    name: 'Home & Garden',
    name_fr: 'Maison et Jardin',
    description: 'Furniture, decor, tools, plants',
    description_fr: 'Meubles, décoration, outils, plantes',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat_beauty',
    name: 'Beauty & Personal Care',
    name_fr: 'Beauté et Soins Personnels',
    description: 'Cosmetics, skincare, fragrances, grooming',
    description_fr: 'Cosmétiques, soins de la peau, parfums, toilettage',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat_sports',
    name: 'Sports & Fitness',
    name_fr: 'Sports et Fitness',
    description: 'Exercise equipment, sportswear, outdoor gear',
    description_fr: 'Équipement d\'exercice, vêtements de sport, équipement de plein air',
    created_at: new Date().toISOString()
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod_smartphone_1',
    name: 'Samsung Galaxy A54 5G',
    name_fr: 'Samsung Galaxy A54 5G',
    description: 'Latest Android smartphone with 128GB storage, excellent camera, and 5G connectivity',
    description_fr: 'Dernier smartphone Android avec 128 Go de stockage, excellent appareil photo et connectivité 5G',
    price: 285000,
    category_id: 'cat_electronics',
    image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg'
    ],
    model_url: '/models/smartphone.glb',
    stock: 25,
    active: true,
    is_featured: true,
    discount_percentage: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    review_count: 127
  },
  {
    id: 'prod_headphones_1',
    name: 'Sony WH-1000XM4 Wireless',
    name_fr: 'Sony WH-1000XM4 Sans Fil',
    description: 'Premium noise-canceling headphones with superior sound quality and 30-hour battery',
    description_fr: 'Casque haut de gamme à réduction de bruit avec une qualité sonore supérieure et batterie 30h',
    price: 125000,
    category_id: 'cat_electronics',
    image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    stock: 18,
    active: true,
    is_featured: true,
    discount_percentage: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    review_count: 89
  },
  {
    id: 'prod_dress_1',
    name: 'African Print Summer Dress',
    name_fr: 'Robe d\'été à Imprimé Africain',
    description: 'Beautiful handmade dress with traditional African patterns and modern cut',
    description_fr: 'Belle robe artisanale avec des motifs africains traditionnels et coupe moderne',
    price: 35000,
    category_id: 'cat_fashion',
    image_url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
      'https://images.pexels.com/photos/1926770/pexels-photo-1926770.jpeg',
      'https://images.pexels.com/photos/1926771/pexels-photo-1926771.jpeg'
    ],
    stock: 15,
    active: true,
    is_featured: true,
    discount_percentage: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.7,
    review_count: 156
  },
  {
    id: 'prod_dumbbells_1',
    name: 'Adjustable Dumbbell Set',
    name_fr: 'Set d\'Haltères Réglables',
    description: 'Space-saving adjustable dumbbells with multiple weight options for home workouts',
    description_fr: 'Haltères réglables économes en espace avec plusieurs options de poids pour les entraînements à domicile',
    price: 85000,
    category_id: 'cat_sports',
    image_url: 'https://images.pexels.com/photos/221247/pexels-photo-221247.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/221247/pexels-photo-221247.jpeg',
      'https://images.pexels.com/photos/221248/pexels-photo-221248.jpeg',
      'https://images.pexels.com/photos/221249/pexels-photo-221249.jpeg'
    ],
    stock: 15,
    active: true,
    is_featured: true,
    discount_percentage: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.6,
    review_count: 203
  },
  {
    id: 'prod_plant_1',
    name: 'Indoor Plant Collection (3 Plants)',
    name_fr: 'Collection de Plantes d\'Intérieur (3 Plantes)',
    description: 'Set of 3 beautiful air-purifying indoor plants with decorative pots and care guide',
    description_fr: 'Ensemble de 3 belles plantes d\'intérieur purificatrices d\'air avec pots décoratifs et guide d\'entretien',
    price: 25000,
    category_id: 'cat_home',
    image_url: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg',
      'https://images.pexels.com/photos/1084200/pexels-photo-1084200.jpeg',
      'https://images.pexels.com/photos/1084201/pexels-photo-1084201.jpeg'
    ],
    stock: 40,
    active: true,
    is_featured: true,
    discount_percentage: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.5,
    review_count: 78
  }
];