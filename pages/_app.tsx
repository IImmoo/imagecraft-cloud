import React from 'react';
import type { AppProps } from 'next/app';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import tr from '@shopify/polaris/locales/tr.json';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={tr}>
      <Component {...pageProps} />
    </AppProvider>
  );
} 