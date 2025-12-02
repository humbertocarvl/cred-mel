

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = new URL('qr-scanner/qr-scanner-worker.min.js', import.meta.url).toString();

const QRCodeReader: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<any>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    const COOLDOWN_MS = 1500;

    const handleResult = (result: string) => {
      if (!mounted) return;
      // guard: if paused, ignore
      if (paused) return;

      setScanned(result);
      setPaused(true);
      try {
        onScan(result);
      } catch (e) {
        // swallow
      }
      // pause scanner and resume after cooldown
      try {
        scannerRef.current?.pause();
      } catch (e) {}
      setTimeout(() => {
        try {
          scannerRef.current?.resume();
        } catch (e) {}
        setPaused(false);
        setScanned(null);
      }, COOLDOWN_MS);
    };

    (async () => {
      try {
        if (!videoRef.current) return;
        scannerRef.current = new QrScanner(videoRef.current, (res: any) => handleResult(typeof res === 'string' ? res : res?.data || ''), {
          returnDetailedScanResult: false,
          highlightScanRegion: true,
        });
        await scannerRef.current.start();
      } catch (err) {
        // fallback: do nothing
        console.error('QrScanner init error', err);
      }
    })();

    return () => {
      mounted = false;
      try {
        scannerRef.current?.stop();
      } catch (e) {}
      try {
        scannerRef.current?.destroy?.();
      } catch (e) {}
    };
  }, [onScan, paused]);

  return (
    <div className="relative bg-gray-100 p-4 rounded text-center">
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {scanned && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-600 text-white px-4 py-2 rounded opacity-90">Leitura: {scanned}</div>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;
