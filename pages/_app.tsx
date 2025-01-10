import React from 'react';
import '@shopify/polaris/build/esm/styles.css';
import { AppProps } from 'next/app';
import { AppProvider } from '@shopify/polaris';
import tr from '@shopify/polaris/locales/tr.json';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={tr}>
      <Component {...pageProps} />
    </AppProvider>
  );
} 