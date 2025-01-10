import React, { useState, useCallback } from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Text,
  TextContainer,
  Button,
  LegacyStack,
  Navigation,
  Frame,
  DropZone,
  Banner,
  Spinner,
  Thumbnail
} from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Ana Sayfa',
            url: '/',
            selected: true
          },
          {
            label: 'Planlar',
            url: '/plans'
          },
          {
            label: 'Hakkımızda',
            url: '/about'
          }
        ]}
      />
    </Navigation>
  );

  const handleDrop = useCallback(async (_dropFiles: File[], acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Lütfen geçerli bir görsel yükleyin.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Lütfen sadece görsel dosyası yükleyin.');
      return;
    }

    setFile(file);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/remove-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Görsel işlenirken bir hata oluştu');
      }

      setProcessedImageUrl(data.url);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Görsel işlenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Frame navigation={navigationMarkup}>
      <Page
        title="ImageCraft"
        subtitle="Görsellerinizdeki logoları tek tıkla kaldırın"
      >
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Nasıl Çalışır?</Text>
                  <Text as="p">
                    1. Görselinizi yükleyin
                    2. Yapay zeka logoları tespit eder
                    3. Logolar otomatik olarak kaldırılır
                    4. İşlenmiş görseli indirin
                  </Text>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                {error && (
                  <Banner status="critical" onDismiss={() => setError(null)}>
                    <p>{error}</p>
                  </Banner>
                )}

                <div style={{ marginTop: '20px' }}>
                  <DropZone onDrop={handleDrop} allowMultiple={false}>
                    {isLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spinner size="large" />
                        <div style={{ marginTop: '10px' }}>
                          <Text>Görsel işleniyor...</Text>
                        </div>
                      </div>
                    ) : (
                      <DropZone.FileUpload />
                    )}
                  </DropZone>
                </div>

                {file && !isLoading && (
                  <div style={{ marginTop: '20px' }}>
                    <LegacyStack distribution="fillEvenly">
                      <LegacyStack.Item>
                        <Text variant="headingSm" as="h3">Orijinal Görsel</Text>
                        <div style={{ marginTop: '10px' }}>
                          <Thumbnail
                            source={URL.createObjectURL(file)}
                            alt="Original"
                            size="large"
                          />
                        </div>
                      </LegacyStack.Item>

                      {processedImageUrl && (
                        <LegacyStack.Item>
                          <Text variant="headingSm" as="h3">İşlenmiş Görsel</Text>
                          <div style={{ marginTop: '10px' }}>
                            <Thumbnail
                              source={processedImageUrl}
                              alt="Processed"
                              size="large"
                            />
                            <div style={{ marginTop: '10px' }}>
                              <Button
                                primary
                                onClick={() => window.open(processedImageUrl, '_blank')}
                              >
                                İndir
                              </Button>
                            </div>
                          </div>
                        </LegacyStack.Item>
                      )}
                    </LegacyStack>
                  </div>
                )}
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Özellikler</Text>
                  <LegacyStack vertical spacing="loose">
                    <div>
                      <Text variant="headingSm" as="h3">✨ Yapay Zeka Destekli</Text>
                      <Text as="p">En son teknoloji yapay zeka modelleri ile hassas logo tespiti ve kaldırma</Text>
                    </div>
                    <div>
                      <Text variant="headingSm" as="h3">⚡️ Hızlı İşlem</Text>
                      <Text as="p">Saniyeler içinde sonuç alın</Text>
                    </div>
                    <div>
                      <Text variant="headingSm" as="h3">🎨 Yüksek Kalite</Text>
                      <Text as="p">Orijinal görsel kalitesini koruyarak doğal sonuçlar</Text>
                    </div>
                  </LegacyStack>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
} 