import express from 'express';
import { getCompetitorPrices, refreshPrices, getAlerts, resolveAlert } from '../controllers/competitorController.js';

const router = express.Router();

router.get('/products/:productId/prices', getCompetitorPrices);
router.post('/products/:productId/refresh', refreshPrices);
router.get('/alerts', getAlerts);
router.put('/alerts/:id/resolve', resolveAlert);

export default router;