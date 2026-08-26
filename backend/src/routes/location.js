import express from 'express';
import { query } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve Mapbox API key dynamically if process.env wasn't populated at boot
function getMapboxApiKey() {
  if (process.env.MAPBOX_API_KEY && process.env.MAPBOX_API_KEY.trim()) {
    return process.env.MAPBOX_API_KEY.trim();
  }

  // Fallback check in .env files directly
  const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend/.env')
  ];

  for (const envPath of envPaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/^MAPBOX_API_KEY\s*=\s*(.+)$/m);
        if (match && match[1]) {
          const key = match[1].trim().replace(/^["']|["']$/g, '');
          if (key) {
            process.env.MAPBOX_API_KEY = key;
            return key;
          }
        }
      }
    } catch {}
  }

  return null;
}

/**
 * GET /api/location/autocomplete?q=manila
 * Proxy endpoint to query Mapbox Geocoding API safely with backend API Key.
 * Proximity biasing (`proximity=ip`) prioritizes the user's local geography.
 */
router.get(
  '/autocomplete',
  [
    query('q')
      .isString()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Query must be between 2 and 200 characters'),
    validateRequest
  ],
  async (req, res) => {
    const { q } = req.query;
    const apiKey = getMapboxApiKey();

    // Graceful fallback if Mapbox key is not configured
    if (!apiKey) {
      console.warn('[Mapbox Autocomplete] MAPBOX_API_KEY is not set in environment. Returning empty results.');
      return res.json({
        success: true,
        data: [],
        message: 'Mapbox API key not configured'
      });
    }

    try {
      const encodedQuery = encodeURIComponent(q);
      // Mapbox with proximity=ip biases results toward user's local IP location
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${apiKey}&proximity=ip&types=place,locality,neighborhood,address,region,country&limit=6`;

      const response = await fetch(mapboxUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`[Mapbox Autocomplete] Mapbox API responded with status ${response.status}: ${response.statusText}`);
        return res.json({
          success: true,
          data: [],
          message: 'Location autocomplete service temporarily degraded'
        });
      }

      const data = await response.json();
      const suggestions = (data.features || []).map((feature) => ({
        id: feature.id,
        place_name: feature.place_name,
        text: feature.text,
        center: feature.center || null,
        context: feature.context ? feature.context.map(c => c.text).join(', ') : ''
      }));

      return res.json({
        success: true,
        data: suggestions,
        message: 'Location suggestions retrieved successfully'
      });
    } catch (error) {
      console.error('[Mapbox Autocomplete Error]', error.message);
      return res.json({
        success: true,
        data: [],
        message: 'Location autocomplete unavailable'
      });
    }
  }
);

export default router;
