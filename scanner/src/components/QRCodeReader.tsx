

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRCodeReader: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const qrCodeRegionId = 'qr-code-region';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // cooldown to avoid repeated/on-repeat scans that make UI flicker
    const COOLDOWN_MS = 1500; // ignore repeated scans for 1.5s
    const lastRef = { value: '', time: 0 } as { value: string; time: number };

    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        try {
          const now = Date.now();
          // if same value scanned recently, ignore
          if (decodedText === lastRef.value && now - lastRef.time < COOLDOWN_MS) return;
          lastRef.value = decodedText;
          lastRef.time = now;
          onScan(decodedText);
        } catch (e) {
          // swallow errors from handler
        }
      },
      (errorMessage) => {
        // Ignorar erros de leitura
      }
    );

    return () => {
      if (html5QrCodeRef.current) {
        try {
          // Só para se estiver rodando
          html5QrCodeRef.current.stop().catch(() => {});
        } catch (e) {
          // Ignora erro de stop
        }
        try {
          html5QrCodeRef.current.clear();
        } catch (e) {
          // Ignora erro de clear
        }
      }
    };
  }, [onScan]);

  return (
    <div className="bg-gray-100 p-4 rounded text-center">
      <div id={qrCodeRegionId} style={{ width: '100%' }} />
    </div>
  );
};

export default QRCodeReader;
