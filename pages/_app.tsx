import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '@shopify/polaris';
import tr from '@shopify/polaris/locales/tr.json';
import '@shopify/polaris/build/esm/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={tr}>
      <Component {...pageProps} />
    </AppProvider>
  );
} 