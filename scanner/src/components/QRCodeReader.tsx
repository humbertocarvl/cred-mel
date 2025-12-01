

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRCodeReader: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const qrCodeRegionId = 'qr-code-region';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        onScan(decodedText);
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
