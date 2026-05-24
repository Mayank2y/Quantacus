export const validateProduct = (product) => {
  const issues = [];
  
  // Missing title check
  if (!product.productTitle || product.productTitle.trim().length === 0) {
    issues.push({
      type: 'MISSING_TITLE',
      severity: 'HIGH',
      message: 'Product title is missing',
      suggestion: 'Add a clear product title that describes the product'
    });
  } else if (product.productTitle.length < 10) {
    issues.push({
      type: 'SHORT_TITLE',
      severity: 'MEDIUM',
      message: 'Product title is too short',
      suggestion: 'Add brand, product type, color, gender, or material'
    });
  }
  
  // Missing brand check
  if (!product.brand || product.brand.trim().length === 0) {
    issues.push({
      type: 'MISSING_BRAND',
      severity: 'MEDIUM',
      message: 'Brand information is missing',
      suggestion: 'Add brand if known, or mark as unbranded'
    });
  }
  
  // Price validation
  if (!product.price || product.price <= 0) {
    issues.push({
      type: 'INVALID_PRICE',
      severity: 'HIGH',
      message: 'Invalid or missing price',
      suggestion: 'Price should be positive and numeric'
    });
  }
  
  // MRP vs Price check
  if (product.mrp && product.price && product.mrp < product.price) {
    issues.push({
      type: 'MRP_LOWER_THAN_PRICE',
      severity: 'HIGH',
      message: 'MRP is lower than selling price',
      suggestion: 'Correct MRP or selling price'
    });
  }
  
  // Missing image check
  if (!product.imageUrl || product.imageUrl.trim().length === 0) {
    issues.push({
      type: 'MISSING_IMAGE',
      severity: 'HIGH',
      message: 'Product image is missing',
      suggestion: 'Add at least one product image URL'
    });
  }
  
  // Weak description
  if (!product.description || product.description.length < 30) {
    issues.push({
      type: 'WEAK_DESCRIPTION',
      severity: 'LOW',
      message: 'Product description is weak',
      suggestion: 'Add more product details and attributes'
    });
  }
  
  // Missing important attributes
  const missingAttrs = [];
  if (!product.color) missingAttrs.push('color');
  if (!product.size) missingAttrs.push('size');
  if (!product.material) missingAttrs.push('material');
  if (!product.category) missingAttrs.push('category');
  
  if (missingAttrs.length > 0) {
    issues.push({
      type: 'MISSING_ATTRIBUTES',
      severity: 'MEDIUM',
      message: `Missing important attributes: ${missingAttrs.join(', ')}`,
      suggestion: 'Add color, size, material, or category-specific attributes'
    });
  }
  
  // Out of stock
  if (product.availability === 'out_of_stock') {
    issues.push({
      type: 'OUT_OF_STOCK',
      severity: 'LOW',
      message: 'Product is out of stock',
      suggestion: 'Notify operations team to restock'
    });
  }
  
  // Calculate quality score
  let score = 100;
  const severityWeights = { HIGH: 20, MEDIUM: 10, LOW: 5 };
  issues.forEach(issue => {
    score -= severityWeights[issue.severity];
  });
  score = Math.max(0, Math.min(100, score));
  
  return { issues, listingQualityScore: score };
};