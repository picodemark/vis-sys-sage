import React from 'react';
import MUIDataTable from 'mui-datatables';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAppSelector } from '../../hooks/hooks';
import { selectDataPathLinkAttributes } from '../../store/graphDataSlice';

interface Props {
  source: string;
  target: string;
}

export default function DataPathTable(props: Props) {
  const { source, target } = props;

  let rowData = [];

  let columns = [];

  const linkAttributes = useAppSelector((state) => selectDataPathLinkAttributes(state));

  if (source in linkAttributes && target in linkAttributes[source]) {
    const data = linkAttributes[source][target];

    // create columns dynamically
    columns = data?.attributeNames.map((col) => ({
      name: col
    }));

    rowData = data?.attributes;
  }

  const options = {
    empty: true,
    download: false,
    print: false,
    filter: false,
    selectableRowsHideCheckboxes: true,
    responsive: 'scrollMaxHeight',
    rowsPerPage: 10,
    expandableRows: true,
    draggableColumns: { enabled: true },
    elevation: 0,
    renderExpandableRow: (rowData) => {
      return (
        <React.Fragment>
          <tr>
            <td colSpan={6}>
              <TableContainer>
                <Table style={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowData.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell>{columns[index].name}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </td>
          </tr>
        </React.Fragment>
      );
    }
  };

  return (
    <MUIDataTable title={'ACME Employee list'} data={rowData} columns={columns} options={options} />
  );
}
