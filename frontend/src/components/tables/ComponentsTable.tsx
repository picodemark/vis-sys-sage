import React from 'react';
import MUIDataTable from 'mui-datatables';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ComponentAvatar from '../graphs/ComponentAvatar';
import HighlightComponentsButton from '../buttons/HighlightComponentsButton';
import { StyledTableCell } from './util/common';

interface Props {
  data: any;
}

export default function ComponentsTable(props: Props) {
  const { data } = props;

  const columns = [
    {
      name: 'name',
      label: 'Avatar',
      options: {
        customBodyRender: (value, tableMeta) =>
          value === 'cache' ? (
            <ComponentAvatar
              label={value}
              size="small"
              cacheLevel={
                tableMeta.tableData[tableMeta.rowIndex].attributes.filter(
                  (attribute) => attribute.name === 'cache_level'
                )[0].value
              }
            />
          ) : (
            <ComponentAvatar label={value} size="small" />
          ),
        filter: false,
        sort: false
      }
    },
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'nodeID',
      label: 'Node ID'
    },
    {
      name: 'componentID',
      label: 'Components ID'
    },
    {
      name: 'attributesNumber',
      label: 'Attributes'
    },
    {
      name: 'uniqueComponentID',
      label: 'More',
      options: {
        customBodyRender: (value) => (
          <HighlightComponentsButton label="Show" components={[value]} />
        ),
        filter: false,
        sort: false
      }
    }
  ];

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
    isRowExpandable: (rowIndex) => data[rowIndex]?.attributes !== undefined,
    renderExpandableRow: (row, meta) => {
      return (
        <React.Fragment>
          {data[meta.rowIndex].attributes && (
            <tr>
              <td colSpan={7}>
                <TableContainer>
                  <Table style={{ width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Value</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data[meta.rowIndex].attributes.map((row, index) => (
                        <TableRow key={index}>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.value}</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    }
  };
  return <MUIDataTable data={data} columns={columns} options={options} />;
}
