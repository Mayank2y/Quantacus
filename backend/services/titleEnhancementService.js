// Trending keywords for different categories
const trendingKeywords = {
  Shoes: ['lightweight', 'running', 'sports', 'breathable', 'comfortable', 'training'],
  Dresses: ['elegant', 'floral', 'summer', 'party', 'casual', 'designer'],
  Bags: ['travel', 'backpack', 'durable', 'waterproof', 'laptop', 'stylish'],
  Electronics: ['smart', 'wireless', 'latest', 'premium', 'high-performance', 'pro'],
  default: ['premium', 'quality', 'best', 'trending', 'authentic', 'new']
};

export const generateEnhancedTitle = (product) => {
  const keywords = [];
  const category = product.category || 'default';
  const categoryKeywords = trendingKeywords[category] || trendingKeywords.default;
  
  // Extract keywords based on attributes
  if (product.brand) keywords.push(product.brand);
  if (product.color) keywords.push(product.color);
  if (product.material) keywords.push(product.material);
  
  // Add 2 random trending keywords
  const shuffled = [...categoryKeywords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  keywords.push(...shuffled.slice(0, 2));
  
  // Base product type extraction
  let productType = product.category || 'Product';
  if (product.productTitle) {
    const words = product.productTitle.split(' ');
    if (words.length > 2) productType = words.slice(-2).join(' ');
  }
  
  // Build enhanced title
  const enhancedTitle = `${keywords.join(' ')} ${productType}`.trim();
  
  return {
    originalTitle: product.productTitle,
    extractedAttributes: {
      brand: product.brand,
      color: product.color,
      material: product.material,
      category: product.category
    },
    keywords: keywords,
    enhancedTitle: enhancedTitle,
    reason: `Enhanced using brand (${product.brand || 'unknown'}), color (${product.color || 'unknown'}), and trending keywords for ${category} category`
  };
};