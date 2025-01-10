import React from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Text,
  TextContainer,
  Navigation,
  Frame
} from '@shopify/polaris';

export default function About() {
  const navigationMarkup = (
    <Navigation location="/about">
      <Navigation.Section
        items={[
          {
            label: 'Ana Sayfa',
            url: '/',
          },
          {
            label: 'Planlar',
            url: '/plans',
          },
          {
            label: 'Hakkımızda',
            url: '/about',
            selected: true
          }
        ]}
      />
    </Navigation>
  );

  return (
    <Frame navigation={navigationMarkup}>
      <Page
        title="Hakkımızda"
        subtitle="ImageCraft'ı daha yakından tanıyın"
      >
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Biz Kimiz?</Text>
                  <Text as="p">
                    ImageCraft, e-ticaret görsellerinizi optimize etmek için yapay zeka teknolojilerini kullanan yenilikçi bir platformdur.
                    Amacımız, işletmelerin ürün fotoğraflarını profesyonel ve marka kimliğine uygun hale getirmektir.
                  </Text>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">Misyonumuz</Text>
                  <Text as="p">
                    E-ticaret işletmelerinin görsel içeriklerini optimize ederek satışlarını artırmalarına yardımcı olmak.
                    Yapay zeka teknolojimiz sayesinde, her işletmenin profesyonel görünümlü ürün fotoğraflarına sahip olmasını sağlıyoruz.
                  </Text>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <Text variant="headingMd" as="h2">İletişim</Text>
                  <Text as="p">
                    E-posta: contact@imagecraft.com
                    Adres: İstanbul, Türkiye
                  </Text>
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
} 