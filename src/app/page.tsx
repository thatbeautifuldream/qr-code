import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageClient from './page-client';
import { LoaderIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate QR codes from URLs instantly.',
};

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoaderIcon className="size-4 animate-spin text-muted-foreground" /></div>}>
      <PageClient />
    </Suspense>
  );
}
