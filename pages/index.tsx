import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { CloudArrowUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [originalImage, setOriginalImage] = useState('');

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    handleImage(file);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleImage(file);
  }, []);

  const handleImage = async (file: File) => {
    setIsLoading(true);
    setError('');
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        setOriginalImage(base64Image);
        
        const response = await fetch('/api/remove-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: base64Image }),
        });

        const data = await response.json();
        
        if (data.success) {
          setProcessedImage(data.url);
        } else {
          setError(data.error || 'Bir hata oluştu');
        }
      };
    } catch (err) {
      setError('Görsel işlenirken bir hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>ImageCraft - Logo Kaldırma</title>
        <meta name="description" content="Görsellerden logo kaldırma uygulaması" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            ImageCraft - Logo Kaldırma
          </h1>
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div
            className="max-w-xl mx-auto mb-8"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <label
              className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-primary-500 focus:outline-none"
            >
              <span className="flex flex-col items-center justify-center">
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-base text-gray-600">
                  Logoyu kaldırmak istediğiniz görseli sürükleyin veya seçin
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isLoading}
                />
              </span>
            </label>
          </div>

          {isLoading && (
            <div className="card mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Görsel işleniyor...</span>
              </div>
            </div>
          )}

          {(originalImage || processedImage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {originalImage && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Orijinal Görsel</h3>
                  <img
                    src={originalImage}
                    alt="Orijinal"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              
              {processedImage && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">İşlenmiş Görsel</h3>
                  <img
                    src={processedImage}
                    alt="İşlenmiş"
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4">
                    <a
                      href={processedImage}
                      download
                      className="btn-primary inline-flex items-center"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                      İndir
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 