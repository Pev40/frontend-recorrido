/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { useState } from 'react';

import {
  Box,
  Grid,
  Paper,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

export default function RegistrationForm() {
  const [voucher, setVoucher] = useState<File | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [dni, setDni] = useState<string>('');
  const [email,setEmail] = useState<string>('');
  const [celular,setCelular] = useState<string>('');
  const [entradas, setEntradas] = useState<number>(1);
  const [, setError] = useState('');
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null); // Para la vista previa

  // Maneja la subida del voucher
  // Maneja la selección del archivo y genera la vista previa
  const handleVoucherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setVoucher(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoucherPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simula la consulta de un API para obtener el nombre por DNI
  const handleConsultarNombre = async () => {
    try {
      const response = await axios.get(`http://localhost:18755/api/reniec/${dni}`);

      if (response.status === 200) {
        const { nombres, apellidoPaterno, apellidoMaterno } = response.data;
        setNombre(`${nombres} ${apellidoPaterno} ${apellidoMaterno}`);
        setError('');
      } else {
        setError('DNI no encontrado.');
      }
    } catch (err) {
      setError('Ocurrió un error al consultar el DNI.');
    }
  };
  const handleIncrement = () => {
    if (entradas < 100) setEntradas(entradas + 1);
  };

  const handleDecrement = () => {
    if (entradas > 1) setEntradas(entradas - 1);
  };

  // Validación de entradas
  const handleEntradasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > 0 && value <= 100) {
      setEntradas(value);
    } else {
      alert('El número de entradas debe ser mayor a 0 y menor o igual a 100');
    }
  };

  const handleSubmit = async () => {
    if (!voucher) {
      alert('Por favor, sube tu voucher.');
      return;
    }
  
    try {
      const formData = new FormData();
      
      // Agregar datos al FormData
      formData.append('idEvento', '1'); // Ejemplo: Evento seleccionado
      formData.append('DNI', dni);
      formData.append('NombreCompleto', nombre);
      formData.append('Email', email);
      formData.append('Celular', celular);
      formData.append('NumeroDeEntradas', entradas.toString());
      formData.append('MontoTotal', (entradas * 25).toFixed(2));
      formData.append('ImagenPago', voucher); // La imagen en binario
  
      const response = await axios.post('http://localhost:18755/api/compras', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Formulario enviado:', response.data);
      alert('Compra y pago registrados exitosamente.');
    } catch (e) {
      console.error('Error al enviar los datos:', e);
      alert('Ocurrió un error al enviar los datos.');
    }
  };




  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/cementeriofondo.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>

      {/* Contenedor del Formulario */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: '60%',
            maxWidth: 800,
            height: '80vh',
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#1C1C1C',
          }}
        >
          <Grid container spacing={0} sx={{ height: '100%' }}>
            {/* Sección izquierda */}
            <Grid item xs={12} md={6} sx={{ bgcolor: '#3D3C42', color: 'white', padding: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                  Recorrido Nocturno
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  El Cementerio de La Apacheta se prepara para ofrecer un recorrido turístico
                  durante Halloween:
                  <strong> «Circuito Nocturno: Mitos y Leyendas del Cementerio La Apacheta»</strong>
                  .
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  Este recorrido, de aproximadamente 45 minutos, contará las leyendas urbanas más
                  misteriosas del cementerio y estará disponible los días 28, 30 y 31 de octubre.
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  Las entradas están disponibles desde el 16 de octubre por{' '}
                  <strong>S/. 25.00</strong>. Se pueden adquirir en la sede de la Beneficencia o en
                  la oficina del cementerio.
                </Typography>
                <img
                  src="/public/qr.jpg"
                  alt="QR del Evento"
                  style={{
                    width: '90%',
                    marginTop: '10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                />
              </Box>
            </Grid>

            {/* Sección derecha */}
            <Grid item xs={12} md={6} sx={{ padding: 4, bgcolor: '#282828' }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                ¡Regístrato Recorrido Nocturno!
              </Typography>

              <form onSubmit={(e) => e.preventDefault()}>
                <Box display="flex" alignItems="center" gap={1} >
                  <TextField
                    label="DNI"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                       handleConsultarNombre();
                        }
                       }}
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      input: { color: 'white' },
                      label: { color: '#FF6F00' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#FF6F00' },
                        '&:hover fieldset': { borderColor: '#FF5722' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                      },
                    }}
                  />
                  <IconButton
                  
                    color="primary"
                    onClick={handleConsultarNombre}
                    sx={{ height: '56px', width: '56px' }}
                  >
                    <SearchIcon />
                  </IconButton>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={nombre}
                  margin="normal"
                  disabled
                  sx={{
                  input: { color: 'white' },
                  label: { color: '#FF6F00' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FF6F00' },
                    '&:hover fieldset': { borderColor: '#FF5722' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                  },
                  }}
                />
                </Box>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  error={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)}
                  helperText={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Correo electrónico no válido' : ''}
                  sx={{
                    input: { color: 'white' },
                    label: { color: '#FF6F00' },
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FF6F00' },
                    '&:hover fieldset': { borderColor: '#FF5722' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                    },
                  }}
                  />
                  <TextField
                  label="Celular"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    input: { color: 'white' },
                    label: { color: '#FF6F00' },
                    paddingTop:'2px',
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FF6F00' },
                    '&:hover fieldset': { borderColor: '#FF5722' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                    },
                  }}
                  />
                <Box display="flex" alignItems="center" gap={2} sx={{ marginTop: 2 }}>
                    <Typography variant="body1" sx={{ color: '#FF6F00' }}>
                      Cantidad de Entradas
                    </Typography>
                    <IconButton color="primary" onClick={handleDecrement} disabled={entradas <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {entradas}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={handleIncrement}
                      disabled={entradas >= 100}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {/* Incrementador de Entradas */}
                  
                  
                </Box>
                <TextField
                    sx={{
                      height: '56px',
                      width: '100%',
                      input: { color: 'white' },
                      label: { color: '#FF6F00' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#FF6F00' },
                        '&:hover fieldset': { borderColor: '#FF5722' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                      },
                    }}
                    fullWidth
                    label="Evento"
                    select
                    margin="normal"
                    required
                  >
                    <MenuItem value="4">29 de Octubre</MenuItem>
                    <MenuItem value="5">30 de Octubre</MenuItem>
                    <MenuItem value="6">31 de Octubre</MenuItem>
                  </TextField>
                    <Box
                    sx={{
                      border: '2px dashed #9e9e9e',
                      padding: 1,
                      borderRadius: 2,
                      textAlign: 'center',
                      marginTop: 2,
                      bgcolor: '#1C1C1C',
                    }}
                    >
                    {!voucherPreview ? (
                      <>
                      <CloudUploadIcon color="action" fontSize="small" />
                      <Typography variant="body2" gutterBottom sx={{color:"white"}}>
                        Arrastra el archivo aquí o haz clic en Examinar
                      </Typography>
                      <Button
                        variant="contained"
                        component="label"
                        sx={{ backgroundColor: '#FF6F00', color: 'white', fontSize: '0.8rem' }}
                      >
                        Examinar
                        <input
                        type="file"
                        accept=".jpg"
                        hidden
                        onChange={handleVoucherChange}
                        />
                      </Button>
                      </>
                    ) : (
                      <img
                      src={voucherPreview}
                      alt="Vista previa del voucher"
                      style={{ marginTop: '10px', width: '60%', borderRadius: '8px' ,marginRight:'8px'}}
                      />
                    )}
                    {voucherPreview && (
                      <Button
                      variant="contained"
                      component="label"
                      sx={{ backgroundColor: '#FF6F00', color: 'white', marginTop: 1, fontSize: '0.8rem' }}
                      >
                      Cambiar
                      <input
                        type="file"
                        accept=".jpg"
                        hidden
                        onChange={handleVoucherChange}
                      />
                      </Button>
                    )}
                    </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 3, bgcolor: '#FF6F00' }}
                  onClick={handleSubmit}
                >
                  Enviar
                </Button>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
