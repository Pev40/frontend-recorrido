import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Table,
  Paper,
  Modal,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

interface CompraPago {
    idCompra: number;
    idEvento: number;
    dni: string;
    nombreCompleto: string;
    email: string;
    celular: string;
    numeroDeEntradas: number;
    confirmada: boolean;
    fechaCreacion: string;
    montoTotal: number;
    estado: number;
    imagenBase64: string | null;
}

const ComprasPagos: React.FC = () => {
  const [data, setData] = useState<CompraPago[]>([]);
  const [selectedCompra, setSelectedCompra] = useState<CompraPago | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData(); // Cargar los datos al montar el componente
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:18755/api/compras/obtener');
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  console.log(data);
  const handleOpenModal = (compra: CompraPago) => {
    setSelectedCompra(compra);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompra(null);
    setModalOpen(false);
  };

  const handleAprobado = async () => {
    if (!selectedCompra) return;

    try {
      // Llamada al endpoint para aprobar la compra
      await axios.post('http://localhost:18755/api/compras/aprobar', null, {
        params: {
          idCompra: selectedCompra.idCompra,
          idUsuarioAprobo: 1, // Aquí puedes enviar el ID del usuario que aprueba (por ejemplo, del contexto)
        },
      });

      alert('Compra aprobada y correos enviados.');
      handleCloseModal();
      fetchData(); // Actualizar los datos después de la aprobación
    } catch (error) {
      console.error('Error al aprobar la compra:', error);
      alert('Error al aprobar la compra.');
    }
  };

  const handleNoProcedente = () => {
    alert('Compra No Procedente');
    handleCloseModal();
  };
  const estadoTexto = (estado: number) => (estado === 1 ? 'Aprobado' : 'Pendiente');

  return (
    <Paper sx={{ padding: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Costo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.idCompra ?? `row-${index}`}>
              <TableCell>{row.nombreCompleto || 'Sin nombre'}</TableCell>
              <TableCell>{row.numeroDeEntradas || 0}</TableCell>
              <TableCell>S/ {(row.montoTotal ?? 0).toFixed(2)}</TableCell>
              <TableCell>{estadoTexto(row.estado)}</TableCell> {/* Mostrar estado */}
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal(row)}>
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedCompra && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                {selectedCompra.imagenBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${selectedCompra.imagenBase64}`}
                    alt="Voucher"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                ) : (
                  <Typography>No hay voucher disponible</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">Información de la Compra</Typography>
                <Typography>
                  <strong>Nombre:</strong> {selectedCompra.nombreCompleto}
                </Typography>
                <Typography>
                  <strong>DNI:</strong> {selectedCompra.dni}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedCompra.email}
                </Typography>
                <Typography>
                  <strong>Celular:</strong> {selectedCompra.celular}
                </Typography>
                <Typography>
                  <strong>Número de Entradas:</strong> {selectedCompra.numeroDeEntradas}
                </Typography>
                <Typography>
                  <strong>Fecha de Creación:</strong>{' '}
                  {new Date(selectedCompra.fechaCreacion).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Monto Total:</strong> S/ {selectedCompra.montoTotal.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <Button variant="contained" color="success" onClick={handleAprobado}>
                    Aprobado
                  </Button>
                  <Button variant="contained" color="error" onClick={handleNoProcedente}>
                    No Procedente
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default ComprasPagos;
