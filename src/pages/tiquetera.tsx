import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Modal, Button } from '@mui/material';
import QrScanner from 'react-qr-scanner';

const Escaner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log('Verificando disponibilidad de getUserMedia...');
    // Verifica si `getUserMedia` está disponible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('La cámara no es compatible en este navegador.');
      setIsCameraSupported(false);
      setError(new Error('La cámara no es compatible en este navegador.'));
    } else {
      console.log('Cámara compatible.');
    }
  }, []);

  const handleScan = (data: { text: string } | null) => {
    console.log('Resultado del escaneo:', data);
    if (data) {
      setQrCode(data.text);
      setModalOpen(true);
    }
  };

  const handleError = (err: Error) => {
    console.error('Error al acceder a la cámara:', err);
    setError(err);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Escáner de Códigos QR
        </Typography>
      </Box>

      {isCameraSupported ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Escanea tu código QR
          </Typography>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', maxWidth: 400 }}
          />
        </Card>
      ) : (
        <Typography variant="h6" color="error">
          La cámara no es compatible en este navegador.
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error">
          {error.message}
        </Typography>
      )}

      {qrCode && (
        <Modal open={modalOpen} onClose={handleCloseModal}>
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
            <Typography variant="h6">Resultado del Escaneo</Typography>
            <Typography variant="body1">
              {qrCode ? `Código QR Escaneado: ${qrCode}` : 'No se escaneó ningún código.'}
            </Typography>
            <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default Escaner;