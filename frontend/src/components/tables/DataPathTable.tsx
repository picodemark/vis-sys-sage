import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppSelector } from '../../hooks/hooks';
import { selectDataPathLinkAttributes } from '../../store/graphDataSlice';

interface RowProps {
  row: any;
}

function Row(props: RowProps) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="10%">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width="30%" align="left">
          {row.type}
        </TableCell>
        <TableCell width="30%" align="left">
          {row.latency}
        </TableCell>
        <TableCell width="30%" align="left">
          {row.bw}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                More Info
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.moreInfo.map((moreInfoRow, index) => (
                    <TableRow key={'moreInfoTable' + index}>
                      <TableCell component="th" scope="row">
                        {moreInfoRow.name}
                      </TableCell>
                      <TableCell>{moreInfoRow.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface Props {
  source: string;
  target: string;
}

export default function CollapsibleTable(props: Props) {
  const { source, target } = props;

  let rowData = [];

  const linkAttributes = useAppSelector((state) => selectDataPathLinkAttributes(state));

  if (source in linkAttributes && target in linkAttributes[source]) {
    rowData = linkAttributes[source][target];
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Type</TableCell>
            <TableCell align="left">Latency</TableCell>
            <TableCell align="left">Bandwidth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <Row key={'mainTable' + index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
