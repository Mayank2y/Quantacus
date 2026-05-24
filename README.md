# Product Intelligence Dashboard for E-commerce Sellers

An end-to-end MERN-style application for analyzing e-commerce product listings, validating listing quality, comparing mocked competitor prices, and surfacing actionable alerts.

This project intentionally mocks the video extraction and competitor pricing flows for assignment/demo purposes. The backend simulates product data extraction from uploaded videos instead of calling a real computer-vision or AI service.

## Features

- Product video upload with mocked extraction
- CSV fallback upload for bulk product import
- Optional title enhancement using category keywords
- Product validation with HIGH, MEDIUM, and LOW severity issues
- Listing quality score from 0 to 100
- Mock competitor prices for Amazon, Myntra, Ajio, Nykaa Fashion, Tata Cliq, and Meesho
- Price comparison with recommendations
- Listing and pricing alerts stored in MongoDB
- Job status tracking for video processing and CSV imports
- Manual product editing
- Competitor price refresh
- Responsive React dashboard

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router DOM, Axios, React Hot Toast |
| Backend | Node.js, Express.js, Multer, UUID |
| Database | MongoDB with Mongoose |
| Styling | Custom CSS |
| Deployment | Vercel frontend, Render backend, MongoDB Atlas |

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
frontend/
  public/
  src/
sample_data/
```

## Local Setup

### Prerequisites

- Node.js 18 or higher
- MongoDB local instance or MongoDB Atlas connection string

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product_intelligence
```

Start the backend:

```bash
npm run dev
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Deployment

### Backend on Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

## Demo Notes

- Video extraction is mocked in `backend/services/extractionService.js`.
- Competitor prices are simulated and refreshed with random variations.
- CSV import supports the sample file in `sample_data/sample-products.csv`.
- Uploaded files are stored locally in `backend/uploads/` during local development and are ignored by Git.

## Limitations

- No real AI/computer vision integration.
- No real competitor scraping or marketplace APIs.
- No authentication.
- No real-time notifications.
- No price history chart.
