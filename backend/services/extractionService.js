import { v4 as uuidv4 } from 'uuid';

// Mock product data for simulation
const mockProducts = [
  { skuId: 'SHOE001', title: 'Nike Air Max', brand: 'Nike', category: 'Shoes', price: 3999, mrp: 4999, color: 'Blue', material: 'Mesh', description: 'Lightweight running shoes with breathable mesh upper' },
  { skuId: 'DRESS001', title: 'Summer Floral Dress', brand: 'Zara', category: 'Dresses', price: 1799, mrp: 2499, color: 'Red', material: 'Cotton', description: 'Elegant floral print dress perfect for summer' },
  { skuId: 'BAG001', title: 'Travel Backpack', brand: 'Puma', category: 'Bags', price: 1299, mrp: 1999, color: 'Black', material: 'Polyester', description: 'Durable backpack with laptop compartment' },
  { skuId: 'WATCH001', title: 'Smart Watch', brand: 'Apple', category: 'Electronics', price: 24999, mrp: 29999, color: 'Silver', material: 'Aluminum', description: 'GPS + Cellular smartwatch' }
];

export const extractFromVideo = async (videoFile) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extraction based on filename or random selection
  const mockIndex = Math.floor(Math.random() * mockProducts.length);
  const mockProduct = { ...mockProducts[mockIndex] };
  
  return {
    success: true,
    product: {
      skuId: mockProduct.skuId,
      productTitle: mockProduct.title,
      description: mockProduct.description,
      brand: mockProduct.brand,
      category: mockProduct.category,
      price: mockProduct.price,
      mrp: mockProduct.mrp,
      color: mockProduct.color,
      material: mockProduct.material,
      availability: 'in_stock'
    },
    extractedAttributes: {
      visibleText: mockProduct.title,
      detectedColors: [mockProduct.color],
      detectedBrands: [mockProduct.brand],
      confidence: 0.85
    },
    missingFields: ['imageUrl', 'productUrl']
  };
};

export const simulateFrameExtraction = async (videoPath) => {
  // Mock frame extraction
  return {
    frames: 30,
    extractedText: ['Nike', 'Running', 'Shoes', 'Blue'],
    detectedObjects: ['shoe', 'box']
  };
};