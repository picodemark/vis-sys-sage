import React from 'react';
import MUIDataTable from 'mui-datatables';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ComponentAvatar from 'components/graphs/ComponentAvatar';
import HighlightComponentsButton from 'components/buttons/HighlightComponentsButton';
import { StyledTableCell } from 'components/tables/utils/common';
import { ComponentTableEntry } from 'types/common';

interface Props {
  data: ComponentTableEntry;
}

export default function ComponentTable(props: Props) {
  const { data } = props;

  const columns = [
    {
      name: 'name',
      label: 'Avatar',
      options: {
        customBodyRenderLite: (dataIndex) =>
          data[dataIndex].name === 'cache' ? (
            <ComponentAvatar
              label={data[dataIndex].name}
              size="small"
              cacheLevel={
                data[dataIndex].attributes.filter(
                  (attribute) => attribute.name === 'cache_level'
                )[0].value
              }
            />
          ) : (
            <ComponentAvatar label={data[dataIndex].name} size="small" />
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
      label: 'Component ID'
    },
    {
      name: 'attributesNumber',
      label: 'Info'
    },
    {
      name: 'uniqueComponentID',
      label: 'Highlight',
      options: {
        customBodyRender: (value) => <HighlightComponentsButton components={[value]} />,
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
    isRowExpandable: (dataIndex) => data[dataIndex]?.attributes !== undefined,
    renderExpandableRow: (row, meta) => {
      return (
        <React.Fragment>
          {data[meta.dataIndex].attributes && (
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
                      {data[meta.dataIndex].attributes.map((row, index) => (
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
