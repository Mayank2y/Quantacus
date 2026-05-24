import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import Alert from '../models/Alert.js';
import Job from '../models/Job.js';
import Product from '../models/Product.js';
import { extractFromVideo } from '../services/extractionService.js';
import { generateEnhancedTitle } from '../services/titleEnhancementService.js';
import { validateProduct } from '../services/validationService.js';

const createListingAlerts = async (product, issues) => {
  await Promise.all(issues.map((issue) => Alert.findOneAndUpdate(
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
    { upsert: true, new: true }
  )));
};

const parseCSV = (content) => {
  const rows = [];
  let cell = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"' && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index] || ''])
  ));
};

const normalizeCSVProduct = (row) => ({
  skuId: row.skuId || row.sku_id,
  productTitle: row.productTitle || row.product_title,
  description: row.description,
  brand: row.brand,
  category: row.category,
  price: Number(row.price),
  mrp: row.mrp ? Number(row.mrp) : undefined,
  imageUrl: row.imageUrl || row.image_url,
  productUrl: row.productUrl || row.product_url,
  availability: row.availability || 'in_stock',
  color: row.color,
  size: row.size,
  material: row.material,
  source: 'CSV'
});

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    const jobId = uuidv4();
    const enhanceTitle = req.body.enhanceTitle === 'true';
    
    const job = await Job.create({
      jobId,
      status: 'PENDING',
      progress: 0,
      type: 'VIDEO_PROCESSING',
      metadata: { fileName: req.file.filename, enhanceTitle }
    });
    
    // Process asynchronously
    processVideoExtraction(job, req.file.path, enhanceTitle);
    
    res.json({ jobId, status: 'PENDING', message: 'Video upload successful, processing started' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

const processVideoExtraction = async (job, videoPath, enhanceTitle) => {
  try {
    job.status = 'RUNNING';
    job.progress = 30;
    await job.save();
    
    const extractionResult = await extractFromVideo(videoPath);
    
    job.progress = 70;
    await job.save();
    
    const productData = {
      ...extractionResult.product,
      extractedAttributes: extractionResult.extractedAttributes,
      source: 'VIDEO'
    };
    
    const validation = validateProduct(productData);
    const enhancement = enhanceTitle ? generateEnhancedTitle(productData) : null;
    
    const product = await Product.findOneAndUpdate(
      { skuId: productData.skuId },
      {
        ...productData,
        enhancedTitle: enhancement?.enhancedTitle,
        validationIssues: validation.issues,
        listingQualityScore: validation.listingQualityScore
      },
      { upsert: true, new: true, runValidators: true }
    );

    await createListingAlerts(product, validation.issues);
    
    job.productId = product._id;
    job.progress = 100;
    job.status = extractionResult.missingFields.length > 0 ? 'PARTIALLY_COMPLETED' : 'COMPLETED';
    job.completedAt = new Date();
    job.metadata = {
      ...job.metadata,
      productId: product._id,
      missingFields: extractionResult.missingFields,
      extractionMode: 'MOCK_VIDEO_EXTRACTION'
    };
    await job.save();
    
  } catch (error) {
    console.error('Processing error:', error);
    job.status = 'FAILED';
    job.errorMessage = error.message;
    await job.save();
  }
};

export const uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });

  try {
    const job = await Job.create({
      jobId: uuidv4(),
      status: 'RUNNING',
      progress: 20,
      type: 'CSV_IMPORT',
      metadata: { fileName: req.file.originalname }
    });

    const content = await fs.readFile(req.file.path, 'utf8');
    const csvData = parseCSV(content).map(normalizeCSVProduct);
    const products = [];

    for (const row of csvData) {
      const validation = validateProduct(row);
      const product = await Product.findOneAndUpdate(
        { skuId: row.skuId },
        {
          ...row,
          validationIssues: validation.issues,
          listingQualityScore: validation.listingQualityScore
        },
        { upsert: true, new: true, runValidators: true }
      );
      await createListingAlerts(product, validation.issues);
      products.push(product);
    }

    job.status = 'COMPLETED';
    job.progress = 100;
    job.completedAt = new Date();
    job.metadata = { ...job.metadata, importedCount: products.length };
    await job.save();

    res.json({ success: true, jobId: job.jobId, count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
