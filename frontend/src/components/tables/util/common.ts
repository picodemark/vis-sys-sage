import { styled } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main
  },
  [`&.${tableCellClasses.body}`]: {
    width: '50%'
  }
}));
