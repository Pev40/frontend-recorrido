declare module 'react-qr-scanner' {
    import type { CSSProperties } from 'react';
  
    interface QrScannerProps {
      delay?: number;
      onError: (error: Error) => void;
      onScan: (data: { text: string } | null) => void;
      style?: CSSProperties;
    }
  
    const QrScanner: React.FC<QrScannerProps>;
    export default QrScanner;
  }
  