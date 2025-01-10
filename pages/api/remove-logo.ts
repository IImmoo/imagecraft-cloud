import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

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
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...'
    };

    console.log('Cloudinary Config:', config);

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary yapılandırması eksik',
        details: 'Lütfen tüm Cloudinary environment variable\'larını kontrol edin'
      });
    }

    try {
      // İlk olarak görseli yükle
      const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: 'logo-removal',
        resource_type: 'image'
      });

      console.log('Initial Upload Response:', uploadResponse);

      // Sonra AI background removal uygula
      const aiResponse = await cloudinary.uploader.explicit(uploadResponse.public_id, {
        type: 'upload',
        effect: 'background_removal'
      });

      console.log('AI Processing Response:', aiResponse);

      if (!aiResponse || !aiResponse.secure_url) {
        throw new Error('AI processing failed');
      }

      return res.status(200).json({
        success: true,
        url: aiResponse.secure_url,
        original: aiResponse
      });
    } catch (uploadError) {
      console.error('Cloudinary Error:', uploadError);
      throw new Error(uploadError instanceof Error ? uploadError.message : 'Cloudinary processing failed');
    }
  } catch (error) {
    console.error('Logo kaldırma hatası:', error);
    return res.status(500).json({
      success: false,
      error: 'Görsel işlenirken bir hata oluştu',
      details: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'
      }
    });
  }
} 