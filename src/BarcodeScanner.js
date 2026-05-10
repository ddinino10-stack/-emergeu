/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function BarcodeScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const readerRef = useRef(null);

  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, []);

  const startScanning = async () => {
    try {
      readerRef.current = new BrowserMultiFormatReader();
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (devices.length === 0) {
        setError('No camera found on this device');
        return;
      }

      const selectedDevice = devices[devices.length - 1];

      await readerRef.current.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            stopScanning();
            onResult(result.getText());
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    try {
      if (readerRef.current) {
        BrowserMultiFormatReader.releaseAllStreams();
      }
    } catch (err) {
      console.error(err);
    }
    setScanning(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '500px', padding: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>📷 Scan Barcode</h3>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            Point your camera at the product barcode
          </p>
        </div>

        {error ? (
          <div style={{
            backgroundColor: '#111', border: '1px solid #ff4444',
            borderRadius: '16px', padding: '30px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📷</div>
            <p style={{ color: '#ff4444', marginBottom: '16px' }}>{error}</p>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Try searching by food name instead
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              style={{
                width: '100%', borderRadius: '16px',
                border: '2px solid #FF6B00'
              }}
            />
            {/* Scanning overlay */}
            <div style={{
              position: 'absolute', top: '50%', left: '10%',
              width: '80%', height: '2px',
              backgroundColor: '#FF6B00',
              transform: 'translateY(-50%)',
              boxShadow: '0 0 10px rgba(255,107,0,0.8)',
              animation: 'scan 2s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute', top: '25%', left: '15%',
              width: '70%', height: '50%',
              border: '2px solid rgba(255,107,0,0.5)',
              borderRadius: '8px'
            }} />
          </div>
        )}

        <button
          onClick={() => { stopScanning(); onClose(); }}
          style={{
            width: '100%', marginTop: '20px', padding: '16px',
            borderRadius: '12px', border: 'none',
            backgroundColor: '#333', color: 'white',
            fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
          }}>
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 30%; }
          50% { top: 70%; }
          100% { top: 30%; }
        }
      `}</style>
    </div>
  );
}

export default BarcodeScanner;