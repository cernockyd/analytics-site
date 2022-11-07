import type { AppProps } from 'next/app';
import { OverlayProvider, SSRProvider } from 'react-aria';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <OverlayProvider>
        <Component {...pageProps} />
      </OverlayProvider>
    </SSRProvider>
  );
}
