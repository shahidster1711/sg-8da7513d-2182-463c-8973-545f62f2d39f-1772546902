import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Navigation />
      <Component {...pageProps} />
      <Toaster />
      <div className="h-16 md:h-0" />
    </ThemeProvider>
  );
}