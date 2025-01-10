import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Başlangıç',
    price: 9.99,
    credits: 100,
    features: [
      'Aylık 100 görsel işleme',
      'Temel logo kaldırma',
      'JPG ve PNG desteği',
      'Email desteği'
    ]
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    price: 19.99,
    credits: 500,
    features: [
      'Aylık 500 görsel işleme',
      'Gelişmiş logo kaldırma',
      'Tüm görsel formatları desteği',
      'Öncelikli destek',
      'API erişimi'
    ]
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    price: 49.99,
    credits: 2000,
    features: [
      'Aylık 2000 görsel işleme',
      'En gelişmiş logo kaldırma',
      'Özel format desteği',
      '7/24 öncelikli destek',
      'Özel API erişimi',
      'Özel entegrasyon desteği'
    ]
  }
];

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = data.confirmationUrl;
      } else {
        alert('Abonelik işlemi başarısız oldu: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error(err);
      alert('Abonelik işlemi sırasında bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>ImageCraft - Abonelik Planları</title>
        <meta name="description" content="ImageCraft abonelik planları" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Abonelik Planları
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            İhtiyacınıza en uygun planı seçin
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card transition-all duration-300 ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-primary-600 mb-4">
                  ₺{plan.price}
                  <span className="text-base font-normal text-gray-600">/ay</span>
                </div>
                <div className="bg-primary-50 text-primary-700 py-2 px-4 rounded-full text-sm font-semibold mb-6">
                  {plan.credits} Kredi/ay
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="btn-primary w-full"
                >
                  Planı Seç
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 