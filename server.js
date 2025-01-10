require('dotenv').config();
const express = require('express');
const next = require('next');
const { Shopify } = require('@shopify/shopify-api');
const cloudinary = require('cloudinary').v2;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Shopify yapılandırması
const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES.split(','),
  hostName: process.env.HOST.replace(/https:\/\//, ''),
  apiVersion: '2023-10',
  isEmbeddedApp: true
});

app.prepare().then(() => {
  const server = express();
  
  // API endpoint'leri
  server.post('/api/remove-logo', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      // Cloudinary'ye yükle ve logo kaldırma işlemini uygula
      const result = await cloudinary.uploader.upload(imageUrl, {
        background_removal: "cloudinary_ai"
      });
      
      res.json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error('Logo kaldırma hatası:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Next.js request handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 