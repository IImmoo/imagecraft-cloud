import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }

    // Environment variables'ları kontrol et
    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...'
    });

    // Cloudinary'ye yükle ve logo kaldırma işlemini uygula
    const result = await cloudinary.uploader.upload(imageUrl, {
      background_removal: true,
      notification_url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/cloudinary-webhook` : undefined
    });

    console.log('Cloudinary Result:', result);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      original: result
    });
  } catch (error) {
    console.error('Logo kaldırma hatası:', error);
    return res.status(500).json({
      success: false,
      error: 'Görsel işlenirken bir hata oluştu',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 