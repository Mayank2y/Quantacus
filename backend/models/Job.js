import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED'],
    default: 'PENDING'
  },
  progress: { type: Number, default: 0 },
  startedAt: { type: Date },
  completedAt: { type: Date },
  errorMessage: { type: String },
  type: { type: String, enum: ['VIDEO_PROCESSING', 'CSV_IMPORT', 'PRICE_REFRESH'], required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);