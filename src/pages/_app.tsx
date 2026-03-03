import type { AppProps } from "next/app";
import Script from 'next/script'
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Navigation />
      {/* Google Analytics 4 */}
<Script
    id="google-analytics-4"
    src="https://www.googletagmanager.com/gtag/js?id=G-3TP3LFHWYJ"
    strategy="afterInteractive"
/>
              <Script
                  id="google-analytics-4-inline"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                      __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-3TP3LFHWYJ');`
                  }}
              />
{/* End Google Analytics 4 */}
<Component {...pageProps} />
      <Toaster />
      <div className="h-16 md:h-0" />
    </ThemeProvider>
  );
}