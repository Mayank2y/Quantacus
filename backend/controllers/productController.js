import Product from '../models/Product.js';
import Alert from '../models/Alert.js';
import { validateProduct } from '../services/validationService.js';
import { generateEnhancedTitle } from '../services/titleEnhancementService.js';

export const getAllProducts = async (req, res) => {
  try {
    const { severity, category, alertStatus } = req.query;
    let query = {};
    
    if (severity) {
      query['validationIssues.severity'] = severity;
    }
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const alerts = await Alert.find({ productId: product._id, isResolved: false });
    
    res.json({ product, activeAlerts: alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    Object.assign(product, req.body);
    const validation = validateProduct(product);
    product.validationIssues = validation.issues;
    product.listingQualityScore = validation.listingQualityScore;
    
    await product.save();
    
    // Create alerts for high severity issues
    for (const issue of validation.issues.filter(i => i.severity === 'HIGH')) {
      await Alert.findOneAndUpdate(
        { productId: product._id, type: 'LISTING', title: issue.type },
        {
          productId: product._id,
          skuId: product.skuId,
          type: 'LISTING',
          severity: issue.severity,
          title: issue.type,
          message: issue.message,
          actionSuggestion: issue.suggestion,
          isResolved: false
        },
        { upsert: true }
      );
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enhanceTitle = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const enhancement = generateEnhancedTitle(product);
    product.enhancedTitle = enhancement.enhancedTitle;
    await product.save();
    
    res.json(enhancement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find();
    
    const totalProducts = products.length;
    const highIssues = products.filter(p => p.validationIssues.some(i => i.severity === 'HIGH')).length;
    const mediumIssues = products.filter(p => p.validationIssues.some(i => i.severity === 'MEDIUM')).length;
    const lowIssues = products.filter(p => p.validationIssues.some(i => i.severity === 'LOW')).length;
    const missingImages = products.filter(p => !p.imageUrl).length;
    const invalidPrices = products.filter(p => !p.price || p.price <= 0).length;
    const weakListings = products.filter(p => p.listingQualityScore < 60).length;
    const avgQualityScore = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.listingQualityScore || 0), 0) / products.length 
      : 0;
    
    res.json({
      totalProducts,
      issueCounts: { HIGH: highIssues, MEDIUM: mediumIssues, LOW: lowIssues },
      weakListings,
      missingImageCount: missingImages,
      invalidPriceCount: invalidPrices,
      overallQualityScore: Math.round(avgQualityScore)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};