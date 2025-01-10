import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Layout,
  Page,
  Card,
  Button,
  Banner,
  LegacyStack,
  Text,
  TextContainer,
  LegacyCard
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

export default function Home() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      console.log('Görsel yükleme başlıyor...');
      
      const file = acceptedFiles[0];
      console.log('Seçilen dosya:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          console.log('Base64 dönüşümü tamamlandı, uzunluk:', base64Image.length);

          console.log('API isteği gönderiliyor...');
          const response = await fetch('/api/remove-logo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: base64Image })
          });

          console.log('API yanıtı alındı:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });

          const data = await response.json();
          console.log('API yanıt verisi:', data);

          if (!response.ok) {
            throw new Error(data.error || data.details || 'API yanıtı başarısız');
          }

          if (!data.success || !data.url) {
            throw new Error('API yanıtında URL bulunamadı');
          }

          setProcessedImageUrl(data.url);
          setApiResponse(data);
        } catch (error: any) {
          console.error('API hatası:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          setError(`API Hatası: ${error.message}`);
          setApiResponse(error);
        }
      };

      reader.onerror = (error) => {
        console.error('Dosya okuma hatası:', error);
        setError('Dosya okunamadı');
      };

      reader.readAsDataURL(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    } catch (error: any) {
      console.error('Genel hata:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setError(`Görsel işlenirken bir hata oluştu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <LegacyCard>
            <LegacyCard.Section>
              <div {...getRootProps()} style={{
                border: '2px dashed #ccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <input {...getInputProps()} />
                <TextContainer>
                  {isDragActive ? (
                    <p>Görseli buraya bırakın...</p>
                  ) : (
                    <p>Görseli seçmek için tıklayın veya buraya sürükleyin</p>
                  )}
                </TextContainer>
              </div>
            </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>

        {error && (
          <Layout.Section>
            <Banner tone="critical">
              <p>{error}</p>
              {apiResponse && (
                <div style={{ marginTop: '10px' }}>
                  <TextContainer>
                    <Text as="h4" variant="bodyMd">API Yanıtı:</Text>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-word',
                      background: '#f5f5f5',
                      padding: '10px',
                      borderRadius: '4px',
                      marginTop: '5px'
                    }}>
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </TextContainer>
                </div>
              )}
            </Banner>
          </Layout.Section>
        )}

        {isLoading && (
          <Layout.Section>
            <Banner tone="info">
              <p>Görsel işleniyor...</p>
            </Banner>
          </Layout.Section>
        )}

        {(uploadedImageUrl || processedImageUrl) && (
          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <LegacyStack distribution="fillEvenly">
                  {uploadedImageUrl && (
                    <LegacyStack.Item>
                      <TextContainer>
                        <Text as="h3" variant="headingMd">Orijinal Görsel</Text>
                        <img 
                          src={uploadedImageUrl} 
                          alt="Original" 
                          style={{ maxWidth: '100%', maxHeight: '300px' }} 
                        />
                      </TextContainer>
                    </LegacyStack.Item>
                  )}
                  {processedImageUrl && (
                    <LegacyStack.Item>
                      <TextContainer>
                        <Text as="h3" variant="headingMd">İşlenmiş Görsel</Text>
                        <img 
                          src={processedImageUrl} 
                          alt="Processed" 
                          style={{ maxWidth: '100%', maxHeight: '300px' }} 
                        />
                        <div style={{ marginTop: '10px' }}>
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() => window.open(processedImageUrl, '_blank')}
                          >
                            İndir
                          </Button>
                        </div>
                      </TextContainer>
                    </LegacyStack.Item>
                  )}
                </LegacyStack>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
} 