import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import OffersChip from './OffersChip';
import { format } from 'date-fns'


export default function TypesTable({ data, removeType, removeTypeOfferAdded, editOffersToType, editAvalaibilityToPeriod }) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">{'Oferta'}</TableCell>
            <TableCell align="left">{'Disponibilidad'}</TableCell>
            <TableCell align="left">{'Tipo'}</TableCell>
            <TableCell align="center">{'Accion'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" scope="row">
                {`${row.isPeriod ? (format(new Date(row.period[0]), 'dd/MM/yyyy') + ' - ' + format(new Date(row.period[1]), 'dd/MM/yyyy')) : format(new Date(row.date), 'dd/MM/yyyy')} `}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.availability}
              </TableCell>
              <TableCell align="left">
                <OffersChip data={row.offers} handleDeleteOffer={(item) => removeTypeOfferAdded(item, row.id)} />
              </TableCell>
              <TableCell align="center">
                <IconButton title='EDITAR DISPONIBILIDAD' onClick={() => editAvalaibilityToPeriod(row)}>
                  <EditIcon />
                </IconButton>
                {
                  row.isPeriod && 
                  <IconButton title='AGREGAR OFERTAS' onClick={() => editOffersToType(row.id)}>
                    <LibraryAddIcon />
                  </IconButton>
                }
                <IconButton title='ELIMINAR PERIODO' onClick={() => removeType(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )) : <p style={{ marginLeft: '10px' }}>{'0 elementos'}</p>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
