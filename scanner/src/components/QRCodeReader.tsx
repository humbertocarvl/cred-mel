

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

        // list devices via navigator.mediaDevices (more compatible)
        let devicesInfo: MediaDeviceInfo[] = [];
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          try {
            devicesInfo = await navigator.mediaDevices.enumerateDevices();
          } catch (e) {
            console.warn('enumerateDevices failed', e);
          }
        }

        const videoDevices = (devicesInfo || []).filter(d => d.kind === 'videoinput');
        // If no labels (no permission), try to request permission to get labels
        if (videoDevices.length === 0 && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            devicesInfo = await navigator.mediaDevices.enumerateDevices();
          } catch (permErr) {
            console.warn('Camera permission denied or getUserMedia failed', permErr);
            setCameraError('Permissão de câmera negada ou indisponível');
          }
        }

        const finalDevices = (devicesInfo || []).filter(d => d.kind === 'videoinput');
        setAvailableDevices(finalDevices.length > 0 ? (finalDevices as any) : null);

        // choose rear camera if available
        let deviceId: string | undefined;
        if (finalDevices && finalDevices.length > 0) {
          const back = finalDevices.find(d => /back|rear|trase|environment|externa/i.test(d.label));
          deviceId = (back || finalDevices[0]).deviceId;
        }

        activeDecode = true;
        // start continuous decode from chosen device (deviceId can be undefined to use default)
        try {
          // decodeFromVideoDevice accepts deviceId and a video element and uses callback continuously
          readerRef.current.decodeFromVideoDevice(deviceId || undefined, videoRef.current as HTMLVideoElement, (result: any, err: any) => {
            if (result) {
              handleResult(result.getText());
            } else if (err && !(err instanceof NotFoundException)) {
              console.error('Decode error', err);
            }
          });
        } catch (e) {
          console.error('decodeFromVideoDevice failed', e);
          setCameraError('Leitor indisponível neste dispositivo');
        }
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
