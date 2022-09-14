import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import ComponentAvatar from '../graphs/ComponentAvatar';
import Typography from '@mui/material/Typography';

const columns: GridColDef[] = [
  {
    field: 'unique_component_id',
    headerName: 'Symbol',
    renderCell: (params: GridCellParams) => <ComponentAvatar id={params.value} clickable={true} />,
    width: 80,
    align: 'center'
  },
  { field: 'name', headerName: 'Name', headerClassName: 'datagrid--header', flex: 1 },
  { field: 'node_id', headerName: 'Node ID', headerClassName: 'datagrid--header', flex: 1 },
  {
    field: 'component_id',
    headerName: 'Component ID',
    headerClassName: 'datagrid--header',
    flex: 1
  },
  {
    field: 'attributes',
    headerName: 'Attributes',
    renderCell: (params: GridCellParams) => (
      <Typography>{params.value && Object.keys(params.value).length}</Typography>
    ),
    flex: 1
  }
];
function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0
      }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

export default function ComponentsTable(rowData) {
  return (
    <Box sx={{ height: 493, width: 800 }}>
      <DataGrid
        disableColumnMenu
        rows={rowData.rowData}
        getRowId={(row) => row.unique_component_id}
        columns={columns}
        components={{ Toolbar: QuickSearchToolbar }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        density="compact"
        sx={{ padding: 0 }}
      />
    </Box>
  );
}
