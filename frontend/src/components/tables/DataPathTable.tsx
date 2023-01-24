import React from 'react';
import MUIDataTable from 'mui-datatables';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell } from 'components/tables/utils/common';
import { DataPathLinkAttributeInfo } from 'types/data-path';

const COLUMN_NAMES = {
  dp_type: 'Type',
  latency: 'Latency',
  bw: 'Bandwidth'
};

interface Props {
  linkInfo: DataPathLinkAttributeInfo;
}

export default function DataPathTable(props: Props) {
  const { linkInfo } = props;

  let data = [];

  let columns = [];

  if (linkInfo !== undefined) {
    if (linkInfo?.attributeNames !== undefined && linkInfo?.attributes !== undefined) {
      // create columns dynamically
      columns = linkInfo.attributeNames.map((col: string) => ({
        name: col,
        label: col in COLUMN_NAMES ? COLUMN_NAMES[col] : col
      }));

      data = linkInfo.attributes;
    }
  }

  const options = {
    elevation: 0,
    empty: true,
    download: false,
    print: false,
    filter: false,
    selectableRowsHideCheckboxes: true,
    rowsPerPage: 10,
    expandableRowsHeader: false,
    expandableRows: true,
    draggableColumns: { enabled: true },
    renderExpandableRow: (row) => {
      return (
        <React.Fragment>
          <tr>
            <td colSpan={6}>
              <TableContainer>
                <Table style={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Value</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.map((value, index) => (
                      <TableRow key={index}>
                        <StyledTableCell>
                          {columns[index].name in COLUMN_NAMES
                            ? COLUMN_NAMES[columns[index].name]
                            : columns[index].name}
                        </StyledTableCell>
                        <StyledTableCell>{value}</StyledTableCell>
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

  return <MUIDataTable data={data} columns={columns} options={options} />;
}
