import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Başarılı! - ImageCraft</title>
        <meta name="description" content="Abonelik başarıyla tamamlandı" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="mb-8">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tebrikler!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Aboneliğiniz başarıyla oluşturuldu.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="btn-primary inline-block"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 