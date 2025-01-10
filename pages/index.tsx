import React, { useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Button,
  DropZone,
  Stack,
  Banner,
  Spinner,
  Text
} from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

const config = {
  apiKey: process.env.SHOPIFY_API_KEY || '',
  host: process.env.HOST?.replace(/https:\/\//, '') || '',
  forceRedirect: true
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [originalImage, setOriginalImage] = useState('');

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const file = files[0];
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

  const pageContent = (
    <Page title="ImageCraft - Logo Kaldırma">
      <Layout>
        {error && (
          <Layout.Section>
            <Banner status="critical" title="Hata">{error}</Banner>
          </Layout.Section>
        )}
        
        <Layout.Section>
          <Card sectioned>
            <Stack vertical>
              <Text as="h2" variant="headingMd">
                Logoyu kaldırmak istediğiniz görseli yükleyin
              </Text>
              <DropZone
                accept="image/*"
                type="image"
                onDrop={handleDrop}
                disabled={isLoading}
                allowMultiple={false}
              >
                <DropZone.FileUpload />
              </DropZone>
            </Stack>
          </Card>
        </Layout.Section>

        {isLoading && (
          <Layout.Section>
            <Card sectioned>
              <Stack distribution="center">
                <Spinner accessibilityLabel="Yükleniyor" size="large" />
                <Text as="p">Görsel işleniyor...</Text>
              </Stack>
            </Card>
          </Layout.Section>
        )}

        {(originalImage || processedImage) && (
          <Layout.Section>
            <Card sectioned>
              <Stack distribution="fillEvenly">
                {originalImage && (
                  <div>
                    <Text as="h3" variant="headingMd">Orijinal Görsel</Text>
                    <img
                      src={originalImage}
                      alt="Orijinal"
                      style={{ maxWidth: '100%', marginTop: '1rem' }}
                    />
                  </div>
                )}
                {processedImage && (
                  <div>
                    <Text as="h3" variant="headingMd">İşlenmiş Görsel</Text>
                    <img
                      src={processedImage}
                      alt="İşlenmiş"
                      style={{ maxWidth: '100%', marginTop: '1rem' }}
                    />
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        primary
                        url={processedImage}
                        external
                        download
                      >
                        İndir
                      </Button>
                    </div>
                  </div>
                )}
              </Stack>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );

  return (
    <AppBridgeProvider config={config}>
      {pageContent}
    </AppBridgeProvider>
  );
} 