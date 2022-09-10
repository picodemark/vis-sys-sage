import * as React from 'react';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Name', headerClassName: 'datagrid--header', flex: 1 },
  { field: 'value', headerName: 'Value', headerClassName: 'datagrid--header', flex: 1 }
];

const createRowData = (data: Record<string, string | number | boolean>) => {
  return Object.keys(data.rowData).map((key) => ({ id: key, value: data.rowData[key] }));
};

export default function AttributesTable(rowData) {
  return (
    <div style={{ height: 400, width: 600 }}>
      <DataGrid
        rows={createRowData(rowData)}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ padding: 0 }}
      />
    </div>
  );
}
