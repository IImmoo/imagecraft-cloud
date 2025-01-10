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
  console.log('API Request received:', {
    method: req.method,
    headers: req.headers,
    body: typeof req.body === 'object' ? JSON.stringify(req.body) : req.body
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    console.log('Request body:', {
      imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'missing',
      bodyType: typeof req.body,
      contentType: req.headers['content-type']
    });

    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required',
        receivedBody: req.body
      });
    }

    // Environment variables'ları kontrol et
    const envCheck = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    };

    console.log('Environment Check:', {
      cloud_name: envCheck.cloud_name ? 'set' : 'missing',
      api_key: envCheck.api_key ? 'set' : 'missing',
      api_secret: envCheck.api_secret ? 'set' : 'missing',
      nodeEnv: process.env.NODE_ENV
    });

    if (!envCheck.cloud_name || !envCheck.api_key || !envCheck.api_secret) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary yapılandırması eksik',
        details: 'Lütfen tüm Cloudinary environment variable\'larını kontrol edin',
        missing: Object.entries(envCheck)
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      });
    }

    try {
      console.log('Attempting initial upload to Cloudinary...');
      
      // Base64 kontrolü
      const isBase64 = imageUrl.startsWith('data:image');
      console.log('Image format:', isBase64 ? 'base64' : 'URL');
      
      // İlk olarak görseli yükle
      const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: 'logo-removal',
        resource_type: 'image',
        timeout: 60000 // 60 saniye timeout
      });

      console.log('Initial upload successful:', {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
        format: uploadResponse.format,
        size: uploadResponse.bytes
      });

      console.log('Applying AI background removal...');
      
      // Sonra AI background removal uygula
      const aiResponse = await cloudinary.uploader.explicit(uploadResponse.public_id, {
        type: 'upload',
        effect: 'background_removal',
        timeout: 120000 // 120 saniye timeout
      });

      console.log('AI processing successful:', {
        public_id: aiResponse.public_id,
        url: aiResponse.secure_url,
        format: aiResponse.format,
        size: aiResponse.bytes
      });

      if (!aiResponse || !aiResponse.secure_url) {
        throw new Error('AI işlemi başarısız oldu - URL alınamadı');
      }

      return res.status(200).json({
        success: true,
        url: aiResponse.secure_url,
        original: aiResponse
      });
    } catch (cloudinaryError: any) {
      console.error('Cloudinary Error Details:', {
        message: cloudinaryError?.message,
        name: cloudinaryError?.name,
        stack: cloudinaryError?.stack,
        error: cloudinaryError?.error,
        http_code: cloudinaryError?.http_code
      });

      // Cloudinary'den gelen hatayı daha detaylı işle
      let errorMessage = 'Cloudinary işlemi başarısız oldu';
      if (cloudinaryError?.error && typeof cloudinaryError.error === 'object') {
        errorMessage = `Cloudinary Error: ${cloudinaryError.error.message || 'Unknown'}`;
      } else if (cloudinaryError?.message) {
        errorMessage = cloudinaryError.message;
      }

      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('Logo kaldırma hatası:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      code: error?.code,
      statusCode: error?.statusCode
    });

    return res.status(500).json({
      success: false,
      error: 'Görsel işlenirken bir hata oluştu',
      details: error instanceof Error ? error.message : 'Unknown error',
      env_status: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
        node_env: process.env.NODE_ENV
      }
    });
  }
} 