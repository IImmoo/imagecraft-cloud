import React, { useEffect, useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Button,
  TextStyle,
  List,
  Stack,
  Badge
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

export default function Plans() {
  const app = useAppBridge();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const sessionToken = await getSessionToken(app);
        const response = await fetch('/api/plans', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError('Planlar yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [app]);

  const handleSubscribe = async (planId: string) => {
    try {
      const sessionToken = await getSessionToken(app);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ planId }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Başarılı abonelik işlemi
        window.location.href = data.confirmationUrl;
      } else {
        setError(data.error || 'Abonelik işlemi başarısız oldu');
      }
    } catch (err) {
      setError('Abonelik işlemi sırasında bir hata oluştu');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Page title="Abonelik Planları">
      <Layout>
        <Layout.Section>
          <Stack distribution="fillEvenly">
            {plans.map((plan) => (
              <Stack.Item key={plan.id}>
                <Card sectioned>
                  <Stack vertical spacing="tight">
                    <TextStyle variation="strong">{plan.name}</TextStyle>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      ${plan.price}/ay
                    </div>
                    <Badge>{plan.credits} Kredi/ay</Badge>
                    <div style={{ marginTop: '1rem' }}>
                      <TextStyle variation="strong">Özellikler:</TextStyle>
                      <List type="bullet">
                        {plan.features.map((feature, index) => (
                          <List.Item key={index}>{feature}</List.Item>
                        ))}
                      </List>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <Button
                        primary
                        fullWidth
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        Abone Ol
                      </Button>
                    </div>
                  </Stack>
                </Card>
              </Stack.Item>
            ))}
          </Stack>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 