import * as React from 'react';
import { DataGrid, GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', headerClassName: 'datagrid--header', flex: 1 },
  { field: 'value', headerName: 'Value', headerClassName: 'datagrid--header', flex: 1 }
];

const createRowData = (data: Record<string, string | number | boolean>) => {
  return Object.keys(data.rowData).map((key) => ({ name: key, value: data.rowData[key] }));
};

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

export default function AttributesTable(rowData) {
  return (
    <div style={{ height: 400, width: 600 }}>
      <DataGrid
        disableColumnMenu
        rows={createRowData(rowData)}
        getRowId={(row) => row.name}
        columns={columns}
        components={{ Toolbar: QuickSearchToolbar }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ padding: 0 }}
      />
    </div>
  );
}
