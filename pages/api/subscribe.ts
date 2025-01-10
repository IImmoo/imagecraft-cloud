import type { NextApiRequest, NextApiResponse } from 'next';

const PLANS = {
  basic: {
    id: 'basic',
    price: 9.99,
    name: 'Başlangıç Planı'
  },
  pro: {
    id: 'pro',
    price: 19.99,
    name: 'Profesyonel Plan'
  },
  enterprise: {
    id: 'enterprise',
    price: 49.99,
    name: 'Kurumsal Plan'
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
    const { planId } = req.body;

    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      return res.status(400).json({ success: false, error: 'Invalid plan ID' });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Burada gerçek ödeme entegrasyonu yapılacak
    // Şimdilik başarılı kabul ediyoruz
    return res.status(200).json({
      success: true,
      confirmationUrl: '/success',
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price
      }
    });
  } catch (error) {
    console.error('Abonelik hatası:', error);
    return res.status(500).json({
      success: false,
      error: 'Abonelik işlemi sırasında bir hata oluştu'
    });
  }
} 