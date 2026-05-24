import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  skuId: { type: String, required: true },
  type: { type: String, enum: ['LISTING', 'PRICING'], required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  actionSuggestion: { type: String },
  isResolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);