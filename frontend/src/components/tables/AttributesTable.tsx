import React from 'react';
import MUIDataTable from 'mui-datatables';

interface Props {
  data: any;
}

export default function AttributesTable(props: Props) {
  const { data } = props;

  const columns = [
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'value',
      label: 'Value'
    }
  ];

  const options = {
    elevation: 0,
    download: false,
    print: false,
    filter: false,
    selectableRowsHideCheckboxes: true,
    rowsPerPage: 5
  };

  return <MUIDataTable data={data} columns={columns} options={options} />;
}
