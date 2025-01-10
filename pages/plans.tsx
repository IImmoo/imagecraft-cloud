import {
  Page,
  Layout,
  LegacyCard,
  Text,
  TextContainer,
  Button,
  LegacyStack,
  Navigation,
  Frame
} from '@shopify/polaris';

export default function Plans() {
  const navigationMarkup = (
    <Navigation location="/plans">
      <Navigation.Section
        items={[
          {
            label: 'Ana Sayfa',
            url: '/',
          },
          {
            label: 'Planlar',
            url: '/plans',
            selected: true
          },
          {
            label: 'Hakkımızda',
            url: '/about'
          }
        ]}
      />
    </Navigation>
  );

  const plans = [
    {
      name: 'Ücretsiz',
      price: '0 ₺',
      features: [
        '5 görsel/ay',
        'Standart çözünürlük',
        'Temel destek',
        'Watermark'
      ],
      cta: 'Şimdi Başla',
      popular: false
    },
    {
      name: 'Pro',
      price: '99 ₺/ay',
      features: [
        '100 görsel/ay',
        'HD çözünürlük',
        'Öncelikli destek',
        'Watermark yok',
        'API erişimi'
      ],
      cta: 'Pro\'ya Yükselt',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Özel Fiyat',
      features: [
        'Sınırsız görsel',
        '4K çözünürlük',
        '7/24 özel destek',
        'Özel API',
        'Beyaz etiket'
      ],
      cta: 'İletişime Geç',
      popular: false
    }
  ];

  return (
    <Frame navigation={navigationMarkup}>
      <Page
        title="Planlar ve Fiyatlandırma"
        subtitle="İhtiyacınıza uygun planı seçin"
      >
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Neden Premium?</Text>
                  <Text as="p">
                    Premium planlarımızla daha yüksek kalitede ve daha hızlı sonuçlar alın.
                    Watermark olmadan, yüksek çözünürlüklü görseller elde edin.
                  </Text>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section>
            <LegacyStack distribution="fillEvenly">
              {plans.map((plan, index) => (
                <LegacyStack.Item key={index}>
                  <LegacyCard>
                    {plan.popular && (
                      <div style={{
                        background: '#1abc9c',
                        color: 'white',
                        textAlign: 'center',
                        padding: '8px',
                        borderRadius: '4px 4px 0 0'
                      }}>
                        <Text as="p" variant="bodyMd">En Popüler</Text>
                      </div>
                    )}
                    <LegacyCard.Section>
                      <TextContainer spacing="tight">
                        <Text variant="headingLg" as="h3">{plan.name}</Text>
                        <div style={{ margin: '15px 0' }}>
                          <Text variant="heading3xl" as="p">{plan.price}</Text>
                        </div>
                        <LegacyStack vertical spacing="tight">
                          {plan.features.map((feature, i) => (
                            <Text as="p" key={i}>✓ {feature}</Text>
                          ))}
                        </LegacyStack>
                        <div style={{ marginTop: '20px' }}>
                          <Button
                            primary={plan.popular}
                            fullWidth
                            onClick={() => {
                              if (plan.name === 'Enterprise') {
                                window.location.href = 'mailto:contact@imagecraft.com';
                              } else {
                                // TODO: Ödeme sayfasına yönlendir
                                alert('Yakında aktif olacak!');
                              }
                            }}
                          >
                            {plan.cta}
                          </Button>
                        </div>
                      </TextContainer>
                    </LegacyCard.Section>
                  </LegacyCard>
                </LegacyStack.Item>
              ))}
            </LegacyStack>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Sıkça Sorulan Sorular</Text>
                  <LegacyStack vertical spacing="loose">
                    <div>
                      <Text variant="headingSm" as="h3">Aylık görsel limitimi nasıl takip edebilirim?</Text>
                      <Text as="p">Hesabınızın kontrol panelinden kalan görsel sayınızı görebilirsiniz.</Text>
                    </div>
                    <div>
                      <Text variant="headingSm" as="h3">Planımı istediğim zaman değiştirebilir miyim?</Text>
                      <Text as="p">Evet, planınızı dilediğiniz zaman yükseltebilir veya düşürebilirsiniz.</Text>
                    </div>
                    <div>
                      <Text variant="headingSm" as="h3">İade politikanız nedir?</Text>
                      <Text as="p">İlk 7 gün içinde iade garantisi sunuyoruz.</Text>
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