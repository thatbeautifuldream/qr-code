'use client';

import { QRCode } from '@/components/qr-code';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon, DownloadIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

export default function Home() {
  const [url] = useQueryState('url', parseAsString);
  const [copied, setCopied] = useState(false);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-2">QR Code Generator</h1>
          <p className="mb-4 text-sm opacity-80">
            Pass a <span className="font-mono bg-accent px-1 rounded">url</span> query parameter to generate a QR code.<br />
            <span className="opacity-70">Example:</span>
          </p>
          <a
            href="?url=https://milindmishra.com"
            className="inline-block px-3 py-1 rounded bg-accent/60 hover:bg-accent transition-colors text-xs font-mono text-foreground border border-border"
          >
            ?url=https://milindmishra.com
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <QRCode data={url} className="size-96" />
      <div className="space-x-2 text-xs font-mono text-muted-foreground break-all max-w-xl text-center mt-2 flex items-center justify-center">
        <span className="break-all">{url}</span>
        <button
          aria-label="Copy URL"
          className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          style={{ fontSize: '1rem', lineHeight: 1 }}
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          <motion.span
            key={copied ? 'check' : 'copy'}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-center"
          >
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </motion.span>
        </button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const svg = document.querySelector('.size-96 svg');
            if (svg) {
              const serializer = new XMLSerializer();
              const source = serializer.serializeToString(svg);
              const blob = new Blob([source], { type: 'image/svg+xml' });
              const urlBlob = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = urlBlob;
              a.download = 'qrcode.svg';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(urlBlob);
            }
          }}
          className="flex items-center space-x-2"
        >
          <DownloadIcon className="size-4" /> SVG
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const svg = document.querySelector('.size-96 svg');
            if (svg) {
              const serializer = new XMLSerializer();
              const source = serializer.serializeToString(svg);
              const img = new Image();
              const svg64 = btoa(unescape(encodeURIComponent(source)));
              const image64 = 'data:image/svg+xml;base64,' + svg64;
              img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = 448;
                canvas.height = 448;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#fff';
                  ctx.fillRect(0, 0, 448, 448);
                  ctx.drawImage(img, 32, 32, 384, 384);
                  canvas.toBlob(function (blob) {
                    if (blob) {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'qrcode.png';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }, 'image/png');
                }
              };
              img.src = image64;
            }
          }}
          className="flex items-center space-x-2"
        >
          <DownloadIcon className="size-4" /> PNG
        </Button>
      </div>
    </div>
  );
}
