

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException, VideoInputDevice } from '@zxing/library';

const QRCodeReader: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<VideoInputDevice[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const COOLDOWN_MS = 1500;
    let activeDecode = false;

    const handleResult = (resultText: string) => {
      if (!mounted) return;
      if (paused) return;
      setScanned(resultText);
      setPaused(true);
      try {
        onScan(resultText);
      } catch (e) {}
      setTimeout(() => {
        setPaused(false);
        setScanned(null);
      }, COOLDOWN_MS);
    };

    const initScanner = async () => {
      try {
        if (!videoRef.current) return;
        readerRef.current = new BrowserMultiFormatReader();

        // list devices
        let devices = await readerRef.current.listVideoInputDevices();

        // If labels are empty (no permission yet), request permission to get labels
        const hasLabels = devices.some(d => d.label && d.label.length > 0);
        if (!hasLabels && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            devices = await readerRef.current.listVideoInputDevices();
          } catch (permErr) {
            console.warn('Camera permission denied or getUserMedia failed', permErr);
            setCameraError('Permissão de câmera negada ou indisponível');
          }
        }

        setAvailableDevices(devices || null);

        // choose rear camera if available
        let deviceId: string | undefined;
        if (devices && devices.length > 0) {
          const back = devices.find(d => /back|rear|trase|environment|externa/i.test(d.label));
          deviceId = (back || devices[0]).deviceId;
        }

        activeDecode = true;
        readerRef.current.decodeFromVideoDeviceContinuously(deviceId || undefined, videoRef.current, (result, err) => {
          if (result) {
            handleResult(result.getText());
          } else if (err && !(err instanceof NotFoundException)) {
            console.error('Decode error', err);
          }
        });
      } catch (err: any) {
        console.error('ZXing init error', err);
        setCameraError(String(err?.message || err));
      }
    };

    initScanner();

    return () => {
      mounted = false;
      try {
        if (activeDecode) readerRef.current?.reset();
      } catch (e) {}
      try {
        readerRef.current = null;
      } catch (e) {}
    };
  }, [onScan, paused]);

  return (
    <div className="relative bg-gray-100 p-4 rounded text-center">
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600 text-white px-4 py-2 rounded opacity-95">Erro câmera: {cameraError}</div>
        </div>
      )}

      {scanned && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-600 text-white px-4 py-2 rounded opacity-90">Leitura: {scanned}</div>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;
