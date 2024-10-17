import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { Box, Card, Container, Typography } from '@mui/material';

const EscanerQR: React.FC = () => {
  useEffect(() => {
    // Función para manejar el éxito del escaneo
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      // Aquí puedes manejar el texto escaneado, mostrarlo, guardarlo en el estado, etc.
    };

    // Función para manejar el error de escaneo
    const onScanError = (errorMessage: string) => {
      console.warn(`Scan error: ${errorMessage}`);
      // Aquí puedes manejar el error o simplemente ignorarlo
    };

    // Inicializar el escáner de QR
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", { fps: 10, qrbox: 250 }, false
    );

    // Iniciar el escaneo
    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Limpiar el escáner cuando el componente se desmonte
    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Box mb={3}>
        <Typography variant="h4">Escáner de Códigos QR</Typography>
      </Box>
      
      <Card sx={{ p: 4 }}>
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Coloca tu código QR frente a la cámara
          </Typography>
          <div id="reader" style={{ width: '100%', maxWidth: '400px' }} />
        </Box>
      </Card>
    </Container>
  );
};

export default EscanerQR;
