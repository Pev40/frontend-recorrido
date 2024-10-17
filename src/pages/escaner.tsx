import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useState, useEffect } from 'react';

import { Box, Card, Modal, Button, Container, Typography } from '@mui/material';

const EscanerQR: React.FC = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null); // Guardar el valor del QR escaneado
  const [open, setOpen] = useState(false); // Controla si el modal está abierto

  // Función para manejar el éxito del escaneo
  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log(`Resultado escaneado: ${decodedText}`);
    setQrCodeValue(decodedText); // Guardar el valor escaneado
    setOpen(true); // Abrir el modal automáticamente después de escanear
  };

  const onScanError = (errorMessage: string) => {
    console.warn(`Error de escaneo: ${errorMessage}`);
  };

  const handleClose = () => setOpen(false); // Cerrar el modal

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", { fps: 10, qrbox: 250 }, false
    );
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

      {/* Componente QrScanner en la página principal */}
      <Card sx={{ p: 4 }}>
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Coloca tu código QR frente a la cámara
          </Typography>
          <div id="reader" style={{ width: '100%' }} /> {/* Aquí se renderiza el escáner */}
        </Box>
      </Card>

      {/* Modal para mostrar el valor del QR escaneado */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Valor del Código QR
          </Typography>
          <Typography variant="body1">{qrCodeValue}</Typography> {/* Mostrar el valor escaneado */}
          <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default EscanerQR;
