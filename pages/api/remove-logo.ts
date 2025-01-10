import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set',
    });

    const form = formidable({});
    const [fields, files] = await form.parse(req);

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const file = files.image[0];
    console.log('Uploaded file:', {
      name: file.originalFilename,
      type: file.mimetype,
      size: file.size,
    });

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'logo-removal',
      transformation: [
        { effect: 'remove_logo' }
      ]
    });

    console.log('Cloudinary response:', result);

    await fs.promises.unlink(file.filepath);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    });
  }
} 