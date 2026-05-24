import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  skuId: { type: String, required: true, unique: true },
  productTitle: { type: String, required: true },
  description: { type: String },
  brand: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number },
  imageUrl: { type: String },
  productUrl: { type: String },
  availability: { type: String, enum: ['in_stock', 'out_of_stock', 'limited'], default: 'in_stock' },
  color: { type: String },
  size: { type: String },
  material: { type: String },
  enhancedTitle: { type: String },
  extractedAttributes: { type: mongoose.Schema.Types.Mixed },
  competitorPrices: [{
    platform: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    url: { type: String },
    lastChecked: { type: Date, default: Date.now }
  }],
  validationIssues: [{
    type: { type: String },
    severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'] },
    message: { type: String },
    suggestion: { type: String }
  }],
  listingQualityScore: { type: Number, min: 0, max: 100 },
  source: { type: String, enum: ['VIDEO', 'CSV', 'MANUAL'], default: 'VIDEO' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
