import React from 'react';
import MUIDataTable from 'mui-datatables';

interface Props {
  rowData: any;
}

export default function AttributesTable(props: Props) {
  const { rowData } = props;

  const columns = [
    {
      name: 'name',
      label: 'Name',
      width: '30%'
    },
    {
      name: 'value',
      label: 'Value',
      width: '70%'
    }
  ];

  const createRowData = (data: Record<string, string | number | boolean>) => {
    return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
  };

  const options = {
    empty: true,
    download: false,
    print: false,
    filter: false,
    selectableRowsHideCheckboxes: true,
    responsive: 'scrollMaxHeight',
    rowsPerPage: 5,
    elevation: 0
  };

  return <MUIDataTable data={createRowData(rowData)} columns={columns} options={options} />;
}
