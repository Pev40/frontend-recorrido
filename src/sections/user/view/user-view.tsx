import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import { TableEmptyRows } from '../table-empty-rows';

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


export default function ComprasPagos() {
  const table = useTable();
  const [data, setData] = useState<CompraPago[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    } finally {
      setLoading(false);
    }
  };

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
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Compras y Pagos
        </Typography>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableBody>
                {loading ? (
                  <Typography variant="h6" textAlign="center">
                    Cargando datos...
                  </Typography>
                ) : (
                  data
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TableRow key={row.idCompra}>
                        <TableCell>{row.nombreCompleto}</TableCell>
                        <TableCell>{row.numeroDeEntradas}</TableCell>
                        <TableCell>S/ {row.montoTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenModal(row)}
                          >
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
                

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={data.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

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
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  return {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}