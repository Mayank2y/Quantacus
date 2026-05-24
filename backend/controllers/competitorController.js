import Product from '../models/Product.js';
import Alert from '../models/Alert.js';
import { getMockCompetitorPrices, refreshCompetitorPrices, calculatePriceComparison } from '../services/competitorService.js';

const createPricingAlertIfNeeded = async (product, comparison) => {
  if (!comparison.isAlertNeeded) return;

  await Alert.findOneAndUpdate(
    { productId: product._id, type: 'PRICING', title: 'HIGHER_THAN_COMPETITOR' },
    {
      productId: product._id,
      skuId: product.skuId,
      type: 'PRICING',
      severity: 'HIGH',
      title: 'Price Higher Than Competitors',
      message: `Your price ${product.price} INR is ${comparison.percentageDifference.toFixed(1)}% higher than the lowest competitor price ${comparison.lowestCompetitorPrice} INR`,
      actionSuggestion: comparison.recommendedAction,
      isResolved: false
    },
    { upsert: true, new: true }
  );
};

export const getCompetitorPrices = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    let competitors = product.competitorPrices;
    if (!competitors || competitors.length === 0) {
      competitors = await getMockCompetitorPrices(product);
      product.competitorPrices = competitors;
      await product.save();
    }
    
    const comparison = calculatePriceComparison(product.price, competitors);
    await createPricingAlertIfNeeded(product, comparison);
    
    res.json({ competitors, comparison });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshPrices = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const competitors = await refreshCompetitorPrices(product);
    product.competitorPrices = competitors;
    await product.save();
    
    const comparison = calculatePriceComparison(product.price, competitors);
    await createPricingAlertIfNeeded(product, comparison);
    
    res.json({ competitors, comparison });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isResolved: false })
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    
    alert.isResolved = true;
    alert.resolvedAt = new Date();
    await alert.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
